const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const cookieParser = require("cookie-parser");
const Database = require("./Database");
const bodyParser = require("body-parser");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const _ = require("lodash");
const express = require("express/lib/express");

initializeDB();

app.use(cookieParser());
nextApp.prepare().then(() => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  //add other middleware
  app.use(cors());
  app.use(morgan("dev"));
  app.use(
    fileUpload({
      createParentPath: true
    })
  );

  app.get("/logout", (req, res) => {
    res.clearCookie("userId");
    res.send({ status: 200 });
  });

  app.post("/api/registration", async (req, res) => {
    if (
      await Database.user_provider.findOne({
        login: req.body.login
      })
    ) {
      console.log(
        "Данный пользователь уже существует, попробуйте другой логин"
      );
    } else {
      try {
        const { login, password, firstName, lastName, email } = req.body;

        Database.user_provider.insert({
          login,
          password,
          firstName,
          lastName,
          avatar: "/default_avatar.png",
          email
        });

        res.json({ status: 200 });
      } catch (err) {
        console.log(err);
        res.json({ stats: 404 });
      }
    }
  });
  app.get("/api/authorization/:userName/:userPassword", async (req, res) => {
    const { userName, userPassword } = req.params;
    if (!userName || !userPassword) {
      res.sendStatus(401);
    } else {
      const user = await Database.user_provider.findOne({
        login: userName,
        password: userPassword
      });

      if (user) {
        res.cookie("userId", user._id);
        res.send({ status: 200 });
      } else {
        res.clearCookie("userId");
        res.sendStatus(401);
      }
    }
  });

  app.get("*", (req, res, next) => {
    if (!req.cookies.userId && !req.headers.userid) {
      if (
        req.originalUrl.includes("/login") ||
        req.originalUrl.includes("/registration")
      ) {
        return next();
      }
      return nextApp.render(req, res, "/login");
    }
    next();
  });

  app.get("/api/user", async (req, res) => {
    const userid = req.cookies.userId;
    const user = await Database.user_provider.findOne({ _id: userid });
    // TODO: УДАЛИТЬ ПАРОЛЬ ЮЗЕРА ПРИ ВЫДАЧЕ ЧЕРЕЗ АПИ
    res.json(user);
  });

  io.on("connection", function(socket) {
    const { userid } = socket.handshake.query;

    socket.join(userid);

    socket.on("connect-to", ({ dialogId }) => {
      socket.join(dialogId);
    });

    socket.on("leave-the-room", ({ dialogId }) => {
      socket.leave(dialogId);
    });

    socket.on("message-to-dialog", ({ dialogId, message }) => {
      if (!message) return;
      const currentTime = new Date();

      Database.message_provider.insert({
        text: message,
        time: Date.now(),
        readed: false,
        senderId: userid,
        dialogId: dialogId
      });

      io.to(dialogId).emit("messageFromOpenChat", {
        message,
        senderId: userid,
        time: currentTime,
        dialogId: dialogId
      });
    });

    console.log("a user connected");
  });

  app.post("/api/upload-photos", async (req, res) => {
    const userId = req.cookies.userId;
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded"
        });
      } else {
        let data = [];

        //loop all files
        _.forEach(_.keysIn(req.files), async key => {
          let photo = req.files[key];

          //move photo to upload directory
          photo.mv(`./uploads/${userId}/` + photo.name);

          //push file details

          const link = `/${userId}/${photo.name}`;
          data.push({
            name: photo.name,
            link
          });
          await Database.user_provider.update(
            { _id: userId },
            { $set: { avatar: link } },
            { multi: true }
          );
        });

        //return response

        res.send({
          status: true,
          message: "Files are uploaded",
          data: data
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //make uploads directory static
  app.use("/api/files", express.static("uploads"));

  app.get("/api/getMessages/:dialogId", async (req, res) => {
    const { dialogId } = req.params;
    const messages = await Database.message_provider.find({
      dialogId: dialogId
    });
    res.json({
      dialogId: dialogId,
      messages: messages
    });
  });

  app.get("/api/getUserInfo", async (req, res) => {
    const userid = req.cookies.userId;
    const userInfo = await Database.user_provider.find({
      _id: userid
    });

    res.json({
      userInfo: userInfo
    });
  });

  app.get("/api/getUserAvatar/:avatarUser", async (req, res) => {
    const { avatarUser } = req.params;
    const userAvatar = await Database.user_provider.findOne({
      _id: avatarUser
    });
    res.json({
      userAvatar
    });
  });
  app.get("/api/getUsers", async (req, res) => {
    const users = await Database.user_provider.find();
    res.json({
      users
    });
  });

  app.post("/api/createDialog/:userId/:secondUserId", async (req, res) => {
    const { userId, secondUserId } = req.params;
    const firstUser = await Database.user_provider.findOne({
      _id: userId
    });
    const secondUser = await Database.user_provider.findOne({
      _id: secondUserId
    });
    const users = [{ userId: firstUser._id }, { userId: secondUser._id }];

    const checkDialog = await Database.dialog_provider.findOne({
      users: users
    });

    if (checkDialog) {
      console.log("Данный диалог уже существует");
    } else {
      Database.dialog_provider.insert({
        name: `${firstUser.login} and ${secondUser.login}`,
        users: users
      });
      const newDialog = await Database.dialog_provider.findOne({
        users: users
      });
      res.json({ newDialog });
    }
  });

  app.get("/api/getDialogs/:userId", async (req, res) => {
    const { userId } = req.params;
    const user = await Database.user_provider.findOne({ _id: userId });
    const dialogs = await Database.dialog_provider.find({
      "users.userId": user._id
    });
    const getMessagesForDialogs = async () => {
      for (var i = 0; i < dialogs.length; i++) {
        const dialog = dialogs[i] || [];
        const lastMessages = await Database.message_provider.find({
          dialogId: dialog._id
        });

        const lastMessage = lastMessages[lastMessages.length - 1];

        dialog.message = lastMessage ? lastMessage.text : "";
        dialog.time = lastMessage ? lastMessage.time : null;
      }
    };
    await getMessagesForDialogs();

    res.json({
      data: dialogs
    });
  });

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

async function initializeDB() {
  const createdUser = await Database.user_provider.findOne();
  const createdDialog = await Database.dialog_provider.findOne();
  const createdMessage = await Database.message_provider.findOne();

  if (!createdUser) {
    Database.user_provider.insert({
      login: "1234",
      password: "1234",
      firstName: "1234",
      lastName: "1234",
      avatar: "/default_avatar.png",
      email: "123@mail.ri"
    });
    Database.user_provider.insert({
      login: "1235",
      password: "1235",
      firstName: "1235",
      lastName: "1235",
      avatar: "/default_avatar.png",
      email: "1235@mail.ri"
    });
    Database.user_provider.insert({
      login: "1236",
      password: "1236",
      firstName: "1236",
      lastName: "1236",
      avatar: "/default_avatar.png",
      email: "1236@mail.ri"
    });
  }

  if (!createdDialog) {
    const user = await Database.user_provider.find();
    Database.dialog_provider.insert({
      name: `${user[0].login} ${user[1].login}`,
      users: [{ userId: user[0]._id }, { userId: user[1]._id }]
    });
    Database.dialog_provider.insert({
      name: `${user[1].login} ${user[2].login}`,
      users: [{ userId: user[1]._id }, { userId: user[2]._id }]
    });
    Database.dialog_provider.insert({
      name: `${user[0].login} ${user[2].login}`,
      users: [{ userId: user[0]._id }, { userId: user[2]._id }]
    });
  }

  if (!createdMessage) {
    const user = await Database.user_provider.find();
    const dialog = await Database.dialog_provider.find();
    Database.message_provider.insert({
      text: "1",
      time: Date.now(),
      readed: true,
      senderId: user[1]._id,
      dialogId: dialog[0]._id
    });
    Database.message_provider.insert({
      text: "2",
      time: Date.now(),
      readed: true,
      senderId: user[1]._id,
      dialogId: dialog[1]._id
    });
    Database.message_provider.insert({
      text: "3",
      time: Date.now(),
      readed: true,
      senderId: user[2]._id,
      dialogId: dialog[2]._id
    });
  }
}

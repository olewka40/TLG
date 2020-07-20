const app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const next = require("next");
var cookieParser = require("cookie-parser");
const Database = require("./Database");
var bodyParser = require("body-parser");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

initializeDB();

app.use(cookieParser());
nextApp.prepare().then(() => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get("/api/authorization/logout", (req, res) => {
    res.clearCookie("userId");
    res.send({ status: 200 });
  });

  app.post("/api/registration", async (req, res) => {
    if (
      Database.user_provider.findOne({
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
  app.get("*", async (req, res, next) => {
    // авторизация

    if (!req.cookies.userId && !req.headers.userid) {
      if (
        req.originalUrl.includes("/login") ||
        req.originalUrl.includes("/registration")
      ) {
        return next();
      }
      return nextApp.render(req, res, "/login");
    }
    // lock unlock set
    // else {
    //   const user = await Database.user_provider.findOne({
    //     _id: req.cookies.userId
    //   });
    //   console.log(user, "123123", req.cookies.userId, req.headers.userid);
    //
    //   if (user.lock) {
    //     if (req.originalUrl.includes("/locked")) {
    //       return next();
    //     }
    //     return nextApp.render(req, res, "/locked");
    //   }
    // }
    next();
  });
  // app.get("*", async (req, res, next) => {
  //   const user = await Database.user_provider.findOne({
  //     _id: req.cookies.userId
  //   });
  //   console.log(user, "123123", req.cookies.userId, req.headers.userid);
  //   if (user.lock) {
  //     if (req.originalUrl.includes("/locked")) {
  //       return next();
  //     }
  //     return nextApp.render(req, res, "/locked");
  //   }
  //
  //   next();
  // });

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

  app.get("/api/user-image/:userid", (req, res) => {});

  app.get("/api/getMessages/:dialogid", async (req, res) => {
    const { dialogid } = req.params;
    const messages = await Database.message_provider.find(
      { dialogId: dialogid }
      // undefined,
      // { time: 1 }
    );
    res.json({
      dialogId: dialogid,
      messages: messages
    });
  });

  app.get("/api/getDialogs", async (req, res) => {
    const userid = req.cookies.userId;
    const user = await Database.user_provider.findOne({ _id: userid });
    const dialogs = await Database.dialog_provider.find({
      users: { $in: [user._id] }
    });
    console.log("user ", user, "userid ", userid, "dia ", dialogs);

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
      data: dialogs || []
    });
  });

  // lock unlock
  // app.get("/api/lock", async (req, res) => {
  //   const userId = req.cookies.userId;
  //
  //   const user = await Database.user_provider.findOne({
  //     _id: userId
  //   });
  //   console.log(user);
  //   if (user.lockPass) {
  //     Database.user_provider.update(
  //       { _id: userId },
  //       { $set: { lock: true } },
  //       {}
  //     );
  //     res.json({ status: 200 });
  //   } else {
  //     res.json({ error: "Пожалуйста,Добавьте пароль" });
  //   }
  // });
  // app.post("/api/unlock", async (req, res) => {
  //   const userId = req.cookies.userId;
  //
  //   const user = await Database.user_provider.findOne({
  //     _id: userId
  //   });
  //   const { lockPass } = req.body;
  //   if (user.lockPass && user.lockPass === lockPass) {
  //     Database.user_provider.update(
  //       { _id: userId },
  //       { $set: { lock: false } },
  //       {}
  //     );
  //     res.json({ status: 200, isRight: user.lockPass === lockPass });
  //   } else {
  //     res.json({ error: "Введен неверный пароль" });
  //   }
  // });
  //
  // app.post("/api/lock/set", async (req, res) => {
  //   const userId = req.cookies.userId;
  //   const { lockPass } = req.body;
  //   const user = await Database.user_provider.findOne({
  //     _id: userId
  //   });
  //   Database.user_provider.update({ _id: userId }, { $set: { lockPass } }, {});
  //   res.json({ status: 200 });
  // });

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
      email: "123@mail.ri",
      lockPass: "",
      lock: false
    });
    Database.user_provider.insert({
      login: "1235",
      password: "1235",
      firstName: "1235",
      lastName: "1235",
      email: "1235@mail.ri",
      lockPass: "",
      lock: false
    });
  }

  if (!createdDialog) {
    Database.dialog_provider.insert({
      name: "Squal45",
      users: ["1234", "1235"]
    });
    Database.dialog_provider.insert({
      name: "Squal46",
      users: ["1234", "1236"]
    });
    Database.dialog_provider.insert({
      name: "Squal56",
      users: ["1235", "1236"]
    });
  }

  if (!createdMessage) {
    const user = await Database.user_provider.findOne();
    const dialog = await Database.dialog_provider.findOne();
    Database.message_provider.insert({
      text: "1234",
      time: Date.now(),
      readed: true,
      senderId: user._id,
      dialogId: dialog._id
    });

    Database.message_provider.insert({
      text: "1236",
      time: Date.now(),
      readed: false,
      senderId: user._id,
      dialogId: dialog._id
    });
  }
}

// TODO:
//  context в сайдбаре эмодзи
// сделать гифки
// сделать отправку картинок и закгрузку аватаров
// лок скрин с паролем
// сортировка смс
// несколько диа и создание
//

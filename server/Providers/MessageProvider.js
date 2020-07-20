const Datastore = require("nedb");

const PATH_TO_DB = __dirname + "/../../db";

class MessageProvider {
  constructor() {
    this.messageDB = new Datastore({
      filename: `${PATH_TO_DB}/message.db`
    });

    this.messageDB.loadDatabase();
  }

  async find(query, modifiers, sort) {
    return new Promise((resolve, reject) => {
      this.messageDB.find(query, (err, data) => {
        modifiers && modifiers(err, data);
        // если ошибка тупо выходим
        if (err) return reject();

        // иначе возвращаем данные
        resolve(data);
      });
    });
  }

  async findOne(query) {
    return new Promise((resolve, reject) => {
      this.messageDB.findOne(query, (err, data) => {
        // если ошибка тупо выходим
        if (err) return reject();

        // иначе возвращаем данные
        resolve(data);
      });
    });
  }

  insert(message) {
    this.messageDB.insert(message);
  }
}

module.exports = MessageProvider;

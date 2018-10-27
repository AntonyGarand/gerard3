const Augur = require("augurbot"),
  config = require("./config/config.json"),
  fs = require("fs"),
  path = require("path"),
  u = require("./utils/utils");

function loadCommands(Handler) {
  Handler.db.init(Handler.client);
  Handler.client.on("ready", () => console.log("Ready at:", Date()));
  fs.readdirSync("./commands").filter(c => c.endsWith(".js")).forEach(command => {
    Handler.register(path.resolve(process.cwd(), "./commands/", command));
  });
}

const Handler = new Augur.Handler(config, {
  errorHandler: u.alertError,
  parse: u.parse,
  clientOptions: {
    disableEveryone: true
  }
});

Handler.start().then(loadCommands);

// LAST DITCH ERROR HANDLING
process.on("unhandledRejection", (error, p) => u.alertError(error));
process.on("uncaughtException", u.alertError);

module.exports = {Handler: Handler, bot: Handler.client};

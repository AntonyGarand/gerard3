const { ShardingManager } = require("discord.js");
const config = require("./config/config.json");

const Manager = new ShardingManager(process.cwd() + "/src/base.js", {
  token: config.token,
});

Manager.spawn("auto");
Manager.on("shardCreate", (shard) => {
  console.log("Launched Shard", shard.id);
});

module.exports = Manager;

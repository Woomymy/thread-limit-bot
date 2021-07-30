import { config as envconfig } from "dotenv";
envconfig();
import { Client, Intents, Message, ThreadChannel } from "discord.js";

const client = new Client({
  intents: new Intents(["GUILD_MESSAGES", "GUILDS"]),
});

client.login(process.env.TOKEN);

client.on("messageCreate", async (msg: Message) => {
  if (msg.content == "t!ping") {
    msg.reply("Hello");
  }
});
client.on("threadCreate", async (tc: ThreadChannel) => {
  console.log(`New thread ${tc.name}`);
  await tc.join();
});
client.on("ready", () => {
  console.log("READY");
  client.channels.cache.forEach(async (chan) => {
    if (chan.isThread() && !chan.archived) {
      await chan.join();
    }
  });
});

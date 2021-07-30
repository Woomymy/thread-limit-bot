import { config as envconfig } from "dotenv";
envconfig();
import { Client, Intents, Message, ThreadChannel } from "discord.js";
import { addThread } from "./addThread";
// Threads created by user cache
const threadCache = new Map<`${bigint}`, number>();

const client = new Client({
  intents: new Intents(["GUILD_MESSAGES", "GUILDS"]),
});

client.login(process.env.TOKEN);

client.on("messageCreate", async (msg: Message) => {
  if (msg.content == "t!ping") {
    const base = Date.now();
    msg.reply("Mesure...").then((m: Message) => {
      m.edit(
        `${
          Date.now() - base < 250 ? "🟢" : 500 < Date.now() ? "🔴" : "🟡"
        }Pong! 🏓 en ${Date.now() - base}ms`
      );
    });
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
      addThread(threadCache, chan.ownerId);
    }
  });
});

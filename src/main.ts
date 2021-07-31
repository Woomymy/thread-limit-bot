import { config as envconfig } from "dotenv";
envconfig();
import { Client, Intents, Message, ThreadChannel } from "discord.js";
import { addThread } from "./addThread.js";
import { removeThread } from "./removeThread.js";
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
  } else if (msg.content === "t!nthreads") {
    const nthreads = threadCache.get(msg.author.id) || 0;
    msg.reply(
      `Vous avez créé ${nthreads == 0 ? "aucun" : nthreads} thread${
        nthreads > 1 ? "s" : ""
      }`
    );
  }
});
client.on("threadUpdate", (otc, ntc) => {
  if (!otc.archived && ntc.archived) {
    console.log(`Thread ${ntc.name} has been archived`);
    removeThread(threadCache, ntc.ownerId);
    return;
  } else if (otc.archived && !ntc.archived) {
    console.log(`Thread ${ntc.name} has been unarchived`);
    addThread(threadCache, ntc.ownerId);
  }
});
client.on("threadCreate", async (tc: ThreadChannel) => {
  addThread(threadCache, tc.ownerId);
  console.log(`New thread by ${tc.ownerId}`);
  if (threadCache.get(tc.ownerId) > 1) {
    await tc.delete(`User a déjà créé 1 thread`);
  }
});
client.on("threadDelete", (tc) => {
  console.log(`Thread ${tc.name} has been deleted`);
  removeThread(threadCache, tc.ownerId);
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

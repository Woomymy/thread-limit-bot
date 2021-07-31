import { config as envconfig } from "dotenv";
envconfig();
import { Client, Intents, Message, ThreadChannel } from "discord.js";
import { addThread } from "./addThread.js";
import { removeThread } from "./removeThread.js";
// Threads created by user cache
const threadCache = new Map<string, number>();

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
    const nthreads = threadCache.get(`${msg.guild.id}${msg.author.id}`) || 0;
    msg.reply(
      `Vous avez créé ${nthreads == 0 ? "aucun" : nthreads} thread${
        nthreads > 1 ? "s" : ""
      }`
    );
  }
});
client.on("threadUpdate", (otc, ntc) => {
  if (!otc.archived && ntc.archived) {
    console.log(`Thread ${ntc.name} on ${ntc.guild.name} has been archived`);
    removeThread(threadCache, `${ntc.guildId}${ntc.ownerId}`);
    return;
  } else if (otc.archived && !ntc.archived) {
    console.log(`Thread ${ntc.name} on ${ntc.guild.name} has been unarchived`);
    addThread(threadCache, `${ntc.guildId}${ntc.ownerId}`);
  }
});
client.on("threadCreate", async (tc: ThreadChannel) => {
  addThread(threadCache, `${tc.guildId}${tc.ownerId}`);
  console.log(`New thread by ${tc.ownerId} on ${tc.guild.name}`);
  if (threadCache.get(`${tc.guildId}${tc.ownerId}`) > 1) {
    await tc.delete(`User a déjà créé 1 thread`);
  }
});
client.on("threadDelete", (tc) => {
  console.log(`Thread ${tc.name} on ${tc.guild.name} has been deleted`);
  removeThread(threadCache, `${tc.guildId}${tc.ownerId}`);
});
client.on("ready", () => {
  console.log("READY");
  client.channels.cache.forEach(async (chan) => {
    if (chan.isThread() && !chan.archived) {
      await chan.join();
      addThread(threadCache, `${chan.guildId}${chan.ownerId}`);
    }
  });
});

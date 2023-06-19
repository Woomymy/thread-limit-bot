import {
  AnyThreadChannel,
  Client,
  GatewayIntentBits,
  ThreadChannel,
} from "discord.js";
import { addThread } from "./addThread.js";
import CommandHandler from "./commandhandler.js";
import { removeThread } from "./removeThread.js";
import { initInteractions } from "./util/interactions.js";

// Threads created by user cache
const threadCache = new Map<string, number>();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on(
  "threadUpdate",
  (otc: AnyThreadChannel, ntc: AnyThreadChannel): void => {
    if (!otc.archived && ntc.archived) {
      removeThread(threadCache, `${ntc.guildId}${ntc.ownerId}`);
      return;
    } else if (otc.archived && !ntc.archived) {
      addThread(threadCache, `${ntc.guildId}${ntc.ownerId}`);
    }
  }
);

client.on("threadCreate", async (tc: ThreadChannel): Promise<void> => {
  addThread(threadCache, `${tc.guildId}${tc.ownerId}`);
  if (
    (threadCache.get(`${tc.guildId}${tc.ownerId}`) ??
    0) > 1 &&
      !(tc.guild.members.cache
        .get(tc.ownerId ?? "")
        ?.permissions.has("Administrator"))
  ) {
    await tc.delete(`User a déjà créé 1 thread`);
  }
});
client.on("threadDelete", (tc) => {
  removeThread(threadCache, `${tc.guildId}${tc.ownerId}`);
});
const commandHandler = new CommandHandler(client);

client.on("ready", () => {
  console.log("READY");
  client.user?.setStatus("dnd");
  client.user?.setActivity("Gérer les threads");
  client.channels.cache.forEach(async (chan) => {
    if (chan.isThread() && !chan.archived) {
      await chan.join();
      addThread(threadCache, `${chan.guildId}${chan.ownerId}`);
    }
  });
  commandHandler.init();

  initInteractions(client);
});

client.on("interactionCreate", async (inter) => {
  if (!inter.isCommand()) return;
  commandHandler.exec(inter, threadCache);
});

client.login(process.env.TOKEN);

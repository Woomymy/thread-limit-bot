import { Client, Intents, Message, ThreadChannel } from "discord.js";
import { addThread } from "./addThread.js";
import CommandHandler from "./commandhandler.js";
import { removeThread } from "./removeThread.js";
import { initInteractions } from "./util/interactions.js";

// Threads created by user cache
const threadCache = new Map<string, number>();

const client = new Client({
  intents: new Intents(["GUILD_MESSAGES", "GUILDS"]),
});

const commandHandler = new CommandHandler(client);
commandHandler.init();

client.on("messageCreate", async (msg: Message) => {
  if (msg.content.startsWith(`${process.env.PREFIX}ping`)) {
    const base = Date.now();
    msg.reply("Mesure...").then((m: Message) => {
      m.edit(
        `${
          Date.now() - base < 250 ? "🟢" : 500 < Date.now() ? "🔴" : "🟡"
        }Pong! 🏓 en ${Date.now() - base}ms`
      );
    });
  } else if (msg.content.startsWith(`${process.env.PREFIX}nthreads`)) {
    const nthreads = threadCache.get(`${msg.guild.id}${msg.author.id}`) || 0;
    msg.reply(
      `Vous avez créé ${nthreads == 0 ? "aucun" : nthreads} thread${
        nthreads > 1 ? "s" : ""
      }`
    );
  } else if (msg.content.startsWith(`${process.env.PREFIX}botinfo`)) {
    msg.channel.send({
      embeds: [
        {
          title: `Informations de ${client.user.username}`,
          color: "RANDOM",
          fields: [
            {
              name: "Source",
              value: `Mon code est disponible sur [GitHub](https://github.com/Woomymy/thread-limit-bot), n'hésitez pas à contribuer!`,
            },
            {
              name: "License",
              value:
                "Ce projet est sous license [MIT](https://github.com/Woomymy/thread-limit-bot/blob/main/LICENSE)",
            },
            {
              name: "Auteurs",
              value: `Fait avec ❤️ par [Woomymy](https://github.com/Woomymy) avec l'aide des membres de la [FII](https://discord.gg/RyGNjns)`,
            },
          ],
        },
      ],
    });
  } else if (msg.content.startsWith(process.env.PREFIX)) {
    msg.reply(
      `Commande \`${msg.content.split(" ")[0]}\` introuvable.\nPréfixe: ${
        process.env.PREFIX
      }\nListe des commandes:
\`ping\`: Obtenir le ping du bot
\`botinfo\`: Obtenir les informations du bot
\`nthreads\`: Obtenir le nombre de fils que vous avez créé`
    );
  }
});
client.on("threadUpdate", (otc, ntc) => {
  if (!otc.archived && ntc.archived) {
    removeThread(threadCache, `${ntc.guildId}${ntc.ownerId}`);
    return;
  } else if (otc.archived && !ntc.archived) {
    addThread(threadCache, `${ntc.guildId}${ntc.ownerId}`);
  }
});
client.on("threadCreate", async (tc: ThreadChannel) => {
  addThread(threadCache, `${tc.guildId}${tc.ownerId}`);
  if (
    threadCache.get(`${tc.guildId}${tc.ownerId}`) > 1 &&
    !tc.guild.members.cache.get(tc.ownerId).permissions.has("ADMINISTRATOR")
  ) {
    await tc.delete(`User a déjà créé 1 thread`);
  }
});
client.on("threadDelete", (tc) => {
  removeThread(threadCache, `${tc.guildId}${tc.ownerId}`);
});
client.on("ready", () => {
  console.log("READY");
  client.user.setStatus("dnd");
  client.user.setActivity("Gérer les threads");
  client.channels.cache.forEach(async (chan) => {
    if (chan.isThread() && !chan.archived) {
      await chan.join();
      addThread(threadCache, `${chan.guildId}${chan.ownerId}`);
    }
  });
  initInteractions(client);
});

client.on('interactionCreate', async inter => {
  if(!inter.isCommand()) return;
  commandHandler.exec(inter);
})

client.login(process.env.TOKEN);

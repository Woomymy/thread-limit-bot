import { Client, CommandInteraction } from "discord.js";
import { readdir } from "fs/promises";
import { dirname } from "path";
import { Command } from "./command.js";

/**
 * slash commands handler
 */
export default class CommandHandler {
    private commands: Map<string, Command>
    private client: Client;

    constructor(client: Client) {
        this.client = client;
        this.commands = new Map();
    }

    async init() {
        const commandsDir = `${dirname(import.meta.url.substring(7))}/commands`
        const files = (await readdir(commandsDir)).filter(f => f.endsWith(".js"));
        files.forEach(async file => {
            const command = await import(`${commandsDir}/${file}`);
            const def = command.default
            const cmd: Command = new def();
            this.commands.set(cmd.name, cmd);
        })
        if (process.env.BOT_ENV === "production") {
            this.client.application.commands.set([]);
            this.commands.forEach(cmd => {
                this.client.application.commands.create(cmd.data)
            })
        } else {
            await this.client.guilds.fetch();
            this.client.guilds.cache.forEach(async guild => {
                guild.commands.set([]);
                this.commands.forEach(cmd => {
                    guild.commands.create(cmd.data)
                })
            })
        }
    }
    async exec(inter: CommandInteraction, threadCache: Map<string, number>) {
        if (this.commands.has(inter.commandName)) {
            this.commands.get(inter.commandName).run(inter, threadCache)
        }
    }
}
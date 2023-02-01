import { Client, CommandInteraction } from "discord.js";
import { readdir } from "fs/promises";
import { dirname } from "path";
import { Command } from "./command.js";

/**
 * slash commands handler
 */
export default class CommandHandler {
  private commands: Map<string, Command>;
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.commands = new Map();
  }

  async init() {
    const commandsDir = `${dirname(import.meta.url.substring(7))}/commands`;
    const files = (await readdir(commandsDir)).filter((f) => f.endsWith(".js"));
    await this.client.application?.commands.set([]);
    files.forEach(async (file) => {
      const command = await import(`${commandsDir}/${file}`);
      const def = command.default;
      const cmd: Command = new def();
      this.commands.set(cmd.name, cmd);
      this.client.application?.commands.create(cmd.data);
      console.log(`Handler: Loaded cmd ${cmd.name}`);
    });
  }
  async exec(inter: CommandInteraction, threadCache: Map<string, number>) {
    if (this.commands.has(inter.commandName)) {
      this.commands.get(inter.commandName)?.run(inter, threadCache);
    }
  }
}

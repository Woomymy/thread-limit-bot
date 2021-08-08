import { CommandInteraction } from "discord.js";
import { Command } from "../command.js";

export default class extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'hello'
        })
    }
    async run(inter: CommandInteraction) {
        inter.reply({
            content: 'Hello, world'
        })
    }
}
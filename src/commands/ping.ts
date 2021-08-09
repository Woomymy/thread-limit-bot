import { CommandInteraction } from "discord.js";
import { Command } from "../command.js";

export default class extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Obtenir le ping du bot'
        })
    }
    async run(inter: CommandInteraction) {
        const base = Date.now();
        await inter.reply("Mesure...")
        await inter.editReply(`${Date.now() - base < 250 ? "🟢" : 500 < Date.now() ? "🔴" : "🟡"} Pong! 🏓 en ${Date.now() - base}ms`)
    }
}
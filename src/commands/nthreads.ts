import { CommandInteraction } from "discord.js";
import { Command } from "../command.js";

export default class extends Command {
    constructor() {
        super({
            name: 'nthreads',
            description: 'Get your threads number'
        })
    }
    async run(inter: CommandInteraction, threadCache: Map<string, number>) {
        const nthreads = threadCache.get(`${inter.guild.id}${inter.user.id}`) || 0;
        inter.reply(
            `Vous avez créé ${nthreads == 0 ? "aucun" : nthreads} thread${nthreads > 1 ? "s" : ""
            }`
        );
    }
}
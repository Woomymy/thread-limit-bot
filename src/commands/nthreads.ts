import { CommandInteraction } from "discord.js";
import { Command } from "../command.js";

export default class extends Command {
    constructor() {
        super({
            name: 'nthreads',
            description: 'Get your threads number',
            options: [
                {
                    name: "user",
                    description: 'L\'utilisateur',
                    type: "USER"
                }
            ]
        })
    }
    async run(inter: CommandInteraction, threadCache: Map<string, number>) {
        const user = inter.options.get("user")?.user ?? inter.user;
        const nthreads = threadCache.get(`${inter.guild.id}${user.id}`) || 0;
        inter.reply(
            `${user.username} a créé ${nthreads == 0 ? "aucun" : nthreads} thread${nthreads > 1 ? "s" : ""
            }`
        );
    }
}
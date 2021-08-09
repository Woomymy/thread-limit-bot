import { CommandInteraction } from "discord.js";
import { Command } from "../command.js";

export default class extends Command {
    constructor() {
        super({
            name: 'nthreads',
            description: 'Obtenir le nombre de threads que vous avez créé',
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
        if (inter.guild) {
            inter.reply("Cette command ne peut pas être utilisée en messages privés!");
            return;
        }
        const user = inter.options.get("user")?.user ?? inter.user;
        const nthreads = threadCache.get(`${inter.guild.id}${user.id}`) || 0;
        inter.reply(
            `${user.username} a créé ${nthreads == 0 ? "aucun" : nthreads} thread${nthreads > 1 ? "s" : ""}`
        );
    }
}
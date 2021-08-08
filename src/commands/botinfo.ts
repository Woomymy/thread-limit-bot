import { CommandInteraction } from "discord.js";
import { Command } from "../command.js";

export default class extends Command {
    constructor() {
        super({
            name: 'botinfo',
            description: 'Get bot informations'
        })
    }
    async run(inter: CommandInteraction) {
        inter.reply({
            embeds: [
                {
                    title: `Informations de ${inter.client.user.username}`,
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
    }
}
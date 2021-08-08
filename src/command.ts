import { ApplicationCommandData, CommandInteraction } from "discord.js";

/**
 * An interaction command
 */
export class Command {
    public name: string;
    public data: ApplicationCommandData;

    constructor(data: ApplicationCommandData) {
        this.name = data.name;
        this.data = data;
    }

    public async run(inter: CommandInteraction, threadCache: Map<string, number>) { }
}
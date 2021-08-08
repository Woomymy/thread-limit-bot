import { Client } from "discord.js";

/**
 * Initialise interactions
 * @param client The discord client
 */
export function initInteractions(client: Client): void {
    client.guilds.cache.forEach(async guild => {
        guild.commands.set([])
    });
    
}
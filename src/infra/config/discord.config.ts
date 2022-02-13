import {DiscordModuleOption, ValidationPipe,TransformPipe } from "discord-nestjs";
import { Intents } from "discord.js";

export const discordConfigFactory = (): DiscordModuleOption =>({
    token: process.env.TOKEN,
    commandPrefix: '!',
    usePipes: [TransformPipe, ValidationPipe],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],      
})

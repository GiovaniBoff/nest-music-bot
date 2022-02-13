import { PlayerInitOptions } from "discord-player";

export const discordPlayerConfig: PlayerInitOptions = {

    ytdlOptions: {
        
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
}

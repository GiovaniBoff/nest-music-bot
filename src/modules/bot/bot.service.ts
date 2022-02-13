import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client, ClientProvider } from 'discord-nestjs';
import { Player, QueryType } from 'discord-player';
import { Message } from 'discord.js';


import { discordPlayerConfig } from 'src/infra/config/discordPlayer.config';
@Injectable()
export class BotService implements OnApplicationBootstrap{
    @Client()
    private clientProvider: ClientProvider;

    private player?: Player;
    onApplicationBootstrap() {
        const client = this.clientProvider.getClient();
        this.player = new Player(client,discordPlayerConfig)
    }

    async play(message:Message) {
        this.player.search('', {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        })
    }
}

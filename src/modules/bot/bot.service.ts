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

    async play(content:string, context: Message) {
        
        if (!content) {
            return context.channel.send(`Che te fude ${context.author}... escreve essa merda direito! ❌`)
        }

        const res = await this.player.search(content, {
            requestedBy: context.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !(res).tracks) {
            return context.channel.send(`Che te fude ${context.author}... achei merda nenhuma! ❌`)
        }

        const queue = this.player.createQueue(context.guild, {
            metadata: context.channel
        })

        if (!queue.connection) {
            await queue.connect(context.member.voice.channel);
        } else {
            await this.player.deleteQueue(context.guild.id);
            return context.channel.send(`Che te fude ${context.author}... não consegui conectar nessa merda! ❌`)
        }

        await context.channel.send(`Che, buscando essa merda de musica "${content}"... 🎧`)
        
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
        if (!queue.playing) {
            await queue.play();
        }
        


    }
}

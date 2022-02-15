import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client, ClientProvider } from 'discord-nestjs';
import { Player, QueryType } from 'discord-player';
import { Message } from 'discord.js';


import { discordPlayerConfig } from 'src/infra/config/discordPlayer.config';
@Injectable()
export class BotService implements OnApplicationBootstrap {
    @Client()
    private clientProvider: ClientProvider;
    private player?: Player;
    onApplicationBootstrap() {
        const client = this.clientProvider.getClient();
        this.player = new Player(client, discordPlayerConfig)
    }

    async play(content: string, context: Message) {

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

    async stop(context: Message) {
        const queue = this.player.getQueue(context.guild.id);
        if (!queue || !queue.playing) return context.channel.send(`Che,${context.author}, tá viajando? não tem música tocando... drogado do krl 🌚 🪴`);
        queue.destroy();
        await context.channel.send(`A Musica parou pq tu é chato pra krl ✅`);
    }

    async pause(context: Message) {
        const queue = this.player.getQueue(context.guild.id);
        if (!queue || !queue.playing) return context.channel.send(`${context.author}, tá viajando? não tem música tocando... drogado do krl 🌚 🪴`);
        const success = queue.setPaused(true);
        await context.channel.send(success ? `A Musica parou pq tu é chato pra krl ✅` : 'Não consegui parar a musica... deu ruim meu patrão');
    }
    
    async resume(context: Message) {
        const queue = this.player.getQueue(context.guild.id);
        if (!queue || !queue.playing) return context.channel.send(`${context.author}, tá viajando? não tem música tocando... drogado do krl 🌚 🪴`);
        const success = queue.setPaused(false);
        await context.channel.send(success ? `A Musica parou pq tu é chato pra krl ✅` : 'Não consegui parar a musica... deu ruim meu patrão');
    }
}

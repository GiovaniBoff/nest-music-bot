import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client, ClientProvider } from 'discord-nestjs';
import { Player, PlayerSearchResult, QueryType, Queue } from 'discord-player';
import { Message } from 'discord.js';

import { discordPlayerConfig } from 'src/infra/config/discordPlayer.config';
@Injectable()
export class BotService implements OnApplicationBootstrap {
  @Client()
  private clientProvider: ClientProvider;
  private player?: Player;
  onApplicationBootstrap() {
    const client = this.clientProvider.getClient();
    this.player = new Player(client, discordPlayerConfig);
  }

  async play(content: string, context: Message): Promise<void> {
    if (!content) {
      context.channel.send(
        `Che te fude ${context.author}... escreve essa merda direito! ❌`,
      );
    }
    const res = await this.search(content, context);

    await this.queue(res, content, context);
  }

  async stop(context: Message): Promise<void> {
    const queue = this.player.getQueue(context.guild.id);
    if (!queue || !queue.playing)
      context.channel.send(
        `Che,${context.author}, tá viajando? não tem música tocando... drogado do krl 🌚 🪴`,
      );
    queue.destroy();
    await context.channel.send(`A Musica parou pq tu é chato pra krl ✅`);
  }

  async pause(context: Message): Promise<void> {
    const queue = this.player.getQueue(context.guild.id);
    if (!queue || !queue.playing)
      context.channel.send(
        `${context.author}, tá viajando? não tem música tocando... drogado do krl 🌚 🪴`,
      );
    const success = queue.setPaused(true);
    await context.channel.send(
      success
        ? `A Musica parou pq tu é chato pra krl ✅`
        : 'Não consegui parar a musica... deu ruim meu patrão',
    );
  }

  async resume(context: Message): Promise<void> {
    const queue = this.player.getQueue(context.guild.id);
    if (!queue || !queue.playing)
      context.channel.send(
        `${context.author}, tá viajando? não tem música tocando... drogado do krl 🌚 🪴`,
      );
    const success = queue.setPaused(false);
    await context.channel.send(
      success
        ? `A Musica parou pq tu é chato pra krl ✅`
        : 'Não consegui parar a musica... deu ruim meu patrão',
    );
  }

  private async queue(
    playerSearch: PlayerSearchResult,
    content: string,
    context: Message,
  ): Promise<void> {
    const queue = this.player.createQueue(context.guild, {
      metadata: context.channel,
    });

    if (!queue.connection) {
      await queue.connect(context.member.voice.channel);
    } else {
      this.player.deleteQueue(context.guild.id);
      context.channel.send(
        `Che te fude ${context.author}... não consegui conectar nessa merda! ❌`,
      );
    }
    await context.channel.send(
      `Che, buscando essa merda de musica "${content}"... 🎧`,
    );
    await this.addTrackToQueue(playerSearch, queue);
  }

  private async addTrackToQueue(
    playerSearch: PlayerSearchResult,
    queue: Queue,
  ): Promise<void> {
    playerSearch.playlist
      ? queue.addTracks(playerSearch.tracks)
      : queue.addTrack(playerSearch.tracks[0]);

    if (!queue.playing) {
      await queue.play();
    }
  }

  private async search(
    content: string,
    context: Message,
  ): Promise<PlayerSearchResult> {
    const res = await this.player.search(content, {
      requestedBy: context.member,
      searchEngine: QueryType.AUTO,
    });

    if (!res || !res.tracks) {
      context.channel.send(
        `Che te fude ${context.author}... achei merda nenhuma! ❌`,
      );
    }

    return res;
  }
}

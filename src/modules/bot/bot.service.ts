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

  async play(content: string, context: Message): Promise<Message> {
    if (!content) {
      return context.channel.send(
        `Che te fude ${context.author}... escreve essa merda direito! ❌`,
      );
    }
    const res = await this.search(content, context);

    await this.queueConfig(res, content, context);
  }

  async stop(context: Message): Promise<void> {
    const queue = this.player.getQueue(context.guild.id);
    this.validateQueueIsPlaying(queue, context);
    queue.destroy();
    await context.channel.send(`A Musica parou pq tu é chato pra krl ✅`);
  }

  async pause(context: Message): Promise<void> {
    const queue = this.player.getQueue(context.guild.id);
    this.validateQueueIsPlaying(queue, context);
    const success = queue.setPaused(true);
    await context.channel.send(
      success
        ? `A Musica parou pq tu é chato pra krl ✅`
        : 'Não consegui parar a musica... deu ruim meu patrão',
    );
  }

  async resume(context: Message): Promise<void> {
    const queue = this.player.getQueue(context.guild.id);
    this.validateQueueIsPlaying(queue, context);
    const success = queue.setPaused(false);
    await context.channel.send(
      success
        ? `A Musica parou pq tu é chato pra krl ✅`
        : 'Não consegui parar a musica... deu ruim meu patrão',
    );
  }

  async skip(context: Message): Promise<Message> {
    const queue = this.player.getQueue(context.guild.id);

    this.validateQueueIsPlaying(queue, context);
    const success = queue.skip();

    return context.channel.send(
      success
        ? `Che, acabei de pular essa merda de "${queue.current.title}"...✅`
        : `Che ${context.author}, deu merda ai pae, não deu pra pular essa bosta! ❌`,
    );
  }

  async skipTo(content: string, context: Message): Promise<Message> {
    const queue = this.player.getQueue(context.guild.id);

    this.validateQueueIsPlaying(queue, context);

    try {
      queue.skipTo(Number.parseInt(content));
      return context.channel.send(
        `Che, acabei de pular essa merda de "${queue.current.title}"...✅`,
      );
    } catch {
      return context.channel.send(
        `Che ${context.author},não deu pra pular essa bosta! Se pá não tem mais nada aí! ❌`,
      );
    }
  }

  async progress(content: string, context: Message): Promise<any> {
    return null;
  }

  private async queueConfig(
    playerSearch: PlayerSearchResult,
    content: string,
    context: Message,
  ): Promise<void> {
    let queue: Queue = this.player.getQueue(context.guild.id);

    if (!queue) {
      queue = this.player.createQueue(context.guild, {
        metadata: context.channel,
      });
    }
    try {
      if (!queue.connection) {
        await queue.connect(context.member.voice.channel);
      }
    } catch {
      this.player.deleteQueue(context.guild.id);
      context.channel.send(
        `Che te fude ${context.author}... não consegui conectar nessa merda! ❌`,
      );
    }
    context.channel.send(`Che, buscando essa merda "${content}"... 🎧`);

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

  private async validateQueueIsPlaying(queue: Queue, context: Message) {
    if (!queue || !queue.playing)
      context.channel.send(
        `${context.author}, tá viajando? não tem música tocando... drogado do krl 🌚 🪴`,
      );
  }
}

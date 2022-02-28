import { Controller } from '@nestjs/common';
import { Content, Context, On, OnCommand } from 'discord-nestjs';
import { Message } from 'discord.js';
import { BotService } from './bot.service';
import { Commands } from './utils/command.enum';

@Controller()
export class BotController {
  constructor(private botService: BotService) {}

  @OnCommand({ name: Commands.Help })
  async onHelp(
    @Content() content: string,
    @Context() [context]: [Message],
  ): Promise<void> {
    await context.reply(`${content}`);
  }

  @OnCommand({ name: Commands.Play })
  async onPlay(
    @Content() content: string,
    @Context() [context]: [Message],
  ): Promise<void> {
    await this.botService.play(content, context);
  }

  @OnCommand({ name: Commands.Stop })
  async onStop(@Context() [context]: [Message]): Promise<void> {
    await this.botService.stop(context);
  }

  @OnCommand({ name: Commands.Pause })
  async onPause(@Context() [context]: [Message]): Promise<void> {
    await this.botService.pause(context);
  }
  @OnCommand({ name: Commands.Resume })
  async onResume(@Context() [context]: [Message]): Promise<void> {
    await this.botService.resume(context);
  }
  @OnCommand({ name: Commands.Skip })
  async onSkip(@Context() [context]: [Message]): Promise<void> {
    await this.botService.skip(context);
  }
  @OnCommand({ name: Commands.SkipTo })
  async onSkipTo(
    @Content() content: string,
    @Context() [context]: [Message],
  ): Promise<void> {
    await this.botService.skipTo(content, context);
  }

  @OnCommand({ name: Commands.Progress })
  async onProgress(
    @Content() content: string,
    @Context() [context]: [Message],
  ): Promise<void> {
    await this.botService.progress(content, context);
  }
}

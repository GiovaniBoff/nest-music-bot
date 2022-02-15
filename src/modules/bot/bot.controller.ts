import { SubCommand } from '@discord-nestjs/core';
import { Controller } from '@nestjs/common';
import { Content, Context, OnCommand } from 'discord-nestjs';
import { CommandInteraction, Message } from 'discord.js';
import { BotService } from './bot.service';

@Controller()
export class BotController {

    constructor(private botService: BotService) { }

    @OnCommand({ name: 'help' || 'h' })
    async onHelp(
        @Content() content: string,
        @Context() [context]: [Message]
    ): Promise<void> {
        await context.reply(`${content}`)
    }

    @OnCommand({ name: 'play' })
    async onPlay(
        @Content() content: string,
        @Context() [context]: [Message]
    ): Promise<void> {
        await this.botService.play(content, context)
    }

    @OnCommand({ name: 'stop'})
    async onStop(
        @Content() content: string,
        @Context() [context]: [Message]
    ): Promise<void> {
        await this.botService.stop(context)
    }

    @OnCommand({ name: 'pause'})
    async onPause(
        @Content() content: string,
        @Context() [context]: [Message]
    ): Promise<void> {
        await this.botService.pause(context)
    }
    @OnCommand({ name: 'resume'})
    async onResume(
        @Content() content: string,
        @Context() [context]: [Message]
    ): Promise<void> {
        await this.botService.resume(context)
    }
}

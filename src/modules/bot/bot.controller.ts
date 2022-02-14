import { SubCommand } from '@discord-nestjs/core';
import { Controller} from '@nestjs/common';
import { Content, Context, OnCommand } from 'discord-nestjs';
import { CommandInteraction, Message } from 'discord.js';
import { BotService } from './bot.service';

@Controller()
export class BotController{
  
    constructor(private botService: BotService){}

    @OnCommand({ name: 'help'})
    async onHelp(
        @Content() content: string,
        @Context() [context]: [Message]
    ): Promise<void>{
        await context.reply(`${content}`)
    }

    @OnCommand({ name: 'play' })
    async onPlay(
        @Content() content: string,
        @Context() [context]: [Message]
    ): Promise<void>{
        await this.botService.play(content,context)
    }
}

import { SubCommand } from '@discord-nestjs/core';
import { Controller} from '@nestjs/common';
import { OnCommand } from 'discord-nestjs';
import { Message} from 'discord.js';

@Controller()
export class BotController{
  
    @OnCommand({ name: 'help'})
    async onHelp(message: Message): Promise<void>{
        await message.reply('VAI TU TI FUDE!')
    }

    @OnCommand({ name: 'play' })
    async onPlay(message: Message): Promise<void>{

    }
}

import { Module } from '@nestjs/common';
import { DiscordModule } from 'discord-nestjs';
import { discordConfigFactory } from 'src/infra/config/discord.config';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
    imports: [
        DiscordModule.forRootAsync({
            useFactory: discordConfigFactory,
        })
    ],
    controllers:[BotController],
    providers: [BotService]
})
export class BotModule {}

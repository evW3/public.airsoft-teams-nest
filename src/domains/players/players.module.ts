import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PlayersController } from './players.controller';

@Module({
    imports: [Query],
    controllers: [PlayersController]
})
export class PlayersModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {

    }
}
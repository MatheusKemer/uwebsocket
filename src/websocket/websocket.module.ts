import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [WebsocketService],
})
export class WebsocketModule {}

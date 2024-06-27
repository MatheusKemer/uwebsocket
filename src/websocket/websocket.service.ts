import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as uWS from 'uWebSockets.js';

@Injectable()
export class WebsocketService implements OnModuleInit {
  private readonly logger = new Logger(WebsocketService.name);
  private readonly wss: any;
  private interval: NodeJS.Timeout;
  private intervalSeconds: number;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.intervalSeconds = this.configService.get<number>(
      'INTERVAL_SECONDS',
      10,
    );
    this.baseUrl = this.configService.get<string>('BASE_URL');
    this.wss = uWS
      .App()
      .ws('/*', {
        open: (ws) => {
          this.logger.log('A WebSocket connected!');
          ws.subscribe('broadcast');
        },
        message: (ws, message, isBinary) => {
          const messageString = Buffer.from(message).toString();
          this.logger.log('Received message:', messageString);
          ws.send(`Echo: ${messageString}`, isBinary);
        },
        close: (ws, code, message) => {
          this.logger.log('WebSocket closed');
        },
      })
      .listen(3001, (token) => {
        if (token) {
          this.logger.log('Listening to port 3001');
        } else {
          this.logger.error('Failed to listen to port 3001');
        }
      });
  }

  onModuleInit() {
    this.startInterval();
  }

  private async fetchAndBroadcastData() {
    try {
      const response = await axios.get(`${this.baseUrl}/coins`);
      const data = response.data;
      this.logger.log('Fetched data from API');
      this.logger.log(data);

      // Broadcast data to all connected WebSocket clients
      this.wss.publish('broadcast', JSON.stringify(data));
    } catch (error) {
      this.logger.error('Error fetching data from API', error);
    }
  }

  private startInterval() {
    this.interval = setInterval(() => {
      this.fetchAndBroadcastData();
    }, this.intervalSeconds * 1000);
  }
}

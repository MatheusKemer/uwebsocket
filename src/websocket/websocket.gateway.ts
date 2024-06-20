import { OnModuleInit, Injectable } from '@nestjs/common';
import * as uWS from 'uWebSockets.js';

@Injectable()
export class WebsocketGateway implements OnModuleInit {
  onModuleInit() {
    uWS
      .App()
      .ws('/*', {
        open: (ws) => {
          console.log('A WebSocket connected!');
        },
        message: (ws, message, isBinary) => {
          const messageString = Buffer.from(message).toString();
          console.log('Received message:', messageString);
          ws.send(`Echo: ${messageString}`, isBinary);
        },
        close: (ws, code, message) => {
          console.log('WebSocket closed');
        },
      })
      .listen(3001, (listenSocket) => {
        if (listenSocket) {
          console.log('Listening to port 3001');
        } else {
          console.log('Failed to listen to port 3001');
        }
      });
  }
}

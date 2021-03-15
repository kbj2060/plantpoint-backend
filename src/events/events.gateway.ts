import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {ControlSwitchEvent, WebSocketEvent} from "../interfaces/events.interface";
import {WebSocketPort} from "../interfaces/constants";

@WebSocketGateway(WebSocketPort,{
  namespace: '/switch',
  path:'/ws',
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SwitchesGateWay');

  @SubscribeMessage(WebSocketEvent.SEND_SWITCH_TO_SERVER)
  handleMessage(client: Socket, payload: ControlSwitchEvent): void {
    this.server.emit(WebSocketEvent.SEND_SWITCH_TO_CLIENT, payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
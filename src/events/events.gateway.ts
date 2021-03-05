import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect, MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

interface ReducerControlSwitchesDto {
  machineSection: string;
  machine: string;
  status:  boolean;
}

@WebSocketGateway( {  transports: [ 'websocket'], path:'/ws' })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SwitchWebSocket');

  @SubscribeMessage('sendSwitchControl')
  handleMessage(client: Socket, payload: ReducerControlSwitchesDto) {
    this.server.emit('receiveSwitchControl', payload);
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
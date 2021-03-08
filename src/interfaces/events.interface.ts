export enum WebSocketEvent {
  SEND_SWITCH_TO_SERVER = 'sendSwitchToServer',
  SEND_SWITCH_TO_CLIENT = 'sendSwitchToClient'
}

export interface ControlSwitchEvent {
  machineSection: string;
  machine: string;
  status: number | boolean;
}
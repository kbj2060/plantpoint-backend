import { MachineSection } from '../entities/machine_section.entity';
import { User } from '../entities/user.entity';

export interface PowerOnSwitch {
  machineSection: string;
  machine: string;
  status: number;
}

export interface PowerOnMachines {
  machineSection: string;
  machines: string[];
}

export interface SwitchHistory {
  machine: string;
  status: number;
  controlledBy: string;
  created: Date;
}

export interface SwitchCreate {
  machine: string;
  machineSection: MachineSection;
  controlledBy: User;
  status: number;
}

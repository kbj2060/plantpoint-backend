import { MachineSection } from '../entities/machine_section.entity';

export interface LastCurrent {
  machine: string;
  machineSection: string;
  current: number;
}

export interface CurrentCreate {
  machine: string;
  machineSection: MachineSection;
  current: number;
}

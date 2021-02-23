import { MachineSection } from '../entities/machine_section.entity';
import { Machine } from '../entities/machine.entity';
import { User } from '../entities/user.entity';

export interface LastAutomation {
  start: string;
  end: string;
  term: number | null;
  enable: boolean;
  machine: Machine | string;
  automationType: string;
  machineSection: MachineSection | string;
}

export interface AutomationCreate {
  machineSection: MachineSection | string;
  machine: Machine | string;
  start: string[];
  end: string[];
  term?: number | null;
  enable: boolean;
  controlledBy: User;
}

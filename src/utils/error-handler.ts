import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { ErrorMessages } from '../interfaces/constants';
import { User } from '../entities/user.entity';
import { MachineSection } from '../entities/machine_section.entity';
import { Machine } from '../entities/machine.entity';
import { EnvironmentSection } from '../entities/environment_section.entity';
import { Schedule } from '../entities/schedule.entity';
import { PowerOnSwitch } from '../interfaces/switches.interface';
import {isArray} from "class-validator";



export function checkUser(user: User) {
  if (!user) {
    throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
  }
}

export function checkMachine(machine: Machine) {
  if (!machine) {
    throw new NotFoundException(ErrorMessages.NOT_FOUND_MACHINE);
  }
}

export function checkMachineSection(machineSection: MachineSection) {
  if (!machineSection) {
    throw new NotFoundException(ErrorMessages.NOT_FOUND_MACHINESECTION);
  }
}

export function checkEnvironmentSection(
  environmentSection: EnvironmentSection | EnvironmentSection[],
) {
  if (!environmentSection || ( environmentSection as EnvironmentSection[] ).length === 0 ) {
    throw new NotFoundException(ErrorMessages.NOT_FOUND_ENVIRONMENTSECTION);
  }
}

export function checkSchedule(schedule: Schedule) {
  if (!schedule) {
    throw new NotFoundException(ErrorMessages.NOT_FOUND_SCHEDULE);
  }
}

export function checkCurrentSwitches(switches: PowerOnSwitch[]) {
  if (!switches) {
    throw new NotFoundException(ErrorMessages.NOT_FOUND_SWITCHES);
  }
}

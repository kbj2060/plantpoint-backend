import * as moment from 'moment';
import { Machine } from '../entities/machine.entity';

export const getPresentDatetime = function (): string {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
};

export const getSectionInTopic = function (topic: string): string {
  return topic.split('/')[1];
};

export const getMachineInTopic = (topic: string): string => {
  return topic.split('/')[2];
};

export const getEnvironmentSectionInTopic = function (topic: string): string {
  return topic.split('/')[2];
};

export const flattenMachines = (machines: Machine[]): string[] => {
  return machines.map((m)=>Object.values(m)[0])
}
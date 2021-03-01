import * as moment from 'moment';

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
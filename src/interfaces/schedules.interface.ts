import { User } from '../entities/user.entity';

export interface SelectedDateSchedule {
  id: number;
  date: string;
  title: string;
  content: string;
  binding: number;
}

export interface ScheduleCreate {
  date: string[];
  title: string;
  content: string;
  createdBy: User;
}

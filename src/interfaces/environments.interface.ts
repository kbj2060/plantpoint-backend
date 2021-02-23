import { EnvironmentSection } from '../entities/environment_section.entity';

export interface LastEnvironment {
  co2: number;
  humidity: number;
  temperature: number;
}

export interface EnvironmentCreate {
  environmentSection: EnvironmentSection;
  co2: number;
  humidity: number;
  temperature: number;
}

export interface EnvironmentHistory {
  co2?: number;
  humidity?: number;
  temperature?: number;
  environmentSection: string;
  created: string;
}

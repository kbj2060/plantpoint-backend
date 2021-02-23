import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Expose } from 'class-transformer';
import { LastAutomation } from '../interfaces/automations.interface';

export class ResponseLastAutomationDto {
  @Expose()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsObject()
  readonly lastAutomations: LastAutomation[];
}

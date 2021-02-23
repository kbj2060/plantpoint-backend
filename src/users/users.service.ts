import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { ErrorMessages } from '../interfaces/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ username: username });
  }

  async signup(userCreateDto: CreateUserDto): Promise<void> {
    const user = await this.findOne(userCreateDto.username);
    if (user) {
      throw new BadRequestException(ErrorMessages.SAME_USER_EXISTED);
    }
    await this.userRepository.save(plainToClass(User, userCreateDto));
  }
}

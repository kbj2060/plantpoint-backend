import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './authentication/constants';
import { AuthenticationModule } from './authentication/authentication.module';
import { AutomationsModule } from './automations/automations.module';
import { CurrentsModule } from './currents/currents.module';
import { EnvironmentsModule } from './environments/environments.module';
import { SchedulesModule } from './schedules/schedules.module';
import { SwitchesModule } from './switches/switches.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';
import { MachinesModule } from './machines/machines.module';
import {MqttModule} from "nest-mqtt";
import { SectionsModule } from './sections/sections.module';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import {format} from "winston";

@Module({
  imports: [
    WinstonModule.forRoot({
      format: format.combine(
        format.prettyPrint(),
        format.timestamp({format: 'YYYY-MM-DD hh-mm-ss'}),
        format.printf(msg => {
          return `${msg.timestamp} | [${msg.level}] | ${msg.message}`;
        },
        )),
      transports: [
        new winston.transports.File({ filename: '.logs/error.log', level: 'error', zippedArchive: true, }),
        new winston.transports.File({ filename: '.logs/info.log', level: 'info', zippedArchive: true, }),
        new(winston.transports.Console)({ })
      ],
      // other options
    }),
    MqttModule.forRoot({

    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ClientsModule.register([
      {
        name: 'MQTT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '01055646565',
      database: 'iot',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      //cache: false,
      //keepConnectionAlive: true,
    }),
    AutomationsModule,
    CurrentsModule,
    EnvironmentsModule,
    SchedulesModule,
    SwitchesModule,
    UsersModule,
    AuthenticationModule,
    PassportModule,
    EventsModule,
    MachinesModule,
    SectionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

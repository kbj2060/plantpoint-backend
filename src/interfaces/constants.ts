export enum DateFormat {
  DAY_FORMAT = 'YYYY-MM-DD',
  MONTH_FORMAT = 'YYYY-MM',
  SECONDS_FORMAT = 'YYYY-MM-DD HH:mm:ss',
}

export enum MachineStatus {
  OFF = 0,
  ON = 1,
  STOP = 2,
  CONVERT = 3,
}

export enum SwitchHistoryNumber {
  LIMIT = 20,
}

export enum UserInfoLength {
  MIN_PASSWORD = 4,
  MAX_PASSWORD = 20,
  MIN_USERNAME = 4,
  MAX_USERNAME = 20,
}

export enum ErrorMessages {
  SAME_USER_EXISTED = 'Cannot Create User',
  NOT_FOUND_USER = 'Cannot Found User',
  NOT_FOUND_SCHEDULE = 'Cannot Found Schedule data',
  NOT_FOUND_SWITCHES = 'Cannot Found Switches data',
  NOT_FOUND_AUTOMATION = 'Cannot Found Automation data',
  NOT_FOUND_ENVIRONMENTNAME = 'Cannot Found EnvironmentName Column',
  NOT_FOUND_MACHINESECTION = 'Cannot Found MachineSection',
  NOT_FOUND_ENVIRONMENTSECTION = 'Cannot Found EnvironmentSection',
  NOT_FOUND_MACHINE = 'Cannot Found Machine',
  NOT_RIGHT_DATE_FORMAT = 'Date format should be day or month like YYYY-MM-DD or YYYY-MM',
}

export type City = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export type ForecastCurrent = {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;
  weather_code: number;
};

export type ForecastHourly = {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
};

export type ForecastDaily = {
  time: string[];
  temperature_2m_min: number[];
  temperature_2m_max: number[];
  weather_code: number[];
};

export type ForecastResponse = {
  timezone?: string;
  current?: ForecastCurrent;
  hourly?: ForecastHourly;
  daily?: ForecastDaily;
};

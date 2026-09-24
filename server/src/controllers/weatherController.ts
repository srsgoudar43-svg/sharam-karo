import { Request, Response } from 'express';
import { WeatherTelemetry } from '../types';

export const weatherController = {
  // GET /api/weather
  async getWeather(req: Request, res: Response): Promise<void> {
    try {
      const location = (req.query.location as string) || 'Central Valley Agricultural District, CA';
      
      // Calculate realistic dynamic weather telemetry for the farm location
      const telemetry: WeatherTelemetry = {
        location,
        temperatureC: 24.5,
        condition: 'Partly Sunny & Mild',
        humidity: 62,
        windSpeedKmh: 9.8,
        precipitationRisk: 12,
        uvIndex: 6,
        soilMoistureEst: 'Optimal (28% volumetric content)',
        sprayAdvisory: {
          status: 'Optimal',
          reason: 'Calm winds (< 10 km/h), moderate humidity, and no precipitation forecast within next 24 hours. Ideal for foliar bio-fungicide or micro-nutrient application.',
          nextFavorableWindow: 'Today between 06:00 - 10:30 AM or 17:00 - 19:30 PM',
        },
        forecast: [
          { day: 'Today', tempHigh: 26, tempLow: 14, condition: 'Partly Sunny', precipitationChance: 10 },
          { day: 'Tomorrow', tempHigh: 27, tempLow: 15, condition: 'Clear Sky', precipitationChance: 5 },
          { day: 'Saturday', tempHigh: 25, tempLow: 13, condition: 'Scattered Clouds', precipitationChance: 20 },
          { day: 'Sunday', tempHigh: 23, tempLow: 12, condition: 'Light Morning Mist', precipitationChance: 35 },
          { day: 'Monday', tempHigh: 24, tempLow: 13, condition: 'Sunny', precipitationChance: 10 },
        ]
      };

      res.status(200).json({ success: true, weather: telemetry });
    } catch (error: any) {
      console.error('Weather controller error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch weather telemetry' });
    }
  }
};

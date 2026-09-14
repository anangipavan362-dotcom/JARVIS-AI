import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CyberCard } from '../common/CyberCard';
import { ApiClient } from '../../services/api';
import { WeatherData } from '../../types';

export const WeatherWidget: React.FC = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await ApiClient.getWeather('San Francisco');
        setWeather(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <CyberCard
      title="METEOROLOGICAL TELEMETRY"
      subtitle="LIVE ATMOSPHERIC SENSORS"
      badge={weather?.is_live ? 'LIVE SENSOR' : 'CACHED'}
      headerAction={
        <button
          onClick={() => navigate('/weather')}
          className="text-cyan-400 hover:text-white text-xs font-mono flex items-center gap-1"
        >
          <span>EXPAND</span> <ArrowRight className="w-3 h-3" />
        </button>
      }
    >
      {loading ? (
        <div className="py-6 text-center font-mono text-xs text-cyan-400/60 animate-pulse">
          ACQUIRING ATMOSPHERIC TELEMETRY...
        </div>
      ) : weather ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">{weather.city}</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-500/70">
              FEELS LIKE {weather.feels_like}°C
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-hud font-black text-cyan-200">
              {weather.temperature}°C
            </span>
            <span className="text-xs font-mono text-gray-300">
              {weather.condition}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-500/10 text-[11px] font-mono text-gray-400">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Humidity: {weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wind: {weather.wind} km/h</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs font-mono text-gray-500 py-4 text-center">
          Meteorological sensors unreachable.
        </div>
      )}
    </CyberCard>
  );
};

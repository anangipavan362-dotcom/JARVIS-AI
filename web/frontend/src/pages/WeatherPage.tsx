import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Search,
  MapPin,
  Compass,
  Thermometer,
  Calendar
} from 'lucide-react';
import { ApiClient } from '../services/api';
import { WeatherData } from '../types';
import { CyberCard } from '../components/common/CyberCard';
import { sound } from '../utils/sound';

export const WeatherPage: React.FC = () => {
  const [cityInput, setCityInput] = useState('');
  const [currentCity, setCurrentCity] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (city?: string, lat?: number, lon?: number) => {
    setLoading(true);
    try {
      const data = await ApiClient.getWeather(city, lat, lon);
      setWeather(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(currentCity);
  }, [currentCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    sound.playClick();
    setCurrentCity(cityInput.trim());
    setCityInput('');
  };

  const handleUseBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by this browser.');
      return;
    }
    sound.playProcessing();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(undefined, pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        alert('Geolocation permission denied.');
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-widest text-cyan-300 uppercase">
            JARVIS WEATHER
          </h1>
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase mt-1">
            METEOROLOGICAL SENSOR SUITE & FORECAST RADAR
          </p>
        </div>

        <button
          onClick={handleUseBrowserLocation}
          className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-400 text-xs font-hud text-cyan-300 hover:text-white flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>USE BROWSER GPS</span>
        </button>
      </div>

      {/* Location Search Input */}
      <div className="cyber-panel p-4 rounded-lg">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search global coordinates or city (e.g. London, Tokyo, Mumbai, Paris)..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/60 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded bg-cyan-950 border border-cyan-400 text-xs font-hud font-bold text-cyan-300 hover:text-white"
          >
            SEARCH
          </button>
        </form>
      </div>

      {/* Current Atmospheric Telemetry Overview */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-cyan-400 animate-pulse">
          SAMPLING SATELLITE ATMOSPHERIC SENSORS...
        </div>
      ) : weather ? (
        <div className="space-y-6">
          <div className="cyber-panel rounded-lg p-6 sm:p-8 tech-corner-tl tech-corner-br flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-mono text-cyan-400">
                <MapPin className="w-4 h-4" />
                <span className="font-bold text-lg text-cyan-200">{weather.city}</span>
              </div>
              <div className="text-5xl sm:text-6xl font-hud font-black text-white tracking-tight">
                {weather.temperature}°C
              </div>
              <p className="text-sm font-mono text-cyan-300 uppercase tracking-wider">
                {weather.condition}
              </p>
            </div>

            {/* Metric Gauges */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-xs font-mono">
              <div className="p-3 rounded bg-black/50 border border-cyan-500/20">
                <span className="text-gray-400 block text-[10px]">FEELS LIKE</span>
                <span className="text-base font-bold text-cyan-200">{weather.feels_like}°C</span>
              </div>
              <div className="p-3 rounded bg-black/50 border border-cyan-500/20">
                <span className="text-gray-400 block text-[10px]">HUMIDITY</span>
                <span className="text-base font-bold text-blue-300">{weather.humidity}%</span>
              </div>
              <div className="p-3 rounded bg-black/50 border border-cyan-500/20">
                <span className="text-gray-400 block text-[10px]">WIND VELOCITY</span>
                <span className="text-base font-bold text-cyan-200">{weather.wind} km/h</span>
              </div>
              <div className="p-3 rounded bg-black/50 border border-cyan-500/20">
                <span className="text-gray-400 block text-[10px]">SENSOR STATUS</span>
                <span className="text-base font-bold text-green-400">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Multi-Day Forecast Matrix */}
          <div>
            <h3 className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>5-DAY METEOROLOGICAL FORECAST</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {weather.forecast?.map((day, i) => (
                <div
                  key={i}
                  className="cyber-panel rounded-lg p-3 text-center space-y-1 tech-corner-tl"
                >
                  <span className="text-[11px] font-mono text-cyan-400 font-bold block">
                    {day.date}
                  </span>
                  <div className="text-lg font-hud font-bold text-white">
                    {day.max_temp}° / <span className="text-gray-400 text-sm">{day.min_temp}°</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-300 block truncate">
                    {day.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="cyber-panel p-8 text-center text-xs font-mono text-gray-500">
          No meteorological data returned for location.
        </div>
      )}
    </div>
  );
};

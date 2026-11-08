import { useEffect, useState } from 'react';
import { BotonRosa } from './BotonRosa';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=13.7100&longitude=-89.1390&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=America%2FEl_Salvador';

const describeWeather = (code) => {
  if (code === 0) return 'Despejado';
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Neblina';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Llovizna';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Lluvia';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Nieve';
  if ([95, 96, 99].includes(code)) return 'Tormenta';
  return 'Condición no disponible';
};

export default function ApiExterna() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadWeather = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(WEATHER_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`La API respondió con el código ${response.status}.`);
        }

        const result = await response.json();
        if (!result.current || typeof result.current.temperature_2m !== 'number') {
          throw new Error('La respuesta de la API no contiene el clima actual esperado.');
        }

        setWeather(result.current);
      } catch (requestError) {
        if (requestError.name === 'AbortError') return;
        setError(requestError.message || 'No se pudo consultar el clima.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadWeather();
    return () => controller.abort();
  }, [refreshKey]);

  return (
    <section id="clima-actual" className="container section-block weather-section" aria-labelledby="weather-title">
      <div className="weather-card">
        <div>
          <span className="eyebrow">Clima actual</span>
          <h2 id="weather-title" className="section-title">Clima en Soyapango</h2>
          <p>Consulta las condiciones actuales cerca de nuestro salón.</p>
        </div>

        {loading ? (
          <p role="status">Consultando Open-Meteo...</p>
        ) : error ? (
          <div className="weather-message" role="alert">
            <p>No se pudo cargar el clima: {error}</p>
            <BotonRosa className="btn-secondary" texto="Reintentar" onClick={() => setRefreshKey((key) => key + 1)} />
          </div>
        ) : weather ? (
          <div className="weather-values" aria-live="polite">
            <strong className="weather-temperature">{Math.round(weather.temperature_2m)}°C</strong>
            <div>
              <p>{describeWeather(weather.weather_code)}</p>
              <p>Sensación térmica: {Math.round(weather.apparent_temperature)}°C</p>
              <p>Humedad: {weather.relative_humidity_2m}%</p>
            </div>
            <BotonRosa className="btn-secondary" texto="Actualizar" onClick={() => setRefreshKey((key) => key + 1)} />
          </div>
        ) : null}
        <small>Fuente: Open-Meteo · Datos meteorológicos de Soyapango, El Salvador.</small>
      </div>
    </section>
  );
}

import ApiExterna from '../components/ApiExterna';
import { CatalagoServicios } from '../components/CatalagoServicios';

const SALON_LOCATION = '13.7160476,-89.1540094';
const MAP_EMBED_URL = 'https://www.openstreetmap.org/export/embed.html?bbox=-89.1700%2C13.7040%2C-89.1380%2C13.7280&layer=mapnik&marker=13.7160476%2C-89.1540094';
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${SALON_LOCATION}`;

export function HomePage({ services, onBook, onReserve }) {
  return (
    <main>
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Belleza • bienestar • confianza</span>
            <h1 className="hero-title">Tu belleza y bienestar, en un solo lugar.</h1>
            <p className="hero-subtitle">Citas premium, servicios personalizados y atención para cada momento de tu rutina.</p>
            <div className="hero-actions">
              <button
                className="btn-secondary"
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver servicios
              </button>
              <button className="btn-primary" onClick={onReserve}>Reservar cita</button>
            </div>
            <div className="stats-row">
              <div><strong>10k+</strong><span>Clientes felices</span></div>
              <div><strong>4.9/5</strong><span>Valoración</span></div>
              <div><strong>15+</strong><span>Especialistas</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="hero visual">
            <div className="hero-glow" />
            <div className="visual-badge">Aesthetica</div>
            <div className="visual-card large-card">
              <span>Tratamiento facial</span>
              <strong>Revitaliza tu piel</strong>
              <div className="mini-tag">Desde $35</div>
            </div>
            <div className="visual-card mini-card">
              <strong>99%</strong>
              <span>clientes satisfechos</span>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios">
        <CatalagoServicios services={services} onBook={onBook} />
      </section>

      <section className="container section-block split-section">
        <div className="info-panel">
          <span className="eyebrow">Nuestra diferencia</span>
          <h3>Tu cuidado, diseñado para sentirse único.</h3>
          <ul>
            <li>Consulta personalizada con cada cliente.</li>
            <li>Productos premium y protocolos actualizados.</li>
            <li>Ambiente tranquilo, limpio y exclusivo.</li>
          </ul>
          <button className="btn-primary" onClick={onReserve}>Agendar ahora</button>
        </div>
        <div className="image-panel">
          <div className="image-box"><span>Consulta personalizada</span></div>
        </div>
      </section>

      <section className="container section-block specialists-section">
        <div className="section-header">
          <span className="eyebrow">Especialistas</span>
          <h2 className="section-title">Conoce a nuestro equipo</h2>
        </div>
        <div className="specialist-grid">
          {['Ana Martínez', 'Juan Alberto', 'Elena Gómez'].map((person, index) => (
            <div className="specialist-item" key={person}>
              <div className="avatar">{person.split(' ')[0].slice(0, 1)}</div>
              <h4>{person}</h4>
              <p>{index === 0 ? 'Especialista facial' : index === 1 ? 'Masajista corporal' : 'Manicurista'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-block cta-banner">
        <div>
          <span className="eyebrow">Reserva tu cita</span>
          <h3>Cuida tu bienestar con una experiencia premium.</h3>
        </div>
        <button className="btn-primary" onClick={onReserve}>Reservar ahora</button>
      </section>

      <section id="ubicacion" className="container section-block">
        <div className="section-header">
          <div>
            <span className="eyebrow">Visítanos</span>
            <h2 className="section-title">Cómo llegar a nuestro salón</h2>
          </div>
          <a className="btn-primary" href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
            Abrir indicaciones
          </a>
        </div>
        <div className="map-container">
          <iframe
            title="Mapa de la Universidad Don Bosco en Soyapango"
            src={MAP_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-caption">
            <p><strong>Universidad Don Bosco</strong> · Soyapango, San Salvador</p>
            <p>El mapa y las indicaciones señalan la ubicación de la universidad.</p>
            <a href="https://www.openstreetmap.org/?mlat=13.7160476&mlon=-89.1540094#map=16/13.7160476/-89.1540094" target="_blank" rel="noreferrer">
              Ver mapa ampliado en OpenStreetMap
            </a>
          </div>
        </div>
      </section>

      <ApiExterna />

      <section className="container section-block report-cta">
        <div>
          <span className="eyebrow">Aesthetica en cifras</span>
          <h2 className="section-title">Consulta nuestras estadísticas</h2>
          <p>Explora el rendimiento de los servicios y compara los resultados por año.</p>
        </div>
        <a className="btn-primary" href="./reportes.html">Ver gráficas</a>
      </section>
    </main>
  );
}

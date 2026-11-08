import { BotonRosa } from './BotonRosa';

export function CatalagoServicios({ services, onBook }) {
  return (
    <section className="container section-block" aria-labelledby="services-title">
      <div className="section-header">
        <div>
          <span className="eyebrow">Servicios</span>
          <h2 id="services-title" className="section-title">Nuestros tratamientos</h2>
        </div>
      </div>
      {services.length === 0 ? (
        <p role="status">No hay servicios disponibles en este momento.</p>
      ) : (
        <div className="grid-3">
          {services.map((service) => (
            <article className="card" key={service.id}>
              <div className="card-topline">{service.duration}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p className="price-tag">${Number(service.price).toFixed(2)}</p>
              <BotonRosa texto="Reservar" onClick={() => onBook(service)} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

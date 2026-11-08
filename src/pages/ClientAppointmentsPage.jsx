import { dateOffset } from '../context/SalonContext';

export function ClientAppointmentsPage({ appointments, onBook, onCancel }) {
  return (
    <main className="container section-block">
      <div className="section-header">
        <div>
          <span className="eyebrow">Tu bienestar, a tu ritmo</span>
          <h2 className="section-title">Mis citas</h2>
        </div>
        <button className="btn-primary" onClick={onBook}>Reservar una cita</button>
      </div>
      {appointments.length === 0 ? (
        <div className="selection-box empty-state">
          <h3>Aún no tienes citas</h3>
          <p>Cuando reserves un servicio, aquí podrás consultar su fecha y estado.</p>
        </div>
      ) : (
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <article className="selection-box appointment-card" key={appointment.id}>
              <div>
                <span className={`status-pill status-${appointment.status}`}>{appointment.status}</span>
                <h3>{appointment.serviceName}</h3>
                <p>{appointment.date} · {appointment.time} · {appointment.specialist}</p>
                <strong>${appointment.price}.00</strong>
              </div>
              {appointment.status !== 'cancelado' && appointment.date >= dateOffset(0) && (
                <button className="btn-primary danger" onClick={() => onCancel(appointment)}>
                  Cancelar cita
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

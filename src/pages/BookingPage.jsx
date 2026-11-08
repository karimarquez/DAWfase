export function BookingPage({
  bookingForm,
  setBookingForm,
  services,
  dateOffset,
  availableTimes,
  specialistOptions,
  selectedService,
  onSubmit,
}) {
  return (
    <main className="container section-block">
      <h2 className="section-title">Reserva tu cita</h2>
      <form onSubmit={onSubmit} className="booking-form">
        <div className="two-columns">
          <div className="selection-box">
            <h3>SELECCIONA EL SERVICIO</h3>
            <div className="form-group">
              <label htmlFor="booking-service">Servicio</label>
              <select
                id="booking-service"
                className="form-input"
                value={bookingForm.serviceId}
                onChange={(event) => setBookingForm({ ...bookingForm, serviceId: Number(event.target.value) })}
                required
              >
                {services.length === 0 && <option value="">No hay servicios disponibles</option>}
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="booking-date">Fecha</label>
              <input
                id="booking-date"
                type="date"
                className="form-input"
                value={bookingForm.date}
                min={dateOffset(1)}
                onChange={(event) => setBookingForm({ ...bookingForm, date: event.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora</label>
              <div className="time-slots">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`slot-btn ${bookingForm.time === time ? 'active' : ''}`}
                    onClick={() => setBookingForm({ ...bookingForm, time })}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {availableTimes.length === 0 && <p className="form-hint">No hay horarios para este día. Prueba otra fecha o especialista.</p>}
            </div>
          </div>

          <div className="selection-box">
            <h3>ELIGE TU ESPECIALISTA</h3>
            <div className="specialist-list">
              {specialistOptions.map((person) => (
                <label key={person} className={`specialist-card ${bookingForm.specialist === person ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="specialist"
                    value={person}
                    checked={bookingForm.specialist === person}
                    onChange={() => setBookingForm({ ...bookingForm, specialist: person })}
                    required
                  />
                  <div><strong>{person}</strong><small>Especialista</small></div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-resume-box">
          <div>
            <strong>RESUMEN:</strong>{' '}
            {selectedService
              ? `${selectedService.name} | ${bookingForm.date} | ${bookingForm.time} | ${bookingForm.specialist} | $${selectedService.price}.00`
              : 'No hay servicios disponibles'}
          </div>
          <button className="btn-primary" type="submit" disabled={!selectedService}>Continuar al pago</button>
        </div>
      </form>
    </main>
  );
}

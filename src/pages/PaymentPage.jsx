export function PaymentPage({
  paymentForm,
  setPaymentForm,
  pendingReservation,
  selectedService,
  bookingForm,
  onSubmit,
}) {
  return (
    <main className="container section-block">
      <h2 className="section-title">Confirmación y Pago</h2>
      <form onSubmit={onSubmit} className="two-columns">
        <div className="selection-box">
          <h3>MÉTODOS DE PAGO</h3>
          <div className="payment-methods">
            <label className={paymentForm.method === 'online' ? 'selected-payment' : ''}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentForm.method === 'online'}
                onChange={() => setPaymentForm({ ...paymentForm, method: 'online' })}
                required
              />
              Pagar en línea
            </label>
            <label className={paymentForm.method === 'local' ? 'selected-payment' : ''}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentForm.method === 'local'}
                onChange={() => setPaymentForm({ ...paymentForm, method: 'local' })}
              />
              Pagar en establecimiento
            </label>
          </div>

          {paymentForm.method === 'online' && (
            <div className="payment-demo-fields">
              <p className="form-hint">Demostración académica: no introduzcas datos de una tarjeta real. No se procesa ningún pago.</p>
              <div className="form-group">
                <label htmlFor="demo-card">Número de tarjeta de prueba</label>
                <input
                  id="demo-card"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={19}
                  className="form-input"
                  value={paymentForm.card}
                  onChange={(event) => setPaymentForm({ ...paymentForm, card: event.target.value.replace(/\D/g, '').slice(0, 19) })}
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="demo-exp">Vencimiento de prueba</label>
                  <input
                    id="demo-exp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={5}
                    className="form-input"
                    value={paymentForm.exp}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                      setPaymentForm({ ...paymentForm, exp: digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits });
                    }}
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="demo-cvc">CVC de prueba</label>
                  <input
                    id="demo-cvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    className="form-input"
                    value={paymentForm.cvc}
                    onChange={(event) => setPaymentForm({ ...paymentForm, cvc: event.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="123 o 1234"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="selection-box payment-summary">
          <h3>RESUMEN DE COMPRA</h3>
          <div className="summary-list">
            <p><strong>Servicio:</strong> {pendingReservation?.serviceName || selectedService?.name || 'No disponible'}</p>
            <p><strong>Fecha:</strong> {pendingReservation?.date || bookingForm.date}</p>
            <p><strong>Hora:</strong> {pendingReservation?.time || bookingForm.time}</p>
            <p><strong>Especialista:</strong> {pendingReservation?.specialist || bookingForm.specialist}</p>
            <hr />
            <p><strong>Total:</strong> ${pendingReservation?.price || selectedService?.price || 0}.00</p>
            <p className="payment-total"><strong>Anticipo:</strong> $10.00</p>
          </div>
          <button className="btn-primary payment-submit" type="submit">
            {paymentForm.method === 'online' ? 'Confirmar simulación' : 'Registrar cita'}
          </button>
        </div>
      </form>
    </main>
  );
}

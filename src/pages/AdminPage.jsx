import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AdminPage({
  currentUser,
  dashboardStats,
  chartData,
  appointments,
  users,
  services,
  serviceForm,
  setServiceForm,
  editingServiceId,
  onLogout,
  onAppointmentStatus,
  onServiceSubmit,
  onCancelEdit,
  onEditService,
  onDeleteService,
}) {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h3>Aesthetica Admin</h3>
        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li>Citas</li>
          <li>Servicios</li>
          <li>Personal</li>
        </ul>
        <button className="btn-secondary sidebar-logout" onClick={onLogout}>Cerrar sesión</button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h2>Panel de administración</h2>
          <div>Bienvenido, {currentUser?.name}</div>
        </header>

        <div className="metrics-grid">
          <div className="metric-card">
            <div>Citas confirmadas</div>
            <div className="metric-value">{dashboardStats.confirmed}</div>
          </div>
          <div className="metric-card">
            <div>Ingresos</div>
            <div className="metric-value">${dashboardStats.totalRevenue}.00</div>
          </div>
          <div className="metric-card">
            <div>Pendientes</div>
            <div className="metric-value">{dashboardStats.pending}</div>
          </div>
        </div>

        <div className="admin-panels">
          <div className="selection-box chart-box">
            <h3>RENDIMIENTO DE SERVICIOS</h3>
            <div className="chart-wrapper">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                }}
              />
            </div>
          </div>

          <section className="selection-box table-box">
            <div className="section-header">
              <div>
                <h3>GESTIÓN DE CITAS</h3>
                <p>Confirma o cancela las reservas de tus clientes.</p>
              </div>
            </div>
            {appointments.length === 0 ? (
              <p>No hay citas registradas.</p>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Fecha y hora</th>
                      <th>Especialista</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{users.find((user) => user.id === appointment.userId)?.name || 'Cliente'}</td>
                        <td>{appointment.serviceName}</td>
                        <td>{appointment.date} · {appointment.time}</td>
                        <td>{appointment.specialist}</td>
                        <td><span className={`status-pill status-${appointment.status}`}>{appointment.status}</span></td>
                        <td className="actions-cell">
                          {appointment.status !== 'confirmado' && appointment.status !== 'cancelado' && (
                            <button className="btn-secondary small" onClick={() => onAppointmentStatus(appointment, 'confirmado')}>
                              Confirmar
                            </button>
                          )}
                          {appointment.status !== 'cancelado' && (
                            <button className="btn-primary small danger" onClick={() => onAppointmentStatus(appointment, 'cancelado')}>
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="selection-box table-box">
            <h3>CRUD DE SERVICIOS</h3>
            <form onSubmit={onServiceSubmit} className="service-form">
              <div className="form-row">
                <div className="form-group half">
                  <label>Nombre</label>
                  <input
                    type="text"
                    className="form-input"
                    value={serviceForm.name}
                    onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })}
                    minLength={3}
                    maxLength={80}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Precio</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-input"
                    value={serviceForm.price}
                    onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Duración</label>
                  <input
                    type="text"
                    className="form-input"
                    value={serviceForm.duration}
                    onChange={(event) => setServiceForm({ ...serviceForm, duration: event.target.value })}
                    placeholder="45 min"
                    pattern="[0-9]{1,3}\s?[a-zA-Z]+"
                    title="Indica la duración en minutos u horas (por ejemplo, 45 min)"
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Descripción</label>
                  <input
                    type="text"
                    className="form-input"
                    value={serviceForm.description}
                    onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })}
                    maxLength={240}
                  />
                </div>
              </div>
              <button className="btn-primary" type="submit">
                {editingServiceId ? 'Guardar cambios' : 'Añadir servicio'}
              </button>
              {editingServiceId && (
                <button className="btn-secondary service-cancel" type="button" onClick={onCancelEdit}>
                  Cancelar edición
                </button>
              )}
            </form>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Precio</th>
                  <th>Tiempo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>${service.price}.00</td>
                    <td>{service.duration}</td>
                    <td className="actions-cell">
                      <button className="btn-secondary small" onClick={() => onEditService(service)}>Editar</button>
                      <button className="btn-primary small danger" onClick={() => onDeleteService(service.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

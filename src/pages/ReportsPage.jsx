import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useSalon } from '../context/SalonContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const STATUSES = [
  { key: 'confirmado', label: 'Confirmadas', color: '#89564e' },
  { key: 'pendiente', label: 'Pendientes', color: '#bd8a78' },
  { key: 'cancelado', label: 'Canceladas', color: '#b95a52' },
];
const CURRENT_YEAR = String(new Date().getFullYear());

const getYear = (date) => (/^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date.slice(0, 4) : null);

export function ReportsPage() {
  const { appointments } = useSalon();
  const availableYears = useMemo(() => {
    const years = appointments.map((appointment) => getYear(appointment.date)).filter(Boolean);
    return [...new Set([CURRENT_YEAR, ...years])].sort((a, b) => b.localeCompare(a));
  }, [appointments]);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const yearAppointments = useMemo(
    () => appointments.filter((appointment) => getYear(appointment.date) === selectedYear),
    [appointments, selectedYear]
  );
  const chartData = useMemo(() => ({
    labels: MONTHS,
    datasets: STATUSES.map((status) => {
      const monthlyTotals = Array(12).fill(0);
      yearAppointments.forEach((appointment) => {
        if (appointment.status !== status.key) return;
        const month = Number(appointment.date.slice(5, 7));
        if (month >= 1 && month <= 12) monthlyTotals[month - 1] += 1;
      });

      return {
        label: status.label,
        data: monthlyTotals,
        backgroundColor: status.color,
        borderRadius: 5,
      };
    }),
  }), [yearAppointments]);
  const summary = useMemo(() => ({
    total: yearAppointments.length,
    confirmed: yearAppointments.filter((item) => item.status === 'confirmado').length,
    cancelled: yearAppointments.filter((item) => item.status === 'cancelado').length,
  }), [yearAppointments]);
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      title: { display: true, text: `Citas registradas en ${selectedYear}` },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <main className="container section-block reports-page">
      <a className="back-link" href="./" aria-label="Volver a la página principal de Aesthetica">
        ← Volver a Aesthetica
      </a>
      <section className="selection-box reports-card" aria-labelledby="reports-title">
        <div className="reports-header">
          <div>
            <span className="eyebrow">Aesthetica en cifras</span>
            <h1 id="reports-title" className="section-title">Reporte de citas</h1>
            <p>Resumen calculado a partir de las reservas guardadas en este navegador.</p>
          </div>
          <div className="form-group reports-filter">
            <label htmlFor="report-year">Seleccionar año</label>
            <select
              id="report-year"
              className="form-input"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        <div className="metrics-grid reports-stats" aria-live="polite">
          <div className="metric-card">
            <div>Citas del año</div>
            <div className="metric-value">{summary.total}</div>
          </div>
          <div className="metric-card">
            <div>Confirmadas</div>
            <div className="metric-value">{summary.confirmed}</div>
          </div>
          <div className="metric-card">
            <div>Canceladas</div>
            <div className="metric-value">{summary.cancelled}</div>
          </div>
        </div>

        <div className="reports-chart">
          <Bar data={chartData} options={chartOptions} />
        </div>
        {yearAppointments.length === 0 && (
          <p className="reports-empty" role="status">
            No hay citas registradas para {selectedYear}. La gráfica se actualizará al crear reservas.
          </p>
        )}
        <p className="reports-note">
          Los datos se almacenan localmente y no se sincronizan entre dispositivos o usuarios.
        </p>
      </section>
    </main>
  );
}

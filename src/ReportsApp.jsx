import { SalonProvider } from './context/SalonContext';
import { ReportsPage } from './pages/ReportsPage';

export default function ReportsApp() {
  return (
    <SalonProvider>
      <ReportsPage />
    </SalonProvider>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SalonContext = createContext(null);
const STORAGE_KEYS = {
  appointments: 'aesthetica_appointments',
  users: 'aesthetica_users',
  services: 'aesthetica_services',
  session: 'aesthetica_current_user',
};

export const dateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const specialistOptions = ['Ana Martínez', 'Juan Alberto', 'Elena Gómez'];

const initialUsers = [
  { id: 1, name: 'Administrador', email: 'admin@aesthetica.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Cliente Demo', email: 'cliente@aesthetica.com', password: 'cliente123', role: 'client' },
];

const initialServices = [
  { id: 1, name: 'Limpieza facial', price: 35, duration: '45Min', description: 'Piel luminosa y revitalizada.' },
  { id: 2, name: 'Masaje corporal', price: 50, duration: '60Min', description: 'Relajación profunda y alivio muscular.' },
  { id: 3, name: 'Manicure Spa', price: 25, duration: '30Min', description: 'Cuidado premium para tus manos.' },
  { id: 4, name: 'Tratamiento facial', price: 65, duration: '75Min', description: 'Hidratación, limpieza y rejuvenecimiento.' },
];

const initialAppointments = [
  { id: 1, userId: 2, serviceId: 1, serviceName: 'Limpieza facial', price: 35, specialist: 'Ana Martínez', date: dateOffset(3), time: '10:00', status: 'confirmado' },
  { id: 2, userId: 2, serviceId: 2, serviceName: 'Masaje corporal', price: 50, specialist: 'Juan Alberto', date: dateOffset(4), time: '13:30', status: 'pendiente' },
];

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`No se pudo leer el almacenamiento "${key}":`, error);
    return fallback;
  }
};

const loadAppointments = () => {
  try {
    const appointments = readStorage(STORAGE_KEYS.appointments, initialAppointments);
    if (!Array.isArray(appointments)) {
      throw new Error('Los datos guardados de las citas no tienen un formato válido.');
    }

    return appointments.map((appointment) => {
      const oldFirstDemo = appointment.id === 1
        && appointment.userId === 2
        && appointment.serviceName === 'Limpieza facial'
        && appointment.specialist === 'Ana Martínez'
        && appointment.date === '2026-09-28';
      const oldSecondDemo = appointment.id === 2
        && appointment.userId === 2
        && appointment.serviceName === 'Masaje corporal'
        && appointment.specialist === 'Juan Alberto'
        && appointment.date === '2026-09-29';

      if (oldFirstDemo) return { ...appointment, date: dateOffset(3) };
      if (oldSecondDemo) return { ...appointment, date: dateOffset(4) };
      return appointment;
    });
  } catch (error) {
    console.error('No se pudieron cargar las citas guardadas:', error);
    return initialAppointments;
  }
};

export function SalonProvider({ children }) {
  const [appointments, setAppointments] = useState(loadAppointments);
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, initialUsers));
  const [services, setServices] = useState(() => readStorage(STORAGE_KEYS.services, initialServices));
  const [currentUser, setCurrentUser] = useState(() => readStorage(STORAGE_KEYS.session, null));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
    } catch (error) {
      console.error('No se pudieron guardar las citas:', error);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    } catch (error) {
      console.error('No se pudieron guardar los usuarios:', error);
    }
  }, [users]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
    } catch (error) {
      console.error('No se pudieron guardar los servicios:', error);
    }
  }, [services]);

  useEffect(() => {
    try {
      if (currentUser) {
        window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.session);
      }
    } catch (error) {
      console.error('No se pudo guardar la sesión:', error);
    }
  }, [currentUser]);

  const value = useMemo(() => ({
    appointments,
    setAppointments,
    users,
    setUsers,
    services,
    setServices,
    currentUser,
    setCurrentUser,
  }), [appointments, users, services, currentUser]);

  return (
    <SalonContext.Provider value={value}>
      {children}
    </SalonContext.Provider>
  );
}

export function useSalon() {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon debe utilizarse dentro de un SalonProvider.');
  }
  return context;
}

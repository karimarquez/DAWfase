import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { AppHeader } from './components/AppHeader';
import { dateOffset, SalonProvider, specialistOptions, useSalon } from './context/SalonContext';
import { BookingPage } from './pages/BookingPage';
import { ClientAppointmentsPage } from './pages/ClientAppointmentsPage';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { PaymentPage } from './pages/PaymentPage';
import { AdminPage } from './pages/AdminPage';

const timeOptions = ['10:00', '11:00', '13:00', '14:30', '16:00', '17:30'];

function AppContent() {
  const {
    appointments,
    setAppointments,
    users,
    setUsers,
    services,
    setServices,
    currentUser,
    setCurrentUser,
  } = useSalon();
  const [currentView, setCurrentView] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [pendingReservation, setPendingReservation] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: 'admin@aesthetica.com', password: 'admin123' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [bookingForm, setBookingForm] = useState({
    serviceId: 1,
    date: dateOffset(1),
    time: '10:00',
    specialist: specialistOptions[0],
  });
  const [paymentForm, setPaymentForm] = useState({ method: 'online', card: '', exp: '', cvc: '' });
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '', description: '' });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [notice, setNotice] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && currentView !== 'admin') {
      setCurrentView('admin');
    }
  }, [currentUser, currentView]);

  useEffect(() => {
    if (!notice.text) return;

    Swal.fire({
      icon: notice.type === 'error' ? 'error' : 'success',
      title: notice.type === 'error' ? 'Revisa los datos' : '¡Listo!',
      text: notice.text,
      confirmButtonColor: '#89564e',
    });
  }, [notice]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === Number(bookingForm.serviceId)) || services[0] || null,
    [services, bookingForm.serviceId]
  );

  const availableTimes = useMemo(
    () => timeOptions.filter((time) => !appointments.some((appointment) =>
      appointment.date === bookingForm.date
      && appointment.time === time
      && appointment.specialist === bookingForm.specialist
      && appointment.status !== 'cancelado'
    )),
    [appointments, bookingForm.date, bookingForm.specialist]
  );

  useEffect(() => {
    if (availableTimes.length > 0 && !availableTimes.includes(bookingForm.time)) {
      setBookingForm((current) => ({ ...current, time: availableTimes[0] }));
    }
  }, [availableTimes, bookingForm.time]);

  const chartData = useMemo(() => {
    const totals = services.map((service) => {
      const serviceAppointments = appointments.filter((appointment) => appointment.serviceId === service.id);
      return serviceAppointments.length;
    });

    return {
      labels: services.map((service) => service.name),
      datasets: [{
        label: 'Servicios reservados',
        data: totals,
        backgroundColor: '#8C5158',
      }],
    };
  }, [services, appointments]);

  const dashboardStats = useMemo(() => {
    const totalRevenue = appointments
      .filter((appointment) => appointment.status === 'confirmado')
      .reduce((sum, appointment) => sum + Number(appointment.price || 0), 0);
    const pending = appointments.filter((item) => item.status === 'pendiente').length;
    const confirmed = appointments.filter((item) => item.status === 'confirmado').length;

    return {
      totalRevenue,
      pending,
      confirmed,
    };
  }, [appointments]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (!loginForm.email.trim() || !loginForm.password) {
      setNotice({ type: 'error', text: 'Escribe tu correo y contraseña para continuar.' });
      return;
    }

    const user = users.find(
      (item) => item.email.toLowerCase() === loginForm.email.trim().toLowerCase() && item.password === loginForm.password
    );

    if (!user) {
      setNotice({ type: 'error', text: 'Correo o contraseña incorrectos.' });
      return;
    }

    setCurrentUser(user);
    setNotice({ type: 'success', text: `Bienvenido ${user.name}` });
    setCurrentView(user.role === 'admin' ? 'admin' : 'home');
    setLoginForm({ email: '', password: '' });
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!registerForm.name.trim() || !registerForm.email.trim() || !registerForm.password || !registerForm.confirmPassword) {
      setNotice({ type: 'error', text: 'Todos los campos son obligatorios.' });
      return;
    }

    if (registerForm.name.trim().length < 2) {
      setNotice({ type: 'error', text: 'El nombre debe tener al menos 2 caracteres.' });
      return;
    }

    if (registerForm.password.length < 8 || !/[A-Z]/.test(registerForm.password) || !/[a-z]/.test(registerForm.password) || !/\d/.test(registerForm.password)) {
      setNotice({ type: 'error', text: 'Usa al menos 8 caracteres con una mayúscula, una minúscula y un número.' });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setNotice({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    const emailExists = users.some((user) => user.email.toLowerCase() === registerForm.email.trim().toLowerCase());
    if (emailExists) {
      setNotice({ type: 'error', text: 'Ese correo ya está registrado.' });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: registerForm.name.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      role: 'client',
    };

    setUsers((current) => [...current, newUser]);
    setNotice({ type: 'success', text: 'Usuario registrado correctamente.' });
    setAuthMode('login');
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleBooking = (event) => {
    event.preventDefault();

    if (!currentUser) {
      setCurrentView('login');
      setNotice({ type: 'error', text: 'Debes iniciar sesión para reservar.' });
      return;
    }

    if (!selectedService) {
      setNotice({ type: 'error', text: 'No hay servicios disponibles. Contacta con la clínica.' });
      return;
    }

    if (bookingForm.date < dateOffset(1)) {
      setNotice({ type: 'error', text: 'Selecciona una fecha a partir de mañana.' });
      return;
    }

    if (!availableTimes.includes(bookingForm.time)) {
      setNotice({ type: 'error', text: 'Ese horario ya no está disponible para el especialista. Elige otro.' });
      return;
    }

    const reservation = {
      id: Date.now(),
      userId: currentUser.id,
      serviceId: Number(bookingForm.serviceId),
      serviceName: selectedService.name,
      price: Number(selectedService.price),
      specialist: bookingForm.specialist,
      date: bookingForm.date,
      time: bookingForm.time,
      status: 'pendiente',
    };

    setPendingReservation(reservation);
    setCurrentView('payment');
  };

  const handlePayment = (event) => {
    event.preventDefault();

    if (!pendingReservation) {
      setNotice({ type: 'error', text: 'No hay reserva pendiente.' });
      return;
    }

    if (paymentForm.method === 'online') {
      const cardNumber = paymentForm.card.replace(/\D/g, '');
      const digitSum = [...cardNumber].reverse().reduce((sum, digit, index) => {
        let value = Number(digit);
        if (index % 2 === 1) {
          value *= 2;
          if (value > 9) value -= 9;
        }
        return sum + value;
      }, 0);
      const expiration = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(paymentForm.exp);
      const currentMonth = new Date().getFullYear() % 100 * 12 + new Date().getMonth();
      const expiryMonth = expiration ? Number(expiration[2]) * 12 + Number(expiration[1]) - 1 : -1;

      if (cardNumber.length < 13 || cardNumber.length > 19 || digitSum % 10 !== 0) {
        setNotice({ type: 'error', text: 'Revisa el número de tarjeta de prueba (debe tener entre 13 y 19 dígitos válidos).' });
        return;
      }

      if (!expiration || expiryMonth < currentMonth) {
        setNotice({ type: 'error', text: 'Escribe una fecha válida y vigente con el formato MM/AA.' });
        return;
      }

      if (!/^\d{3,4}$/.test(paymentForm.cvc)) {
        setNotice({ type: 'error', text: 'El código de seguridad debe tener 3 o 4 dígitos.' });
        return;
      }
    }

    const confirmedReservation = {
      ...pendingReservation,
      status: paymentForm.method === 'online' ? 'confirmado' : 'pendiente',
    };

    setAppointments((current) => [confirmedReservation, ...current]);
    setPendingReservation(null);
    setPaymentForm({ method: 'online', card: '', exp: '', cvc: '' });
    setCurrentView('home');
    setNotice({
      type: 'success',
      text: paymentForm.method === 'online'
        ? 'Reserva confirmada. El cobro es una simulación académica; no se procesó ningún pago real.'
        : 'Cita registrada. El pago se realizará en el establecimiento.',
    });
  };

  const handleServiceSubmit = (event) => {
    event.preventDefault();

    if (!serviceForm.name.trim() || !serviceForm.price || !serviceForm.duration.trim()) {
      setNotice({ type: 'error', text: 'Nombre, precio y duración son obligatorios.' });
      return;
    }

    if (serviceForm.name.trim().length < 3 || Number(serviceForm.price) <= 0 || !Number.isFinite(Number(serviceForm.price))) {
      setNotice({ type: 'error', text: 'El nombre debe tener al menos 3 caracteres y el precio debe ser mayor que cero.' });
      return;
    }

    if (!/^\d{1,3}\s?(min|mins|minutos|h|hora|horas)$/i.test(serviceForm.duration.trim())) {
      setNotice({ type: 'error', text: 'Indica la duración en minutos u horas, por ejemplo: 45 min.' });
      return;
    }

    if (editingServiceId) {
      setServices((current) =>
        current.map((service) =>
          service.id === editingServiceId ? { ...service, ...serviceForm, price: Number(serviceForm.price) } : service
        )
      );
      setNotice({ type: 'success', text: 'Servicio actualizado correctamente.' });
    } else {
      const newService = {
        id: Date.now(),
        name: serviceForm.name.trim(),
        price: Number(serviceForm.price),
        duration: serviceForm.duration.trim(),
        description: serviceForm.description.trim() || 'Servicio disponible en la clínica.',
      };

      setServices((current) => [newService, ...current]);
      setNotice({ type: 'success', text: 'Servicio agregado correctamente.' });
    }

    setServiceForm({ name: '', price: '', duration: '', description: '' });
    setEditingServiceId(null);
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description,
    });
  };

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar este servicio?',
      text: 'Las citas existentes se conservarán en el historial.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Conservar',
      confirmButtonColor: '#b95a52',
    });

    if (!result.isConfirmed) return;

    setServices((current) => current.filter((service) => service.id !== serviceId));
    setNotice({ type: 'success', text: 'Servicio eliminado.' });
  };

  const handleAppointmentStatus = async (appointment, status) => {
    const action = status === 'confirmado' ? 'confirmar' : 'cancelar';
    const result = await Swal.fire({
      icon: 'question',
      title: `¿${action} esta cita?`,
      text: `${appointment.serviceName} · ${appointment.date} a las ${appointment.time}`,
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Volver',
      confirmButtonColor: status === 'cancelado' ? '#b95a52' : '#89564e',
    });

    if (!result.isConfirmed) return;

    setAppointments((current) => current.map((item) =>
      item.id === appointment.id ? { ...item, status } : item
    ));
    setNotice({ type: 'success', text: `Cita ${status === 'confirmado' ? 'confirmada' : 'cancelada'}.` });
  };

  const clientAppointments = appointments.filter((appointment) => appointment.userId === currentUser?.id);

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    setNotice({ type: 'success', text: 'Sesión cerrada.' });
  };

  return (
    <div className="app-shell">
      <AppHeader currentUser={currentUser} onNavigate={setCurrentView} onLogout={logout} />

      {currentView === 'home' && (
        <HomePage
          services={services}
          onBook={(service) => {
            setBookingForm((current) => ({ ...current, serviceId: service.id }));
            setCurrentView('booking');
          }}
          onReserve={() => setCurrentView('booking')}
        />
      )}

      {currentView === 'booking' && (
        <BookingPage
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          services={services}
          dateOffset={dateOffset}
          availableTimes={availableTimes}
          specialistOptions={specialistOptions}
          selectedService={selectedService}
          onSubmit={handleBooking}
        />
      )}

      {currentView === 'appointments' && currentUser?.role === 'client' && (
        <ClientAppointmentsPage
          appointments={clientAppointments}
          onBook={() => setCurrentView('booking')}
          onCancel={(appointment) => handleAppointmentStatus(appointment, 'cancelado')}
        />
      )}

      {currentView === 'login' && (
        <AuthPage
          authMode={authMode}
          setAuthMode={setAuthMode}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {currentView === 'payment' && (
        <PaymentPage
          paymentForm={paymentForm}
          setPaymentForm={setPaymentForm}
          pendingReservation={pendingReservation}
          selectedService={selectedService}
          bookingForm={bookingForm}
          onSubmit={handlePayment}
        />
      )}

      {currentView === 'admin' && (
        <AdminPage
          currentUser={currentUser}
          dashboardStats={dashboardStats}
          chartData={chartData}
          appointments={appointments}
          users={users}
          services={services}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          editingServiceId={editingServiceId}
          onLogout={logout}
          onAppointmentStatus={handleAppointmentStatus}
          onServiceSubmit={handleServiceSubmit}
          onCancelEdit={() => {
            setEditingServiceId(null);
            setServiceForm({ name: '', price: '', duration: '', description: '' });
          }}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SalonProvider>
      <AppContent />
    </SalonProvider>
  );
}

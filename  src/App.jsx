import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Scissors, CheckCircle, AlertCircle, User } from 'lucide-react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentView, setCurrentView] = useState('booking');
  const [selectedService, setSelectedService] = useState('corte');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [queuePosition, setQueuePosition] = useState(null);
  
  const services = [
    { id: 'corte', name: 'Corte de Cabelo', duration: 45, price: 'R$45' },
    { id: 'barba', name: 'Barba Completa', duration: 30, price: 'R$35' },
    { id: 'combo', name: 'Corte + Barba', duration: 60, price: 'R$70' },
    { id: 'sobrancelha', name: 'Sobrancelha', duration: 15, price: 'R$20' }
  ];

  const [queue, setQueue] = useState([
    { id: 1, name: 'João Silva', service: 'corte', timestamp: new Date(Date.now() - 30 * 60000), status: 'in-progress' },
    { id: 2, name: 'Carlos Mendes', service: 'barba', timestamp: new Date(Date.now() - 10 * 60000), status: 'waiting' },
    { id: 3, name: 'Miguel Santos', service: 'combo', timestamp: new Date(), status: 'waiting' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const queueTimer = setInterval(() => {
      setQueue(prev => {
        const updatedQueue = [...prev];
        if (updatedQueue.length > 0 && updatedQueue[0].status === 'in-progress') {
          const serviceTime = services.find(s => s.id === updatedQueue[0].service)?.duration || 45;
          const elapsed = (Date.now() - updatedQueue[0].timestamp.getTime()) / 60000;
          if (elapsed >= serviceTime) {
            updatedQueue.shift();
            if (updatedQueue.length > 0) {
              updatedQueue[0] = { ...updatedQueue[0], status: 'in-progress' };
            }
          }
        }
        return updatedQueue;
      });
    }, 10000);
    
    return () => clearInterval(queueTimer);
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now(),
      name: customerName,
      phone: customerPhone,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      duration: services.find(s => s.id === selectedService)?.duration || 45
    };
    setBookingConfirmation(newBooking);
    setCurrentView('confirmation');
  };

  const handleJoinQueue = () => {
    const newQueueEntry = {
      id: queue.length > 0 ? Math.max(...queue.map(q => q.id)) + 1 : 1,
      name: customerName || 'Cliente',
      service: selectedService,
      timestamp: new Date(),
      status: queue.length === 0 ? 'in-progress' : 'waiting'
    };
    
    if (queue.length === 0) {
      setQueue([newQueueEntry]);
    } else {
      setQueue(prev => [...prev, newQueueEntry]);
    }
    
    setQueuePosition(queue.length + 1);
    setCurrentView('queue');
  };

  const getServiceName = (serviceId) => {
    return services.find(s => s.id === serviceId)?.name || serviceId;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateWaitTime = (position) => {
    if (position <= 1) return 'Agora';
    const totalWait = (position - 1) * 45;
    const hours = Math.floor(totalWait / 60);
    const minutes = totalWait % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Barbearia Elite</h1>
                <p className="text-amber-400 text-sm">Estilo e Precisão</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('booking')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'booking'
                    ? 'bg-amber-500 text-gray-900'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Agendamento
              </button>
              <button
                onClick={() => setCurrentView('queue')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'queue'
                    ? 'bg-amber-500 text-gray-900'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Fila de Espera
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'booking' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
            <div className="text-center mb-8">
              <Calendar className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Agendamento Online</h2>
              <p className="text-gray-400">Escolha seu serviço e horário preferido</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Selecione o Serviço</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedService === service.id
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm mt-1">{service.duration} min • {service.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Horário</label>
                  <select
                    required
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Selecione um horário</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Confirmar Agendamento</span>
              </button>
            </form>
          </div>
        )}

        {currentView === 'queue' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Fila de Espera em Tempo Real</h2>
              <p className="text-gray-400">Acompanhe sua posição na fila</p>
            </div>

            {queuePosition && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8 text-center">
                <div className="text-amber-400 mb-2">Sua Senha</div>
                <div className="text-4xl font-bold text-white mb-2">#{queuePosition}</div>
                <div className="text-gray-300">
                  Tempo estimado de espera: <span className="font-semibold text-amber-400">
                    {calculateWaitTime(queuePosition)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-400 pb-2 border-b border-gray-700">
                <span>Cliente</span>
                <span>Serviço</span>
                <span>Status</span>
                <span>Horário</span>
              </div>
              
              {queue.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg">Nenhum cliente na fila no momento!</p>
                  <p className="text-sm">Você pode ser o próximo!</p>
                </div>
              ) : (
                queue.map((customer, index) => (
                  <div
                    key={customer.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      customer.status === 'in-progress'
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        customer.status === 'in-progress' ? 'bg-green-500' : 'bg-amber-500'
                      }`}>
                        <span className="text-xs font-bold text-gray-900">
                          {index === 0 ? '✓' : index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="text-xs text-gray-400">Senha #{index + 1}</div>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm">
                      {getServiceName(customer.service)}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      customer.status === 'in-progress'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {customer.status === 'in-progress' ? 'Atendendo' : 'Aguardando'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {formatTime(customer.timestamp)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {!queuePosition && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Quer entrar na fila?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedService === service.id
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Seu nome (opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4"
                />
                <button
                  onClick={handleJoinQueue}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Entrar na Fila de Espera</span>
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'confirmation' && bookingConfirmation && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Agendamento Confirmado!</h2>
            <div className="bg-gray-700/50 rounded-xl p-6 mb-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-gray-400 text-sm">Cliente</div>
                  <div className="text-white font-semibold">{bookingConfirmation.name}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Telefone</div>
                  <div className="text-white font-semibold">{bookingConfirmation.phone}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Serviço</div>
                  <div className="text-white font-semibold">
                    {getServiceName(bookingConfirmation.service)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Duração</div>
                  <div className="text-white font-semibold">{bookingConfirmation.duration} minutos</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Data</div>
                  <div className="text-white font-semibold">{bookingConfirmation.date}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Horário</div>
                  <div className="text-white font-semibold">{bookingConfirmation.time}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentView('booking');
                setBookingConfirmation(null);
                setCustomerName('');
                setCustomerPhone('');
                setSelectedDate('');
                setSelectedTime('');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors duration-200"
            >
              Novo Agendamento
            </button>
          </div>
        )}
      </main>

      <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p>© 2025 Barbearia Elite. Todos os direitos reservados.</p>
            <p className="text-sm mt-2">Horário de funcionamento: Segunda a Sábado, 09:00 - 19:00</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
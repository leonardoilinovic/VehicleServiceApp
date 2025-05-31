import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: '➕ Novi servis',
      description: 'Dodaj novi servis za vozilo i unesi detalje',
      path: '/service-dashboard',
      color: 'bg-blue-100',
    },
    {
      title: '📅 Kalendar servisa',
      description: 'Pogledaj i uredi sve planirane servise',
      path: '/service-calendar',
      color: 'bg-green-100',
    },
    {
      title: '🚗 Vozila',
      description: 'Pregledaj ili uredi postojeća vozila',
      path: '/vehicle-list',
      color: 'bg-yellow-100',
    },
    {
      title: '👤 Klijenti',
      description: 'Pregledaj, dodaj ili uredi klijente',
      path: '/client-list',
      color: 'bg-orange-100',
    },
    {
      title: '🔧 Servisni zadaci',
      description: 'Dodaj ili pregledaj sve dostupne servisne zadatke',
      path: '/add-service-task',
      color: 'bg-purple-100',
    },
    {
      title: '📝 Svi servisi',
      description: 'Pogledaj popis svih servisnih zapisa',
      path: '/service-list',
      color: 'bg-pink-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">👨‍🔧 Dobrodošao natrag, Serviseru!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className={`cursor-pointer rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.02] p-6 ${card.color}`}
          >
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-700">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

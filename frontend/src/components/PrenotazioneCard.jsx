import React from "react";

function PrenotazioneCard({ prenotazione }) {
  const start = prenotazione?.startTime ? new Date(prenotazione.startTime) : null;
  const end = prenotazione?.endTime ? new Date(prenotazione.endTime) : null;

  const formatDate = (d) => d.toLocaleDateString();
  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Caso entrambi disponibili
  if (start && end) {
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    const startTime = formatTime(start);
    const endTime = formatTime(end);

    // Se le due date coincidono, mostra una sola riga data + intervallo orario
    if (startDate === endDate) {
      return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{prenotazione?.nome ?? 'Prenotazione'}</h3>
          <p className="text-gray-600">Data: {startDate}</p>
          <p className="text-gray-600">Orario: {startTime} - {endTime}</p>
        </div>
      );
    }

    // Se le date sono diverse, mostra data+orario di inizio e di fine separatamente
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">{prenotazione?.nome ?? 'Prenotazione'}</h3>
        <p className="text-gray-600">Inizio: {startDate} {startTime}</p>
        <p className="text-gray-600">Fine: {endDate} {endTime}</p>
      </div>
    );
  }

  // Fallback quando manca start o end
  const date = start
    ? formatDate(start)
    : (prenotazione?.data ? new Date(prenotazione.data).toLocaleDateString() : '—');

  const time = start
    ? formatTime(start)
    : (prenotazione?.orario ?? '—');

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{prenotazione?.nome ?? 'Prenotazione'}</h3>
      <p className="text-gray-600">Data: {date}</p>
      <p className="text-gray-600">Orario: {time}</p>
    </div>
  );
}

export default PrenotazioneCard;
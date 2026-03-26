function PrenotazioneCard({ prenotazione, onElimina, onModifica }) {
  const start = prenotazione?.startTime ? new Date(prenotazione.startTime) : null;
  const end = prenotazione?.endTime ? new Date(prenotazione.endTime) : null;

  const formatDate = (d) => d.toLocaleDateString("it-IT");
  const formatTime = (d) =>
    d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  let contenuto;
  if (start && end) {
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    const startTime = formatTime(start);
    const endTime = formatTime(end);

    contenuto =
      startDate === endDate ? (
        <>
          <p className="text-gray-600">Data: {startDate}</p>
          <p className="text-gray-600">
            Orario: {startTime} - {endTime}
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-600">
            Inizio: {startDate} {startTime}
          </p>
          <p className="text-gray-600">
            Fine: {endDate} {endTime}
          </p>
        </>
      );
  } else {
    const date = start ? formatDate(start) : "—";
    const time = start ? formatTime(start) : "—";
    contenuto = (
      <>
        <p className="text-gray-600">Data: {date}</p>
        <p className="text-gray-600">Orario: {time}</p>
      </>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">{prenotazione?.nome ?? "Prenotazione"}</h3>
        {contenuto}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onModifica}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Modifica
        </button>
        <button
          onClick={onElimina}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Elimina
        </button>
      </div>
    </div>
  );
}

export default PrenotazioneCard;
import { useState, useEffect } from "react";
import PrenotazioneCard from "../components/PrenotazioneCard.jsx";
import { api } from "../api.js";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import it from "date-fns/locale/it";
import "react-datepicker/dist/react-datepicker.css";
import { useStore } from "../store.jsx";

registerLocale("it", it);

function PaginaPrenotazioni() {
  const { prenotazioni, eliminaPrenotazione, applicaModificaPrenotazione, fetchPrenotazioni } = useStore();
  const [prenotazioneDaModificare, setPrenotazioneDaModificare] = useState(null);



  const apriModifica = (prenotazione) => setPrenotazioneDaModificare(prenotazione);
  const chiudiModifica = () => setPrenotazioneDaModificare(null);

  useEffect(() => {
    fetchPrenotazioni();
    console.log("Prenotazioni caricate:", prenotazioni);
  }, []);

  const salvaModifiche = (prenotazioneModificata) => {
    applicaModificaPrenotazione({ prenotazioneModificata });
    chiudiModifica();
  };

  const ModaleModifica = () => {
    const pren = prenotazioneDaModificare;
    const now = new Date();
    const initialStart = pren.startTime ? new Date(pren.startTime) : now;
    const initialEnd = pren.endTime
      ? new Date(pren.endTime)
      : new Date(initialStart.getTime() + 60 * 60 * 1000);

    const [nome, setNome] = useState(pren.nome || "");
    const [startDateTime, setStartDateTime] = useState(initialStart);
    const [endDateTime, setEndDateTime] = useState(initialEnd);

    // 👇 controlliamo apertura calendario
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    const timeSlots = Array.from({ length: 24 }, (_, i) =>
      `${i.toString().padStart(2, "0")}:00`
    );

    const formatHour = (date) =>
      `${date.getHours().toString().padStart(2, "0")}:00`;

    const handleSubmit = (e) => {
      e.preventDefault();

      if (startDateTime < new Date()) {
        alert("La data di inizio non può essere nel passato.");
        return;
      }

      if (endDateTime < new Date()) {
        alert("La data di fine non può essere nel passato.");
        return;
      }

      if (endDateTime < startDateTime) {
        alert("La data di fine non può essere precedente alla data di inizio.");
        return;
      }

      salvaModifiche({
        ...pren,
        nome,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
    };

    const CustomInput = ({ value, onClick }) => (
      <input
        className="border p-2 rounded w-full cursor-pointer"
        value={value}
        onClick={onClick}
        readOnly
      />
    );

    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/10 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4 border-2 border-gray-300"
        >
          <h2 className="text-xl font-semibold">Modifica Prenotazione</h2>

          <label className="flex flex-col">
            Nome
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border p-2 rounded"
              onClick={() => {
                setOpenStart(false);
                setOpenEnd(false);
              }}
            />
          </label>

          <label className="flex flex-col">
            Inizio
            <div className="flex gap-2 items-center">
              <DatePicker
                selected={startDateTime}
                onChange={(date) => {
                  setStartDateTime(date);
                  setOpenStart(false);

                  if (date >= endDateTime) {
                    const newEnd = new Date(date);
                    newEnd.setHours(date.getHours() + 1, date.getMinutes(), 0, 0);
                    setEndDateTime(newEnd);
                  }
                }}
                open={openStart}
                onInputClick={() => {
                  setOpenStart(true);
                  setOpenEnd(false);
                }}
                onClickOutside={() => setOpenStart(false)}
                dateFormat="dd/MM/yyyy"
                locale="it"
                minDate={new Date()}
                customInput={<CustomInput />}
              />

              <select
                className="border p-2 rounded"
                value={formatHour(startDateTime)}
                onClick={() => {
                  setOpenStart(false);
                  setOpenEnd(false);
                }}
                onChange={(e) => {
                  const [hours] = e.target.value.split(":").map(Number);
                  const d = new Date(startDateTime);
                  d.setHours(hours, 0, 0, 0);
                  setStartDateTime(d);

                  if (d >= endDateTime) {
                    const newEnd = new Date(d);
                    newEnd.setHours(d.getHours() + 1, 0, 0, 0);
                    setEndDateTime(newEnd);
                  }
                }}
              >
                {timeSlots.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </label>

          <label className="flex flex-col">
            Fine
            <div className="flex gap-2 items-center">
              <DatePicker
                selected={endDateTime}
                onChange={(date) => {
                  setEndDateTime(date);
                  setOpenEnd(false);
                }}
                open={openEnd}
                onInputClick={() => {
                  setOpenEnd(true);
                  setOpenStart(false);
                }}
                onClickOutside={() => setOpenEnd(false)}
                dateFormat="dd/MM/yyyy"
                locale="it"
                minDate={startDateTime}
                customInput={<CustomInput />}
              />

              <select
                className="border p-2 rounded"
                value={formatHour(endDateTime)}
                onClick={() => {
                  setOpenStart(false);
                  setOpenEnd(false);
                }}
                onChange={(e) => {
                  const [hours] = e.target.value.split(":").map(Number);
                  const d = new Date(endDateTime);
                  d.setHours(hours, 0, 0, 0);

                  if (d < startDateTime) {
                    d.setHours(startDateTime.getHours() + 1, 0, 0, 0);
                  }

                  setEndDateTime(d);
                }}
              >
                {timeSlots.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={chiudiModifica}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annulla
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Prenotazioni</h2>

      {prenotazioni.length === 0 || !prenotazioni ? (
        <p>Qui verranno mostrate le prenotazioni future.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {prenotazioni.map((prenotazione) => (
            <PrenotazioneCard
              key={prenotazione.uuid}
              prenotazione={prenotazione}
              onElimina={() => eliminaPrenotazione(prenotazione.id)}
              onModifica={() => apriModifica(prenotazione)}
            />
          ))}
        </div>
      )}

      {prenotazioneDaModificare && <ModaleModifica />}
    </div>
  );
}

export default PaginaPrenotazioni;
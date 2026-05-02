import * as motion from "motion/react-client";
import { useState } from "react";
import QRCode from "qrcode";
import { useStore } from "../store.jsx";

function PrenotazioneCard({ prenotazione, pulsanti = true, onElimina, onModifica }) {
  const formatDateOnly = useStore((s) => s.formatDateOnly);
  const formatTime = useStore((s) => s.formatTime);
  const parcheggi = useStore((s) => s.parcheggi);
  const [qrLoading, setQrLoading] = useState(false);

  const start = prenotazione.start_time;
  const end = prenotazione.end_time;

  const parkingLabel = prenotazione.parking_name;

  let contenuto;

  if (start && end) {
    const startDate = formatDateOnly(start);
    const endDate = formatDateOnly(end);
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
    const date = start ? formatDateOnly(start) : "—";
    const time = start ? formatTime(start) : "—";
    contenuto = (
      <>
        <p className="text-gray-600">Data: {date}</p>
        <p className="text-gray-600">Orario: {time}</p>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">{parkingLabel}</h3>
        {contenuto}
      </div>

      {pulsanti && (
        <div className="mt-4 flex justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={async () => {
              if (qrLoading) return;
              try {
                setQrLoading(true);
                const id = prenotazione.uuid;
                const dataUrl = await QRCode.toDataURL(String(id));
                const w = window.open();
                if (w) {
                  w.document.write(`<img src="${dataUrl}" alt="QR code"/>`);
                  w.document.title = 'QR Prenotazione';
                } else {
                  const a = document.createElement('a');
                  a.href = dataUrl;
                  a.download = `prenotazione-${id}.png`;
                  a.click();
                }
              } catch (e) {
                console.error('Errore generazione QR', e);
                alert('Errore generazione QR');
              } finally {
                setQrLoading(false);
              }
            }}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {qrLoading ? 'Generazione...' : 'QR'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onModifica}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Modifica
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onElimina}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Elimina
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default PrenotazioneCard;

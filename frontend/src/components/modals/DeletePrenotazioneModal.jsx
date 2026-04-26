import React from 'react';
import { useStore } from "../../store.jsx";

export default function DeletePrenotazioneModal({ open, onClose, prenotazione }) {
  if (!prenotazione) return null;

  const { formatDate, nascondiModaleEliminaRes,  } = useStore();

  const onConfirm = (prenotazione) => {
    try {
      await deletePrenotazione(prenotazione.uuid);
    } finally {
      setBusy(false);
      nascondiModaleEliminaRes();
    }
  }


return (
  <div className={"modal " + (open ? 'modal-open' : '')}>
    <div className="modal-box">
      <h3 className="font-bold text-lg">Conferma eliminazione prenotazione</h3>
      <p className="py-2">Sei sicuro di voler eliminare la seguente prenotazione?</p>

      <div className="space-y-2 text-sm">
        <div><strong>Utente:</strong> {prenotazione.id_user}</div>
        <div><strong>Parcheggio:</strong> {prenotazione.parking_name}</div>
        <div><strong>Inizio:</strong> {prenotazione.start_time}</div>
        <div><strong>Fine:</strong> {prenotazione.end_time}</div>
      </div>

      <div className="modal-action mt-4">
        <button className="btn" onClick={onClose}>Annulla</button>
        <button className="btn btn-error" onClick={() => onConfirm(prenotazione)}>Elimina</button>
      </div>
    </div>
  </div>
);
}

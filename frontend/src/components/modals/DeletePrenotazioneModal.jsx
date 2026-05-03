import React from 'react';
import { useStore } from "../../store.jsx";

export default function DeletePrenotazioneModal({ open, onClose, prenotazione, showUser = false }) {
  if (!prenotazione) return null;

  const { formatDate, nascondiModaleEliminaRes, deletePrenotazione } = useStore();

  const onConfirm = (prenotazione) => {
    try {
      deletePrenotazione(prenotazione.uuid);
    } finally {
      nascondiModaleEliminaRes();
    }
  }


  return (
    <div className={"modal " + (open ? 'modal-open' : '')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Conferma eliminazione prenotazione</h3>
        <p className="py-2">Sei sicuro di voler eliminare la seguente prenotazione?</p>

        <div className="space-y-2 text-sm">
          {showUser &&
            <>
              <div><strong>ID utente:</strong> {prenotazione.id_user}</div>
              <div><strong>Nome utente:</strong> {prenotazione.user_first_name} {prenotazione.user_last_name}</div>
            </>
          }
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

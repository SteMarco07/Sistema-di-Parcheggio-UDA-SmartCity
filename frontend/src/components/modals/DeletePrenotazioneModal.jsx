import React from 'react';
import { useStore } from "../../store";

export default function DeletePrenotazioneModal({ open, onClose, onConfirm, prenotazione, parkingName }) {
  if (!prenotazione) return null;

  const { formatDate } = useStore();

  return (
    <div className={"modal " + (open ? 'modal-open' : '')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Conferma eliminazione prenotazione</h3>
        <p className="py-2">Sei sicuro di voler eliminare la seguente prenotazione?</p>

        <div className="space-y-2 text-sm">
          <div><strong>Utente:</strong> {prenotazione.userId}</div>
          <div><strong>Parcheggio:</strong> {parkingName ?? prenotazione.parkingId}</div>
          <div><strong>Inizio:</strong> {formatDate(prenotazione.startTime)}</div>
          <div><strong>Fine:</strong> {formatDate(prenotazione.endTime)}</div>
        </div>

        <div className="modal-action mt-4">
          <button className="btn" onClick={onClose}>Annulla</button>
          <button className="btn btn-error" onClick={() => onConfirm(prenotazione.id)}>Elimina</button>
        </div>
      </div>
    </div>
  );
}

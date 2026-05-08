import React from 'react';

export default function UserProfileModal({ open, onClose, user, loading }) {
  if (!open) return null;

  return (
    <div className={"modal " + (open ? 'modal-open' : '')}>
      <div className="modal-box max-w-md">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg">Dettagli utente</h3>
        </div>

        <div className="py-4">
          {loading ? (
            <div className="text-sm text-muted">Caricamento...</div>
          ) : !user ? (
            <div className="text-sm">Nessun dato disponibile</div>
          ) : (
            <div className="space-y-3 text-sm">
              <div><strong>Nome:</strong> {user.first_name ?? '-'}</div>
              <div><strong>Cognome:</strong> {user.last_name ?? '-'}</div>
              <div><strong>Email:</strong> {user.email ?? '-'}</div>
              <div><strong>Targa:</strong> {user.license_plate ?? '-'}</div>
              {user.role && <div><strong>Ruolo:</strong> {user.role}</div>}
              {user.note && <div><strong>Note:</strong> {user.note}</div>}
              <div><strong>ID:</strong> {user.uuid ?? '-'}</div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Chiudi</button>
        </div>
      </div>
    </div>
  );
}

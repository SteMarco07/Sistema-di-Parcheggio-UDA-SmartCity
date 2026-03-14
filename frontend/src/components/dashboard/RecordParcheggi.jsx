import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {useStore} from "../../store";

function RecordParcheggi({ numero, parcheggio }) {

    const {deleteParcheggio} = useStore();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [busy, setBusy] = useState(false);


    const handleConfirmDelete = async () => {
        setBusy(true);
        try {
            await deleteParcheggio(parcheggio.id);
        } finally {
            setBusy(false);
            setShowDeleteModal(false);
        }
    }

    const onEdit = () => {
        //alert("Funzione non implementata");
    }

    return (
        <>
        <tr>
            <td>{numero}</td>
            <td>{parcheggio.nome}</td>
            <td>{parcheggio.descrizione}</td>
            <td>{parcheggio.prezzo_orario} €/h</td>
            <td>{parcheggio.lat}</td>
            <td>{parcheggio.lng}</td>
            <td><button className="btn btn-ghost" onClick={() => onEdit()}><img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
            <td><button className="btn btn-ghost" onClick={() => setShowDeleteModal(true)}><img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
        </tr>

        {showDeleteModal && typeof document !== 'undefined' ? createPortal(
            <div className="modal modal-open">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Conferma eliminazione</h3>
                    <p className="py-4">Sei sicuro di voler eliminare <strong>{parcheggio.nome}</strong>?</p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => setShowDeleteModal(false)} disabled={busy}>Annulla</button>
                        <button className="btn btn-error" onClick={handleConfirmDelete} disabled={busy}>{busy ? 'Eliminazione...' : 'Elimina'}</button>
                    </div>
                </div>
            </div>,
            document.body
        ) : null}
        </>
    );

}

export default RecordParcheggi;
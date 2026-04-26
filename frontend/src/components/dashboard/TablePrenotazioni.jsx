import { useState, useMemo } from 'react';
import { useStore } from '../../store.jsx';

import RecordPrenotazioni from './RecordPrenotazioni.jsx';
import DeletePrenotazioneModal from '../modals/DeletePrenotazioneModal.jsx';
import ModifyPrenotazioneModal from '../modals/ModifyPrenotazioneModal.jsx';

function TablePrenotazioni() {

    const { prenotazioni, parcheggi, modificaParcheggio, deleteParcheggio, deletePrenotazione,
        oggettoInModificaRes,
        showEditModalRes, nascondiModaleModificaRes,
        showDeleteModalRes, nascondiModaleEliminaRes } = useStore();

    const [busy, setBusy] = useState(false);

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Elenco delle Prenotazioni</h1>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Utente</th>
                            <th>Parcheggio</th>
                            <th>Stato</th>
                            <th>Data inizio</th>
                            <th>Data fine</th>
                            <th>Modifica</th>
                            <th>Elimina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(prenotazioni) && prenotazioni.length > 0 ? (
                            prenotazioni.map((p, i) => {
                                // console.log("Prenotazione:", p);
                                return <RecordPrenotazioni key={p.uuid} numero={i + 1} prenotazione={p} />
                            }
                            )
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-4 text-gray-500">Nessuna prenotazione trovata.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <DeletePrenotazioneModal
                open={showDeleteModalRes}
                onClose={() => nascondiModaleEliminaRes()}
                prenotazione={oggettoInModificaRes}
            />
            <ModifyPrenotazioneModal
                open={showEditModalRes}
                onClose={() => nascondiModaleModificaRes()}
                prenotazione={oggettoInModificaRes}
            />

        </>
    );
}

export default TablePrenotazioni;
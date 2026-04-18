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


    const parcheggiMap = useMemo(() => {
        const m = new Map();
        (parcheggi || []).forEach((p) => m.set(p.id, p.nome || `#${p.id}`));
        return m;
    }, [parcheggi]);


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
                            <th>Data inizio</th>
                            <th>Data fine</th>
                            <th>Modifica</th>
                            <th>Elimina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prenotazioni.map((p, i) => (
                            <RecordPrenotazioni key={p.id} numero={i + 1} prenotazione={p} parcheggiMap={parcheggiMap} />
                        ))}
                    </tbody>
                </table>
            </div>
            <DeletePrenotazioneModal
                open={showDeleteModalRes}
                onClose={() => nascondiModaleEliminaRes()}
                onConfirm={async (id) => {
                    setBusy(true);
                    try {
                        await deletePrenotazione(id);
                    } finally {
                        setBusy(false);
                        nascondiModaleEliminaRes();
                    }
                }}
                prenotazione={oggettoInModificaRes}
                parkingName={parcheggiMap.get(oggettoInModificaRes?.parkingId)}
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
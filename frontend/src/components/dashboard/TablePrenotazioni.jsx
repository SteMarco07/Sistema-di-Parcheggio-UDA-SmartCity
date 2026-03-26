import { useState, useMemo } from 'react';
import { useStore } from '../../store.jsx';

import RecordPrenotazioni from './RecordPrenotazioni.jsx';

function TablePrenotazioni() {

    const { prenotazioni, parcheggi } = useStore();

    // Memoized map built once per Table render; O(1) lookup for each row
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
        </>
    );
}

export default TablePrenotazioni;
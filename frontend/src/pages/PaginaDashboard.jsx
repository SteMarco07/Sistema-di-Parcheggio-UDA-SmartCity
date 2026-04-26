import { useEffect } from 'react';
import { useStore } from '../store.jsx';

import TableParcheggi from '../components/dashboard/TableParcheggi.jsx';
import TablePrenotazioni from '../components/dashboard/TablePrenotazioni.jsx';
import ChartParcheggi from '../components/dashboard/ChartParcheggi.jsx';
import ChartPrenotazioniAttive from '../components/dashboard/ChartPrenotazioniAttive.jsx';
import ChartStoricoPrenotazioni from '../components/dashboard/ChartStoricoPrenotazioni.jsx';

function PaginaDashboard() {
    const { nascondiModaleEliminaPark, nascondiModaleModificaPark, nascondiModaleEliminaRes, nascondiModaleModificaRes, nascondiModaleAggiungiParcheggio } = useStore();
    const fetchParcheggi = useStore((s) => s.fetchParcheggi);
    const utente = useStore((s) => s.utente);

    // fetch full parcheggi list only for admin dashboard
    useEffect(() => {
        if (utente && utente.admin) {
            fetchParcheggi();
        }
    }, [utente, fetchParcheggi]);


    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                nascondiModaleEliminaPark();
                nascondiModaleModificaPark();
                nascondiModaleEliminaRes();
                nascondiModaleModificaRes();
                nascondiModaleAggiungiParcheggio();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [nascondiModaleEliminaPark, nascondiModaleModificaPark, nascondiModaleEliminaRes, nascondiModaleModificaRes, nascondiModaleAggiungiParcheggio]);

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Dashboard</h1>

            <div className="flex flex-col md:flex-row md:items-stretch gap-6 min-h-[80vh]">
                <div className="w-full md:w-3/4 space-y-6 flex flex-col">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-auto flex-1">
                        <TableParcheggi />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-auto flex-1">
                        <TablePrenotazioni />
                    </div>
                </div>

                <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col">
                    <div className="flex-1">
                        <ChartParcheggi />
                        <ChartPrenotazioniAttive />
                        <ChartStoricoPrenotazioni />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaDashboard;
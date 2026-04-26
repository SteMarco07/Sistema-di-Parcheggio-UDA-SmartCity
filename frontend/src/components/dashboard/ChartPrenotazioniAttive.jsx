import React from 'react';
import { useStore } from '../../store.jsx';
import {
    ResponsiveContainer,
    PieChart,
    Tooltip,
    Legend,
    Pie,
} from 'recharts';

function ChartPrenotazioniAttive() {
    const { prenotazioni } = useStore();

    const items = Array.isArray(prenotazioni) ? prenotazioni : [];

    if (items.length === 0) {
        return <div className="text-sm text-gray-500">Nessun dato disponibile per il grafico</div>;
    }
    const now = Date.now();

    const counts = items.reduce((acc, p) => {

        // Calcola usando la data di fine per evitare di fare fetch e update al DB ogni ora per aggiornare lo stato
        const end = p.end_time ? new Date(p.end_time).getTime() : NaN;


        if (!Number.isNaN(end) && end >= now) {
            acc.attive += 1;
        } else {
            acc.terminate += 1;
        }

        return acc;
    }, { attive: 0, terminate: 0, cancellate: 0 });

    const coloriStatus = {
        Attive: '#16a34a',
        Terminate: '#dc2626',
        Cancellate: '#6b7280',
    };

    const data = [
        { nome: 'Attive', count: counts.attive, fill: coloriStatus.Attive },
        { nome: 'Terminate', count: counts.terminate, fill: coloriStatus.Terminate },
        { nome: 'Cancellate', count: counts.cancellate, fill: coloriStatus.Cancellate },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-3">Prenotazioni per stato</h2>
            <div className="w-full h-48 md:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                        <Pie data={data} dataKey="count" nameKey="nome" cx="50%" cy="50%" outerRadius={80} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartPrenotazioniAttive;

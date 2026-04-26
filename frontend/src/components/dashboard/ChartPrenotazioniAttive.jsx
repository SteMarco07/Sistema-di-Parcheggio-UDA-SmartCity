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

        // console.log("Prenotazione:", p);
        acc[p.status] = (acc[p.status] || 0) + 1;

        return acc;
    }, { active: 0, expired: 0, cancelled: 0 });

    const coloriStatus = {
        Attive: '#16a34a',
        Terminate: '#dc2626',
        Cancellate: '#6b7280',
    };

    const data = [
        { nome: 'Attive', count: counts.ACTIVE, fill: coloriStatus.Attive },
        { nome: 'Terminate', count: counts.EXPIRED, fill: coloriStatus.Terminate },
        { nome: 'Cancellate', count: counts.CANCELLED, fill: coloriStatus.Cancellate },
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

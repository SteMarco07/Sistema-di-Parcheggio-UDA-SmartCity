import React from 'react';
import { useStore } from '../../store.jsx';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from 'recharts';

function ChartParcheggi() {
    const { parcheggi, prenotazioni } = useStore();

    if ((!parcheggi || parcheggi.length === 0) || (!prenotazioni || prenotazioni.length === 0)) {
        return <div className="text-sm text-gray-500">Nessun dato disponibile per il grafico</div>;
    }

    // Conta prenotazioni per parcheggio usando parkingId
    const counts = {};
    prenotazioni.forEach((pr) => {
        const pid = pr.parkingId;
        if (pid != null) counts[pid] = (counts[pid] || 0) + 1;
    });

    // Trasforma in array con nome parcheggio (se disponibile)
    let data = (parcheggi || []).map((p) => ({
        nome: p.nome || `#${p.id}`,
        count: counts[p.id] || 0,
    }));

    // Mostra solo parcheggi con almeno una prenotazione e ordina per count desc
    data = data.filter(d => d.count > 0).sort((a, b) => b.count - a.count);

    if (data.length === 0) {
        return <div className="text-sm text-gray-500">Nessuna prenotazione disponibile per il grafico</div>;
    } else {
        console.log('Dati per grafico:', data);
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-3">Prenotazioni per parcheggio</h2>
            <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" interval={0} height={60} tick={{ angle: -45, textAnchor: 'end' }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" name="Prenotazioni" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartParcheggi;

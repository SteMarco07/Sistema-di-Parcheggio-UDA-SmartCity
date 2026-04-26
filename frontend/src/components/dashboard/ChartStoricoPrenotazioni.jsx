import React, { useMemo, useState } from 'react';
import { useStore } from '../../store.jsx';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

// Normalizza una data all'inizio del giorno (00:00)
function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Genera tutte le date tra due estremi (inclusi)
function generateDateRange(start, end) {
    const result = [];
    const current = new Date(start);
    while (current <= end) {
        result.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return result;
}

// Genera tutte le ore tra due estremi (inclusi, arrotondando all'ora)
function generateHourRange(start, end) {
    const result = [];
    const current = new Date(start);
    current.setMinutes(0, 0, 0);
    while (current <= end) {
        result.push(new Date(current));
        current.setHours(current.getHours() + 1);
    }
    return result;
}

function ChartStoricoPrenotazioni() {
    const { prenotazioni, parcheggi } = useStore();
    const items = Array.isArray(prenotazioni) ? prenotazioni : [];
    const [range, setRange] = useState('week'); // giorno ~ settimana ~ mese ~ anno ~ tutto lo storico perché QUALCUNO ha messo prenotazioni del 2024 nell'API


    const { data, label } = useMemo(() => {
        if (!(items.length > 0) || !( parcheggi && Array.isArray(parcheggi) && parcheggi.length > 0)) {
            return { data: [], label: '' };
        }

        const nowLocal = new Date();
        let rangeStart = range === 'all' ? new Date(nowLocal) : null;

        switch (range) {
            case 'day':
                rangeStart = new Date(nowLocal);
                rangeStart.setDate(rangeStart.getDate() - 1);
                break;
            case 'week':
                rangeStart = new Date(nowLocal);
                rangeStart.setDate(rangeStart.getDate() - 7);
                break;
            case 'month':
                rangeStart = new Date(nowLocal);
                rangeStart.setMonth(rangeStart.getMonth() - 1);
                break;
            case 'year':
                rangeStart = new Date(nowLocal);
                rangeStart.setFullYear(rangeStart.getFullYear() - 1);
                break;
            case 'all':
            default: {
                let minDate = null;
                items.map((p) => {
                    const d = p.startTime ? new Date(p.startTime) : (p.endTime ? new Date(p.endTime) : null);
                    if (d && !Number.isNaN(d.getTime())) {
                        const sod = startOfDay(d);
                        if (!minDate || sod < minDate) {
                            minDate = sod;
                        }
                    }
                });
                rangeStart = minDate || startOfDay(nowLocal);
                break;
            }
        }

        let start;
        let end;

        if (range === 'day') {
            // Ultime 24 ore, aggregazione per ora
            end = new Date(nowLocal);
            end.setMinutes(0, 0, 0);
            start = new Date(end);
            start.setHours(end.getHours() - 23);
            start.setMinutes(0, 0, 0);
        } else {
            // Altri intervalli: aggregazione per giorno
            start = startOfDay(rangeStart);
            end = startOfDay(nowLocal);
        }

        // Conteggio prenotazioni per bucket (ora o giorno)
        const counts = {};
                items.map((p) => {
            const rawDate = p.startTime ? new Date(p.startTime) : (p.endTime ? new Date(p.endTime) : null);
            if (!rawDate || Number.isNaN(rawDate.getTime())) return;

            if (range === 'day') {
                const bucket = new Date(rawDate);
                bucket.setMinutes(0, 0, 0);
                if (bucket < start || bucket > end) return;

                const key = bucket.toISOString().slice(0, 13); // yyyy-mm-ddTHH
                counts[key] = (counts[key] || 0) + 1;
            } else {
                const d = startOfDay(rawDate);
                if (d < start || d > end) return;

                const key = d.toISOString().slice(0, 10); // yyyy-mm-dd
                counts[key] = (counts[key] || 0) + 1;
            }
        });

        let dataPoints;
        if (range === 'day') {
            // Serie continua per ora
            const hours = generateHourRange(start, end);
            dataPoints = hours.map((d) => {
                const key = d.toISOString().slice(0, 13);
                return {
                    date: d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
                    count: counts[key] || 0,
                };
            });
        } else {
            // Serie continua per giorno
            const days = generateDateRange(start, end);
            const formatterOptionsShort = { day: '2-digit', month: '2-digit' };
            const formatterOptionsLong = { day: '2-digit', month: '2-digit', year: '2-digit' };
            const useLong = range === 'year' || range === 'all';

            dataPoints = days.map((d) => {
                const key = d.toISOString().slice(0, 10);
                return {
                    date: d.toLocaleDateString('it-IT', useLong ? formatterOptionsLong : formatterOptionsShort),
                    count: counts[key] || 0,
                };
            });
        }

        let labelText;
        switch (range) {
            case 'day':
                labelText = 'Ultimo giorno';
                break;
            case 'week':
                labelText = 'Ultima settimana';
                break;
            case 'month':
                labelText = 'Ultimo mese';
                break;
            case 'year':
                labelText = 'Ultimo anno';
                break;
            case 'all':
            default:
                labelText = 'Tutto lo storico';
                break;
        }

        return { data: dataPoints, label: labelText };
    }, [prenotazioni, range]);

    if (!data || data.length === 0) {
        return <div className="text-sm text-gray-500">Nessuna prenotazione nel periodo selezionato</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <h2 className="text-xl font-bold">Storico prenotazioni</h2>
                <div className="flex gap-1 text-xs sm:text-sm">
                    <button
                        type="button"
                        className={`px-2 py-1 rounded border ${range === 'day' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => setRange('day')}
                    >
                        Giorno
                    </button>
                    <button
                        type="button"
                        className={`px-2 py-1 rounded border ${range === 'week' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => setRange('week')}
                    >
                        Settimana
                    </button>
                    <button
                        type="button"
                        className={`px-2 py-1 rounded border ${range === 'month' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => setRange('month')}
                    >
                        Mese
                    </button>
                    <button
                        type="button"
                        className={`px-2 py-1 rounded border ${range === 'year' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => setRange('year')}
                    >
                        Anno
                    </button>
                    <button
                        type="button"
                        className={`px-2 py-1 rounded border ${range === 'all' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                        onClick={() => setRange('all')}
                    >
                        Tutto
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-2">{label}</p>

            <div className="w-full h-48 md:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 24 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" name="Prenotazioni" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartStoricoPrenotazioni;
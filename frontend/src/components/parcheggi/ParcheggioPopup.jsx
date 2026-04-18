import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../store.jsx';

function ParcheggioPopup({ parcheggio }) {
    const { addPrenotazione, getTimeStampInizio, getTimeStampFine } = useStore();

    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [preview, setPreview] = useState({ start: null, end: null });

    const handlePrenota = () => {
        // prepara dati di anteprima e apre il modal di conferma
        // console.log(`ParcheggioPopup: getTimeStampInizio=${getTimeStampInizio()}, getTimeStampFine=${getTimeStampFine()}`);
        setPreview({ start: getTimeStampInizio(), end: getTimeStampFine() });
        setModalOpen(true);
    };

    const formatTs = (ts) => {
        try { return ts ? new Date(ts).toLocaleString() : '—'; } catch (e) { return String(ts); }
    };

    const calcDurationHours = () => {
        if (!preview.start || !preview.end) return 0;
        return Math.max(0, (preview.end - preview.start) / (1000 * 60 * 60));
    };

    const calcEstimatedPrice = () => {
        const hours = calcDurationHours();
        const price = parseFloat(parcheggio.hour_tax) || 0;
        return (hours * price).toFixed(2);
    };

    const confirmPrenotazione = () => {
        const prenotazione = {
            id: 0,
            parkingId: parcheggio.id,
            nome: parcheggio.nome,
            userId: 0,
            startTime: preview.start,
            endTime: preview.end,
        };
        addPrenotazione({ prenotazione });
        setModalOpen(false);
        navigate('/prenotazioni');
    };

    return (
        // Niente card/shadow: il popup di Mapbox fornisce già il contenitore
        <div className="flex flex-col gap-2 p-1 min-w-45">

            {/* Nome + badge */}
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary rounded-lg p-1.5 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="font-bold text-xl text-base-content">{parcheggio.name}</span>
                </div>
            </div>

            <div className="divider my-0" />

            {/* Prezzo */}
            <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-base-content/60">Prezzo orario</span>
                <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold text-primary">€{parcheggio.hour_tax}</span>
                    <span className="text-xs text-base-content/40">/ora</span>
                </div>
            </div>

            {/* CTA */}
            <button
                className="btn btn-primary btn-sm btn-block gap-1.5 mt-1"
                onClick={handlePrenota}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Prenota ora
            </button>

            {/* Modal di conferma prenotazione (portal su document.body) */}
            {modalOpen && createPortal(
                <div className="modal modal-open">
                    <div className="modal-box max-w-xl">
                        <header className="flex items-center gap-4">
                            <div>
                                <h3 className="font-extrabold text-2xl">Conferma prenotazione</h3>
                                <p className="text-sm text-gray-500">Verifica i dettagli e conferma la tua prenotazione.</p>
                            </div>
                        </header>

                        <div className="divider my-4" />

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                            <div>
                                <dt className="text-xs text-gray-400 uppercase tracking-wider">Parcheggio</dt>
                                <dd className="text-gray-800 font-medium">{parcheggio.name}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-400 uppercase tracking-wider">Prezzo orario</dt>
                                <dd className="text-gray-800">€{parcheggio.hour_tax} / ora</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-400 uppercase tracking-wider">Inizio</dt>
                                <dd className="text-gray-800">{formatTs(preview.start)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-400 uppercase tracking-wider">Fine</dt>
                                <dd className="text-gray-800">{formatTs(preview.end)}</dd>
                            </div>
                        </dl>

                        <div className="divider"/>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            <div>
                                <div className=" text-xs text-gray-400 uppercase tracking-wider">Durata stimata</div>
                                <div className="text-lg font-semibold">{calcDurationHours().toFixed(2)} ore</div>
                            </div>

                            <div>
                                <div className=" text-xs text-gray-400 uppercase tracking-wider">Totale stimato</div>
                                <div className="text-lg font-semibold text-primary">€{calcEstimatedPrice()}</div>
                            </div>
                        </div>

                        <div className="modal-action mt-4">
                            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annulla</button>
                            <button className="btn btn-primary" onClick={confirmPrenotazione}>Conferma</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
}

export default ParcheggioPopup;
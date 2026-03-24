import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store.jsx';

function ParcheggioPopup({ parcheggio }) {
    const { addPrenotazione, getTimeStampInizio, getTimeStampFine } = useStore();
    const navigate = useNavigate();

    const handlePrenota = () => {
        const prenotazione = {
            id: 0,
            parkingId: parcheggio.id,
            nome: parcheggio.nome,
            userId: 0,
            startTime: getTimeStampInizio(),
            endTime: getTimeStampFine(),
        };
        addPrenotazione({ prenotazione });
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
                    <span className="font-bold text-xl text-base-content">{parcheggio.nome}</span>
                </div>
            </div>

            <div className="divider my-0" />

            {/* Prezzo */}
            <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-base-content/60">Prezzo orario</span>
                <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold text-primary">€{parcheggio.prezzo_orario}</span>
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

        </div>
    );
}

export default ParcheggioPopup;
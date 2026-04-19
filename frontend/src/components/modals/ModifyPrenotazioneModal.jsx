import { useEffect, useState } from 'react';
import { useStore } from '../../store.jsx';
import OrarioParcheggi from '../OrarioParcheggi.jsx';

function isoToDate(iso) {
    if (!iso) return null;
    try {
        return new Date(iso);
    } catch (e) {
        return null;
    }
}

function ModifyPrenotazioneModal({ open, onClose, prenotazione }) {
    const { modificaPrenotazione } = useStore();

    // console.log('Prenotazione da modificare:', prenotazione);
    const [parkingId, setParkingId] = useState( prenotazione ? prenotazione.parkingId : '');
    const [startDate, setStartDate] = useState(prenotazione ? isoToDate(prenotazione.startTime) : null);
    const [endDate, setEndDate] = useState(prenotazione ? isoToDate(prenotazione.endTime) : null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!prenotazione) return;
        setStartDate(isoToDate(prenotazione.startTime));
        setEndDate(isoToDate(prenotazione.endTime));
        setError(null);
    }, [prenotazione]);

    if (!prenotazione) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!startDate || !endDate) {
            setError('Inserisci data/ora di inizio e fine');
            return;
        }
        const startIso = startDate.toISOString();
        const endIso = endDate.toISOString();

        setBusy(true);
        try {
            await modificaPrenotazione(prenotazione.id, {
                parkingId: Number(parkingId),
                startTime: startIso,
                endTime: endIso
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Errore durante la modifica');
        } finally {
            setBusy(false);
        }
    };

     return (
        <div className={"modal " + (open ? 'modal-open' : '')}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Modifica prenotazione</h3>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">

                    <div>
                        <label className="block text-sm font-medium">Orario</label>
                        <OrarioParcheggi
                            value={{ startDateTime: startDate, endDateTime: endDate }}
                            onChange={({ startDateTime, endDateTime }) => {
                                setStartDate(startDateTime);
                                setEndDate(endDateTime);
                            }}
                            showSearch={false}
                            showSubmit={false}
                        />
                    </div>

                    {error && <div className="text-sm text-error">{error}</div>}

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={() => onClose()} disabled={busy}>Annulla</button>
                        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Salvando...' : 'Salva'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModifyPrenotazioneModal;
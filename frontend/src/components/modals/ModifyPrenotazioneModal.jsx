import { useEffect, useState } from 'react';
import { useStore } from '../../store.jsx';
import OrarioParcheggi from '../OrarioParcheggi.jsx';

function isoToDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}

function ModifyPrenotazioneModal({ open, onClose, prenotazione }) {
    const { modificaPrenotazione, verificaDisponibilitaPrenotazione } = useStore();

    const [parkingId, setParkingId] = useState(prenotazione?.id_parking_lot || '');
    const [startDate, setStartDate] = useState(() => isoToDate(prenotazione?.start_time));
    const [endDate, setEndDate] = useState(() => isoToDate(prenotazione?.end_time));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [availLoading, setAvailLoading] = useState(false);
    const [availOk, setAvailOk] = useState(null);
    const [availMessage, setAvailMessage] = useState('');

    useEffect(() => {
        if (!prenotazione) return;
        setStartDate(isoToDate(prenotazione.start_time));
        setEndDate(isoToDate(prenotazione.end_time));
        setParkingId(prenotazione.id_parking_lot);
        setError(null);
        setAvailOk(null);
        setAvailMessage('');
    }, [prenotazione]);

    if (!prenotazione) return null;

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        setError(null);
        if (!startDate || !endDate) return setError('Inserisci data/ora di inizio e fine');

        setBusy(true);
        try {
            const reservationId = prenotazione.uuid;
            await modificaPrenotazione(reservationId, {
                start_time: startDate,
                end_time: endDate,
                id_parking_lot: parkingId
            });
            onClose();
        } catch (err) {
            setError(err?.message || 'Errore durante la modifica');
        } finally {
            setBusy(false);
        }
    };

    const checkAvailability = async () => {
        setAvailMessage('');
        setAvailOk(null);
        if (!startDate || !endDate) return setAvailMessage('Inserisci data/ora di inizio e fine prima di verificare.');

        setAvailLoading(true);
        try {
            const avail = await verificaDisponibilitaPrenotazione(prenotazione.id_parking_lot, startDate, endDate);
            const isAvailable = avail === true || (Boolean(avail) && (avail.available === true || avail.success === true || avail.successo === true));
            setAvailOk(isAvailable);
            setAvailMessage(isAvailable ? 'Disponibile' : 'Non disponibile per l\'intervallo selezionato');
        } catch (err) {
            setAvailOk(false);
            setAvailMessage(err?.message || 'Errore durante la verifica');
        } finally {
            setAvailLoading(false);
        }
    };

    return (
        <div className={"modal " + (open ? 'modal-open' : '')}>
            <div className="modal-box w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl min-h-[50vh] overflow-y-auto">
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
                </form>

                <div className="sticky mt-42 bg-white/90 backdrop-blur-sm py-3 flex items-center justify-between gap-2 border-t px-4">
                    <div className="flex items-center gap-3">
                        <button type="button" className="btn btn-outline" onClick={checkAvailability} disabled={availLoading}>
                            {availLoading ? 'Verifico...' : 'Verifica disponibilità'}
                        </button>
                        {availOk === true && <div className="text-sm text-green-600">{availMessage}</div>}
                        {availOk === false && <div className="text-sm text-red-600">{availMessage}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn" onClick={onClose} disabled={busy}>Annulla</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={busy}>{busy ? 'Salvando...' : 'Salva'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModifyPrenotazioneModal;
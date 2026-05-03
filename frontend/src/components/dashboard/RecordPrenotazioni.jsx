import React, { useState } from 'react';
import { useStore } from "../../store";
import UserProfileModal from '../modals/UserProfileModal';

function isReservationDisabled(reservation) {
    return reservation && reservation.status === 'CANCELLED';
}

function isReservationPast(reservation) {
    if (!reservation) return false;
    // Prefer end_time if available, otherwise use start_time
    const timeStr = reservation.end_time || reservation.start_time;
    if (!timeStr) return false;
    const t = new Date(timeStr);
    if (isNaN(t.getTime())) return false;
    return t < new Date();
}


function RecordPrenotazioni({ numero, prenotazione }) {
    const { mostraModaleEliminaRes, mostraModaleModificaRes, formatDate, profileById } = useStore();
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    async function handleClick(id) {
        setProfile(null);
        setProfileLoading(true);
        setProfileOpen(true);
        try {
            const data = await profileById(id);
            setProfile(data || null);
        } catch (e) {
            setProfile(null);
            console.error('Errore recupero profilo', e);
        } finally {
            setProfileLoading(false);
        }
    }

    return (
        <>
            <tr>
                <td>{numero}</td>
                <td><button className="btn btn-ghost" onClick={() => handleClick(prenotazione.id_user)}>{prenotazione.user_first_name} {prenotazione.user_last_name}</button></td>
                <td>{prenotazione.parking_name}</td>
                <td>{isReservationDisabled(prenotazione) ? prenotazione.status : (isReservationPast(prenotazione) ? 'TERMINATED' : prenotazione.status)}</td>
                <td>{prenotazione.start_time}</td>
                <td>{prenotazione.end_time}</td>
                <td>
                    <button
                        className={"btn btn-ghost" + ((isReservationDisabled(prenotazione) || isReservationPast(prenotazione)) ? " opacity-50 cursor-not-allowed" : "")}
                        disabled={isReservationDisabled(prenotazione) || isReservationPast(prenotazione)}
                        aria-disabled={isReservationDisabled(prenotazione) || isReservationPast(prenotazione)}
                        onClick={() => { if (!(isReservationDisabled(prenotazione) || isReservationPast(prenotazione))) mostraModaleModificaRes(prenotazione); }}
                    >
                        <img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8' />
                    </button>
                </td>
                <td>
                    <button
                        className={"btn btn-ghost" + ((isReservationDisabled(prenotazione) || isReservationPast(prenotazione)) ? " opacity-50 cursor-not-allowed" : "")}
                        disabled={isReservationDisabled(prenotazione) || isReservationPast(prenotazione)}
                        aria-disabled={isReservationDisabled(prenotazione) || isReservationPast(prenotazione)}
                        onClick={() => { if (!(isReservationDisabled(prenotazione) || isReservationPast(prenotazione))) mostraModaleEliminaRes(prenotazione); }}
                    >
                        <img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8' />
                    </button>
                </td>
            </tr>

            <UserProfileModal
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={profile}
                loading={profileLoading}
            />
        </>

    );

}

export default RecordPrenotazioni;
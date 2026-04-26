import React, { useState } from 'react';
import { useStore } from "../../store";
import UserProfileModal from '../modals/UserProfileModal';


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
                <td><button className="btn btn-ghost" onClick={() => handleClick(prenotazione.id_user)}>{prenotazione.id_user}</button></td>
                <td>{prenotazione.parking_name}</td>
                <td>{prenotazione.start_time}</td>
                <td>{prenotazione.end_time}</td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleModificaRes(prenotazione)}><img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleEliminaRes(prenotazione)}><img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
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
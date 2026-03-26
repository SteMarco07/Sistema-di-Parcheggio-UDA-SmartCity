import React from 'react';
import { useStore } from "../../store";


function RecordPrenotazioni({ numero, prenotazione, parcheggiMap }) {
    const parkingName = parcheggiMap?.get(prenotazione.parkingId) ?? prenotazione.parkingId;
    const { mostraModaleEliminaRes, mostraModaleModificaRes, formatDate } = useStore();

    return (
        <>
            <tr>
                <td>{numero}</td>
                <td>{prenotazione.userId}</td>
                <td>{parkingName}</td>
                <td>{formatDate(prenotazione.startTime)}</td>
                <td>{formatDate(prenotazione.endTime)}</td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleModificaRes(prenotazione)}><img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleEliminaRes(prenotazione)}><img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
            </tr>
        </>

    );

}

export default RecordPrenotazioni;
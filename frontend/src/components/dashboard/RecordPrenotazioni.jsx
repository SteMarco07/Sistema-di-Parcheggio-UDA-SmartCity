

import React from 'react';

function RecordPrenotazioni({ numero, prenotazione, parcheggiMap }) {
    const parkingName = parcheggiMap?.get(prenotazione.parkingId) ?? prenotazione.parkingId;

    return (
        <>
            <tr>
                <td>{numero}</td>
                <td>{prenotazione.userId}</td>
                <td>{parkingName}</td>
                <td>{prenotazione.startTime}</td>
                <td>{prenotazione.endTime}</td>
                <td><button className="btn btn-ghost" ><img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
                <td><button className="btn btn-ghost" ><img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
            </tr>
        </>

    );

}

export default RecordPrenotazioni;
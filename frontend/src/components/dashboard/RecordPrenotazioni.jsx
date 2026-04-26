import React from 'react';
import { useStore } from "../../store";


function RecordPrenotazioni({ numero, prenotazione }) {
    const { mostraModaleEliminaRes, mostraModaleModificaRes, formatDate } = useStore();

    return (
        <>
            <tr>
                <td>{numero}</td>
                <td>{prenotazione.id_user}</td>
                <td>{prenotazione.parking_name}</td>
                <td>{prenotazione.start_time}</td>
                <td>{prenotazione.end_time}</td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleModificaRes(prenotazione)}><img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleEliminaRes(prenotazione)}><img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
            </tr>
        </>

    );

}

export default RecordPrenotazioni;
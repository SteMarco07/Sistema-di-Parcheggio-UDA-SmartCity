import React, { useState } from 'react';
import { useStore } from "../../store";

function RecordParcheggi({ numero, parcheggio }) {

    const { mostraModaleEliminaPark, mostraModaleModificaPark } = useStore();


    return (
        <>
            <tr>
                <td>{numero}</td>
                <td>{parcheggio.nome}</td>
                <td>{parcheggio.id}</td>
                <td>{parcheggio.descrizione}</td>
                <td>{parcheggio.prezzo_orario} €/h</td>
                <td>{parcheggio.lat}</td>
                <td>{parcheggio.lng}</td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleModificaPark(parcheggio)}><img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
                <td><button className="btn btn-ghost" onClick={() => mostraModaleEliminaPark(parcheggio)}><img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
            </tr>

        </>
    );

}

export default RecordParcheggi;
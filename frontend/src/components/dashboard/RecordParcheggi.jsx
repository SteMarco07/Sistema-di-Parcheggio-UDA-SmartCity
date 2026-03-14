import React, { useState } from 'react';
import {useStore} from "../../store";

function RecordParcheggi({ numero, parcheggio }) {

    const {deleteParcheggio} = useStore();

    const onDelete = () => {
        deleteParcheggio(parcheggio.id);
        //console.log("Eliminato parcheggio con id:", parcheggio.id);
    }

    const onEdit = () => {
        //alert("Funzione non implementata");
    }

    return (
        <tr>
            <td>{numero}</td>
            <td>{parcheggio.nome}</td>
            <td>{parcheggio.descrizione}</td>
            <td>{parcheggio.prezzo_orario} €/h</td>
            <td>{parcheggio.lat}</td>
            <td>{parcheggio.lng}</td>
            <td><button className="btn btn-ghost" onClick={() => onEdit()}><img src="src/assets/icona_modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
            <td><button className="btn btn-ghost" onClick={() => onDelete()}><img src="src/assets/icona_cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
        </tr>
    );

}

export default RecordParcheggi;
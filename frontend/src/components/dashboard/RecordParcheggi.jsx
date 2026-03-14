import React from 'react';

function RecordParcheggi({ numero, parcheggio }) {

    const onDelete = () => {
        alert("Funzione non implementata");
    }

    const onEdit = () => {
        alert("Funzione non implementata");
    }

    return (
        <tr>
            <td>{numero}</td>
            <td>{parcheggio.nome}</td>
            <td>{parcheggio.descrizione}</td>
            <td>{parcheggio.prezzo_orario} €/h</td>
            <td>{parcheggio.lat}</td>
            <td>{parcheggio.lng}</td>
            <td><button className="btn btn-ghost" onClick={onEdit}><img src="src/assets/modifica.svg" alt="Modifica" className='h-8 ' /></button></td>
            <td><button className="btn btn-ghost" onClick={onDelete}><img src="src/assets/cestino.svg" alt="Elimina" className='h-8 ' /></button></td>
        </tr>
    );

}

export default RecordParcheggi;
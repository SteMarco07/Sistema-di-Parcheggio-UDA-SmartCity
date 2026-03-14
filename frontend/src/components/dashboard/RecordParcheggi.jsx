import React from 'react';

function RecordParcheggi({ numero, parcheggio }) {

    return (
        <tr>
            <td>{numero}</td>
            <td>{parcheggio.nome}</td>
            <td>{parcheggio.descrizione}</td>
            <td>{parcheggio.prezzo_orario} €/h</td>
            <td>{parcheggio.lat}</td>
            <td>{parcheggio.lng}</td>
        </tr>
    );

}

export default RecordParcheggi;
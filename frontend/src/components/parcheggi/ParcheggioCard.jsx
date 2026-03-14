import React, { useState } from 'react';
import { useStore } from '../../store.jsx';


function ParcheggioCard({ parcheggio }) {

  const [p, setP] = useState(parcheggio);

  const { modifyPosition, modifyZoom } = useStore();

  function handleClick() {
    modifyPosition([p.lat, p.lng]);
    modifyZoom(18);
  }


  return (
    <div onClick={handleClick}>
      <h1 className="text-xl font-bold">{p.nome}</h1>
      <p>Posti disponibili: {p.postiDisponibili || 0}</p>
      <p>Descrizione: {p.descrizione || "nessuna descrizione presente"}</p>
    </div>
  );
}

export default ParcheggioCard;
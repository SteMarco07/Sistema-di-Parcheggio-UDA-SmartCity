import React, { useState } from 'react';
import { useStore } from '../../store.jsx';


function ParcheggioCard({ parcheggio }) {

  const [p, setP] = useState(parcheggio);

  const { modifyPosition, modifyZoom } = useStore();

  function handleClick() {
    modifyPosition([p.latitude ?? p.lat, p.longitude ?? p.lng]);
    modifyZoom(18);
  }


  return (
    <div onClick={handleClick} className='margin-4'>
      <h1 className="text-xl font-bold">{p.name}</h1>
      <p>Posti totali: {p.total_spots ?? '—'}</p>
      <p>Descrizione: {p.description || "nessuna descrizione presente"}</p>
    </div>
  );
}

export default ParcheggioCard;
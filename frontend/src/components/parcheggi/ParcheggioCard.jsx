import { useStore } from '../../store.jsx';

function ParcheggioCard({ parcheggio }) {
  const { modifyPosition, modifyZoom } = useStore();

  function handleClick() {
    modifyPosition([parcheggio.latitude ?? parcheggio.lat, parcheggio.longitude ?? parcheggio.lng]);
    modifyZoom(18);
  }

  return (
    <div onClick={handleClick} className="margin-4">
      <h1 className="text-xl font-bold">{parcheggio.name}</h1>
      <p>Posti totali: {parcheggio.total_spots ?? '—'}</p>
      <p>Descrizione: {parcheggio.description || "Nessuna descrizione presente"}</p>
    </div>
  );
}

export default ParcheggioCard;
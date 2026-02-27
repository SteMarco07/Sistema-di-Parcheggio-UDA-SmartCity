import PrenotazioneCard from "../components/PrenotazioneCard.jsx";
import { useStore } from "../store.jsx";

function PaginaPrenotazioni() {
  const { prenotazioni } = useStore();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Prenotazioni</h2>
      { prenotazioni.length === 0 ? 
        (<p>Qui verranno mostrate le prenotazioni future.</p>) : (
          prenotazioni.map(
            (prenotazione) => (
              <PrenotazioneCard key={prenotazione.id} prenotazione={prenotazione} />
            )
          )
        )}
    </div>
  )
}

export default PaginaPrenotazioni;

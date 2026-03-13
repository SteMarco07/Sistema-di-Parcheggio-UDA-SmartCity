import PrenotazioneCard from "../components/PrenotazioneCard.jsx";
import { useStore } from "../store.jsx";

function PaginaPrenotazioni() {
  // Prendo prenotazioni, fieldsets e la funzione addFieldset dallo store
  const { prenotazioni, fieldsets, addFieldset } = useStore();

  return (
    <div className="p-6 space-y-6">
      {/* Titolo + bottone */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Prenotazioni</h2>
      </div>

      {/* Lista prenotazioni */}
      {prenotazioni.length === 0 ? (
        <p>Qui verranno mostrate le prenotazioni future.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {prenotazioni.map((prenotazione) => (
            <PrenotazioneCard
              key={prenotazione.id}
              prenotazione={prenotazione}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaPrenotazioni;
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
        <button
          type="button"
          onClick={addFieldset} // chiama la funzione dello store
          className="btn btn-soft"
        >
          Add
        </button>
      </div>

      {/* Fieldset dinamici */}
      {fieldsets?.map((field, index) => (
        <fieldset
          key={field.id}
          className="fieldset bg-base-200 border border-base-300 p-4 rounded-box mb-4"
        >
          <legend className="fieldset-legend">Nuovo Campo {index + 1}</legend>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Scrivi qualcosa..."
          />
        </fieldset>
      ))}

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
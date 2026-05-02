import { useEffect } from "react";
import PrenotazioneCard from "../components/PrenotazioneCard.jsx";
import DeletePrenotazioneModal from "../components/modals/DeletePrenotazioneModal.jsx";
import ModifyPrenotazioneModal from "../components/modals/ModifyPrenotazioneModal.jsx";
import { useStore } from "../store.jsx";

function PaginaPrenotazioni() {
  const {
    prenotazioni,
    fetchPrenotazioni,
    oggettoInModificaRes,
    nascondiModaleEliminaRes,
    showDeleteModalRes,
    mostraModaleEliminaRes,
    mostraModaleModificaRes,
    nascondiModaleModificaRes,
    showEditModalRes,
  } = useStore();

  useEffect(() => {
    fetchPrenotazioni();
  }, []);

  const Elenco = ({ titolo, lista, messaggio, pulsanti = false }) => {
    return (
      <>
        <h2 className="text-2xl font-semibold mb-4">{titolo}</h2>

        {!Array.isArray(lista) || lista.length === 0 ? (
          <p>{messaggio}</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {lista.map((prenotazione) => (
              <PrenotazioneCard
                key={prenotazione.uuid}
                prenotazione={prenotazione}
                pulsanti={pulsanti}
                onElimina={() => mostraModaleEliminaRes(prenotazione)}
                onModifica={() => mostraModaleModificaRes(prenotazione)}
              />
            ))}
          </div>
        )}

        <DeletePrenotazioneModal
          open={showDeleteModalRes}
          onClose={() => nascondiModaleEliminaRes()}
          prenotazione={oggettoInModificaRes}
        />
      </>
    );
  };

  const prenotazioniAttive = Array.isArray(prenotazioni)
    ? prenotazioni.filter(
        (p) => (p.status || "").toString().toUpperCase() === "ACTIVE",
      )
    : [];

  const prenotazioniCancellate = Array.isArray(prenotazioni)
    ? prenotazioni.filter(
        (p) => (p.status || "").toString().toUpperCase() === "CANCELLED",
      )
    : [];

  return (
    <div className="p-6 space-y-6">
      <Elenco
        titolo={"Prenotazioni attive"}
        lista={prenotazioniAttive}
        messaggio={"Qui verranno mostrate le prenotazioni future"}
        pulsanti={true}
      />
      <Elenco
        titolo={"Prenotazioni cancellate"}
        lista={prenotazioniCancellate}
        messaggio={"Qui verranno mostrate le prenotazioni cancellate"}
        pulsanti={false}
      />

      <ModifyPrenotazioneModal
        open={showEditModalRes}
        onClose={() => nascondiModaleModificaRes()}
        prenotazione={oggettoInModificaRes}
      />
    </div>
  );
}

export default PaginaPrenotazioni;

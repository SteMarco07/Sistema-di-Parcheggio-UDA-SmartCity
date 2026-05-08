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
        </>
      );
  };

  const prenotazioniAttive = Array.isArray(prenotazioni)
    ? prenotazioni.filter((p) => {
        if (((p.status || "").toString().toUpperCase() !== "ACTIVE")) return false;
        const d = new Date(p.end_time);
        const ts = !Number.isNaN(d.getTime()) ? d.getTime() : null;
        return ts === null || ts >= Date.now();
      })
    : [];

  const prenotazioniTerminate = Array.isArray(prenotazioni)
    ? prenotazioni.filter((p) => {
        const d = new Date(p.end_time);
        const ts = !Number.isNaN(d.getTime()) ? d.getTime() : null;
        return ts !== null && ts < Date.now();
      })
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
        titolo={"Prenotazioni terminate"}
        lista={prenotazioniTerminate}
        messaggio={"Qui verranno mostrate le prenotazioni concluse"}
        pulsanti={false}
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

      <DeletePrenotazioneModal
        open={showDeleteModalRes}
        onClose={() => nascondiModaleEliminaRes()}
        prenotazione={oggettoInModificaRes}
      />
    </div>
  );
}

export default PaginaPrenotazioni;

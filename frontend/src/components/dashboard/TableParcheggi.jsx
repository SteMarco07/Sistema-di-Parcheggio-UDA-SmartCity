import RecordParcheggi from "./RecordParcheggi";
import { useState } from "react";
import { useStore } from "../../store.jsx";

function TableParcheggi() {
    const {
        parcheggi, modificaParcheggio, deleteParcheggio,
        oggettoInModificaPark,
        showEditModalPark, nascondiModaleModificaPark,
        showDeleteModalPark, nascondiModaleEliminaPark
    } = useStore();

    const [busy, setBusy] = useState(false);

    const handleConfirmDelete = async () => {
        setBusy(true);
        try {
            await deleteParcheggio(oggettoInModificaPark.id);
        } finally {
            setBusy(false);
            nascondiModaleEliminaPark();
        }
    }
  
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Elenco dei Parcheggi</h1>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Id</th>
                            <th>Descrizione</th>
                            <th>Prezzo Orario</th>
                            <th>Latitudine</th>
                            <th>Longitudine</th>
                            <th>Modifica</th>
                            <th>Elimina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcheggi.map((p, i) => (
                            <RecordParcheggi key={p.id} numero={i + 1} parcheggio={p} />
                        ))}
                    </tbody>
                </table>


                {
                    /* Modale modifica parcheggio */
                    showEditModalPark && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg mb-5">Modifica {oggettoInModificaPark?.nome}</h3>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setBusy(true);
                                        try {
                                            const form = new FormData(e.target);
                                            const payload = {
                                                nome: form.get('nome') || '',
                                                descrizione: form.get('descrizione') || '',
                                                prezzo_orario: parseFloat(form.get('prezzo_orario')) || 0,
                                                lat: parseFloat(form.get('lat')) || 0,
                                                lng: parseFloat(form.get('lng')) || 0,
                                            };

                                            modificaParcheggio(oggettoInModificaPark?.id, payload);


                                            nascondiModaleModificaPark();

                                        } catch (err) {
                                            console.error('Impossibile salvare il parcheggio:', err);
                                            // qui puoi mostrare una notifica di errore se vuoi
                                        } finally {
                                            setBusy(false);
                                        }
                                    }}
                                >
                                    <div className="grid grid-cols-1 gap-3">
                                        <label className="label">
                                            <span className="label-text">Nome</span>
                                        </label>
                                        <input
                                            name="nome"
                                            type="text"
                                            defaultValue={oggettoInModificaPark?.nome}
                                            className="input input-bordered w-full"
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Descrizione</span>
                                        </label>
                                        <textarea
                                            name="descrizione"
                                            defaultValue={oggettoInModificaPark?.descrizione}
                                            className="textarea textarea-bordered w-full"
                                            rows={3}
                                        />

                                        <label className="label">
                                            <span className="label-text">Prezzo orario (€)</span>
                                        </label>
                                        <input
                                            name="prezzo_orario"
                                            type="number"
                                            step="0.01"
                                            defaultValue={oggettoInModificaPark?.prezzo_orario}
                                            className="input input-bordered w-full"
                                            required
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="label">
                                                    <span className="label-text">Latitudine</span>
                                                </label>
                                                <input
                                                    name="lat"
                                                    type="number"
                                                    step="any"
                                                    defaultValue={oggettoInModificaPark?.lat}
                                                    className="input input-bordered w-full"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">
                                                    <span className="label-text">Longitudine</span>
                                                </label>
                                                <input
                                                    name="lng"
                                                    type="number"
                                                    step="any"
                                                    defaultValue={oggettoInModificaPark?.lng}
                                                    className="input input-bordered w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-action mt-4">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => nascondiModaleModificaPark()}
                                            disabled={busy}
                                        >
                                            Annulla
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={busy}>
                                            {busy ? 'Salvataggio...' : 'Salva'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {

                    /* Modale elimina parcheggio */
                    showDeleteModalPark && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Conferma eliminazione</h3>
                                <p className="py-4">Sei sicuro di voler eliminare <strong>{oggettoInModificaPark?.nome}</strong>?</p>
                                <div className="modal-action">
                                    <button className="btn" onClick={() => nascondiModaleEliminaPark()} disabled={busy}>Annulla</button>
                                    <button className="btn btn-error" onClick={handleConfirmDelete} disabled={busy}>{busy ? 'Eliminazione...' : 'Elimina'}</button>
                                </div>
                            </div>
                        </div>
                    )}


            </div>
        </>
    )
}

export default TableParcheggi;
import RecordParcheggi from "./RecordParcheggi";
import { useState } from "react";
import { useStore } from "../../store.jsx";

function TableParcheggi() {
    const {
        parcheggi, modificaParcheggio, deleteParcheggio,
        oggettoInModificaPark,
        showEditModalPark, nascondiModaleModificaPark,
        showDeleteModalPark, nascondiModaleEliminaPark,
        showAddParkModal, mostraModaleAggiungiParcheggio, nascondiModaleAggiungiParcheggio, aggiungiParcheggio
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
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">Elenco dei Parcheggi</h1>
                <div className="btn btn-primary" onClick={mostraModaleAggiungiParcheggio}>
                    Aggiungi Parcheggio
                </div>
            </div>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Id</th>
                            <th>Descrizione</th>
                            <th>Posti Totali</th>
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
                    /* Modale aggiungi parcheggio */
                    showAddParkModal && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg mb-5">Aggiungi un nuovo Parcheggio</h3>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setBusy(true);
                                        try {
                                            const form = new FormData(e.target);
                                            const payload = {
                                                name: form.get('name') || form.get('nome') || '',
                                                description: form.get('description') || form.get('descrizione') || '',
                                                hour_tax: parseFloat(form.get('hour_tax') || form.get('prezzo_orario')) || 0,
                                                latitude: parseFloat(form.get('latitude') || form.get('lat')) || 0,
                                                longitude: parseFloat(form.get('longitude') || form.get('lng')) || 0,
                                                total_spots: parseInt(form.get('total_spots') || form.get('posti_totali')) || null,
                                            };

                                            aggiungiParcheggio(payload);


                                            nascondiModaleAggiungiParcheggio();

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
                                            name="name"
                                            type="text"
                                            className="input input-bordered w-full"
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Descrizione</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            className="textarea textarea-bordered w-full"
                                            rows={3}
                                        />

                                        <label className="label">
                                            <span className="label-text">Posti totali</span>
                                        </label>
                                        <input
                                            name="total_spots"
                                            type="number"
                                            step="1"
                                            className="input input-bordered w-full"
                                            defaultValue={50}
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Prezzo orario (€)</span>
                                        </label>
                                        <input
                                            name="hour_tax"
                                            type="number"
                                            step="0.01"
                                            className="input input-bordered w-full"
                                            required
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="label">
                                                    <span className="label-text">Latitudine</span>
                                                </label>
                                                <input
                                                    name="latitude"
                                                    type="number"
                                                    step="any"
                                                    defaultValue={45.4642}
                                                    className="input input-bordered w-full"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">
                                                    <span className="label-text">Longitudine</span>
                                                </label>
                                                <input
                                                    name="longitude"
                                                    type="number"
                                                    step="any"
                                                    defaultValue={9.1900}
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
                                            onClick={nascondiModaleAggiungiParcheggio}
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
                                                id: oggettoInModificaPark.id,
                                                name: form.get('name') || '',
                                                description: form.get('description') || '',
                                                hour_tax: parseFloat(form.get('hour_tax') || 0),
                                                latitude: parseFloat(form.get('latitude') ||  0),
                                                longitude: parseFloat(form.get('longitude') ) || 0,
                                                total_spots: parseInt(form.get('total_spots')) || null,
                                            };

                                            console.log("Dati da salvare per parcheggio con id", oggettoInModificaPark.id, ":", payload);

                                            modificaParcheggio(payload);


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
                                            name="name"
                                            type="text"
                                            defaultValue={oggettoInModificaPark?.name }
                                            className="input input-bordered w-full"
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Descrizione</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            defaultValue={oggettoInModificaPark?.description}
                                            className="textarea textarea-bordered w-full"
                                            rows={3}
                                        />

                                        <label className="label">
                                            <span className="label-text">Posti totali</span>
                                        </label>
                                        <input
                                            name="total_spots"
                                            type="number"
                                            step="1"
                                            className="input input-bordered w-full"
                                            defaultValue={oggettoInModificaPark?.total_spots ?? oggettoInModificaPark?.posti_totali ?? 50}
                                            required
                                        />

                                        <label className="label">
                                            <span className="label-text">Prezzo orario (€)</span>
                                        </label>
                                        <input
                                            name="hour_tax"
                                            type="number"
                                            step="0.01"
                                            defaultValue={oggettoInModificaPark?.hour_tax}
                                            className="input input-bordered w-full"
                                            required
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="label">
                                                    <span className="label-text">Latitudine</span>
                                                </label>
                                                <input
                                                    name="latitude"
                                                    type="number"
                                                    step="any"
                                                    defaultValue={oggettoInModificaPark?.latitude}
                                                    className="input input-bordered w-full"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="label">
                                                    <span className="label-text">Longitudine</span>
                                                </label>
                                                <input
                                                    name="longitude"
                                                    type="number"
                                                    step="any"
                                                    defaultValue={oggettoInModificaPark?.longitude}
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
                                    <button className="btn" onClick={nascondiModaleEliminaPark} disabled={busy}>Annulla</button>
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
import RecordParcheggi from "./RecordParcheggi";
import { useStore } from "../../store.jsx";

function TableParcheggi() {
    const { parcheggi } = useStore();

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Elenco dei Parcheggi</h1>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
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
            </div>
        </>
    )
}

export default TableParcheggi;
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store.jsx';

function ParcheggioPopup({ parcheggio }) {

    const { addPrenotazione } = useStore()
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <h1 className="text-xl font-bold">{parcheggio.nome}</h1>
            <p>Prezzo orario: €{parcheggio.prezzo_orario}</p>
            <div className="flex justify-center items-center">
                <button className="btn btn-neutral" onClick={() => {
                    const prenotazione = {
                        id: 0,
                        parkingId: parcheggio.id,
                        nome: parcheggio.nome,
                        userId: 0,
                        startTime: '2024-06-01T10:00:00Z',
                        endTime: '2024-06-01T12:00:00Z'
                    }
                    // console.log(prenotazione)
                    addPrenotazione({ prenotazione })
                    navigate('/prenotazioni')
                }
                }>Prenota</button>
            </div>
        </div>
    )

}

export default ParcheggioPopup;
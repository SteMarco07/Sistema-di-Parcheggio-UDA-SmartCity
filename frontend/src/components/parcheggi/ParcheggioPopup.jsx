import { useNavigate } from 'react-router-dom';

function ParcheggioPopup({parcheggio}) {
    
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <h1 className="text-xl font-bold">{parcheggio.nome}</h1>
            <p>Prezzo orario: €{parcheggio.prezzo_orario}</p>
            <div className="flex justify-center items-center">
                <button class="btn btn-neutral" onClick={() => navigate('/prenotazioni')}>Seleziona</button>
            </div>
            </div>
    )

}

export default ParcheggioPopup;
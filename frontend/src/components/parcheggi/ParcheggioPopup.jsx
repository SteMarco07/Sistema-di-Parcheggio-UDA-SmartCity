function ParcheggioPopup({parcheggio}) {

    return (
        <div className="w-full">
            <h1 className="text-xl font-bold">{parcheggio.nome}</h1>
            <p>Prezzo orario: €{parcheggio.prezzo_orario}</p>
        </div>
    )

}

export default ParcheggioPopup;
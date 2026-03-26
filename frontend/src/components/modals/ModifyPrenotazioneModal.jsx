function ModifyPrenotazioneModal({ open, onClose, prenotazione }) {
    if (!prenotazione) return null;

    return (
        <>
            <div className={"modal " + (open ? 'modal-open' : '')}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Conferma la modifica della prenotazione</h3>
                    <p className="py-2">Sei sicuro di voler modificare la seguente prenotazione?</p>
                </div>
            </div>
        </>
    )
}

export default ModifyPrenotazioneModal;
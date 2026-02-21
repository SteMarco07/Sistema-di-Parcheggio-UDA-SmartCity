import pIcon from './assets/p_parcheggio.svg';

const PARKINGS = [
  {
    id: 1,
    name: 'Parcheggio 1',
    description: 'Parcheggio situato in centro città, vicino a negozi e ristoranti. Offre 50 posti auto e tariffe convenienti.',
  },
  {
    id: 2,
    name: 'Parcheggio 2',
    description: 'Parcheggio coperto con 100 posti auto, situato vicino a un centro commerciale. Offre tariffe orarie e abbonamenti mensili.',
  },
  {
    id: 3,
    name: 'Parcheggio 3',
    description: "Parcheggio all'aperto con 30 posti auto, situato vicino a un parco pubblico. Offre tariffe giornaliere e settimanali.",
  }
];

function ElencoParcheggi() {
  return (
    <div className="join border border-black rounded-box join-vertical gap-4 h-full">
      <div className="join-item">
        <div className="flex items-center gap-4 px-4 py-3">
          <img src={pIcon} alt="P" className="h-10 w-10" />
          <h2 className="text-3xl font-semibold">Parcheggi disponibili</h2>
        </div>

        {PARKINGS.map((item) => (
          <div key={item.id} className="card card-border w-full bg-base-90 shadow-xl mb-4">
            <div className="card-body">
              <h2 className="card-title">{item.name}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElencoParcheggi;
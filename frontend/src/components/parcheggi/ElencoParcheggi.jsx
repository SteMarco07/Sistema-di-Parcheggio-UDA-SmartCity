import pIcon from '../../assets/p_parcheggio.svg';
import { useStore } from '../../store';
import ParcheggioCard from './ParcheggioCard.jsx';


function ElencoParcheggi() {
  const { parcheggiFiltrati } = useStore();

  return (
  <div className="flex flex-col h-full border border-base-200">
    
    {/* Header */}
    <div className="flex items-center gap-3 px-5 py-4 border-b border-base-200">
      <div>
        <div className="flex items-center gap-4 px-4 py-3">
          <img src={pIcon} alt="P" className="h-10 w-10" />
          <h2 className="text-3xl font-semibold">Parcheggi disponibili</h2>
          </div>
        <p className="text-xs text-base-content/50">{parcheggiFiltrati.length} risultati</p>
      </div>
    </div>

    {/* Lista */}
    <div className="overflow-y-auto flex-1 px-3 py-3 flex flex-col gap-2">
      {parcheggiFiltrati.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-base-content/30">
          <p className="text-sm">Nessun parcheggio trovato</p>
        </div>
      ) : (
        parcheggiFiltrati.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 border border-base-200 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="card-body p-4">
              <ParcheggioCard parcheggio={item} />
            </div>
          </div>
        ))
      )}
    </div>

  </div>
);
}

export default ElencoParcheggi;
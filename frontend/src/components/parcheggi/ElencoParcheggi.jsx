import pIcon from '../../assets/p_parcheggio.svg';
import { useStore } from '../../store';
import ParcheggioCard from './ParcheggioCard.jsx';


function ElencoParcheggi() {
  const { parcheggiFiltrati } = useStore();

  return (
    <div className="join border border-black rounded-box join-vertical gap-4 h-full ">
      <div className="join-item h-full flex flex-col">
        <div className="flex items-center gap-4 px-4 py-3">
          <img src={pIcon} alt="P" className="h-10 w-10" />
          <h2 className="text-3xl font-semibold">Parcheggi disponibili</h2>
        </div>
        <div className='overflow-y-auto flex-1'>
          {parcheggiFiltrati.length !== 0 ? (parcheggiFiltrati.map((item) => (
            <div key={item.id} className="card card-border w-full bg-base-90 shadow-xl mb-4">
              <div className="card-body">
                <ParcheggioCard parcheggio={item} />
              </div>
            </div>
          ))) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 mx-5">
              <p className="text-lg text-center">Nessun parcheggio disponibile per i criteri selezionati.</p>
              <p className="text-sm mt-2">Prova a modificare la tua ricerca o controlla più tardi.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ElencoParcheggi;
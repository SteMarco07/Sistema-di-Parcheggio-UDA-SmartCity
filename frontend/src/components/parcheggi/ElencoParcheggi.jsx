import pIcon from '../../assets/p_parcheggio.svg';
import { useStore } from '../../store';
import ParcheggioCard from './ParcheggioCard.jsx';


function ElencoParcheggi() {
  const { parcheggi } = useStore();

  return (
    <div className="join border border-black rounded-box join-vertical gap-4 h-full ">
      <div className="join-item">
        <div className="flex items-center gap-4 px-4 py-3">
          <img src={pIcon} alt="P" className="h-10 w-10" />
          <h2 className="text-3xl font-semibold">Parcheggi disponibili</h2>
        </div>

        {parcheggi.map((item) => (
          <div key={item.id} className="card card-border w-full bg-base-90 shadow-xl mb-4">
            <div className="card-body">
              <ParcheggioCard parcheggio={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElencoParcheggi;
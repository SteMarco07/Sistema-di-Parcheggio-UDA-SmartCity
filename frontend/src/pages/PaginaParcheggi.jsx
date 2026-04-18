import ElencoParcheggi from '../components/parcheggi/ElencoParcheggi.jsx';
import OrarioParcheggi from '../components/OrarioParcheggi.jsx';
import Mappa from '../components/Mappa.jsx';
import React, { useState } from 'react';
import { useStore } from '../store.jsx';


function PaginaParcheggi() {

    return (
        <>
        
        {/* Area Main: Occupa tutto lo spazio restante (100vh - 64px) */}
        <div className="h-[calc(100vh-64px)] w-full px-6 py-7">
            {/* OrarioParcheggi come riga intera sopra */}
            <div className="flex justify-center mb-3 sm:mb-4">
                <div className="w-full sm:w-auto">
                    <OrarioParcheggi />
                </div>
            </div>

            <div className="flex flex-col md:flex-row w-full h-auto md:h-[calc(100%-6rem)] gap-3 sm:gap-4">
                {/* Stack su mobile, side-by-side su md+ */}
                <div className="flex flex-col md:flex-row w-full h-[calc(100%-5rem)] gap-4">
                
                {/* Mappa: full width su mobile con altezza fissa, desktop usa altezza piena */}
                <div className="w-full md:w-[75%] h-[50vh] md:h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <Mappa />
                </div>

                {/* Elenco: full width su mobile, desktop usa 30% e scrolla */}
                <div className="w-full md:w-[25%] h-[40vh] md:h-full overflow-hidden bg-base-100 rounded-2xl shadow-md ">
                    <ElencoParcheggi />
                </div>

            </div>

            
            
            </div>
        </div>
        </>
    )

}

export default PaginaParcheggi;
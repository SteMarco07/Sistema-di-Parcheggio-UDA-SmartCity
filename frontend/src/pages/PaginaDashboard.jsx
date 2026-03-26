import { use } from 'react';
import { useStore } from '../store.jsx';

import TableParcheggi from '../components/dashboard/TableParcheggi.jsx';
import ChartParcheggi from '../components/dashboard/ChartParcheggi.jsx';

function PaginaDashboard() {
    const { parcheggi } = useStore();

    return (
        <div className="p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

            <div className="join join-horizontal gap-6">
                <div className="join join-vertical gap-6 w-[75%]">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <TableParcheggi />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <TableParcheggi />
                    </div>


                </div>

                <div className="w-[25%] bg-white rounded-lg shadow-md p-6">
                    <ChartParcheggi />

                </div>
            </div>



        </div>
    );
}

export default PaginaDashboard;
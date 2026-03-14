import { use } from 'react';
import { useStore } from '../store.jsx';

import TableParcheggi from '../components/dashboard/TableParcheggi.jsx';

function PaginaDashboard() {
    const { parcheggi } = useStore();

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

            <TableParcheggi />

        </div>
    );
}

export default PaginaDashboard;
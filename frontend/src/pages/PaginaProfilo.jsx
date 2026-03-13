import React from 'react';

const PaginaProfilo = ({ user: propUser }) => {
    // prova a leggere l'utente dal localStorage, altrimenti usa i prop o valori di fallback
    const storedUser = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    const user = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mrossi@example.com',
        targa: 'AB123CD'
    };

    return (
        <div className="px-6 py-8 max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold mb-16 text-center">Profilo</h1>

            <div className="card bg-base-100 shadow-md card-xl">
                <div className="card-body">
                    <div className="space-y-3">
                        
                        {
                            Object.keys(user).map((field) => (
                                <div key={field} className="flex justify-between items-center py-3 gap-10">
                                    <div className="label text-lg"><span className="label-text">{field.charAt(0).toUpperCase() + field.slice(1)} </span></div>
                                    <div className="text-lg">{user[field]}</div>
                                </div>
                            ))}
                    </div>

                    <div className="mt-6 flex items-center justify-around">
                        <button className="btn btn-success"
                        onClick={() => {
                            window.location.href = '/parcheggi';
                        }}
                        >Home</button>
                        <button className="btn btn-error"
                        onClick={() => {
                            window.location.href = '/auth';
                        }}
                        >Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaginaProfilo;
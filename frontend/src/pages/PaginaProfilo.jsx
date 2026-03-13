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

    const defaultUser = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mrossi@example.com',
        targa: 'AB123CD'
    };

    const user = storedUser || propUser || defaultUser;

    const initials = `${(user.nome || '').charAt(0)}${(user.cognome || '').charAt(0)}`.toUpperCase();

    const fieldsOrder = ['nome', 'cognome', 'email', 'targa'];
    const labelFor = (field) => {
        switch (field) {
            case 'nome': return 'Nome';
            case 'cognome': return 'Cognome';
            case 'email': return 'Email';
            case 'targa': return 'Targa';
            default: return field;
        }
    };

    const [copied, setCopied] = React.useState('');

    function copyToClipboard(value) {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(value).then(() => {
            setCopied(value);
            setTimeout(() => setCopied(''), 1800);
        }).catch(() => {});
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-indigo-50 to-white">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-800">Il tuo profilo</h1>
                    <p className="mt-2 text-sm text-gray-500">Gestisci le tue informazioni e le prenotazioni</p>
                </header>

                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                    {initials}
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-gray-800">{user.nome} {user.cognome}</div>
                                    <div className="text-sm text-gray-500">Utente registrato</div>
                                </div>
                            </div>

                        
                        </div>

                        <hr className="my-6 border-gray-100" />

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {fieldsOrder.map((field) => (
                                <div key={field} className="flex flex-col">
                                    <dt className="text-xs text-gray-400 uppercase tracking-wider mb-1">{labelFor(field)}</dt>
                                    <dd className="flex items-center justify-between text-gray-700">
                                        <span className="wrap-break-word max-w-xs">{user[field]}</span>
                                     
                                         <div className="flex items-center gap-2">
                                            {field === 'email' && (
                                                <button
                                                    title="Invia email"
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => window.location.href = `mailto:${user.email}`}
                                                >
                                                    <img src="src/assets/icona_invia_email.svg" alt="Invia email" className="h-4 w-4 text-gray-500" />
                                                </button>
                                            )}

                                            <button
                                                title="Copia"
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => copyToClipboard(user[field])}
                                            >
                                                <img src="src/assets/icona_copia_testo.svg" alt="Copia" className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {copied && (
                            <div className="mt-5 text-sm text-green-600">Copiato: <strong>{copied}</strong></div>
                        )}

                        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-sm text-gray-500">Hai bisogno di aggiornare le informazioni? <br /> Puoi modificare i dettagli nel profilo.</div>

                            <div className="flex gap-3 w-[50%]">
                                <button
                                    className="btn btn-outline flex-1"
                                    onClick={() => alert('Funzione modifica non implementata')}
                                >Modifica profilo</button>
                                <button
                                    className="btn btn-error flex-1"
                                    onClick={() => window.location.href = '/auth'}
                                >Logout</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaginaProfilo;
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

    const user = propUser || storedUser || {
        nome: 'Mario',
        cognome: 'Rossi',
        username: 'mrossi',
        targa: 'AB123CD'
    };

    const containerStyle = { padding: 20, maxWidth: 800, margin: '0 auto' };
    const cardStyle = { border: '1px solid #e6e6e6', borderRadius: 8, padding: 16, background: '#fff' };
    const rowStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' };
    const labelStyle = { color: '#666', fontWeight: 600 };
    const valueStyle = { color: '#222' };

    return (
        <div style={containerStyle}>
            <h1 style={{ marginBottom: 12 }}>Profilo</h1>

            <div style={cardStyle}>
                <div style={rowStyle}>
                    <div style={labelStyle}>Nome</div>
                    <div style={valueStyle}>{user.nome}</div>
                </div>

                <div style={rowStyle}>
                    <div style={labelStyle}>Cognome</div>
                    <div style={valueStyle}>{user.cognome}</div>
                </div>

                <div style={rowStyle}>
                    <div style={labelStyle}>Username</div>
                    <div style={valueStyle}>{user.username}</div>
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div style={labelStyle}>Targa</div>
                    <div style={valueStyle}>{user.targa}</div>
                </div>
            </div>
        </div>
    );
};

export default PaginaProfilo;
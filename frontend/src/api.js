import { use } from "react"

const BASE = 'http://127.0.0.1:9080/api/'

async function request(path, options = {}) {
    const res = await fetch(BASE + path, options)
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `${res.status} ${res.statusText}`)
    }
    try {
        return await res.json()
    } catch (e) {
        return null
    }
}

export const api = {
    fetchParcheggi: (token) => {
        return [
            {
                id: 1,
                nome: 'Parcheggio 1',
                descrizione: 'Parcheggio situato in centro città, vicino a negozi e ristoranti. Offre 50 posti auto e tariffe convenienti.',
                prezzo_orario: 2.5,
                lat: 45.555643027580615,
                lng: 10.21607865816928
            },
            {
                id: 2,
                nome: 'Parcheggio 2',
                descrizione: 'Parcheggio coperto con 100 posti auto, situato vicino a un centro commerciale. Offre tariffe orarie e abbonamenti mensili.',
                prezzo_orario: 3.0,
                lat: 45.556458128508915,
                lng: 10.214501303702997
            },
            {
                id: 3,
                nome: 'Parcheggio 3',
                descrizione: "Parcheggio all'aperto con 30 posti auto, situato vicino a un parco pubblico. Offre tariffe giornaliere e settimanali.",
                prezzo_orario: 2.0,
                lat: 45.5549368476325,
                lng: 10.21519329610318
            }
        ];
    },
    fetchPrenotazioni: (token) => {
        return [
            {
                id: 1,
                nome: 'Prenotazione 1',
                parkingId: 1,
                userId: 1,
                startTime: '2026-06-01T10:00:00Z',
                endTime: '2026-06-02T12:00:00Z'
            },
            {
                id: 2,
                nome: 'Prenotazione 2',
                parkingId: 2,
                userId: 2,
                startTime: '2026-06-01T10:00:00Z',
                endTime: '2026-06-03T12:00:00Z'
            },
            {
                id: 3,
                nome: 'Prenotazione 3',
                parkingId: 3,
                userId: 3,
                startTime: '2026-06-01T10:00:00Z',
                endTime: '2026-06-01T12:00:00Z'
            }
        ]
    },

    login: (username, password) => {
        console.log(`Login con ${JSON.stringify({ username, password })}`)
        return request("login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
        })
    },

    register: (nome, cognome, email, targa, password) => {
        console.log(`Registrazione con ${JSON.stringify({ nome, cognome, email, targa, password })}`)
        return request("register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'nome': nome,
                'cognome': cognome,
                'email': email,
                'username' : email,
                'targa': targa,
                'password': password
            }),
        })
    }

}
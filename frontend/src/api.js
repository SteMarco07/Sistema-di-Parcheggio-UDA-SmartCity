import { use } from "react"
import { data } from "react-router-dom"
import { formatForBackend } from './utils/time';

const BASE = 'http://127.0.0.1:9080/api/'

async function request(path, options = {}) {

    // estraggo token dalle options (se presente) e lo trasformo in header
    const { token, headers: optHeaders, ...rest } = options
    const headers = { ...(optHeaders || {}) }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(BASE + path, { ...rest, headers })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        const error = new Error(text || `${res.status} ${res.statusText}`)
        error.status = res.status
        throw error
    }
    try {
        return await res.json()
    } catch (e) {
        return null
    }
}

function POST(path, body, options = {}) {
    const { headers: optHeaders, token, ...rest } = options || {}
    const headers = { 'Content-Type': 'application/json', ...(optHeaders || {}) }
    return request(path, { method: 'POST', headers, body: JSON.stringify(body), token, ...rest })
}

function PUT(path, body, options = {}) {
    const { headers: optHeaders, token, ...rest } = options || {}
    const headers = { 'Content-Type': 'application/json', ...(optHeaders || {}) }
    return request(path, { method: 'PUT', headers, body: JSON.stringify(body), token, ...rest })
}

function DELETE(path, body, options = {}) {
    const { headers: optHeaders, token, ...rest } = options || {}
    const headers = { 'Content-Type': 'application/json', ...(optHeaders || {}) }
    return request(path, { method: 'DELETE', headers, body: JSON.stringify(body), token, ...rest })
}

function GET(path, options = {}) {
    return request(path, { method: 'GET', ...options })
}

export const api = {

    fetchPargeggiDisponibili: (opts = {}) => {
        let start = opts.start;
        let end = opts.end;

        if (start && end) {
            const sRaw = formatForBackend(start) || String(start);
            const eRaw = formatForBackend(end) || String(end);
            const s = encodeURIComponent(sRaw);
            const e = encodeURIComponent(eRaw);
            const rotta = `park/available/${s}/${e}`;
            console.log(`fetchPargeggiDisponibili:, rotta: ${rotta}`);
            return GET(rotta);
        }

        return GET("park/available");
    },

    fetchParcheggi: () => {
        return GET("park")
    },

    checkAvailability: (parkingId, start, end) => {
        const sRaw = formatForBackend(start) || String(start);
        const eRaw = formatForBackend(end) || String(end);
        const s = encodeURIComponent(sRaw);
        const e = encodeURIComponent(eRaw);
        const rotta = `park/${parkingId}/available/${s}/${e}`;

        console.log(`Verifico disponibilità con rotta: ${rotta}`)
        const data = GET(rotta)
        return data;
    },

    fetchPrenotazioni: (token) => {
        return GET("reservation/search-user", { token })
    },

    fetchAllPrenotazioni: (token) => {
        return GET("reservation", { token })
    },

    login: (username, password) => {
        console.log(`Login con ${JSON.stringify({ username, password })}`)
        return POST("login", {
                email: username,
                password: password
        })
    },

    register: (nome, cognome, email, targa, password) => {
        console.log(`Registrazione con ${JSON.stringify({ nome, cognome, email, targa, password })}`)
        return POST("register", {
            nome,
            cognome,
            email,
            targa,
            password
        })
    },

    profiloById: (id, token) => {
        return GET(`profile/${String(id)}`, { token })
    },

    aggiungiParcheggio: (payload, token) => {
        const data = PUT("park", payload, { token })
        // console.log(`Aggiungi parcheggio: ${JSON.stringify(payload)}, risposta: ${JSON.stringify(data)}`)
        return data
    },

    aggiungiPrenotazione: (payload, token) => {
        console.log(`Aggiungo prenotazione: ${JSON.stringify(payload)}, con token: ${token}`)
        const data = PUT("reservation", payload, { token })
        return data
    },
  
    deleteParcheggio: (id, token) => { 
        return DELETE("park", { id }, { token })
         
    },

    deletePrenotazione: (id, token) => {
        return DELETE(`reservation`, { id }, { token })
    },

    modificaParcheggio: (payload, token) => {
        return POST(`park`, payload, { token })
    },
    modificaPrenotazione: (payload, token) => {
        console.log(`Modifico prenotazione con payload: ${JSON.stringify(payload)}`)
        return POST('reservation', payload, { token })
    }

}
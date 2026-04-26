import { use } from "react"
import { data } from "react-router-dom"

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
        // opts: { start, end } - strings formatted for backend (e.g. "YYYY-MM-DD HH:mm:ss") or timestamps
        let start = opts.start;
        let end = opts.end;
        // Expect `start` and `end` to be pre-formatted strings (e.g. "YYYY-MM-DD HH:mm:ss").
        // The store is responsible for formatting; API just uses them as-is.

        if (start && end) {
            const s = encodeURIComponent(String(start));
            const e = encodeURIComponent(String(end));
            return GET(`park/available/${s}/${e}`);
        }

        return GET("park/available");
    },

    fetchParcheggi: () => {
        return GET("park")
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
        // console.log(`Aggiungo prenotazione: ${JSON.stringify(payload)}`)
        const data = PUT("reservation", payload, { token })
        return data
    },
  
    deleteParcheggio: (id, token) => { 
        return DELETE("park", { id }, { token })
         
    },

    deletePrenotazione: (id, token) => {
        return DELETE(`reservation/${id}`, { id }, { token })
    },

    modificaParcheggio: (payload, token) => {
        return POST(`park`, payload, { token })
    },
    modificaPrenotazione: (id, payload) => {
        return {
            prenotazione: payload,
            successo: true
        }
    }

}
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
        throw new Error(text || `${res.status} ${res.statusText}`)
    }
    try {
        return await res.json()
    } catch (e) {
        return null
    }
}

function post(path, body, options = {}) {
    const { headers: optHeaders, token, ...rest } = options || {}
    const headers = { 'Content-Type': 'application/json', ...(optHeaders || {}) }
    return request(path, { method: 'POST', headers, body: JSON.stringify(body), token, ...rest })
}

function put(path, body, options = {}) {
    const { headers: optHeaders, token, ...rest } = options || {}
    const headers = { 'Content-Type': 'application/json', ...(optHeaders || {}) }
    return request(path, { method: 'PUT', headers, body: JSON.stringify(body), token, ...rest })
}

function get(path, options = {}) {
    return request(path, { method: 'GET', ...options })
}

export const api = {

    fetchPargeggiDisponibili: (token) => {
        return []
    },

    fetchParcheggi: (token) => {
        return get("park")
    },
    fetchPrenotazioni: (token) => {
        return [
            {
                id: 1,
                nome: 'Prenotazione 1',
                parkingId: 1,
                userId: 1,
                startTime: '2026-03-24T10:00:00Z',
                endTime: '2026-03-25T12:00:00Z'
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
        return post("login", {
                email: username,
                password: password
        })
    },

    register: (nome, cognome, email, targa, password) => {
        console.log(`Registrazione con ${JSON.stringify({ nome, cognome, email, targa, password })}`)
        return post("register", {
            nome,
            cognome,
            email,
            targa,
            password
        })
    },

    aggiungiParcheggio: (payload, token) => {
        const data = put("park", payload, { token })
        console.log(`Aggiungi parcheggio: ${payload}, risposta: ${data}`)
        return data
    },
  
    deleteParcheggio: (id) => {
        return {
            id: id,
            successo: true
        }
    },

    deletePrenotazione: (id) => {
        return {
            id: id,
            successo: true
        }
    },

    modificaParcheggio: (id, payload) => {
        return {
            id: id,
            successo: true
        }
    },
    modificaPrenotazione: (id, payload) => {
        return {
            prenotazione: payload,
            successo: true
        }
    }

}
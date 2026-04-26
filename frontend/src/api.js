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

    fetchPargeggiDisponibili: (token) => {
        return []
    },

    fetchParcheggi: (token) => {
        return GET("park")
    },
    
    fetchPrenotazioni: (token) => {
        return GET("reservation/search-user", { token })
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

    deletePrenotazione: (id) => {
        return {
            id: id,
            successo: true
        }
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
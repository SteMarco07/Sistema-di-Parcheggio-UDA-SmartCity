import { create } from 'zustand';
import { api } from './api';


export const useStore = create((set, get) => ({
    // STATO INIZIALE
    parcheggi: [],
    parcheggiFiltrati: [],
    ricerca: "",
    dataOraInizio: "",
    dataOraFine: "",
    prenotazioni: [],
    isLoading: false,
    fieldsets: [],
    error: null,
    position: [45.55584514965588, 10.216172766008182],
    zoom: 18,
    authMode: "login",
    remember: localStorage.getItem('remember') === 'true' || false,
    token: "",
    utente: (() => {
        if (localStorage.getItem('remember') === 'true' || false) {
            try {
                setToken(localStorage.getItem('token'));
                const raw = localStorage.getItem('user');
                return raw ? JSON.parse(raw) : {
                    nome: "",
                    cognome: "",
                    email: "",
                    targa: "",
                    password: "",
                    iniziali: ""
                };
            } catch (e) {
                return {
                    nome: "",
                    cognome: "",
                    email: "",
                    targa: "",
                    password: "",
                    iniziali: ""
                };
            }
        }
    }
    )(),

    addFieldset: () =>
        set((state) => ({
            fieldsets: [...state.fieldsets, { id: Date.now() }],
        })),


    // Modifica posizione e salva su localStorage
    modifyPosition: (newPosition) => {
        if (Array.isArray(newPosition) && newPosition.length == 2) {
            localStorage.setItem('lastPosition', JSON.stringify({ lat: newPosition[0], lng: newPosition[1] }));
        }

        set({ position: newPosition });
    },

    // Modifica zoom e salva su localStorage
    modifyZoom: (newZoom) => {

        localStorage.setItem('lastZoom', JSON.stringify(newZoom));

        set({ zoom: newZoom });
        //console.log('Zoom:', newZoom);
        //console.log('Posizione:', get().position);
    },

    // Carica posizione/zoom da localStorage
    loadFromLocalStorage: () => {

        const storedClickRaw = localStorage.getItem('lastPosition');
        const storedZoomRaw = localStorage.getItem('lastZoom');

        const storedClick = storedClickRaw ? JSON.parse(storedClickRaw) : null;
        const storedZoom = storedZoomRaw ? JSON.parse(storedZoomRaw) : null;

        if (storedClick && storedClick.lat != null && storedClick.lng != null) {
            set({ position: [storedClick.lat, storedClick.lng] });
        }

        if (storedZoom != null) {
            set({ zoom: storedZoom });
        }

    },

    login: async (username, password) => {
        try {
            const userData = await api.login(username, password);
            const token = userData['token'];
            const userInfo = {
                "username": userData['username'],
                "nome": userData['first_name'],
                "cognome": userData['last_name'],
                "email": userData['email'],
                "targa": userData['license_plate'],
                "iniziali": userData['first_name'][0] + userData['last_name'][0]

            }
            get().setUser(userInfo);
            get().setToken(userData['token']);
            if (get().remember) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userInfo));
            }
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    },

    register: async (nome, cognome, email, targa, password) => {
        try {
            const userData = await api.register(nome, cognome, email, targa, password);
            get().setUser({
                "username": email,
                "nome": nome,
                "cognome": cognome,
                "email": email,
                "targa": targa,
                
            });
            alert("Registrazione avvenuta con successo! Ora puoi effettuare il login.");
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    },


    // Modifica modalità di autenticazione (login/signup)
    setAuthMode: (mode) => {
        if (mode == 'login' || mode == 'signup') {
            set({ authMode: mode });
        }

        if (mode == 0) {
            set({ authMode: 'login' });
        } else {
            set({ authMode: 'signup' });
        }
    },

    setToken: (token) => {
        try {
            localStorage.setItem('token', token);
        } catch (e) {
            // ignore storage errors
        }
        set({ token });
    },

    setUser: (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
            // ignore storage errors
        }
        set({ utente: userData });
    },

    clearUser: () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (e) {
            // ignore storage errors
        }
        set({ token: "" });
        set({ utente: { nome: "", cognome: "", email: "", targa: "", password: "", iniziali: "" } });
    },

    // 1. Fetch dei dati (Asincrona)
    fetchParcheggi: async (token) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.fetchParcheggi(token);
            set({ parcheggi: data, isLoading: false });
            set({ parcheggiFiltrati: data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchPrenotazioni: async (token) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.fetchPrenotazioni(token);
            set({ prenotazioni: data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    setRicerca: (testo) => {
        //console.log("Imposto ricerca:", testo);
        set({ ricerca: testo, isLoading: false });
        get().filtraParcheggi();
    },

    filtraParcheggi: () => {
        const { parcheggi, ricerca } = get();
        const filtrati = parcheggi.filter((p) =>
            (p.nome ?? "").toLowerCase().includes(ricerca.toLowerCase()) ||
            (p.descrizione ?? "").toLowerCase().includes(ricerca.toLowerCase())
        );
        set({ parcheggiFiltrati: filtrati });
    },

    addPrenotazione: ({ prenotazione }) => {
        prenotazione.id = get().prenotazioni.length + 1;
        //console.log(`Lo store aggiunge ${JSON.stringify(prenotazione)}`)
        set({ prenotazioni: [...get().prenotazioni, prenotazione] });
    },

    modificaPrenotazione: ({ prenotazioneModificata }) => {
        set({
            prenotazioni: get().prenotazioni.map((p) =>
                p.id === prenotazioneModificata.id ? prenotazioneModificata : p
            )
        });
    },

    eliminaPrenotazione: (id) => {
        set({
            prenotazioni: get().prenotazioni.filter((p) => p.id !== id)
        });
    },

    setDataOraInizio: (dataInizio, oraInizio) => {
        // console.log("Imposto dataOraInizio:", dataInizio, oraInizio);
        set({ dataOraInizio: dataInizio, oraInizio });
    },

    setDataOraFine: (dataOraFine, oraFine) => {
        // console.log("Imposto dataOraFine:", dataOraFine, oraFine);
        set({ dataOraFine, oraFine });
    },

    getTimeStampInizio: () => {
        const { dataOraInizio, oraInizio } = get();
        if (!dataOraInizio || !oraInizio) return null;

        const timestamp = new Date(dataOraInizio);
        const [hours, minutes] = oraInizio.split(':').map(Number);
        timestamp.setHours(hours, minutes, 0, 0);
        return timestamp.getTime();
    },

    getTimeStampFine: () => {
        const { dataOraFine, oraFine } = get();
        if (!dataOraFine || !oraFine) return null;

        const timestamp = new Date(dataOraFine);
        const [hours, minutes] = oraFine.split(':').map(Number);
        timestamp.setHours(hours, minutes, 0, 0);
        return timestamp.getTime();
    },

    getRemember: () => {
        return get().remember;
    },

    alternaRemember: () => {
        localStorage.setItem('remember', !get().remember);
        set({ remember: !get().remember });
    }

}));
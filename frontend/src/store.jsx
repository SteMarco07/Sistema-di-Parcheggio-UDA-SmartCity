import { create } from 'zustand';
import { api } from './api';


export const useStore = create((set, get) => ({
    // STATO INIZIALE
    parcheggi: [],
    parcheggiFiltrati: [],
    ricerca : "",
    prenotazioni: [],
    isLoading: false,    
    fieldsets: [],
    error: null,
    position: [45.55584514965588, 10.216172766008182],
    zoom: 18,
    authMode: "login",
    utente: (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : {
                nome: "",
                cognome: "",
                email: "",
                targa: "",
                password: "",
                iniziali: "",
                admin: false,
            };
        } catch (e) {
            return {
                nome: "",
                cognome: "",
                email: "",
                targa: "",
                password: "",
                iniziali: "",
                admin: false,
            };
        }
    })(),

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

    setUser: (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
            // ignore storage errors
        }
        set({ utente: userData});
    },

    clearUser: () => {
        try {
            localStorage.removeItem('user');
        } catch (e) {
            // ignore storage errors
        }
        set({ utente: { nome: "", cognome: "", email: "", targa: "", password: "", iniziali: "" } });
    },

    // 1. Fetch dei dati (Asincrona)
    fetchParcheggi: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.fetchParcheggi();
            set({ parcheggi: data, isLoading: false });
            set({ parcheggiFiltrati: data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchPrenotazioni: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.fetchPrenotazioni();
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
    }

}));
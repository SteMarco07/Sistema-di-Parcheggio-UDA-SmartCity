import { create } from 'zustand';
import { api } from './api';


export const useStore = create((set, get) => ({
    // STATO INIZIALE
    parcheggi: [],
    parcheggiFiltrati: [],
    ricerca : "",
    dataOraInizio: "",
    dataOraFine: "",
    prenotazioni: [],

    oggettoInModificaPark: null,
    showEditModalPark: false,
    showDeleteModalPark: false,

    oggettoInModificaRes: null,
    showEditModalRes: false,
    showDeleteModalRes: false,

    showAddParkModal: false,
    

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
        set({ utente: userData });
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
    },

    deleteParcheggio: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.deleteParcheggio(id);
            if (data && data.successo) {
                const filtrati = get().parcheggi.filter((p) => p.id !== data.id);

                set({ parcheggi: filtrati, parcheggiFiltrati: filtrati, isLoading: false });
                console.log("Eliminato parcheggio con id:", data.id);
                get().fetchPrenotazioni();
            } else {
                set({ isLoading: false });
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    deletePrenotazione: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.deletePrenotazione(id);
            if (data && data.successo) {
                const remaining = get().prenotazioni.filter((p) => p.id !== data.id);
                set({ prenotazioni: remaining, isLoading: false });
                console.log("Eliminata prenotazione con id:", data.id);
            } else {
                set({ isLoading: false });
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    modificaParcheggio: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.modificaParcheggio(id, payload);
            if (data && data.successo) {
                const parcheggi = get().parcheggi.map((p) => p.id === id ? { ...p, ...payload } : p);
                set({ parcheggi, parcheggiFiltrati: parcheggi, isLoading: false });
                console.log("Modificato parcheggio con id:", id);
            } else {
                set({ isLoading: false });
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    modificaPrenotazione: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.modificaPrenotazione(id, payload);
            if (data && data.successo) {
                const prenotazioni = get().prenotazioni.map((p) => p.id === id ? { ...p, ...data.prenotazione } : p);
                set({ prenotazioni, isLoading: false });
                console.log("Modificata prenotazione con id:", id);
            } else {
                set({ isLoading: false });
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },



    mostraModaleModificaPark: (oggettoModifica) => {
        set({ showEditModalPark: true, oggettoInModificaPark: oggettoModifica });
    },

    nascondiModaleModificaPark: () => {
        set({ showEditModalPark: false, oggettoInModificaPark: null });
    },

    mostraModaleEliminaPark: (oggettoElimina) => {
        set({ showDeleteModalPark: true, oggettoInModificaPark: oggettoElimina });
    },

    nascondiModaleEliminaPark: () => {
        set({ showDeleteModalPark: false, oggettoInModificaPark: null });
    },

    mostraModaleModificaRes: (oggettoModifica) => {
        set({ showEditModalRes: true, oggettoInModificaRes: oggettoModifica });
    },

    nascondiModaleModificaRes: () => {
        set({ showEditModalRes: false, oggettoInModificaRes: null });
    },

    mostraModaleEliminaRes: (oggettoElimina) => {
        set({ showDeleteModalRes: true, oggettoInModificaRes: oggettoElimina });
    },

    nascondiModaleEliminaRes: () => {
        set({ showDeleteModalRes: false, oggettoInModificaRes: null });
    },

    mostraModaleAggiungiParcheggio: () => {
        set({ showAddParkModal: true });
    },

    nascondiModaleAggiungiParcheggio: () => {
        set({ showAddParkModal: false });
    },

    aggiungiParcheggio: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            console.log(`Aggiungo parcheggio: ${JSON.stringify(payload)}`);
            const data = await api.aggiungiParcheggio(payload);
            if (data && data.successo) {
                const nuovoParcheggio = { id: data.id, ...payload };
                const parcheggi = [...get().parcheggi, nuovoParcheggio];
                set({ parcheggi, parcheggiFiltrati: parcheggi, isLoading: false });
                console.log("Aggiunto nuovo parcheggio con id:", data.id);
            } else {
                set({ isLoading: false });
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    formatDate(iso) {
        try {
            return new Date(iso).toLocaleString();
        } catch (e) {
            return iso;
        }
    addPrenotazione: ({prenotazione}) => {
        prenotazione.id = get().prenotazioni.length+1;
        //console.log(`Lo store aggiunge ${JSON.stringify(prenotazione)}`)
        set({ prenotazioni: [...get().prenotazioni, prenotazione] });
    },

    modificaPrenotazione: ({prenotazioneModificata}) => {
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
    }

}));
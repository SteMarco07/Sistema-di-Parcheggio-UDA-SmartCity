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
    remember: localStorage.getItem('remember') === 'true' || false,
    token: localStorage.getItem('token') || "",
    utente: (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : {
                uuid: "",
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
                uuid: "",
                nome: "",
                cognome: "",
                email: "",
                targa: "",
                password: "",
                iniziali: "",
                admin: false,
            };
        }
        return {uuid: "", nome: "", cognome: "", email: "", targa: "", password: "", iniziali: "" }
    })(),
    addFieldset: () =>
        set((state) => ({
            fieldsets: [...state.fieldsets, { id: Date.now() }],
        })),


    // Modifica posizione e salva su localStorage
    modifyPosition: (newPosition) => {
        if (Array.isArray(newPosition) && newPosition.length == 2) {
            localStorage.setItem('lastPosition', JSON.stringify({ latitude: newPosition[0], longitude: newPosition[1] }));
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

        // supporto sia vecchio (`lat`/`lng`) che nuovo (`latitude`/`longitude`) formati
        if (storedClick && (storedClick.latitude != null && storedClick.longitude != null)) {
            set({ position: [storedClick.latitude, storedClick.longitude] });
        } else if (storedClick && (storedClick.lat != null && storedClick.lng != null)) {
            set({ position: [storedClick.lat, storedClick.lng] });
        }

        if (storedZoom != null) {
            set({ zoom: storedZoom });
        }

    },

    login: async (email, password) => {
        try {
            const data = await api.login(email, password);
            if (data && data.token) {
                const token = data['token'];
                const userInfo = {
                    "uuid": data['uuid'],
                    "nome": data['first_name'],
                    "cognome": data['last_name'],
                    "email": data['email'],
                    "targa": data['license_plate'],
                    "admin": data['role'] === 'ADMIN',
                    "iniziali": data['first_name'][0].toUpperCase() + data['last_name'][0].toUpperCase()

                }
                get().setUser(userInfo);
                get().setToken(data['token']);
                if (get().remember) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(userInfo));
                }
                get().setUser(userInfo);
                return { success: true };
            } else {
                return { success: false, message: "Login fallito" };
            }

        } catch (err) {
            return { success: false, message: err.message };
        }
    },

    register: async (nome, cognome, email, targa, password) => {
        try {
            const data = await api.register(nome, cognome, email, targa, password);
            console.log("Dati registrazione:", data);
            if (data.success) {
                // Dopo la registrazione, effettua il login automatico per ottenere il token
                const loginResult = await get().login(email, password);
                if (loginResult && loginResult.success) {
                    return { success: true };
                }
            } else {
                return { success: false, message: data.message || "Registrazione fallita" };
            }
        } catch (err) {
            return { success: false, message: err.message };
        }
    },



    addPrenotazione: async (prenotazione) => {
        const formatForBackend = (v) => {
            if (!v) return v;
            try {
                let d;
                if (typeof v === 'number') d = new Date(v);
                else if (/^\d+$/.test(v)) d = new Date(Number(v));
                else {
                    // try native parse
                    d = new Date(v);
                    if (Number.isNaN(d.getTime())) {
                        // try DD/MM/YYYY[ ,] HH:MM:SS
                        const m = String(v).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})[ ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
                        if (m) {
                            const day = m[1].padStart(2, '0');
                            const month = m[2].padStart(2, '0');
                            const year = m[3];
                            const hh = (m[4] || '00').padStart(2, '0');
                            const mm = (m[5] || '00').padStart(2, '0');
                            const ss = (m[6] || '00').padStart(2, '0');
                            // build ISO-compatible string then parse
                            d = new Date(`${year}-${month}-${day}T${hh}:${mm}:${ss}`);
                        }
                    }
                }
                if (!d || Number.isNaN(d.getTime())) return v;
                const pad = (n) => String(n).padStart(2, '0');
                const YYYY = d.getFullYear();
                const MM = pad(d.getMonth() + 1);
                const DD = pad(d.getDate());
                const hh = pad(d.getHours());
                const mm = pad(d.getMinutes());
                const ss = pad(d.getSeconds());
                return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
            } catch (e) {
                return v;
            }
        };

        try {
            const body = { ...prenotazione };
            // accept both camelCase and snake_case from UI
            if (body.startTime) body.start_time = formatForBackend(body.startTime);
            else if (body.start_time) body.start_time = formatForBackend(body.start_time);
            if (body.endTime) body.end_time = formatForBackend(body.endTime);
            else if (body.end_time) body.end_time = formatForBackend(body.end_time);

            const data = await api.aggiungiPrenotazione(body, get().token);
            console.log("Dati prenotazione:", data);
            if (data && data.success) {
                const updatedPrenotazioni = [...get().prenotazioni, data.prenotazione || body];
                set({ prenotazioni: updatedPrenotazioni });
                return { success: true };
            } else {
                return { success: false, message: data?.message || "Prenotazione fallita" };
            }
        } catch (err) {
            return { success: false, message: err.message };
        }
    },

    // Modifica modalità di autenticazione (login/signup)
    setAuthMode: (mode) => {
        if (mode === "login" || mode === "signup") {
            set({ authMode: mode });
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
            ((p.name ??  "")).toLowerCase().includes(ricerca.toLowerCase()) ||
            ((p.description ??  "")).toLowerCase().includes(ricerca.toLowerCase())
            ((p.description ??  "")).toLowerCase().includes(ricerca.toLowerCase())
        );
        set({ parcheggiFiltrati: filtrati });
    },


    deleteParcheggio: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.deleteParcheggio(id, get().token);
            // console.log(`Risposta eliminazione parcheggio con id ${id}:`, data);
            // Backend may not echo the deleted id; use the requested id as fallback
            const success = Boolean(data && (data.success || data.successo || data.deleted));
            if (data && data.success) {
                // prefer backend-provided id when present
                const removedId = data.id;
                const filtrati = get().parcheggi.filter((p) => {
                    return p.id !== removedId;
                });
                // console.log(`Parcheggi rimanenti dopo eliminazione:`, filtrati);
                set({ parcheggi: filtrati, parcheggiFiltrati: filtrati, isLoading: false });
                // refresh reservations just in case
                get().fetchPrenotazioni();
            } else if (success) {
                // success flag present but different shape
                const filtrati = get().parcheggi.filter((p) => p.id !== id);
                set({ parcheggi: filtrati, parcheggiFiltrati: filtrati, isLoading: false });
                get().fetchPrenotazioni();
            } else {
                // If backend returned nothing useful, still remove locally by id
                const filtrati = get().parcheggi.filter((p) => p.id !== id);
                set({ parcheggi: filtrati, parcheggiFiltrati: filtrati, isLoading: false });
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
                // console.log("Eliminata prenotazione con id:", data.id);
            } else {
                set({ isLoading: false });
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    modificaParcheggio: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.modificaParcheggio(payload, get().token);
            if (data) {
                const parcheggi = get().parcheggi.map((p) => p.id === data.id ? {...payload } : p);
                set({ parcheggi, parcheggiFiltrati: parcheggi, isLoading: false });
                // console.log("Modificato parcheggio con id:", id);
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
                // console.log("Modificata prenotazione con id:", id);
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
            // console.log(`Aggiungo parcheggio: ${JSON.stringify(payload)}`);
            const data = await api.aggiungiParcheggio(payload, get().token);
            if (data) {
                console.log(`Parcheggio aggiunto con id ${data.id}:`, data);
                const parcheggi = [...get().parcheggi, data];
                set({ parcheggi, parcheggiFiltrati: parcheggi, isLoading: false });
                // console.log("Aggiunto nuovo parcheggio con id:", data.id);
            } else {
                alert(data)
                set({ isLoading: false });
            }
        } catch (error) {
            const message = error.message || "Errore durante l'aggiunta del parcheggio";
            if (error.status === 409) {
                alert(message);
            }
            set({ error: message, isLoading: false });
        }
    },

    formatDate(iso) {
        try {
            return new Date(iso).toLocaleString();
        } catch (e) {
            return iso;
        }
    },

    applicaModificaPrenotazione: ({ prenotazioneModificata }) => {
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
        // console.log(`getTimeStampFine: dataOraFine=${dataOraFine}, oraFine=${oraFine}`);
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
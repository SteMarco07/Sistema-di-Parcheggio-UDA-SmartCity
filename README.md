# Parcheggio — Progetto Smart City

Il progetto "Parcheggio" nasce con l'obiettivo di offrire una soluzione completa per la ricerca, la visualizzazione e la prenotazione dei parcheggi in un contesto Smart City. Il sistema mette a disposizione un backend leggero per la gestione di utenti, parcheggi e prenotazioni, e un frontend reattivo che consente agli utenti di esplorare la mappa, filtrare i risultati e prenotare posti. Le API sono progettate per essere sicure (JWT) e facilmente integrabili con client esterni; è prevista inoltre un'area amministrativa protetta per le operazioni di gestione.

## Funzionalità principali
L'applicazione permette di cercare e visualizzare parcheggi su una mappa, applicando filtri per orari, disponibilità e tipologia. Gli utenti possono effettuare prenotazioni, visualizzare e cancellare le proprie prenotazioni, mentre gli amministratori dispongono di un pannello per eseguire operazioni CRUD sui parcheggi e gestire gli utenti. Le API espongono in modo RESTful tutte le operazioni necessarie per il funzionamento del servizio.


https://github.com/user-attachments/assets/a50ab77b-4c81-4809-8fb4-82624dadd0f4

Per gli amministratori è stata aggiunta una sezione apposita per aggiungere, modificare o eliminare dei parhceggi. Un'altra sezione è dedicata alla gestione e visualizzazione delle prenotazioni, con i relativi utenti. Inoltre, sono presenti dei grafici, con lo scopo di dare un'idea immediata della situazione della situazione corrente


https://github.com/user-attachments/assets/17ec6213-9d3e-45e1-ab27-6e5104b63177


## Architettura e componenti (sintesi)
Il backend è scritto in PHP con un'architettura di tipo controller/repository; gestisce le rotte e la logica applicativa ed espone le API. Tra i file principali troviamo `index.php` come punto di ingresso, `conf/config.php` per le configurazioni (database, chiavi JWT), la cartella `Controller/` che contiene `AdminController.php`, `AuthController.php` e `ParcheggiController.php`, i repository in `Model/` per l'accesso ai dati e i middleware in `Middleware/` (`JWTMiddleware.php`, `JWTAdminMiddleware.php`) che proteggono le rotte. La connessione al database è incapsulata in `Util/Connection.php`.

Il frontend è una single-page application basata su React e Vite: i componenti principali per l'interazione con la mappa e la UI sono in `src/` (per esempio `Mappa.jsx`, `Markers.jsx`, `SearchBox.jsx`) e le pagine principali gestiscono autenticazione, dashboard, elenco parcheggi, prenotazioni e profilo. Il file `api.js` funge da wrapper per le chiamate al backend e per la gestione dei token.

Il database è fornito tramite dump e script nella cartella `database/`. Le dipendenze PHP sono gestite con Composer e si trovano in `vendor/`.

## Requisiti funzionali
Il sistema prevede i seguenti requisiti funzionali:

- Autenticazione e autorizzazione tramite JWT per utenti e amministratori.
- Registrazione e login degli utenti.
- Visualizzazione di una mappa interattiva con marker e dettagli dei parcheggi.
- Ricerca e filtri per orario, disponibilità e caratteristiche dei parcheggi.
- Funzionalità di prenotazione: creazione, cancellazione e consultazione dello storico personale.
- Operazioni CRUD sui parcheggi accessibili agli amministratori.
- Esposizione di API RESTful per l'integrazione con client esterni.
- Protezione delle rotte sensibili tramite middleware JWT.

## Requisiti non funzionali
Dal punto di vista non funzionale, il progetto soddisfa i seguenti requisiti:

- Estendibilità e manutenibilità attraverso la separazione tra logica di business e accesso ai dati (controller/repository).
- Sicurezza operativa: gestione corretta di JWT, protezione delle rotte amministrative e uso di variabili d'ambiente per i segreti.
- Performance: API leggere e reattive; possibilità di caching lato client per dati non sensibili.
- Portabilità: compatibilità con stack LAMP/LEMP e build del frontend con Vite.
- Deploy e operatività: adatto sia a hosting tradizionale sia a containerizzazione (es. Docker) per ambienti cloud.

## Struttura delle cartelle (riassunto)
La radice del progetto contiene le cartelle principali: `backend/` per il codice PHP server-side, configurazioni e middleware; `frontend/` per l'app React (Vite) con componenti e pagine; `database/` per i dump SQL e le istruzioni di import/export; `testers/` per file utili a testare le rotte (ad es. `test-routes.http`); e `vendor/` per le dipendenze PHP gestite da Composer.

## Installazione e avvio (sviluppo)
Prerequisiti: PHP 7.4+ (o versione compatibile), Composer, Node.js 14+ e un server MySQL/Postgres compatibile.

Per il backend:

- installare docker
- Clonare la [repository](https://github.com/ProfAndreaPollini/docker_lamp) per avere l'ambiente docker pronto
- Spostare i file contenuti nella cartella `backend\` nella cartella `www\` di docker_lamp e seguire i comandi presenti nella repository
- Per importare il DataBase seguire le istruzioni persenti in `database\export-import-db.md`

Per il frontend:

```bash
cd frontend
npm install
npm run dev
```

Per eseguire l'API in locale è possibile utilizzare il server built-in di PHP o configurare un virtual host verso `backend/index.php`.

## API e rotte (panoramica)
Le rotte principali esposte dalle API includono gli endpoint per l'autenticazione (`POST /auth/login` che restituisce il JWT e, se previsto, `POST /auth/register` per la registrazione), gli endpoint per la gestione dei parcheggi (`GET /parcheggi` per l'elenco con filtri e `GET /parcheggi/{id}` per i dettagli) e la creazione di prenotazioni (`POST /prenotazioni`, richiede autenticazione). Le rotte amministrative sotto `admin/*` sono protette e permettono operazioni CRUD su parcheggi e gestione utenti. Per la lista completa delle rotte e dei parametri, consultare la cartella `backend/Controller`.

## Sicurezza
L'autenticazione e l'autorizzazione si basano su JWT; i middleware verificano la validità del token e i ruoli dell'utente. Si raccomanda di non inserire segreti nel controllo di versione e di utilizzare variabili d'ambiente o file di configurazione locali non versionati per le chiavi e le credenziali.

## Note operative
Prima di utilizzare l'app in modalità completa è opportuno importare il database con gli script presenti in `database/`. Il file `testers/test-routes.http` contiene esempi di richieste per testare le API in fase di sviluppo.

## Come contribuire
Per contribuire al progetto, aprire issue per bug o proposte di funzionalità, creare una fork per la feature, implementare i cambiamenti con eventuali test e inviare una pull request per la revisione.

---

<a href="https://github.com/SteMarco07/Parcheggio">Parcheggio</a> © 2026 is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a><br/>
<img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;">

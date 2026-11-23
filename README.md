# Quaderno Rugby Test · Versione di prova

App web per allenatori: esercizi con lavagna e animazione, calendario U14/U16/U18, schemi.
Dati su Firebase (Firestore + accesso con email e password), pubblicata su GitHub Pages, installabile su iPhone.

## File
| File | A cosa serve |
|---|---|
| `index.html` | l'app |
| `firebase-config.js` | **da modificare**: la configurazione del tuo progetto Firebase |
| `sw.js` | salva l'app sul telefono, così si apre anche senza rete |
| `manifest.webmanifest` | nome e icona per l'installazione |
| `icons/` | icone (anche quella per iPhone) |
| `firestore.rules` | regole di sicurezza da incollare nella console Firebase (non serve caricarle su GitHub) |

## 1 · Firebase (una volta sola)
1. **Authentication → Metodo di accesso**: attiva **Email/password** (lascia spento «Link via email»).
2. **Firestore Database → Crea database**, in modalità produzione, posizione in Europa.
3. **Firestore → Regole**: incolla il contenuto di `firestore.rules` e premi **Pubblica**.
4. **⚙ Impostazioni progetto → Le tue app → Aggiungi app → Web** (senza Hosting). In «Configurazione SDK» scegli **Config**, copia il blocco `const firebaseConfig = { … };` e incollalo in `firebase-config.js` al posto dell'esempio.
5. **Authentication → Impostazioni → Domini autorizzati**: aggiungi `tuonome.github.io`.
6. Facoltativo: **Authentication → Impostazioni → Azioni utente**, se c'è la voce, togli «Abilita creazione (registrazione)». Anche senza, chi si registra da solo non vede i dati.

## 2 · Aggiungere o togliere un allenatore (solo console, niente codice)
**Aggiungere**
1. **Authentication → Utenti → Aggiungi utente**: email e una password provvisoria.
2. Copia il suo **UID** (colonna «UID utente», c'è l'icona per copiarlo).
3. **Firestore → Dati**: nella raccolta **`allenatori`** (la prima volta: «Avvia raccolta», ID `allenatori`) → **Aggiungi documento** → ID documento = **l'UID copiato**, aggiungi un campo `nome` (stringa) con il suo nome → Salva.
4. Mandagli link, email e password provvisoria: la cambia lui da *Dati e backup → Cambia password*.

**Il primo da aggiungere sei tu**, con il tuo account.

**Togliere**: elimina il suo documento in `allenatori` (l'accesso ai dati si blocca subito). Se vuoi, in Authentication disattiva o elimina anche l'utente.

## 3 · GitHub Pages
1. Crea un repository (es. `quaderno-rugby-test`) e carica tutti i file, con la cartella `icons`.
2. **Settings → Pages → Build and deployment**: «Deploy from a branch», ramo `main`, cartella `/ (root)` → Save.
3. Dopo un minuto l'app è su `https://tuonome.github.io/quaderno-rugby-test/`.

Quando ricarichi file nuovi, l'app si aggiorna da sola: la nuova versione si vede dalla seconda apertura.

## 4 · Su iPhone
1. Apri il link in **Safari** → Condividi → **Aggiungi alla schermata Home**.
2. Apri l'app **dalla Home** ed entra con email e password. L'accesso fatto in Safari non vale per l'app sulla Home: sono separati.
3. Dopo il primo accesso l'app si apre anche senza rete; le modifiche partono quando torna la connessione.

## 5 · Portare i tuoi esercizi dalla versione su Claude
Nella versione su Claude: *Dati e backup → Esporta backup*. Qui: *Dati e backup → Importa backup* e scegli quel file.
L'importazione non cancella nulla e può copiare anche i nomi dei tag che hai rinominato.

Tutti gli allenatori autorizzati vedono e modificano la stessa libreria, lo stesso calendario e gli stessi schemi.

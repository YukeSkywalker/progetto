//Impoto le librerie necessarie
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const fs = require("fs");


const dbPath = path.join(__dirname, 'db.json');
let notes = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Configurazione variabili ambiente per IP e PORT
const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

//  Configurazione FrontEnd (static files)
app.use(express.static(path.join(__dirname, '..' ,'client')));

// Rotta Principale 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', '..' , 'index.html'));
});

// DB JSON post
app.post("/notes", (req, res) => {
    const newNote = {
        id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1, 
        text: req.body.text,
        data: new Date().toLocaleDateString(), 
        ora: new Date().toLocaleTimeString()
    };

    notes.push(newNote);

    // SALVATAGGIO SU FILE
    fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2), 'utf-8');

    res.json(newNote);
});

//db json delete
app.delete("/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
    // Sovrascriviamo l'array locale
    notes = notes.filter(note => note.id !== id);

    // AGGIORNAMENTO DEL FILE
    fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2), 'utf-8');

    res.json({ message: "Nota eliminata con successo" });
});

//db json get
app.get("/notes", (req, res) => {
    // Leggiamo le note dal file ogni volta per garantire dati aggiornati
    const data = fs.readFileSync(dbPath, 'utf-8');
    const notes = JSON.parse(data);
    res.json(notes);
});

// -------- Rotte API ----------- 

// GET -> ottiene tutte le note
app.get("/notes", (req, res) => {
    res.json(notes);
});


// POST -> aggiunge una nota
app.post("/notes", (req, res) => {
    const newNote = {
        id: notes.length + 1,
        text: req.body.text
    };

    notes.push(newNote);

    res.json(newNote);
});


// DELETE -> elimina una nota
app.delete("/notes/:id", (req, res) => {

    const id = parseInt(req.params.id);

    notes = notes.filter(note => note.id !== id);

    res.json({
        message: "Nota eliminata"
    });
});


app.listen(PORT, () => {
    console.log(`Server disponibile su http://${IP}:${PORT}.`);
});
//Impoto le librerie necessarie
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Configurazione variabili ambiente per IP e PORT
const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

//  Configurazione FrontEnd (static files)
app.use(express.static(path.join(__dirname, 'client')));

// Rotta Principale 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});



// Leva sto DB finto 
let notes = [
    { id: 1, text: "Prima notassssss" },
    { id: 2, text: "Seconda nota e bastaaaaaasecondo" },
    { id: 3, text: "terza" }
];


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
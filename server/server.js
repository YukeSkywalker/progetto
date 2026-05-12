const express = require("express");
const cors = require("cors");

const app = express();

const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//  Static frontend
app.use(express.static(path.join(__dirname, 'client')));

let notes = [
{ id: 1, text: "Prima notassssss" },
{ id: 2, text: "Seconda nota e bastaaaaaasecondo" },
{ id: 3, text: "terza" }
];


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
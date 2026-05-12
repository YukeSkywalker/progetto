const API_URL = "http://localhost:3000&quot";


async function loadNotes() {

    const response = await fetch(API_URL + "/notes");

    const notes = await response.json();

    const list = document.getElementById("notesList");

    list.innerHTML = "";

    notes.forEach(note => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${note.text}

            <button onclick="deleteNote(${note.id})">
            Elimina
            </button>
        `;

        list.appendChild(li);
    });
}



async function addNote() {

    const input = document.getElementById("noteInput");

    const text = input.value;

    await fetch(API_URL + "/notes", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            text: text
        })

    });

    input.value = "";

    loadNotes();
}

async function deleteNote(id) {

    await fetch(API_URL + "/notes/" + id, {
        method: "DELETE"
    });

    loadNotes();
}

loadNotes();
const API_URL = "http://localhost:3000"; 

// 1. GESTIONE DATA AUTOMATICA
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateEl = document.getElementById('currentDate');
    if(dateEl) dateEl.innerText = now.toLocaleDateString('it-IT', options);
}

// 2. TEMA DARK/LIGHT
const themeBtn = document.getElementById('themeToggle');
themeBtn.onclick = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
};

// 3. AGGIUNGI NOTA
async function addNote() {
    const input = document.getElementById("noteInput");
    if(!input.value.trim()) return;

    try {
        await fetch(API_URL + "/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                text: input.value,
                date: new Date().toISOString() 
            })
        });
        input.value = "";
        alert("Nota salvata!");
        updateTotalCounter();
    } catch (e) {
        console.error("Errore invio nota", e);
    }
}

// 4. CARICA NOTE NELL'ARCHIVIO (Pagina note.html)
async function loadNotesArchive() {
    const container = document.getElementById("notesContainer");
    if(!container) return;

    try {
        const res = await fetch(API_URL + "/notes");
        const notes = await res.json();

        if(notes.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>Nessuna nota presente.</p></div>`;
            return;
        }

        container.innerHTML = "";
        notes.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordine cronologico

        notes.forEach(note => {
            const dateStr = new Date(note.date).toLocaleString('it-IT', {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'});
            const div = document.createElement("div");
            div.className = "note-item";
            div.innerHTML = `
                <div>
                    <h4>${dateStr}</h4>
                    <p>${note.text}</p>
                </div>
                <button onclick="deleteNote(${note.id})" style="background:none; border:none; color:#ff7675; cursor:pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            container.appendChild(div);
        });
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><p>Esempio: Nota di prova (Server non connesso)</p></div>`;
    }
}

// 5. ELIMINA NOTA
async function deleteNote(id) {
    if(!confirm("Eliminare la nota?")) return;
    await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
    loadNotesArchive();
    updateTotalCounter();
}

// 6. AGGIORNA CONTATORE FOOTER
async function updateTotalCounter() {
    try {
        const res = await fetch(API_URL + "/notes");
        const notes = await res.json();
        const el1 = document.getElementById("totalNotes");
        const el2 = document.getElementById("totalNotesArchive");
        if(el1) el1.innerText = notes.length;
        if(el2) el2.innerText = notes.length;
    } catch (e) { /* silent fail */ }
}

// ESECUZIONE AL CARICAMENTO
updateDate();
updateTotalCounter();
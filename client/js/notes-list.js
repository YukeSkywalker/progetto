const API_URL = "http://localhost:3000"; 

// Funzione principale per caricare le note nello storico
async function loadNotesArchive() {
    const container = document.getElementById("notesContainer");
    if (!container) return;

    // Mostriamo un caricamento testuale (opzionale)
    container.innerHTML = "<p style='text-align:center; opacity:0.5;'>Caricamento archivio...</p>";

    try {
        const response = await fetch(API_URL + "/notes");
        const notes = await response.json();

        // 1. Gestione caso archivio vuoto
        if (notes.length === 0) {
            showEmptyState();
            return;
        }

        // 2. Pulizia contenitore
        container.innerHTML = "";

        // 3. Ordinamento: le più recenti in alto (ordine decrescente)
        notes.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 4. Generazione delle card per ogni nota
        notes.forEach(note => {
            // Formattazione data italiana (es: 12 mag, 21:30)
            const dateObj = new Date(note.date);
            const formattedDate = dateObj.toLocaleString('it-IT', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });

            const noteItem = document.createElement("div");
            noteItem.className = "note-item"; // Classe definita nel CSS
            noteItem.innerHTML = `
                <div class="note-content">
                    <h4>${formattedDate}</h4>
                    <p id="text-${note.id}">${note.text}</p>
                </div>
                <div class="note-actions">
                    <button onclick="deleteNote(${note.id})" class="btn-delete" title="Elimina nota">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(noteItem);
        });

    } catch (error) {
        console.error("Errore nel recupero note:", error);
        showEmptyState(); // Mostra il box di esempio/errore se il server è offline
    }
}

// Funzione per mostrare il box "Vuoto" o di Errore
function showEmptyState() {
    const container = document.getElementById("notesContainer");
    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 15px; color: var(--accent);"></i>
            <p>Non ci sono note salvate o il server è offline.<br>
            Torna in Dashboard per crearne una!</p>
        </div>
    `;
}

// Funzione per eliminare una nota dallo storico
async function deleteNote(id) {
    if (!confirm("Sei sicuro di voler eliminare definitivamente questa nota?")) return;

    try {
        await fetch(`${API_URL}/notes/${id}`, {
            method: "DELETE"
        });
        
        // Ricarichiamo la lista e aggiorniamo il contatore globale
        loadNotesArchive();
        if (typeof updateTotalCounter === "function") {
            updateTotalCounter();
        }
    } catch (error) {
        alert("Errore durante l'eliminazione");
    }
}

// Inizializzazione al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    loadNotesArchive();
});
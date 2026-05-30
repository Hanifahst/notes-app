const API = "http://localhost:5000/api";

function register() {
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      username: username.value,
      email: email.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    window.location.href = "login.html";
  });
}

function login() {
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if(data.token){
      localStorage.setItem("token", data.token);
      alert("Login berhasil");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  });
}

function addNote() {
  const noteInput = document.getElementById("note");

   if (!noteInput.value.trim()) {
    alert("Catatan tidak boleh kosong");
    return;
  }

  fetch(`${API}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      text: noteInput.value
    })
  })
  .then(res => res.json())
  .then(() => {
    noteInput.value = "";
    loadNotes();
  });
}

function loadNotes() {
  fetch(`${API}/notes`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {
    const noteCount = document.getElementById("noteCount");
    
    if (noteCount) {
        noteCount.textContent = `${data.length} Notes`;
    }

    const list = document.getElementById("list");
    list.innerHTML = "";

    if (data.length === 0) {
        list.innerHTML = `
        <div class="empty">
          <div class="empty-icon">^. .^₎⟆</div>
          <p>Belum ada catatan</p>
          <small>Tulis sesuatu untuk memulai</small>
        </div>
        `;
        return;
    }

    data.forEach(n => {
        list.innerHTML += `
        <li>
        <span class="note-text">𖹭 ${n.text}</span>
        
        <div class="actions">
        <button onclick="editNote(${n.id}, \`${n.text}\`)">✎</button>
        <button onclick="deleteNote(${n.id})">✖</button>
        </div>
        </li>
        `;
    });
  });
}

function searchNotes() {
  const keyword = document.getElementById("search").value.trim();

  if (!keyword) {
    loadNotes();
    return;
  }

  fetch(`${API}/notes/search/${encodeURIComponent(keyword)}`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("list");
    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML = `
        <div class="empty">
          <div class="empty-icon">🔍︎</div>
          <p>Catatan tidak ditemukan</p>
          <small>Coba kata kunci lain</small>
        </div>
      `;
      return;
    }

    data.forEach(n => {
      list.innerHTML += `
        <li>
          <span class="note-text">𖹭 ${n.text}</span>

          <div class="actions">
            <button onclick="editNote(${n.id}, \`${n.text}\`)">✎</button>
            <button onclick="deleteNote(${n.id})">✖</button>
          </div>
        </li>
      `;
    });
  });
}

window.onload = function () {
  if (document.title === "Notes") {
    loadNotes();
  }
};

function deleteNote(id) {
  fetch(`${API}/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(() => {
    loadNotes();
  });
}

function editNote(id, oldText) {
  const newText = prompt("Edit catatan:", oldText);

  if (!newText) return;

  fetch(`${API}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      text: newText
    })
  })
  .then(res => res.json())
  .then(() => {
    loadNotes();
  });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
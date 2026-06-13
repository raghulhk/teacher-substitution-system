const API = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

async function loadTeachers() {
  const response = await fetch(`${API}/api/teachers`);
  const teachers = await response.json();

  const table = document.getElementById("teacherTable");
  table.innerHTML = "";

  teachers.forEach((teacher) => {
    table.innerHTML += `
      <tr>
        <td>${teacher.id}</td>
        <td>${teacher.name}</td>
        <td>${teacher.department || ""}</td>
        <td>${teacher.subject || ""}</td>
        <td>${teacher.email || ""}</td>
        <td>${teacher.phone || ""}</td>
        <td>
          <button class="delete-btn" onclick="deleteTeacher(${teacher.id})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

async function addTeacher() {
  const teacher = {
    name: document.getElementById("name").value,
    department: document.getElementById("department").value,
    subject: document.getElementById("subject").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  const response = await fetch(`${API}/api/teachers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(teacher),
  });

  const data = await response.json();
  const message = document.getElementById("message");

  if (response.ok) {
    message.style.color = "green";
    message.innerText = data.message;

    document.getElementById("name").value = "";
    document.getElementById("department").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";

    loadTeachers();
  } else {
    message.style.color = "red";
    message.innerText = data.message;
  }
}

async function deleteTeacher(id) {
  const confirmDelete = confirm("Are you sure you want to delete this teacher?");

  if (!confirmDelete) return;

  const response = await fetch(`${API}/api/teachers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  alert(data.message);

  loadTeachers();
}

loadTeachers();
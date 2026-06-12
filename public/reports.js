const API = "http://localhost:3000";

if (!localStorage.getItem("token")) {
  window.location.href = "/";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

async function loadReports() {
  const response = await fetch(`${API}/api/substitution`);
  const data = await response.json();

  const table = document.getElementById("reportTable");
  table.innerHTML = "";

  data.forEach((item) => {
    table.innerHTML += `
      <tr>
        <td>${item.date}</td>
        <td>${item.day}</td>
        <td>${item.period}</td>
        <td>${item.class_name}</td>
        <td>${item.absent_teacher_name}</td>
        <td>${item.substitute_teacher_name}</td>
        <td>${item.status}</td>
      </tr>
    `;
  });
}

loadReports();
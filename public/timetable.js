const API = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

async function loadTeachers() {

  const response =
    await fetch(`${API}/api/teachers`);

  const teachers =
    await response.json();

  const select =
    document.getElementById("teacherSelect");

  select.innerHTML = "";

  teachers.forEach((teacher) => {

    select.innerHTML += `
      <option value="${teacher.id}">
        ${teacher.name}
      </option>
    `;

  });
}

async function loadTimetable() {

  const response =
    await fetch(`${API}/api/timetable`);

  const timetable =
    await response.json();

  const table =
    document.getElementById("timetableTable");

  table.innerHTML = "";

  timetable.forEach((entry) => {

    table.innerHTML += `
      <tr>
        <td>${entry.teacher_name}</td>
        <td>${entry.day}</td>
        <td>${entry.period}</td>
        <td>${entry.class_name}</td>
        <td>${entry.subject}</td>
      </tr>
    `;

  });
}

async function addTimetable() {

  const data = {
    teacher_id:
      document.getElementById("teacherSelect").value,

    day:
      document.getElementById("day").value,

    period:
      document.getElementById("period").value,

    class_name:
      document.getElementById("className").value,

    subject:
      document.getElementById("subject").value,
  };

  const response = await fetch(
    `${API}/api/timetable`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data),
    }
  );

  const result =
    await response.json();

  const message =
    document.getElementById("message");

  if (response.ok) {

    message.style.color = "green";
    message.innerText = result.message;

    loadTimetable();

  } else {

    message.style.color = "red";
    message.innerText = result.message;

  }
}

loadTeachers();
loadTimetable();
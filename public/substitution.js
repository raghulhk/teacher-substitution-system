const API = "http://localhost:3000";

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

async function loadSubstitutions() {

  const response =
    await fetch(`${API}/api/substitution`);

  const data =
    await response.json();

  const table =
    document.getElementById("substitutionTable");

  table.innerHTML = "";

  data.forEach((sub) => {

    table.innerHTML += `
      <tr>
        <td>${sub.date}</td>
        <td>${sub.absent_teacher_name}</td>
        <td>${sub.substitute_teacher_name}</td>
        <td>${sub.class_name}</td>
        <td>${sub.period}</td>
        <td>${sub.status}</td>
      </tr>
    `;

  });
}

async function assignSubstitute() {

  const body = {

    absent_teacher_id:
      document.getElementById("teacherSelect").value,

    date:
      document.getElementById("date").value,

    day:
      document.getElementById("day").value,

    period:
      document.getElementById("period").value,
  };

  const response = await fetch(
    `${API}/api/substitution/assign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const result =
    await response.json();

  const message =
    document.getElementById("message");

  if (response.ok) {

    message.style.color = "green";

    message.innerHTML = `
      Substitute Assigned:<br>
      ${result.substitute_teacher}
    `;

    loadSubstitutions();

  } else {

    message.style.color = "red";
    message.innerText = result.message;

  }
}

loadTeachers();
loadSubstitutions();
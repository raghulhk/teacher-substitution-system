const API_BASE_URL = window.location.origin;

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  message.className = "login-message";

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    message.className = "login-message success";
    message.innerText = "Login successful";

    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 1000);
  } else {
    message.className = "login-message error";
    message.innerText = data.message;
  }
}
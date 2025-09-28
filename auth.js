// auth.js

document.addEventListener("DOMContentLoaded", () => {
  // — Tab buttons & panels
  const [loginTab, registerTab] = document.querySelectorAll(".auth-tabs .tab-btn");
  const loginPanel = document.getElementById("login-form");
  const registerPanel = document.getElementById("register-form");

  function showLogin() {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginPanel.style.display = "block";
    registerPanel.style.display = "none";
  }
  function showRegister() {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerPanel.style.display = "block";
    loginPanel.style.display = "none";
  }
  // expose for your inline onclicks
  window.showLogin = showLogin;
  window.showRegister = showRegister;
  showLogin(); // default view

  // — Login elements
  const loginEmail = loginPanel.querySelector('input[type="email"]');
  const loginPassword = loginPanel.querySelector('input[type="password"]');
  const rememberMeChk = loginPanel.querySelector('input[type="checkbox"]');
  const loginBtn = loginPanel.querySelector(".btn-primary");
  const forgotLink = loginPanel.querySelector("a");

  // — Register elements
  const regNameInput = registerPanel.querySelector('input[type="text"]');
  const regEmailInput = registerPanel.querySelector('input[type="email"]');
  const regPassword = registerPanel.querySelector('input[type="password"]');
  const registerBtn = registerPanel.querySelector(".btn-primary");

  // — Social buttons
  const googleBtn = document.querySelector(".google-btn");
  const facebookBtn = document.querySelector(".facebook-btn");

  // — Helpers for storing users
  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
  }
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // — Registration flow
  registerBtn.addEventListener("click", e => {
    e.preventDefault();
    const name = regNameInput.value.trim();
    const email = regEmailInput.value.trim().toLowerCase();
    const pw = regPassword.value;
    if (!name || !email || !pw) {
      alert("Please fill out all fields.");
      return;
    }
    const users = getUsers();
    if (users[email]) {
      alert("That email is already registered.");
      return;
    }
    users[email] = { name, password: pw };
    saveUsers(users);
    alert("Registration successful! Please log in.");
    showLogin();
  });

  // — Login flow
  loginBtn.addEventListener("click", e => {
    e.preventDefault();
    const email = loginEmail.value.trim().toLowerCase();
    const pw = loginPassword.value;
    const users = getUsers();
    if (users[email] && users[email].password === pw) {
      // persist session if requested
      if (rememberMeChk.checked) {
        localStorage.setItem("sessionUser", email);
      }
      sessionStorage.setItem("currentUser", email);
      alert("Login successful!");
      window.location.href = "index.html";  // or your dashboard
    } else {
      alert("Invalid email or password.");
    }
  });

  // — Forgot password (stub)
  forgotLink.addEventListener("click", e => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    if (!email) {
      alert("Enter your email to reset your password.");
    } else {
      alert(`Password reset link sent to ${email} (stub).`);
    }
  });

  // — Social login stubs
  googleBtn.addEventListener("click", () => {
    alert("Google login not implemented yet.");
  });
  facebookBtn.addEventListener("click", () => {
    alert("Facebook login not implemented yet.");
  });

  // — Auto‑login if “Remember me” was checked
  const remembered = localStorage.getItem("sessionUser");
  if (remembered) {
    sessionStorage.setItem("currentUser", remembered);
    window.location.href = "index.html";
  }
});

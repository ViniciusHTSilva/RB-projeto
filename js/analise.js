function logAccessOnce() {
  const pageKey = "access_logged_" + window.location.pathname;

  // Se já registrou essa página, não faz nada
  if (sessionStorage.getItem(pageKey)) return;
  sessionStorage.setItem(pageKey, "true");

  fetch("http://127.0.0.1:5000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    }),
  })
    .then((res) => res.json())
    .then((res) => console.log("✅ Acesso registrado:", res))
    .catch((err) => console.error("❌ Erro ao registrar acesso:", err));
}

// Chame apenas quando o usuário clicar ou entrar na página
document.addEventListener("DOMContentLoaded", logAccessOnce);

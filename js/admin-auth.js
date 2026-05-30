function adminToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = `${message}: authentication placeholder only.`;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-admin-action]");
  if (action) adminToast(action.dataset.adminAction);
});

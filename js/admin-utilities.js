const adminUtilityEsc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));

function adminUtilityToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

async function getUtilitiesData() {
  const response = await fetch("data/utilities.json");
  return response.json();
}

function adminAssetCard(asset, mode = "admin") {
  const actions = mode === "maintenance"
    ? `<div class="modal-actions"><button data-utility-action="Schedule ${adminUtilityEsc(asset.id)}">Schedule</button><button data-utility-action="Assign vendor ${adminUtilityEsc(asset.id)}">Assign Vendor</button><button data-utility-action="Upload proof ${adminUtilityEsc(asset.id)}">Upload Proof</button></div>`
    : `<div class="modal-actions"><button data-utility-action="Edit ${adminUtilityEsc(asset.id)}">Edit</button><button data-utility-action="Upload bill ${adminUtilityEsc(asset.id)}">Upload Bill</button><button data-utility-action="Archive ${adminUtilityEsc(asset.id)}">Archive</button></div>`;
  return `
    <article class="asset-card ${adminUtilityEsc(asset.theme)}">
      <div class="card-top"><span class="asset-icon">${adminUtilityEsc(asset.icon)}</span><span class="status-badge">${adminUtilityEsc(asset.status)}</span></div>
      <h3>${adminUtilityEsc(asset.id)}: ${adminUtilityEsc(asset.name)}</h3>
      <p>${adminUtilityEsc(asset.category)} / ${adminUtilityEsc(asset.vendor)} / ${adminUtilityEsc(asset.location || asset.cameraLocation || "")}</p>
      <div class="badge-row"><span class="mini-badge">Last ${adminUtilityEsc(asset.lastServiceDate || asset.lastMaintenance || "N/A")}</span><span class="mini-badge">Next ${adminUtilityEsc(asset.nextServiceDate || "Schedule")}</span></div>
      ${actions}
    </article>
  `;
}

function setupAdminFilters(data) {
  const categories = document.getElementById("adminCategoryFilter");
  const statuses = document.getElementById("adminStatusFilter");
  if (categories) categories.innerHTML += [...new Set(data.assets.map((asset) => asset.category))].sort().map((item) => `<option>${adminUtilityEsc(item)}</option>`).join("");
  if (statuses) statuses.innerHTML += [...new Set(data.assets.map((asset) => asset.status))].sort().map((item) => `<option>${adminUtilityEsc(item)}</option>`).join("");
}

function setupForm(data) {
  const category = document.getElementById("formCategory");
  const status = document.getElementById("formStatus");
  if (category) category.innerHTML = data.categories.map((item) => `<option>${adminUtilityEsc(item)}</option>`).join("");
  if (status) status.innerHTML = data.statuses.map((item) => `<option>${adminUtilityEsc(item)}</option>`).join("");
  const form = document.getElementById("utilityForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      adminUtilityToast("Utility asset save placeholder. Backend login/storage will be connected later.");
      form.reset();
    });
  }
}

function renderAdmin(data) {
  const target = document.getElementById("adminUtilityCards");
  if (target) target.innerHTML = data.assets.map((asset) => adminAssetCard(asset)).join("");
}

function renderRegister(data) {
  const target = document.getElementById("utilityAssetRegister");
  if (target) target.innerHTML = data.assets.map((asset) => adminAssetCard(asset, "register")).join("");
}

function renderMaintenance(data) {
  const target = document.getElementById("utilityMaintenanceBoard");
  if (target) target.innerHTML = data.assets.map((asset) => adminAssetCard(asset, "maintenance")).join("");
}

async function initAdminUtilities() {
  const data = await getUtilitiesData();
  setupAdminFilters(data);
  setupForm(data);
  renderAdmin(data);
  renderRegister(data);
  renderMaintenance(data);
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-utility-action]");
    if (action) adminUtilityToast(`${action.dataset.utilityAction}: placeholder only.`);
  });
}

initAdminUtilities().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="notice-strip">Unable to load utilities: ${adminUtilityEsc(error.message)}</div>`);
});

const state = { data: null, search: "", category: "all", status: "all", vendor: "all" };
const byId = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function options(values, label) {
  return [`<option value="all">${label}</option>`, ...values.map((value) => `<option>${esc(value)}</option>`)].join("");
}

function toast(message) {
  const target = byId("toast");
  target.textContent = message;
  target.classList.add("show");
  setTimeout(() => target.classList.remove("show"), 2200);
}

function filteredAssets() {
  return state.data.assets.filter((asset) => {
    const text = JSON.stringify(asset).toLowerCase();
    return (!state.search || text.includes(state.search))
      && (state.category === "all" || asset.category === state.category)
      && (state.status === "all" || asset.status === state.status)
      && (state.vendor === "all" || asset.vendor === state.vendor);
  });
}

function renderFilters() {
  const assets = state.data.assets;
  byId("categoryFilter").innerHTML = options(unique(assets.map((asset) => asset.category)), "All Categories");
  byId("statusFilter").innerHTML = options(unique(assets.map((asset) => asset.status)), "All Statuses");
  byId("vendorFilter").innerHTML = options(unique(assets.map((asset) => asset.vendor)), "All Vendors");
}

function renderSummary() {
  const assets = state.data.assets;
  const count = (category) => assets.filter((asset) => asset.category.includes(category)).length;
  const rows = [
    ["Water Assets", count("Water"), "water"],
    ["Electricity Assets", count("Electricity"), "electricity"],
    ["Street Lights", count("Street"), "street"],
    ["CCTV Cameras", count("CCTV"), "cctv"],
    ["Sewage Systems", count("Sewage"), "sewage"],
    ["Waste Routes", count("Waste"), "waste"]
  ];
  byId("summaryCards").innerHTML = rows.map(([label, value, theme]) => `<article class="summary-card ${theme}"><strong>${esc(label)}</strong><span>${esc(value)}</span></article>`).join("");
}

function renderAssets() {
  const rows = filteredAssets();
  byId("assetCount").textContent = `${rows.length} assets`;
  byId("assetCards").innerHTML = rows.map((asset) => `
    <article class="asset-card ${esc(asset.theme)}">
      <div class="card-top"><span class="asset-icon">${esc(asset.icon)}</span><span class="status-badge">${esc(asset.status)}</span></div>
      <h3>${esc(asset.name)}</h3>
      <p>${esc(asset.publicSummary)}</p>
      <div class="badge-row">
        <span class="mini-badge">${esc(asset.category)}</span>
        <span class="mini-badge">${esc(asset.vendor)}</span>
        <span class="mini-badge">${esc(asset.lastUpdated)}</span>
      </div>
      <button class="details-button" data-asset-id="${esc(asset.id)}">View Details</button>
    </article>
  `).join("");
}

function renderReports() {
  const max = Math.max(...state.data.reports.map((report) => Number(String(report.value).replace(/\D/g, "")) || 4), 1);
  byId("reportBars").innerHTML = state.data.reports.map((report) => {
    const value = Number(String(report.value).replace(/\D/g, "")) || 4;
    return `<div class="bar-row ${esc(report.theme)}"><span>${esc(report.name)}</span><i><b style="width:${Math.min(100, (value / max) * 100)}%"></b></i><strong>${esc(report.value)}</strong></div>`;
  }).join("");
}

function renderSubmersibles() {
  byId("submersibleSummary").innerHTML = state.data.privateSubmersibleSummary.map((row) => `<div><strong>${esc(row.installedCount)}</strong><span>Block ${esc(row.block)}</span><p>${esc(row.publicNote)}</p></div>`).join("");
}

function renderRequests() {
  byId("requestChips").innerHTML = state.data.residentRequests.map((request) => `<a href="complaints.html">${esc(request)}</a>`).join("");
}

function list(title, rows) {
  return `<div class="detail-panel"><h3>${esc(title)}</h3><ul>${(rows || ["No records"]).map((row) => `<li>${esc(row)}</li>`).join("")}</ul></div>`;
}

function openAsset(id) {
  const asset = state.data.assets.find((item) => item.id === id);
  byId("modalContent").innerHTML = `
    <div class="modal-body ${esc(asset.theme)}">
      <div class="modal-hero"><p class="eyebrow">${esc(asset.category)}</p><h2 id="modalTitle">${esc(asset.name)}</h2><p>${esc(asset.publicSummary)}</p></div>
      <div class="detail-grid">
        <div><strong>Asset ID</strong><br>${esc(asset.id || asset.assetId)}</div>
        <div><strong>Type</strong><br>${esc(asset.type)}</div>
        <div><strong>Status</strong><br>${esc(asset.status)}</div>
        <div><strong>Vendor</strong><br>${esc(asset.vendor)}</div>
        <div><strong>Location</strong><br>${esc(asset.location || asset.cameraLocation || asset.drainageLine)}</div>
        <div><strong>Next Service</strong><br>${esc(asset.nextServiceDate || "To be scheduled")}</div>
      </div>
      ${list("Complete History", asset.serviceHistory)}
      ${list("Maintenance Records", asset.complaintHistory || asset.relatedComplaints)}
      ${list("Repair / Expense History", asset.expenseHistory)}
      ${list("Uploaded Documents", asset.documents)}
      ${list("Photos", asset.photos)}
      <div class="detail-panel"><h3>Private/Admin Details</h3><p>Full meter values, private house utility records, owner details, uploaded bills and admin remarks require future login-based access.</p></div>
      <div class="modal-actions"><button data-action="Schedule maintenance">Schedule Maintenance</button><button data-action="Assign vendor">Assign Vendor</button><button data-action="Raise utility complaint">Raise Complaint</button></div>
    </div>`;
  const modal = byId("assetModal");
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function setupEvents() {
  byId("lastUpdated").textContent = `Updated ${state.data.lastUpdated}`;
  const map = { searchInput: "search", categoryFilter: "category", statusFilter: "status", vendorFilter: "vendor" };
  Object.keys(map).forEach((id) => {
    byId(id).addEventListener(id === "searchInput" ? "input" : "change", (event) => {
      state[map[id]] = id === "searchInput" ? event.target.value.trim().toLowerCase() : event.target.value;
      renderAssets();
    });
  });
  byId("assetCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-asset-id]");
    if (button) openAsset(button.dataset.assetId);
  });
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action) toast(`${action.dataset.action}: placeholder only.`);
  });
  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ibpUtilityTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("ibpUtilityTheme") === "dark") document.body.classList.add("dark");
}

async function init() {
  const response = await fetch("data/utilities.json");
  state.data = await response.json();
  renderFilters();
  setupEvents();
  renderSummary();
  renderAssets();
  renderReports();
  renderSubmersibles();
  renderRequests();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="notice-strip">Unable to load utilities: ${esc(error.message)}</div>`);
});

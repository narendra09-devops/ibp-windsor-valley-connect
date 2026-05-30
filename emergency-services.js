const state = {
  services: [],
  search: "",
  category: "all"
};

const byId = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

function firstPhone(value) {
  const match = String(value || "").match(/[0-9]{3,}/);
  return match ? match[0] : "";
}

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function filteredServices() {
  const term = state.search.toLowerCase();
  return state.services.filter((service) => {
    const categoryOk = state.category === "all" || service.category === state.category;
    const searchOk = !term || JSON.stringify(service).toLowerCase().includes(term);
    return categoryOk && searchOk;
  });
}

function renderCategories() {
  const select = byId("categoryFilter");
  const categories = [...new Set(state.services.map((service) => service.category))].sort();
  select.innerHTML = [
    "<option value=\"all\">All Categories</option>",
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join("");
}

function serviceCard(service, index) {
  return `
    <article class="service-card ${escapeHtml(service.theme)}" style="animation-delay:${index * 25}ms">
      <div class="card-top">
        <span class="service-icon" aria-hidden="true">${escapeHtml(service.icon)}</span>
        <span class="category-pill">${escapeHtml(service.category)}</span>
      </div>
      <h3>${escapeHtml(service.name)}</h3>
      <p>${escapeHtml(service.description)}</p>
      <div class="card-meta">
        <span><strong>Status</strong>${escapeHtml(service.status)}</span>
        <span><strong>Number</strong>${escapeHtml(service.number)}</span>
      </div>
      <div class="card-footer">
        <span class="status-pill">${escapeHtml(service.coverage)}</span>
      </div>
      <button class="details-button" type="button" data-service-id="${escapeHtml(service.id)}">View Details</button>
    </article>
  `;
}

function renderServices() {
  const services = filteredServices();
  byId("resultCount").textContent = `${services.length} services`;
  byId("serviceGrid").innerHTML = services.length
    ? services.map(serviceCard).join("")
    : "<div class=\"empty-state\">No services match the current search or category.</div>";
}

function modalActionButtons(service) {
  const phone = firstPhone(service.number);
  const callButton = phone
    ? `<a href="tel:${phone}">Call Placeholder</a>`
    : "<button type=\"button\" data-quick=\"Call Placeholder\">Call Placeholder</button>";
  return `
    <div class="modal-actions">
      <a href="${escapeHtml(service.website)}" target="_blank" rel="noreferrer">Website Link</a>
      ${callButton}
      <button type="button" data-quick="Directions for ${escapeHtml(service.name)}">Directions / Map</button>
      <button type="button" data-quick="Raise Complaint">Raise Complaint</button>
      <button type="button" data-quick="Contact Support">Contact Support</button>
    </div>
  `;
}

function openDetails(serviceId) {
  const service = state.services.find((item) => item.id === serviceId);
  if (!service) return;
  const modal = byId("serviceModal");
  const accent = `var(--${service.theme})`;
  byId("modalContent").innerHTML = `
    <div class="modal-body service-card ${escapeHtml(service.theme)}">
      <div class="modal-hero" style="background:${accent}">
        <p class="eyebrow">${escapeHtml(service.category)}</p>
        <h2 id="modalTitle">${escapeHtml(service.name)}</h2>
        <p>${escapeHtml(service.fullDescription)}</p>
      </div>
      <div class="modal-grid">
        <div><span>Status</span>${escapeHtml(service.status)}</div>
        <div><span>Emergency Number</span>${escapeHtml(service.number)}</div>
        <div><span>Address</span>${escapeHtml(service.address)}</div>
        <div><span>Service Coverage</span>${escapeHtml(service.coverage)}</div>
        <div><span>Website</span>${escapeHtml(service.website)}</div>
        <div><span>Map Placeholder</span>${escapeHtml(service.map)}</div>
        <div><span>Last Updated</span>${escapeHtml(state.lastUpdated || "30 May 2026")}</div>
      </div>
      <div class="services-list">
        <strong>Available Services</strong>
        <ul>${service.servicesOffered.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      ${modalActionButtons(service)}
    </div>
  `;
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function setupEvents() {
  byId("serviceSearch").addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    renderServices();
  });

  byId("categoryFilter").addEventListener("change", (event) => {
    state.category = event.target.value;
    renderServices();
  });

  byId("serviceGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-service-id]");
    if (button) openDetails(button.dataset.serviceId);
  });

  document.addEventListener("click", (event) => {
    const quick = event.target.closest("[data-quick]");
    if (quick) showToast(`${quick.dataset.quick}: request placeholder saved for future login workflow.`);
  });

  byId("floatingHelp").addEventListener("click", () => {
    byId("serviceSearch").value = "Emergency";
    state.search = "Emergency";
    state.category = "all";
    byId("categoryFilter").value = "all";
    renderServices();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Emergency services filtered.");
  });

  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ibpEmergencyTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  if (localStorage.getItem("ibpEmergencyTheme") === "dark") {
    document.body.classList.add("dark");
  }
}

async function init() {
  const response = await fetch("emergency-services.json");
  const data = await response.json();
  state.lastUpdated = data.lastUpdated;
  state.services = data.services;
  renderCategories();
  renderServices();
  setupEvents();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="empty-state">Unable to load emergency services: ${escapeHtml(error.message)}</div>`);
});

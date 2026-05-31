const state = {
  data: null,
  search: "",
  category: "all",
  access: "Public",
  status: "all",
  fileType: "all",
  year: "all"
};

const byId = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
})[char]);

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function unique(values) {
  return [...new Set(values)].sort();
}

function optionList(values, allLabel) {
  return [`<option value="all">${allLabel}</option>`, ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)].join("");
}

function publicDocuments() {
  return state.data.documents.filter((doc) => doc.public && doc.access === "Public");
}

function filteredDocuments() {
  return publicDocuments().filter((doc) => {
    const text = JSON.stringify(doc).toLowerCase();
    return (!state.search || text.includes(state.search)) &&
      (state.category === "all" || doc.category === state.category) &&
      (state.access === "all" || doc.access === state.access) &&
      (state.status === "all" || doc.status === state.status) &&
      (state.fileType === "all" || doc.fileType === state.fileType) &&
      (state.year === "all" || doc.lastUpdated.startsWith(state.year));
  });
}

function fillFilters() {
  const docs = publicDocuments();
  byId("categoryFilter").innerHTML = optionList(unique(docs.map((doc) => doc.category)), "All Categories");
  byId("accessFilter").innerHTML = `<option value="Public">Public Documents</option><option value="all">All Public Access Types</option>`;
  byId("statusFilter").innerHTML = optionList(unique(docs.map((doc) => doc.status)), "All Statuses");
  byId("fileTypeFilter").innerHTML = optionList(unique(docs.map((doc) => doc.fileType)), "All File Types");
  byId("yearFilter").innerHTML = optionList(unique(docs.map((doc) => doc.lastUpdated.slice(0, 4))), "All Years");
}

function renderSummary() {
  const allDocs = state.data.documents;
  const rows = [
    ["Total Documents", allDocs.length, "registration"],
    ["Public Documents", allDocs.filter((d) => d.access === "Public").length, "public"],
    ["Restricted Documents", allDocs.filter((d) => d.access !== "Public").length, "restricted"],
    ["Governance Documents", allDocs.filter((d) => ["Bylaws", "MOA"].includes(d.category)).length, "governance"],
    ["Meeting Records", allDocs.filter((d) => d.theme === "meeting").length, "meeting"],
    ["Bills/Invoices", allDocs.filter((d) => d.category.includes("Bills") || d.category.includes("Invoices")).length, "accounts"],
    ["Renewal Required", allDocs.filter((d) => d.status === "Expired" || d.renewalDate).length, "legal"]
  ];
  byId("summaryCards").innerHTML = rows.map(([label, value, theme]) => `
    <article class="summary-card ${theme}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></article>
  `).join("");
}

function renderDocuments() {
  const docs = filteredDocuments();
  byId("documentCount").textContent = `${docs.length} public documents`;
  byId("documentCards").innerHTML = docs.map((doc) => `
    <article class="document-card ${escapeHtml(doc.theme)}">
      <div class="card-top">
        <span class="doc-icon">${escapeHtml(doc.icon)}</span>
        <span class="status-badge">${escapeHtml(doc.status)}</span>
      </div>
      <h3>${escapeHtml(doc.title)}</h3>
      <p>${escapeHtml(doc.description)}</p>
      <div class="doc-meta">
        <span><strong>${escapeHtml(doc.category)}</strong>Category</span>
        <span><strong>${escapeHtml(doc.access)}</strong>Access</span>
        <span><strong>${escapeHtml(doc.lastUpdated)}</strong>Updated</span>
      </div>
      <div class="badge-row">
        <span class="mini-badge ok">${escapeHtml(doc.fileType)}</span>
        <span class="mini-badge ok">Version ${escapeHtml(doc.version)}</span>
      </div>
      <button class="details-button" type="button" data-document-id="${escapeHtml(doc.id)}">View Details</button>
      <a class="download-button" href="${escapeHtml(doc.downloadUrl)}" target="_blank" rel="noreferrer">Download</a>
    </article>
  `).join("") || "<article class=\"document-card\"><h3>No public documents found</h3><p>Try another filter.</p></article>";
}

function listItems(items) {
  return items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>No related documents.</p>";
}

function openDocument(documentId) {
  const doc = state.data.documents.find((item) => item.id === documentId);
  if (!doc) return;
  const canDownload = doc.public && doc.access === "Public" && doc.downloadUrl;
  byId("modalContent").innerHTML = `
    <div class="modal-body ${escapeHtml(doc.theme)}">
      <div class="modal-hero">
        <p class="eyebrow">${escapeHtml(doc.category)}</p>
        <h2 id="modalTitle">${escapeHtml(doc.title)}</h2>
        <p>${escapeHtml(doc.description)}</p>
      </div>
      <div class="detail-grid">
        <div><strong>Access Level</strong><br>${escapeHtml(doc.access)}</div>
        <div><strong>Uploaded Date</strong><br>${escapeHtml(doc.uploadedDate)}</div>
        <div><strong>Last Updated</strong><br>${escapeHtml(doc.lastUpdated)}</div>
        <div><strong>Uploaded By</strong><br>${escapeHtml(doc.uploadedBy)}</div>
        <div><strong>File Type</strong><br>${escapeHtml(doc.fileType)}</div>
        <div><strong>File Size</strong><br>${escapeHtml(doc.fileSize)}</div>
        <div><strong>Version</strong><br>${escapeHtml(doc.version)}</div>
        <div><strong>Valid Till</strong><br>${escapeHtml(doc.validTill || "Not applicable")}</div>
        <div><strong>Renewal Date</strong><br>${escapeHtml(doc.renewalDate || "Not applicable")}</div>
      </div>
      <div class="detail-panel"><h3>Preview</h3><div class="preview-box">${escapeHtml(doc.preview)}</div></div>
      <div class="detail-panel"><h3>Related Documents</h3>${listItems(doc.related)}</div>
      <div class="detail-panel"><h3>Access Message</h3><p>${canDownload ? "This is a public document and can be downloaded." : "Restricted/private document. Public download is not available."}</p></div>
      <div class="modal-actions">
        ${canDownload ? `<a href="${escapeHtml(doc.downloadUrl)}" target="_blank" rel="noreferrer">Download Document</a>` : "<button type=\"button\" data-action=\"Restricted document access\">Restricted Document</button>"}
        <button type="button" data-action="Print document summary">Print Summary</button>
      </div>
    </div>
  `;
  const modal = byId("documentModal");
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function setupEvents() {
  byId("lastUpdated").textContent = `Updated ${state.data.lastUpdated}`;
  byId("searchInput").addEventListener("input", (event) => { state.search = event.target.value.trim().toLowerCase(); renderDocuments(); });
  byId("categoryFilter").addEventListener("change", (event) => { state.category = event.target.value; renderDocuments(); });
  byId("accessFilter").addEventListener("change", (event) => { state.access = event.target.value; renderDocuments(); });
  byId("statusFilter").addEventListener("change", (event) => { state.status = event.target.value; renderDocuments(); });
  byId("fileTypeFilter").addEventListener("change", (event) => { state.fileType = event.target.value; renderDocuments(); });
  byId("yearFilter").addEventListener("change", (event) => { state.year = event.target.value; renderDocuments(); });
  byId("documentCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-document-id]");
    if (button) openDocument(button.dataset.documentId);
  });
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action) showToast(`${action.dataset.action}: placeholder for future secure document workflow.`);
  });
  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ibpDocumentTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("ibpDocumentTheme") === "dark") document.body.classList.add("dark");
}

async function init() {
  const response = await fetch("data/documents.json");
  state.data = await response.json();
  fillFilters();
  setupEvents();
  renderSummary();
  renderDocuments();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="access-strip">Unable to load documents: ${escapeHtml(error.message)}</div>`);
});

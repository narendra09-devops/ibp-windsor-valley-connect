const state = {
  data: null,
  search: "",
  category: "all",
  priority: "all",
  status: "all",
  block: "all",
  dateRange: "all"
};

const byId = (id) => document.getElementById(id);
const today = new Date("2026-05-31T00:00:00");
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

function publicNotices() {
  return state.data.notices.filter((notice) => notice.published && !["Draft", "Unpublished"].includes(notice.status));
}

function filteredNotices() {
  return publicNotices().filter((notice) => {
    const text = JSON.stringify(notice).toLowerCase();
    const expired = new Date(`${notice.expiryDate}T00:00:00`) < today || notice.status === "Expired";
    const dateOk = state.dateRange === "all" || (state.dateRange === "active" && !expired) || (state.dateRange === "expired" && expired);
    return (!state.search || text.includes(state.search)) &&
      (state.category === "all" || notice.category === state.category) &&
      (state.priority === "all" || notice.priority === state.priority) &&
      (state.status === "all" || notice.status === state.status) &&
      (state.block === "all" || notice.block === state.block) &&
      dateOk;
  });
}

function fillFilters() {
  const notices = publicNotices();
  byId("categoryFilter").innerHTML = optionList(unique(notices.map((notice) => notice.category)), "All Categories");
  byId("priorityFilter").innerHTML = optionList(unique(notices.map((notice) => notice.priority)), "All Priorities");
  byId("statusFilter").innerHTML = optionList(unique(notices.map((notice) => notice.status)), "All Statuses");
  byId("blockFilter").innerHTML = optionList(unique(notices.map((notice) => notice.block)), "All Blocks");
}

function renderSummary() {
  const notices = publicNotices();
  const rows = [
    ["Total Active Notices", notices.filter((n) => n.status === "Active").length, "rwa"],
    ["Emergency Notices", notices.filter((n) => n.priority === "Emergency" || n.category === "Emergency").length, "emergency"],
    ["Maintenance Notices", notices.filter((n) => n.category === "Maintenance").length, "maintenance"],
    ["AGM Notices", notices.filter((n) => n.category === "AGM").length, "agm"],
    ["Payment Notices", notices.filter((n) => n.category === "Payment").length, "payment"],
    ["Expired Notices", notices.filter((n) => n.status === "Expired").length, "general"],
    ["Notices with Attachments", notices.filter((n) => n.attachments.length).length, "utility"]
  ];
  byId("summaryCards").innerHTML = rows.map(([label, value, theme]) => `
    <article class="summary-card ${theme}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></article>
  `).join("");
}

function attachmentBadge(notice) {
  if (!notice.attachments.length) return "No Attachment";
  return notice.attachments.map((item) => item.type).join(" / ");
}

function renderNotices() {
  const notices = filteredNotices();
  byId("noticeCount").textContent = `${notices.length} notices`;
  byId("noticeCards").innerHTML = notices.map((notice) => `
    <article class="notice-card ${escapeHtml(notice.theme)}">
      <div class="card-top">
        <span class="notice-icon">${escapeHtml(notice.icon)}</span>
        <span class="status-badge">${escapeHtml(notice.status)}</span>
      </div>
      <h3>${escapeHtml(notice.title)}</h3>
      <p>${escapeHtml(notice.description)}</p>
      <div class="notice-meta">
        <span><strong>${escapeHtml(notice.category)}</strong>Category</span>
        <span><strong>${escapeHtml(notice.date)}</strong>Date</span>
        <span><strong>${escapeHtml(notice.publishedBy)}</strong>Published By</span>
      </div>
      <div class="badge-row">
        <span class="mini-badge ${notice.priority === "Emergency" ? "hot" : ""}">${escapeHtml(notice.priority)}</span>
        <span class="mini-badge">${escapeHtml(attachmentBadge(notice))}</span>
        ${notice.pinned ? "<span class=\"mini-badge hot\">Pinned</span>" : ""}
      </div>
      <button class="details-button" type="button" data-notice-id="${escapeHtml(notice.id)}">View Details</button>
    </article>
  `).join("") || "<article class=\"notice-card\"><h3>No notices found</h3><p>Try another filter.</p></article>";
}

function renderWhatsapp() {
  byId("whatsappLinks").innerHTML = state.data.whatsappLinks
    .filter((link) => link.status === "Published")
    .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.title)}</a>`)
    .join("");
}

function listItems(items) {
  return items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>No related documents.</p>";
}

function renderAttachmentPreview(notice) {
  if (!notice.attachments.length) return "<p>No public attachment available.</p>";
  return notice.attachments.map((item) => `
    <div class="attachment-preview">
      <strong>${escapeHtml(item.type)} preview placeholder</strong>
      <p>${escapeHtml(item.title)}</p>
      <p>${escapeHtml(item.url)}</p>
    </div>
  `).join("");
}

function openNotice(noticeId) {
  const notice = publicNotices().find((item) => item.id === noticeId);
  if (!notice) return;
  byId("modalContent").innerHTML = `
    <div class="modal-body ${escapeHtml(notice.theme)}">
      <div class="modal-hero">
        <p class="eyebrow">${escapeHtml(notice.category)}</p>
        <h2 id="modalTitle">${escapeHtml(notice.title)}</h2>
        <p>${escapeHtml(notice.description)}</p>
      </div>
      <div class="detail-grid">
        <div><strong>Notice Date</strong><br>${escapeHtml(notice.date)}</div>
        <div><strong>Priority</strong><br>${escapeHtml(notice.priority)}</div>
        <div><strong>Published By</strong><br>${escapeHtml(notice.publishedBy)}</div>
        <div><strong>Applicable Block</strong><br>${escapeHtml(notice.block)}</div>
        <div><strong>Applicable House</strong><br>${escapeHtml(notice.applicableHouse)}</div>
        <div><strong>Expiry Date</strong><br>${escapeHtml(notice.expiryDate)}</div>
      </div>
      <div class="detail-panel"><h3>Full Description</h3><p>${escapeHtml(notice.description)}</p></div>
      <div class="detail-panel"><h3>Attachment Preview</h3>${renderAttachmentPreview(notice)}</div>
      <div class="detail-panel"><h3>Related Documents</h3>${listItems(notice.documents)}</div>
      <div class="modal-actions">
        <button type="button" data-action="Download PDF">PDF Download</button>
        <button type="button" data-action="Open image preview">Image/Screenshot Preview</button>
        <button type="button" data-action="Print notice">Print Notice</button>
        ${notice.whatsapp ? `<a href="https://wa.me/" target="_blank" rel="noreferrer">${escapeHtml(notice.whatsapp)}</a>` : ""}
      </div>
    </div>
  `;
  const modal = byId("noticeModal");
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function setupEvents() {
  byId("lastUpdated").textContent = `Updated ${state.data.lastUpdated}`;
  byId("searchInput").addEventListener("input", (event) => { state.search = event.target.value.trim().toLowerCase(); renderNotices(); });
  byId("categoryFilter").addEventListener("change", (event) => { state.category = event.target.value; renderNotices(); });
  byId("priorityFilter").addEventListener("change", (event) => { state.priority = event.target.value; renderNotices(); });
  byId("statusFilter").addEventListener("change", (event) => { state.status = event.target.value; renderNotices(); });
  byId("blockFilter").addEventListener("change", (event) => { state.block = event.target.value; renderNotices(); });
  byId("dateFilter").addEventListener("change", (event) => { state.dateRange = event.target.value; renderNotices(); });
  byId("noticeCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-notice-id]");
    if (button) openNotice(button.dataset.noticeId);
  });
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action) showToast(`${action.dataset.action}: placeholder for future storage workflow.`);
  });
  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ibpNoticeTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("ibpNoticeTheme") === "dark") document.body.classList.add("dark");
}

async function init() {
  const response = await fetch("data/notices.json");
  state.data = await response.json();
  fillFilters();
  setupEvents();
  renderSummary();
  renderNotices();
  renderWhatsapp();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="access-strip">Unable to load notices: ${escapeHtml(error.message)}</div>`);
});

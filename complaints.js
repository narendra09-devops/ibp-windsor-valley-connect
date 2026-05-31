const state = { data: null, search: "", status: "all", category: "all", priority: "all", block: "all", assigned: "all", date: "all" };
const byId = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));

function toast(message) {
  const target = byId("toast");
  target.textContent = message;
  target.classList.add("show");
  setTimeout(() => target.classList.remove("show"), 2200);
}

function unique(values) {
  return [...new Set(values)].sort();
}

function options(values, label) {
  return [`<option value="all">${label}</option>`, ...values.map((value) => `<option>${esc(value)}</option>`)].join("");
}

function theme(complaint) {
  if (complaint.priority === "Emergency") return "emergency";
  return complaint.theme || "assigned";
}

function fillFilters() {
  const complaints = state.data.complaints;
  byId("statusFilter").innerHTML = options(unique(complaints.map((item) => item.status)), "All Statuses");
  byId("categoryFilter").innerHTML = options(unique(complaints.map((item) => item.category)), "All Categories");
  byId("priorityFilter").innerHTML = options(unique(complaints.map((item) => item.priority)), "All Priorities");
  byId("blockFilter").innerHTML = options(unique(complaints.map((item) => item.block)), "All Blocks");
  byId("assignedFilter").innerHTML = options(unique(complaints.map((item) => item.assignedTo)), "All Assigned");
}

function filteredComplaints() {
  return state.data.complaints.filter((complaint) => {
    const text = JSON.stringify(complaint).toLowerCase();
    const recentOk = state.date !== "recent" || new Date(complaint.createdDate) >= new Date("2026-05-27");
    return (!state.search || text.includes(state.search))
      && (state.status === "all" || complaint.status === state.status)
      && (state.category === "all" || complaint.category === state.category)
      && (state.priority === "all" || complaint.priority === state.priority)
      && (state.block === "all" || complaint.block === state.block)
      && (state.assigned === "all" || complaint.assignedTo === state.assigned)
      && recentOk;
  });
}

function renderSummary() {
  const complaints = state.data.complaints;
  const rows = [
    ["Total Complaints", complaints.length, "assigned"],
    ["Open Complaints", complaints.filter((item) => item.status === "Open").length, "open"],
    ["Assigned Complaints", complaints.filter((item) => item.status === "Assigned").length, "assigned"],
    ["In Progress", complaints.filter((item) => item.status === "In Progress").length, "progress"],
    ["Resolved", complaints.filter((item) => item.status === "Resolved").length, "resolved"],
    ["Emergency Complaints", complaints.filter((item) => item.priority === "Emergency").length, "emergency"],
    ["Builder Pending Issues", complaints.filter((item) => item.category === "Builder Pending Work").length, "hold"],
    ["Average Resolution Time", "3.5 days", "closed"]
  ];
  byId("summaryCards").innerHTML = rows.map(([label, value, type]) => `<article class="summary-card ${type}"><strong>${esc(label)}</strong><span>${esc(value)}</span></article>`).join("");
}

function renderCards() {
  const rows = filteredComplaints();
  byId("complaintCount").textContent = `${rows.length} complaints`;
  byId("complaintCards").innerHTML = rows.map((complaint) => `
    <article class="complaint-card ${theme(complaint)}">
      <div class="card-top"><span class="complaint-icon">${esc(complaint.category.slice(0, 3).toUpperCase())}</span><span class="status-badge">${esc(complaint.status)}</span></div>
      <h3>${esc(complaint.id)}: ${esc(complaint.title)}</h3>
      <p>${esc(complaint.description)}</p>
      <div class="complaint-meta"><span><strong>${esc(complaint.block)}-${esc(complaint.house)}</strong>House</span><span><strong>${esc(complaint.priority)}</strong>Priority</span><span><strong>${esc(complaint.assignedTo)}</strong>Assigned</span></div>
      <div class="badge-row"><span class="mini-badge">${esc(complaint.category)}</span><span class="mini-badge">Created ${esc(complaint.createdDate)}</span><span class="mini-badge">Updated ${esc(complaint.lastUpdated)}</span></div>
      <button class="details-button" data-complaint-id="${esc(complaint.id)}">View Details</button>
    </article>
  `).join("");
}

function renderReports() {
  const reports = ["Daily complaint report", "Monthly complaint report", "Category-wise analysis", "Pending approval report", "Worker/vendor work order report", "Average resolution time report"];
  byId("reportCards").innerHTML = reports.map((report) => `<article class="complaint-card assigned"><h3>${esc(report)}</h3><p>Auto-generated static report placeholder from complaint JSON.</p><button class="details-button" data-action="Generate ${esc(report)}">Generate</button></article>`).join("");
}

function openComplaint(id) {
  const complaint = state.data.complaints.find((item) => item.id === id);
  byId("modalContent").innerHTML = `
    <div class="modal-body ${theme(complaint)}">
      <div class="modal-hero"><p class="eyebrow">${esc(complaint.category)}</p><h2 id="modalTitle">${esc(complaint.title)}</h2><p>${esc(complaint.description)}</p></div>
      <div class="detail-grid">
        <div><strong>Resident</strong><br>${esc(complaint.residentMasked)}</div>
        <div><strong>Status</strong><br>${esc(complaint.status)}</div>
        <div><strong>Priority</strong><br>${esc(complaint.priority)}</div>
        <div><strong>Assigned Worker/Vendor</strong><br>${esc(complaint.assignedTo)}</div>
        <div><strong>Created</strong><br>${esc(complaint.createdDate)}</div>
        <div><strong>Updated</strong><br>${esc(complaint.lastUpdated)}</div>
      </div>
      <div class="detail-panel"><h3>Complaint Timeline</h3><ol>${complaint.timeline.map((item) => `<li>${esc(item)}</li>`).join("")}</ol></div>
      <div class="detail-panel"><h3>Resident Details</h3><p>Masked public view: ${esc(complaint.residentMasked)}. Mobile, email and private identity fields are hidden.</p></div>
      <div class="detail-panel"><h3>Admin Remarks</h3><p>Private admin remarks are login-protected placeholders and are not visible publicly.</p></div>
      <div class="detail-panel"><h3>Uploaded Image Placeholder</h3><p>${esc(complaint.photo || "No image uploaded")}</p></div>
      <div class="detail-panel"><h3>Work Completion Proof</h3><p>${esc(complaint.workProof || "No work proof uploaded")}</p></div>
      <div class="detail-panel"><h3>Feedback</h3><p>${esc(complaint.feedback)}</p></div>
      <div class="modal-actions"><button data-action="Reopen complaint">Reopen Complaint</button><button data-action="Add feedback">Add Feedback</button><button data-action="Print work order">Print Work Order</button></div>
    </div>`;
  const modal = byId("complaintModal");
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function setupEvents() {
  byId("lastUpdated").textContent = `Updated ${state.data.lastUpdated}`;
  const map = { searchInput: "search", statusFilter: "status", categoryFilter: "category", priorityFilter: "priority", blockFilter: "block", assignedFilter: "assigned", dateFilter: "date" };
  Object.keys(map).forEach((id) => {
    byId(id).addEventListener(id === "searchInput" ? "input" : "change", (event) => {
      state[map[id]] = id === "searchInput" ? event.target.value.trim().toLowerCase() : event.target.value;
      renderCards();
    });
  });
  byId("complaintCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-complaint-id]");
    if (button) openComplaint(button.dataset.complaintId);
  });
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action) toast(`${action.dataset.action}: placeholder only.`);
  });
  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ibpComplaintTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("ibpComplaintTheme") === "dark") document.body.classList.add("dark");
}

async function init() {
  const response = await fetch("data/complaints.json");
  state.data = await response.json();
  fillFilters();
  setupEvents();
  renderSummary();
  renderCards();
  renderReports();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="access-strip">Unable to load complaints: ${esc(error.message)}</div>`);
});

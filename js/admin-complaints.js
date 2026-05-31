const complaintEsc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
const complaintTheme = (item) => item.priority === "Emergency" ? "emergency" : (item.theme || "assigned");

function complaintToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function complaintCard(item, admin = false) {
  return `
    <article class="complaint-card ${complaintTheme(item)}">
      <div class="card-top"><span class="complaint-icon">${complaintEsc(item.category.slice(0, 3).toUpperCase())}</span><span class="status-badge">${complaintEsc(item.status)}</span></div>
      <h3>${complaintEsc(item.id)}: ${complaintEsc(item.title)}</h3>
      <p>${complaintEsc(item.block)}-${complaintEsc(item.house)} / ${complaintEsc(item.priority)} priority / ${complaintEsc(item.assignedTo)}</p>
      <div class="badge-row"><span class="mini-badge">${complaintEsc(item.category)}</span><span class="mini-badge">Updated ${complaintEsc(item.lastUpdated)}</span></div>
      ${admin ? `<div class="admin-actions"><button data-admin-action="Assign ${complaintEsc(item.id)}">Assign</button><button data-admin-action="Update ${complaintEsc(item.id)}">Update Status</button><button data-admin-action="Archive ${complaintEsc(item.id)}">Archive</button></div>` : `<a class="details-button" href="complaint-details.html?id=${encodeURIComponent(item.id)}">Open Details</a>`}
    </article>
  `;
}

async function getComplaintData() {
  const response = await fetch("data/complaints.json");
  return response.json();
}

function setupFormOptions(data) {
  const category = document.getElementById("formCategory");
  const priority = document.getElementById("formPriority");
  if (category) category.innerHTML = data.categories.map((item) => `<option>${complaintEsc(item)}</option>`).join("");
  if (priority) priority.innerHTML = data.priorities.map((item) => `<option>${complaintEsc(item)}</option>`).join("");
  const form = document.getElementById("complaintForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      complaintToast("Complaint submission placeholder. Backend login/storage will be connected later.");
      form.reset();
    });
  }
}

function setupAdminFilters(data) {
  const status = document.getElementById("adminStatusFilter");
  const priority = document.getElementById("adminPriorityFilter");
  if (status) status.innerHTML += data.statuses.map((item) => `<option>${complaintEsc(item)}</option>`).join("");
  if (priority) priority.innerHTML += data.priorities.map((item) => `<option>${complaintEsc(item)}</option>`).join("");
}

function renderAdminQueue(data) {
  const target = document.getElementById("adminComplaintCards");
  if (!target) return;
  target.innerHTML = data.complaints.map((item) => complaintCard(item, true)).join("");
}

function renderDetails(data) {
  const target = document.getElementById("complaintDetailsPanel");
  if (!target) return;
  const params = new URLSearchParams(location.search);
  const complaint = data.complaints.find((item) => item.id === params.get("id")) || data.complaints[0];
  target.innerHTML = `
    <article class="modal-body ${complaintTheme(complaint)}">
      <div class="modal-hero"><p class="eyebrow">${complaintEsc(complaint.category)}</p><h2>${complaintEsc(complaint.id)}: ${complaintEsc(complaint.title)}</h2><p>${complaintEsc(complaint.description)}</p></div>
      <div class="detail-grid">
        <div><strong>Resident</strong><br>${complaintEsc(complaint.residentMasked)}</div>
        <div><strong>Block/House</strong><br>${complaintEsc(complaint.block)}-${complaintEsc(complaint.house)}</div>
        <div><strong>Status</strong><br>${complaintEsc(complaint.status)}</div>
        <div><strong>Priority</strong><br>${complaintEsc(complaint.priority)}</div>
        <div><strong>Assigned To</strong><br>${complaintEsc(complaint.assignedTo)}</div>
        <div><strong>Resolution Time</strong><br>${complaintEsc(complaint.resolutionTime)}</div>
      </div>
      <div class="detail-panel"><h3>Timeline</h3><ol>${complaint.timeline.map((item) => `<li>${complaintEsc(item)}</li>`).join("")}</ol></div>
      <div class="detail-panel"><h3>Private Admin Remarks</h3><p>Hidden from public users. Visible only after future Admin/RWA login.</p></div>
      <div class="detail-panel"><h3>Feedback</h3><p>${complaintEsc(complaint.feedback)}</p></div>
      <div class="modal-actions"><button data-admin-action="Reopen ${complaintEsc(complaint.id)}">Reopen Complaint</button><button data-admin-action="Add feedback ${complaintEsc(complaint.id)}">Add Feedback</button><button data-admin-action="Print ${complaintEsc(complaint.id)}">Print Work Order</button></div>
    </article>
  `;
}

function renderWorkOrders(data) {
  const target = document.getElementById("workOrderBoard");
  if (!target) return;
  target.innerHTML = data.complaints.map((item) => `
    <article class="complaint-card ${complaintTheme(item)}">
      <h3>Work Order: ${complaintEsc(item.id)}</h3>
      <p><strong>${complaintEsc(item.title)}</strong></p>
      <p>Assigned to ${complaintEsc(item.assignedTo)}. Status: ${complaintEsc(item.status)}.</p>
      <div class="detail-panel"><strong>Work Proof Placeholder</strong><br>${complaintEsc(item.workProof || "Upload after work completion")}</div>
      <div class="admin-actions"><button data-admin-action="Mark resolved ${complaintEsc(item.id)}">Mark Resolved</button><button data-admin-action="Upload proof ${complaintEsc(item.id)}">Upload Proof</button><button data-admin-action="Generate report ${complaintEsc(item.id)}">Generate Report</button></div>
    </article>
  `).join("");
}

async function initAdminComplaints() {
  const data = await getComplaintData();
  setupFormOptions(data);
  setupAdminFilters(data);
  renderAdminQueue(data);
  renderDetails(data);
  renderWorkOrders(data);
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-admin-action]");
    if (action) complaintToast(`${action.dataset.adminAction}: placeholder only.`);
  });
}

initAdminComplaints().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="access-strip">Unable to load complaints: ${complaintEsc(error.message)}</div>`);
});

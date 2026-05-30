const state = {
  data: null,
  search: "",
  category: "all",
  year: "all",
  status: "all",
  organizer: "all",
  block: "all",
  dateRange: "all",
  momSearch: "",
  momYear: "all",
  momCategory: "all"
};

const byId = (id) => document.getElementById(id);
const today = new Date("2026-05-30T00:00:00");
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
})[char]);

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function eventDate(eventItem) {
  return new Date(`${eventItem.date}T00:00:00`);
}

function unique(values) {
  return [...new Set(values)].sort();
}

function optionList(values, allLabel) {
  return [`<option value="all">${allLabel}</option>`, ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)].join("");
}

function fillFilters() {
  const events = state.data.events;
  byId("categoryFilter").innerHTML = optionList(unique(events.map((eventItem) => eventItem.category)), "All Categories");
  byId("yearFilter").innerHTML = optionList(unique(events.map((eventItem) => eventItem.date.slice(0, 4))), "All Years");
  byId("statusFilter").innerHTML = optionList(unique(events.map((eventItem) => eventItem.status)), "All Statuses");
  byId("organizerFilter").innerHTML = optionList(unique(events.map((eventItem) => eventItem.organizer)), "All Organizers");
  byId("blockFilter").innerHTML = optionList(unique(events.map((eventItem) => eventItem.block)), "All Blocks");
  byId("momYear").innerHTML = optionList(unique(state.data.momRepository.map((mom) => mom.year)), "All Years");
  byId("momCategory").innerHTML = optionList(unique(state.data.momRepository.map((mom) => mom.category)), "All MOM Categories");
}

function filteredEvents() {
  return state.data.events.filter((eventItem) => {
    const text = JSON.stringify(eventItem).toLowerCase();
    const date = eventDate(eventItem);
    const dateOk = state.dateRange === "all" || (state.dateRange === "upcoming" && date >= today) || (state.dateRange === "past" && date < today);
    return (!state.search || text.includes(state.search)) &&
      (state.category === "all" || eventItem.category === state.category) &&
      (state.year === "all" || eventItem.date.startsWith(state.year)) &&
      (state.status === "all" || eventItem.status === state.status) &&
      (state.organizer === "all" || eventItem.organizer === state.organizer) &&
      (state.block === "all" || eventItem.block === state.block) &&
      dateOk;
  });
}

function renderSummary() {
  const events = state.data.events;
  const upcomingEvents = events.filter((item) => item.status === "Upcoming").length;
  const meetings = events.filter((item) => item.category.includes("Meeting") || item.category === "AGM").length;
  const completed = events.filter((item) => item.status === "Completed").length;
  const cancelled = events.filter((item) => item.status === "Cancelled").length;
  const participants = events.reduce((sum, item) => sum + Number(item.participants || 0), 0);
  const rows = [
    ["Upcoming Events", upcomingEvents, "meetings"],
    ["Upcoming Meetings", meetings, "meetings"],
    ["MOM Available", events.filter((item) => item.momAvailable).length, "development"],
    ["Event Galleries", events.filter((item) => item.galleryAvailable).length, "festival"],
    ["Active Programs", events.filter((item) => item.status === "Upcoming").length, "plantation"],
    ["Total Participants", participants, "sports"],
    ["Completed Activities", completed, "cleanliness"],
    ["Cancelled Events", cancelled, "emergency"],
    ["Event Documents", state.data.documents.length, "health"],
    ["Event Statistics", events.length, "meetings"]
  ];
  byId("summaryCards").innerHTML = rows.map(([label, value, theme]) => `
    <article class="summary-card ${theme}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></article>
  `).join("");
}

function badge(label, enabled) {
  return `<span class="mini-badge ${enabled ? "yes" : ""}">${escapeHtml(label)}: ${enabled ? "Yes" : "No"}</span>`;
}

function renderEvents() {
  const events = filteredEvents();
  byId("eventCount").textContent = `${events.length} activities`;
  byId("eventCards").innerHTML = events.map((eventItem) => `
    <article class="event-card ${escapeHtml(eventItem.theme)}">
      <div class="card-banner">
        <div class="card-top"><span class="event-icon">${escapeHtml(eventItem.icon)}</span><span class="status-badge">${escapeHtml(eventItem.status)}</span></div>
        <strong>${escapeHtml(eventItem.banner)}</strong>
      </div>
      <h3>${escapeHtml(eventItem.title)}</h3>
      <p>${escapeHtml(eventItem.description)}</p>
      <div class="event-meta">
        <span><strong>${escapeHtml(eventItem.category)}</strong>Category</span>
        <span><strong>${escapeHtml(eventItem.date)}</strong>${escapeHtml(eventItem.time)}</span>
        <span><strong>${escapeHtml(eventItem.venue)}</strong>${escapeHtml(eventItem.organizer)}</span>
      </div>
      <div class="badge-row">
        <span class="status-badge">${escapeHtml(eventItem.participants)} participants</span>
      </div>
      <div class="badge-row">
        ${badge("MOM", eventItem.momAvailable)}
        ${badge("Gallery", eventItem.galleryAvailable)}
        ${badge("Documents", eventItem.documentsAvailable)}
      </div>
      <button class="details-button" type="button" data-event-id="${escapeHtml(eventItem.id)}">View Details</button>
    </article>
  `).join("") || "<article class=\"event-card\"><h3>No events found</h3><p>Try another filter.</p></article>";
}

function filteredMom() {
  return state.data.momRepository.filter((mom) => {
    const text = JSON.stringify(mom).toLowerCase();
    return (!state.momSearch || text.includes(state.momSearch)) &&
      (state.momYear === "all" || mom.year === state.momYear) &&
      (state.momCategory === "all" || mom.category === state.momCategory);
  });
}

function renderMom() {
  byId("momCards").innerHTML = filteredMom().map((mom) => `
    <article class="repository-card meetings">
      <span class="status-badge">${escapeHtml(mom.status)}</span>
      <h3>${escapeHtml(mom.title)}</h3>
      <p>${escapeHtml(mom.category)} / ${escapeHtml(mom.year)}</p>
      <div class="repo-actions">
        <button type="button" data-action="View MOM ${escapeHtml(mom.title)}">View MOM</button>
        <button type="button" data-action="Download MOM ${escapeHtml(mom.title)}">Download MOM</button>
      </div>
    </article>
  `).join("") || "<article class=\"repository-card\"><h3>No MOM records found</h3></article>";
}

function renderGallery() {
  const galleryEvents = state.data.events.filter((item) => item.galleryAvailable || item.photos.length || item.videos.length);
  byId("galleryCards").innerHTML = galleryEvents.map((item) => `
    <article class="gallery-card ${escapeHtml(item.theme)}">
      <span class="event-icon">${escapeHtml(item.icon)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.category)} / ${escapeHtml(item.date)}</p>
      <p>Photos: ${item.photos.length} / Videos: ${item.videos.length}</p>
    </article>
  `).join("");
}

function renderDocuments() {
  byId("documentCards").innerHTML = state.data.documents.map((doc) => `
    <article class="repository-card development">
      <span class="status-badge">${escapeHtml(doc.fileType)} / ${escapeHtml(doc.status)}</span>
      <h3>${escapeHtml(doc.title)}</h3>
      <p>${escapeHtml(doc.category)}</p>
      <div class="repo-actions">
        <button type="button" data-action="View ${escapeHtml(doc.title)}">View</button>
        <button type="button" data-action="Download ${escapeHtml(doc.title)}">Download</button>
      </div>
    </article>
  `).join("");
}

function listItems(items) {
  return items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>No public records yet.</p>";
}

function openDetails(eventId) {
  const eventItem = state.data.events.find((item) => item.id === eventId);
  if (!eventItem) return;
  byId("modalContent").innerHTML = `
    <div class="modal-body ${escapeHtml(eventItem.theme)}">
      <div class="modal-hero">
        <p class="eyebrow">${escapeHtml(eventItem.category)}</p>
        <h2 id="modalTitle">${escapeHtml(eventItem.title)}</h2>
        <p>${escapeHtml(eventItem.description)}</p>
      </div>
      <div class="detail-grid">
        <div><strong>Date</strong><br>${escapeHtml(eventItem.date)}</div>
        <div><strong>Time</strong><br>${escapeHtml(eventItem.time)}</div>
        <div><strong>Venue</strong><br>${escapeHtml(eventItem.venue)}</div>
        <div><strong>Organizer</strong><br>${escapeHtml(eventItem.organizer)}</div>
        <div><strong>Status</strong><br>${escapeHtml(eventItem.status)}</div>
        <div><strong>Participants</strong><br>${escapeHtml(eventItem.participants)}</div>
      </div>
      <div class="detail-list"><h3>Event Overview</h3><p>${escapeHtml(eventItem.description)}</p></div>
      <div class="detail-list"><h3>Agenda</h3>${listItems(eventItem.agenda)}</div>
      <div class="detail-list"><h3>Discussion Points</h3>${listItems(eventItem.discussionPoints)}</div>
      <div class="detail-list"><h3>Decisions Taken</h3>${listItems(eventItem.decisions)}</div>
      <div class="detail-list"><h3>Action Items</h3><ol>${eventItem.actionItems.map((item) => `<li>${escapeHtml(item.task)} - ${escapeHtml(item.responsible)} - ${escapeHtml(item.targetDate)}</li>`).join("")}</ol></div>
      <div class="detail-list"><h3>Related Documents</h3>${listItems(eventItem.documents)}</div>
      <div class="detail-list"><h3>MOM</h3><p>${escapeHtml(eventItem.mom)}</p></div>
      <div class="detail-list"><h3>Photo Gallery</h3>${listItems(eventItem.photos)}</div>
      <div class="detail-list"><h3>Videos</h3>${listItems(eventItem.videos)}</div>
      <div class="detail-list"><h3>Related Notices</h3>${listItems(eventItem.notices)}</div>
      <div class="detail-list"><h3>Attachments</h3>${listItems(eventItem.attachments)}</div>
      <div class="detail-list"><h3>Event Statistics</h3><p>Attendance: ${escapeHtml(eventItem.stats.attendanceRate)} / Actions closed: ${escapeHtml(eventItem.stats.actionsClosed)} / Budget: ${escapeHtml(eventItem.stats.budget)}</p></div>
      <div class="modal-actions">
        <button type="button" data-action="Download MOM PDF">Download MOM PDF</button>
        <button type="button" data-action="Download Attendance Sheet">Download Attendance Sheet</button>
        <button type="button" data-action="Open Gallery">Open Gallery</button>
        <button type="button" data-action="Print Event Report">Print Event Report</button>
      </div>
    </div>
  `;
  const modal = byId("eventModal");
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function setupEvents() {
  byId("lastUpdated").textContent = `Updated ${state.data.lastUpdated}`;
  byId("searchInput").addEventListener("input", (event) => { state.search = event.target.value.trim().toLowerCase(); renderEvents(); });
  byId("categoryFilter").addEventListener("change", (event) => { state.category = event.target.value; renderEvents(); });
  byId("yearFilter").addEventListener("change", (event) => { state.year = event.target.value; renderEvents(); });
  byId("statusFilter").addEventListener("change", (event) => { state.status = event.target.value; renderEvents(); });
  byId("organizerFilter").addEventListener("change", (event) => { state.organizer = event.target.value; renderEvents(); });
  byId("blockFilter").addEventListener("change", (event) => { state.block = event.target.value; renderEvents(); });
  byId("dateFilter").addEventListener("change", (event) => { state.dateRange = event.target.value; renderEvents(); });
  byId("momSearch").addEventListener("input", (event) => { state.momSearch = event.target.value.trim().toLowerCase(); renderMom(); });
  byId("momYear").addEventListener("change", (event) => { state.momYear = event.target.value; renderMom(); });
  byId("momCategory").addEventListener("change", (event) => { state.momCategory = event.target.value; renderMom(); });
  byId("eventCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-event-id]");
    if (button) openDetails(button.dataset.eventId);
  });
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action) showToast(`${action.dataset.action}: placeholder for future storage/login workflow.`);
  });
  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ibpEventsTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("ibpEventsTheme") === "dark") document.body.classList.add("dark");
}

async function init() {
  const response = await fetch("data/events.json");
  state.data = await response.json();
  fillFilters();
  setupEvents();
  renderSummary();
  renderEvents();
  renderMom();
  renderGallery();
  renderDocuments();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="admin-strip">Unable to load events: ${escapeHtml(error.message)}</div>`);
});

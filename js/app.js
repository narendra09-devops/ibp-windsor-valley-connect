const state = {
  data: null,
  events: [],
  search: "",
  block: "all",
  propertyStatus: "all",
  memberStatus: "all",
  complaintStatus: "all",
  eventStatus: "all"
};

const selectors = {
  search: "#globalSearch",
  block: "#blockFilter",
  status: "#statusFilter",
  member: "#memberFilter",
  complaint: "#complaintFilter",
  event: "#eventFilter"
};

const statusClass = {
  "Occupied": "success",
  "Paid": "success",
  "Present": "success",
  "Resolved": "success",
  "Closed": "success",
  "Working": "success",
  "Live": "success",
  "Available": "success",
  "Upcoming": "success",
  "Rented": "info",
  "Under Construction": "info",
  "In Progress": "info",
  "Assigned": "info",
  "Recorded": "info",
  "Scheduled": "info",
  "Open": "warning",
  "Pending": "warning",
  "Builder Pending": "warning",
  "Vacant Plot": "muted",
  "Absent": "danger",
  "Dispute/Pending Issue": "danger",
  "Restricted": "danger"
};

const money = (value) => `INR ${Number(value).toLocaleString("en-IN")}`;
const byId = (id) => document.getElementById(id);
const badge = (value) => `<span class="badge ${statusClass[value] || "neutral"}">${value}</span>`;
const yesNo = (value) => badge(value ? "Yes" : "No");
const filterSearch = (items) => items.filter(matchesSearch);
const empty = (label) => `<div class="empty-state">No ${label} match the current search/filter.</div>`;

function matchesSearch(item) {
  if (!state.search) return true;
  return JSON.stringify(item).toLowerCase().includes(state.search);
}

function filteredProperties() {
  return state.data.properties.filter((property) => {
    const blockOk = state.block === "all" || property.block === state.block;
    const statusOk = state.propertyStatus === "all" || property.occupancy === state.propertyStatus;
    return blockOk && statusOk && matchesSearch(property);
  });
}

function publicResidents() {
  return state.data.properties.filter((property) => {
    const blockOk = state.block === "all" || property.block === state.block;
    const memberOk =
      state.memberStatus === "all" ||
      (state.memberStatus === "member" && property.rwaMember) ||
      (state.memberStatus === "non-member" && !property.rwaMember);
    return blockOk && memberOk && matchesSearch(property);
  });
}

function renderDashboard() {
  const data = state.data;
  const total = data.properties.length;
  const count = (status) => data.properties.filter((property) => property.occupancy === status).length;
  const occupied = count("Occupied") + count("Rented");
  const rwaMembers = data.properties.filter((property) => property.rwaMember).length;
  const pendingDues = data.maintenance.monthlyCollections.filter((item) => item.status === "Pending").length;
  const workersPresent = data.workers.filter((worker) => worker.attendance === "Present").length;
  const openComplaints = data.complaints.filter((complaint) => !["Resolved", "Closed"].includes(complaint.status)).length;
  const recentExpenses = data.maintenance.expenses.slice(0, 3).reduce((sum, expense) => sum + expense.amount, 0);
  const pendingTasks = data.maintenance.workHistory.filter((task) => task.status !== "Resolved").length;

  byId("lastUpdated").textContent = `Updated ${data.society.lastUpdated}`;
  byId("dashboardCards").innerHTML = [
    ["Total plots", total, "All blocks A-H"],
    ["Occupied houses", occupied, "Includes rented"],
    ["Under construction", count("Under Construction"), "Active work"],
    ["Vacant plots", count("Vacant Plot"), "No public resident"],
    ["RWA members", rwaMembers, "Public member count"],
    ["Non-RWA members", total - rwaMembers, "Follow-up needed"],
    ["Open complaints", openComplaints, "Action queue"],
    ["Pending dues", pendingDues, "House-wise pending"],
    ["Workers present today", workersPresent, "Attendance"],
    ["Visitors today", data.security.entries.length, "Gate entries"],
    ["Recent notices", data.notices.slice(0, 3).length, "Latest notices"],
    ["Recent expenses", money(recentExpenses), "Top 3 expenses"],
    ["Pending tasks", pendingTasks, "Maintenance work"]
  ].map(([label, value, note]) => metricCard(label, value, note)).join("");

  const statusCounts = ["Occupied", "Under Construction", "Vacant Plot", "Rented", "Builder Pending", "Dispute/Pending Issue"]
    .map((status) => ({ label: status, value: count(status) }));
  renderBars("occupancyChart", statusCounts);

  byId("activityFeed").innerHTML = [
    ...data.notices.slice(0, 3).map((notice) => ({ title: notice.title, meta: `${notice.type} notice`, status: notice.priority })),
    ...data.maintenance.expenses.slice(0, 3).map((expense) => ({ title: `${expense.category} - ${money(expense.amount)}`, meta: expense.paidTo, status: expense.status }))
  ].map(feedItem).join("");
}

function metricCard(label, value, note) {
  return `<article class="metric-card"><strong>${label}</strong><span>${value}</span><small>${note}</small></article>`;
}

function renderBars(target, rows) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  byId(target).innerHTML = rows.map((row) => `
    <div class="bar-row">
      <span>${row.label}</span>
      <i><b style="width:${(row.value / max) * 100}%"></b></i>
      <strong>${row.value}</strong>
    </div>
  `).join("");
}

function feedItem(item) {
  return `<div class="feed-item"><div><strong>${item.title}</strong><span>${item.meta}</span></div>${badge(item.status)}</div>`;
}

function renderSociety() {
  const blocks = state.data.society.blocks;
  byId("layoutGrid").innerHTML = blocks.map((block) => {
    const properties = state.data.properties.filter((property) => property.block === block);
    return `<article class="block-card"><h3>Block ${block}</h3><div class="plot-grid">${properties.map((property) => `<span class="${statusClass[property.occupancy] || "neutral"}" title="${property.house} ${property.occupancy}">${property.house}</span>`).join("")}</div></article>`;
  }).join("");

  byId("propertyRows").innerHTML = filteredProperties().map((property) => `
    <tr>
      <td>Block ${property.block}</td>
      <td>${property.house}</td>
      <td>${badge(property.occupancy)}</td>
      <td>${property.resident}</td>
      <td>${property.ownership}</td>
      <td>${property.waterSource}</td>
    </tr>
  `).join("");
}

function renderResidents() {
  byId("residentRows").innerHTML = publicResidents().map((resident) => `
    <tr>
      <td>${resident.block}</td>
      <td>${resident.house}</td>
      <td>${resident.resident}</td>
      <td>${resident.ownership}</td>
      <td>${yesNo(resident.rwaMember)}</td>
    </tr>
  `).join("");
}

function renderRwa() {
  const data = state.data;
  const office = filterSearch(data.rwa.officeBearers);
  const executives = data.rwa.executiveMembers.filter((name) => !state.search || name.toLowerCase().includes(state.search));
  byId("rwaCards").innerHTML = [
    ...office.map((member) => ({ title: member.name, subtitle: member.post, status: "Active" })),
    ...executives.map((name) => ({ title: name, subtitle: "Executive Member", status: "Active" }))
  ].map(simpleCard).join("") || empty("RWA records");

  const members = data.properties.filter((property) => property.rwaMember).length;
  const nonMembers = data.properties.filter((property) => !property.rwaMember).length;
  byId("coordinatorList").innerHTML = [
    ...filterSearch(data.rwa.blockCoordinators).map((item) => `<div><strong>Block ${item.block}</strong><span>${item.name}</span></div>`),
    `<div><strong>RWA members</strong><span>${members}</span></div>`,
    `<div><strong>Non-RWA members</strong><span>${nonMembers}</span></div>`,
    `<div><strong>Pending membership</strong><span>${nonMembers}</span></div>`
  ].join("");

  byId("meetingList").innerHTML = [
    { title: data.rwa.agm.agenda, meta: `AGM: ${data.rwa.agm.date}`, status: "Planned" },
    ...filterSearch(data.rwa.meetingSchedule).map((meeting) => ({ title: meeting.title, meta: meeting.date, status: meeting.status }))
  ].map(feedItem).join("") || empty("meeting records");
}

function simpleCard(item) {
  return `<article class="info-card"><h3>${item.title}</h3><p>${item.subtitle || item.summary || item.note || ""}</p>${item.status ? badge(item.status) : ""}${item.link ? `<a class="action-link" href="${item.link}" target="_blank" rel="noreferrer">Open</a>` : ""}</article>`;
}

function renderMaintenance() {
  const data = state.data.maintenance;
  const expected = data.monthlyCollections.reduce((sum, item) => sum + item.amount, 0);
  const received = data.monthlyCollections.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const expenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const pending = expected - received;

  byId("maintenanceSummary").textContent = `${money(received)} received / ${money(pending)} pending`;
  byId("maintenanceCards").innerHTML = [
    ["Monthly collection", money(expected), "Sample expected"],
    ["Received", money(received), "Paid houses"],
    ["Pending dues", money(pending), "Pending houses"],
    ["Expenses", money(expenses), "Recorded expenses"]
  ].map(([label, value, note]) => metricCard(label, value, note)).join("");

  byId("collectionRows").innerHTML = filterSearch(data.monthlyCollections).map((item) => `<tr><td>${item.house}</td><td>${item.resident}</td><td>${item.month}</td><td>${money(item.amount)}</td><td>${badge(item.status)}</td></tr>`).join("");
  byId("expenseRows").innerHTML = filterSearch(data.expenses).map((item) => `<tr><td>${item.date}</td><td>${item.category}</td><td>${money(item.amount)}</td><td>${item.paidTo}</td><td>${badge(item.status)}</td></tr>`).join("");
  byId("workHistory").innerHTML = filterSearch([...data.workHistory, ...data.vendorBills]).map((item) => simpleCard({
    title: item.task || item.vendor,
    subtitle: item.category || item.bill,
    status: item.status
  })).join("") || empty("maintenance records");
}

function renderUtilities() {
  byId("utilityCards").innerHTML = filterSearch(state.data.utilities).map((item) => simpleCard({
    title: item.name,
    subtitle: `${item.owner}: ${item.note}`,
    status: item.status
  })).join("") || empty("utility records");
}

function renderComplaints() {
  const complaints = state.data.complaints.filter((complaint) => {
    const statusOk = state.complaintStatus === "all" || complaint.status === state.complaintStatus;
    return statusOk && matchesSearch(complaint);
  });
  byId("complaintCards").innerHTML = complaints.map((complaint) => `
    <article class="complaint-card">
      <div class="panel-heading"><h3>${complaint.id}: ${complaint.title}</h3>${badge(complaint.status)}</div>
      <p><strong>${complaint.category}</strong> / ${complaint.house} / ${complaint.assignedTo}</p>
      <ol>${complaint.history.map((item) => `<li>${item}</li>`).join("")}</ol>
    </article>
  `).join("");
}

function renderSecurity() {
  const security = state.data.security;
  byId("securityRows").innerHTML = filterSearch(security.entries).map((entry) => `<tr><td>${entry.type}</td><td>${entry.name}</td><td>${entry.house}</td><td>${entry.entry}</td><td>${entry.exit}</td><td>${entry.purpose}</td><td>${entry.guard}</td><td>${entry.vehicle}</td></tr>`).join("");
  byId("gatePassCards").innerHTML = filterSearch(security.gatePassRecords).map((pass) => simpleCard({
    title: `${pass.pass} - ${pass.house}`,
    subtitle: `${pass.purpose}; valid till ${pass.validTill}`,
    status: pass.status
  })).join("") || empty("gate pass records");
}

function renderWorkers() {
  byId("workerRows").innerHTML = state.data.workers.filter(matchesSearch).map((worker) => `
    <tr>
      <td>${worker.name}</td>
      <td>${worker.role}</td>
      <td>${badge(worker.attendance)}</td>
      <td>${worker.shift}</td>
      <td>${worker.area}</td>
      <td>${badge(worker.paymentStatus)}</td>
    </tr>
  `).join("");
}

function renderDocuments() {
  byId("documentCards").innerHTML = filterSearch(state.data.documents).map((doc) => simpleCard({
    title: doc.title,
    subtitle: `${doc.type} / ${doc.access}`,
    status: doc.status,
    link: doc.link
  })).join("") || empty("document records");
}

function renderNotices() {
  byId("noticeCards").innerHTML = filterSearch(state.data.notices).map((notice) => simpleCard({
    title: notice.title,
    subtitle: `${notice.date} / ${notice.type}`,
    status: notice.priority
  })).join("") || empty("notice records");
  byId("whatsappLinks").innerHTML = filterSearch(state.data.whatsapp).map((item) => `<a class="action-link" href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a>`).join("");
}

function renderEvents() {
  const events = state.events.filter((eventItem) => {
    const statusOk = state.eventStatus === "all" || eventItem.status === state.eventStatus;
    return statusOk && matchesSearch(eventItem);
  });
  const upcoming = state.events.filter((item) => item.status === "Upcoming").length;
  const completed = state.events.filter((item) => item.status === "Completed").length;
  const cancelled = state.events.filter((item) => item.status === "Cancelled").length;

  byId("eventSummary").innerHTML = [
    ["Upcoming Events", upcoming],
    ["Past Events", completed],
    ["Cancelled", cancelled],
    ["Total Programs", state.events.length]
  ].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");

  byId("eventCards").innerHTML = events.map((eventItem) => `
    <article class="event-card">
      <div class="event-top">
        <span>${eventItem.category}</span>
        ${badge(eventItem.status)}
      </div>
      <h3>${eventItem.title}</h3>
      <dl>
        <div><dt>Date</dt><dd>${eventItem.date}</dd></div>
        <div><dt>Time</dt><dd>${eventItem.time}</dd></div>
        <div><dt>Venue</dt><dd>${eventItem.venue}</dd></div>
        <div><dt>Organizer</dt><dd>${eventItem.organizer}</dd></div>
      </dl>
      <div class="event-actions">
        <span>${eventItem.rsvp}</span>
        <span>${eventItem.gallery}</span>
      </div>
    </article>
  `).join("") || empty("event/program records");
}

function renderReports() {
  byId("reportCards").innerHTML = filterSearch(state.data.reports).map((report) => simpleCard({
    title: report.title,
    subtitle: report.summary,
    status: "Available"
  })).join("") || empty("report records");
}

function renderHelp() {
  byId("helpCards").innerHTML = filterSearch(state.data.help).map((item) => `
    <article class="help-card">
      <h3>${item.name}</h3>
      <strong>${item.contact}</strong>
      <p>${item.instruction}</p>
    </article>
  `).join("") || empty("help records");
}

function renderAll() {
  renderDashboard();
  renderSociety();
  renderResidents();
  renderRwa();
  renderMaintenance();
  renderUtilities();
  renderComplaints();
  renderSecurity();
  renderWorkers();
  renderDocuments();
  renderNotices();
  renderEvents();
  renderReports();
  renderHelp();
}

function setActiveNav(hash) {
  const targetHash = hash || "#dashboard";
  document.querySelectorAll(".app-nav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === targetHash);
  });
}

function setupNavigation() {
  const links = [...document.querySelectorAll(".app-nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const hash = link.getAttribute("href");
      const target = document.querySelector(hash);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", hash);
      setActiveNav(hash);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      setActiveNav(`#${visible.target.id}`);
    }
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0.15, 0.35, 0.6] });

  sections.forEach((section) => observer.observe(section));
  setActiveNav(location.hash || "#dashboard");
}

function setupFilters() {
  const blockSelect = document.querySelector(selectors.block);
  state.data.society.blocks.forEach((block) => {
    const option = document.createElement("option");
    option.value = block;
    option.textContent = `Block ${block}`;
    blockSelect.append(option);
  });

  document.querySelector(selectors.search).addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderAll();
  });
  document.querySelector(selectors.block).addEventListener("change", (event) => {
    state.block = event.target.value;
    renderAll();
  });
  document.querySelector(selectors.status).addEventListener("change", (event) => {
    state.propertyStatus = event.target.value;
    renderSociety();
  });
  document.querySelector(selectors.member).addEventListener("change", (event) => {
    state.memberStatus = event.target.value;
    renderResidents();
  });
  document.querySelector(selectors.complaint).addEventListener("change", (event) => {
    state.complaintStatus = event.target.value;
    renderComplaints();
  });
  document.querySelector(selectors.event).addEventListener("change", (event) => {
    state.eventStatus = event.target.value;
    renderEvents();
  });
}

async function init() {
  const [publicResponse, eventsResponse] = await Promise.all([
    fetch("data/public-data.json"),
    fetch("data/events.json")
  ]);
  state.data = await publicResponse.json();
  state.events = (await eventsResponse.json()).events;
  setupFilters();
  setupNavigation();
  renderAll();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="load-error">Unable to load portal data: ${error.message}</div>`);
});

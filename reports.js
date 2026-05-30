const state = {
  publicData: null,
  reportData: null,
  search: "",
  category: "all",
  block: "all",
  status: "all",
  uploadStatus: "all"
};

const byId = (id) => document.getElementById(id);
const money = (value) => `INR ${Number(value).toLocaleString("en-IN")}`;
const pct = (part, total) => `${Math.round((part / Math.max(total, 1)) * 100)}%`;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
})[char]);

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function analytics() {
  const data = state.publicData;
  const totalProperties = data.properties.length;
  const occupied = data.properties.filter((p) => ["Occupied", "Rented"].includes(p.occupancy)).length;
  const residents = data.properties.filter((p) => !["Vacant Plot", "Builder Pending"].includes(p.occupancy)).length;
  const collectionTotal = data.maintenance.monthlyCollections.reduce((sum, item) => sum + item.amount, 0);
  const collected = data.maintenance.monthlyCollections.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const expenses = data.maintenance.expenses.reduce((sum, item) => sum + item.amount, 0);
  const openComplaints = data.complaints.filter((item) => !["Resolved", "Closed"].includes(item.status)).length;
  const activeWorkers = data.workers.filter((item) => item.attendance === "Present").length;
  return { totalProperties, occupied, residents, collectionTotal, collected, expenses, openComplaints, activeWorkers };
}

function reportMetrics(report) {
  const data = state.publicData;
  const a = analytics();
  const map = {
    finance: {
      total: data.maintenance.monthlyCollections.length + data.maintenance.expenses.length,
      kpis: [["Collection Rate", pct(a.collected, a.collectionTotal)], ["Pending Dues", money(a.collectionTotal - a.collected)], ["Expenses", money(a.expenses)], ["Vendor Bills", data.maintenance.vendorBills.length]]
    },
    residents: {
      total: data.properties.length,
      kpis: [["Total Residents", a.residents], ["Owners", data.properties.filter((p) => p.ownership === "Owner").length], ["Tenants", data.properties.filter((p) => p.ownership === "Tenant").length], ["RWA Members", data.properties.filter((p) => p.rwaMember).length]]
    },
    maintenance: {
      total: data.maintenance.workHistory.length + data.maintenance.vendorBills.length,
      kpis: [["Open Tasks", data.maintenance.workHistory.filter((t) => t.status !== "Resolved").length], ["Completed Tasks", data.maintenance.workHistory.filter((t) => t.status === "Resolved").length], ["Cost Summary", money(a.expenses)], ["Vendors", data.maintenance.vendorBills.length]]
    },
    complaints: {
      total: data.complaints.length,
      kpis: [["Open", data.complaints.filter((c) => c.status === "Open").length], ["In Progress", data.complaints.filter((c) => c.status === "In Progress").length], ["Resolved", data.complaints.filter((c) => c.status === "Resolved").length], ["Categories", Object.keys(countBy(data.complaints, "category")).length]]
    },
    security: {
      total: data.security.entries.length + data.security.gatePassRecords.length,
      kpis: [["Visitors Today", data.security.entries.length], ["Gate Passes", data.security.gatePassRecords.length], ["Vehicles", data.security.entries.filter((e) => e.vehicle && e.vehicle !== "Private").length], ["Deliveries", data.security.entries.filter((e) => e.type === "Delivery").length]]
    },
    workers: {
      total: data.workers.length,
      kpis: [["Present", a.activeWorkers], ["Absent", data.workers.filter((w) => w.attendance === "Absent").length], ["Paid", data.workers.filter((w) => w.paymentStatus === "Paid").length], ["Pending Salary", data.workers.filter((w) => w.paymentStatus === "Pending").length]]
    },
    utilities: {
      total: data.utilities.length,
      kpis: [["Working", data.utilities.filter((u) => u.status === "Working").length], ["Open", data.utilities.filter((u) => u.status === "Open").length], ["Planned", data.utilities.filter((u) => u.status === "Planned").length], ["Live", data.utilities.filter((u) => u.status === "Live").length]]
    },
    rwa: {
      total: data.rwa.officeBearers.length + data.rwa.executiveMembers.length + data.rwa.blockCoordinators.length,
      kpis: [["Office Bearers", data.rwa.officeBearers.length], ["Executives", data.rwa.executiveMembers.length], ["Coordinators", data.rwa.blockCoordinators.length], ["Meetings", data.rwa.meetingSchedule.length]]
    },
    uploads: {
      total: state.reportData.uploadedReports.length,
      kpis: [["Published", state.reportData.uploadedReports.filter((u) => u.status === "Published").length], ["Draft", state.reportData.uploadedReports.filter((u) => u.status === "Draft").length], ["Formats", new Set(state.reportData.uploadedReports.map((u) => u.fileType)).size], ["Repository", "Ready"]]
    }
  };
  return map[report.id] || { total: 0, kpis: [] };
}

function renderKpis() {
  const data = state.publicData;
  const a = analytics();
  const kpis = [
    ["Total Properties", a.totalProperties, "residents"],
    ["Total Residents", a.residents, "residents"],
    ["Collection Rate", pct(a.collected, a.collectionTotal), "finance"],
    ["Open Complaints", a.openComplaints, "complaints"],
    ["Today's Visitors", data.security.entries.length, "security"],
    ["Active Workers", a.activeWorkers, "workers"],
    ["Water System Status", data.utilities.find((u) => u.name === "Common water system")?.status || "Tracked", "utilities"],
    ["Electricity Status", data.utilities.find((u) => u.name === "Common electricity")?.status || "Tracked", "rwa"]
  ];
  byId("kpiGrid").innerHTML = kpis.map(([label, value, theme]) => `
    <article class="kpi-card ${theme}"><strong>${label}</strong><span>${escapeHtml(value)}</span></article>
  `).join("");
}

function fillFilters() {
  const categories = state.reportData.autoReports.map((r) => r.category);
  byId("categoryFilter").innerHTML = ["<option value=\"all\">All Categories</option>", ...categories.map((c) => `<option>${escapeHtml(c)}</option>`)].join("");
  byId("dateFilter").innerHTML = ["<option value=\"all\">All Dates</option>", ...state.reportData.dateRanges.map((d) => `<option>${escapeHtml(d)}</option>`)].join("");
  byId("blockFilter").innerHTML = ["<option value=\"all\">All Blocks</option>", ...state.publicData.society.blocks.map((b) => `<option>Block ${escapeHtml(b)}</option>`)].join("");
  byId("statusFilter").innerHTML = ["<option value=\"all\">All Statuses</option>", ...state.reportData.reportStatuses.map((s) => `<option>${escapeHtml(s)}</option>`)].join("");
}

function reportMatches(report) {
  const text = JSON.stringify(report).toLowerCase();
  const searchOk = !state.search || text.includes(state.search);
  const categoryOk = state.category === "all" || report.category === state.category;
  const statusOk = state.status === "all" || report.status === state.status;
  return searchOk && categoryOk && statusOk;
}

function renderReportCards() {
  const reports = state.reportData.autoReports.filter(reportMatches);
  byId("reportCount").textContent = `${reports.length} categories`;
  byId("reportCards").innerHTML = reports.map((report) => {
    const metrics = reportMetrics(report);
    return `
      <article class="report-card ${escapeHtml(report.theme)}">
        <div class="card-top"><span class="report-icon">${escapeHtml(report.icon)}</span><span class="badge">${escapeHtml(report.status)}</span></div>
        <h3>${escapeHtml(report.name)}</h3>
        <p>${escapeHtml(report.summary)}</p>
        <div class="report-meta">
          <span><strong>${metrics.total}</strong>Total Records</span>
          <span><strong>${escapeHtml(state.reportData.lastUpdated)}</strong>Last Updated</span>
        </div>
        <button class="view-button" type="button" data-report-id="${escapeHtml(report.id)}">View Details</button>
      </article>
    `;
  }).join("") || "<div class=\"report-card\">No reports match the selected filters.</div>";
}

function renderCharts() {
  const blockCounts = Object.entries(countBy(state.publicData.properties, "block")).map(([label, value]) => ({ label, value }));
  const max = Math.max(...blockCounts.map((b) => b.value), 1);
  byId("blockChart").innerHTML = blockCounts.map((row) => `
    <div class="bar-row"><span>Block ${row.label}</span><i><b style="width:${(row.value / max) * 100}%"></b></i><strong>${row.value}</strong></div>
  `).join("");

  const finance = state.reportData.autoReports.find((r) => r.id === "finance").trend;
  const fMax = Math.max(...finance, 1);
  byId("financeChart").innerHTML = finance.map((value) => `<span class="line-bar" title="${value}" style="height:${(value / fMax) * 100}%"></span>`).join("");

  const complaintCount = state.publicData.complaints.length;
  byId("complaintChart").innerHTML = `<div class="donut"><span>${complaintCount} total</span></div><p>Open, in-progress and resolved complaint mix from current JSON.</p>`;
}

function renderUploads() {
  const uploads = state.reportData.uploadedReports.filter((item) => {
    const searchOk = !state.search || JSON.stringify(item).toLowerCase().includes(state.search);
    const categoryOk = state.category === "all" || item.category === state.category;
    const statusOk = state.uploadStatus === "all" || item.status === state.uploadStatus;
    return searchOk && categoryOk && statusOk;
  });
  byId("uploadCards").innerHTML = uploads.map((item) => `
    <article class="upload-card">
      <span class="badge">${escapeHtml(item.fileType)} / ${escapeHtml(item.status)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <div class="report-meta">
        <span><strong>${escapeHtml(item.category)}</strong>Category</span>
        <span><strong>${escapeHtml(item.uploadDate)}</strong>Upload Date</span>
        <span><strong>${escapeHtml(item.uploadedBy)}</strong>Uploaded By</span>
      </div>
      <div class="upload-actions">
        <button type="button" data-action="View ${escapeHtml(item.title)}">View</button>
        <button type="button" data-action="Download ${escapeHtml(item.title)}">Download</button>
      </div>
    </article>
  `).join("") || "<article class=\"upload-card\"><h3>No uploaded reports found</h3><p>Try another filter.</p></article>";
}

function openReport(reportId) {
  const report = state.reportData.autoReports.find((item) => item.id === reportId);
  if (!report) return;
  const metrics = reportMetrics(report);
  byId("modalContent").innerHTML = `
    <div class="modal-body ${escapeHtml(report.theme)}">
      <div class="modal-hero">
        <p class="eyebrow">${escapeHtml(report.category)}</p>
        <h2 id="modalTitle">${escapeHtml(report.name)}</h2>
        <p>${escapeHtml(report.summary)}</p>
      </div>
      <div class="modal-kpis">${metrics.kpis.map(([label, value]) => `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}</div>
      <h3>Included Reports</h3>
      <div class="modal-table">${report.reports.map((name) => `<div>${escapeHtml(name)}</div>`).join("")}</div>
      <h3>Trend Analysis</h3>
      <div class="line-chart">${report.trend.map((value) => `<span class="line-bar" style="height:${(value / Math.max(...report.trend, 1)) * 100}%"></span>`).join("")}</div>
      <h3>Upload History</h3>
      <div class="modal-table">${state.reportData.uploadedReports.filter((u) => u.category === report.category || report.id === "uploads").map((u) => `<div><strong>${escapeHtml(u.title)}</strong><br>${escapeHtml(u.fileType)} / ${escapeHtml(u.status)}</div>`).join("") || "<div>No related uploads yet.</div>"}</div>
      <div class="modal-actions">
        ${state.reportData.downloadOptions.map((label) => `<button type="button" data-action="${escapeHtml(label)}">${escapeHtml(label)}</button>`).join("")}
      </div>
    </div>
  `;
  const modal = byId("reportModal");
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function renderAll() {
  renderKpis();
  renderReportCards();
  renderCharts();
  renderUploads();
}

function setupEvents() {
  byId("lastUpdated").textContent = `Updated ${state.reportData.lastUpdated}`;
  byId("searchInput").addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderReportCards();
    renderUploads();
  });
  byId("categoryFilter").addEventListener("change", (event) => {
    state.category = event.target.value;
    renderReportCards();
    renderUploads();
  });
  byId("statusFilter").addEventListener("change", (event) => {
    state.status = event.target.value;
    renderReportCards();
  });
  byId("uploadFilter").addEventListener("change", (event) => {
    state.uploadStatus = event.target.value;
    renderUploads();
  });
  byId("blockFilter").addEventListener("change", (event) => {
    state.block = event.target.value;
    showToast(`${state.block} filter placeholder applied to detailed report tables.`);
  });
  byId("dateFilter").addEventListener("change", (event) => {
    showToast(`${event.target.value} date filter placeholder selected.`);
  });
  byId("reportCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-report-id]");
    if (button) openReport(button.dataset.reportId);
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) showToast(`${button.dataset.action}: admin/login workflow placeholder.`);
  });
  byId("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ibpReportsTheme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("ibpReportsTheme") === "dark") {
    document.body.classList.add("dark");
  }
}

async function init() {
  const [publicResponse, reportResponse] = await Promise.all([
    fetch("data/public-data.json"),
    fetch("reports-data.json")
  ]);
  state.publicData = await publicResponse.json();
  state.reportData = await reportResponse.json();
  fillFilters();
  setupEvents();
  renderAll();
}

init().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="admin-panel">Unable to load reports: ${escapeHtml(error.message)}</div>`);
});

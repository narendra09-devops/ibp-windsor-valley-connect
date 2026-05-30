const blocks = ["A", "B", "C", "D", "E", "F", "G", "H"];

const residentSourceRows = [
  ["A", "01", "Sanjeev Pande"],
  ["A", "02", "Saumuya"],
  ["A", "03", "Pooja"],
  ["A", "04", "Biswajeet"],
  ["A", "05", "Atul"],
  ["A", "06", "Umesh M"],
  ["A", "07", "Prabhu Dayal"],
  ["A", "08", "Harsh Mangal"],
  ["B", "01", "Rajnish Kumar"],
  ["B", "02", "Manish"],
  ["B", "03", "Narendra Pratap Singh"],
  ["B", "04", "Nitesh Mulgali"],
  ["B", "05", "Nimesh"],
  ["B", "06", "Nitesh"],
  ["B", "07", "Vasanth Gurude"],
  ["B", "08", "Narendra Vats"],
  ["B", "09", "Sanjay Rastogi"],
  ["B", "10", ""],
  ["B", "11", "Avinash Singh"],
  ["B", "12", "Hardik Mudgal"],
  ["C", "01", ""],
  ["C", "02", ""],
  ["C", "03", "Roshan Kumar"],
  ["C", "04", "Ravi Ranjan"],
  ["C", "05", "Nitin Arora"],
  ["C", "06", "Dhruv Tripathi"],
  ["C", "07", ""],
  ["C", "08", ""],
  ["C", "09", ""],
  ["C", "10", ""],
  ["C", "11", ""],
  ["C", "12", ""],
  ["D", "01", "Ashish Rai"],
  ["D", "02", "Ram Krishna Gautam"],
  ["D", "03", "Ashok Yadav"],
  ["D", "04", "Pradeep Kumar"],
  ["D", "05", "Krishana Mishara"],
  ["D", "06", "Shiv Ram Tathagat"],
  ["E", "01", "Gautam Kumar"],
  ["E", "02", "Rakesh Singh"],
  ["E", "03", "Anuj"],
  ["E", "04", "Deepak"],
  ["E", "05", ""],
  ["E", "06", ""],
  ["F", "01", ""],
  ["F", "02", ""],
  ["F", "03", ""],
  ["F", "04", ""],
  ["F", "05", ""],
  ["F", "06", ""],
  ["F", "07", ""],
  ["F", "08", ""],
  ["F", "09", ""],
  ["F", "10", ""],
  ["G", "01", ""],
  ["G", "02", ""],
  ["G", "03", ""],
  ["G", "04", ""],
  ["G", "05", ""],
  ["G", "06", ""],
  ["G", "07", ""],
  ["G", "08", ""],
  ["G", "09", ""],
  ["G", "10", ""],
  ["H", "01", ""],
  ["H", "02", ""],
  ["H", "03", ""],
  ["H", "04", ""],
  ["H", "05", ""],
  ["H", "06", ""]
];

const residentProperties = residentSourceRows.map(([block, number, residentName]) => {
  const hasResident = Boolean(residentName);
  return {
    block,
    number: `${block}-${number}`,
    status: hasResident ? "Occupied" : "Builder Pending",
    rwaMember: hasResident,
    occupant: hasResident ? residentName : "Resident details pending",
    waterSource: hasResident ? "Common" : "Not Connected"
  };
});

const publicData = {
  lastUpdated: "30 May 2026, 02:30 PM",
  properties: residentProperties,
  maintenance: [
    { title: "Water motor repair", description: "Main borewell motor vibration reported near Block C.", status: "Open", block: "C", priority: "High" },
    { title: "Street light issue", description: "Three poles inactive between Blocks E and F.", status: "In Progress", block: "E-F", priority: "Medium" },
    { title: "Sewage issue", description: "Drain overflow check requested behind Block B.", status: "Open", block: "B", priority: "High" },
    { title: "Cleaning issue", description: "Construction debris needs removal from Block D service lane.", status: "In Progress", block: "D", priority: "Medium" },
    { title: "Security issue", description: "Night patrolling log audit scheduled.", status: "Open", block: "All", priority: "Medium" },
    { title: "Common electricity", description: "Meter reading and backup light bill review pending.", status: "In Progress", block: "Gate", priority: "Low" }
  ],
  expenses: [
    { date: "2026-05-28", category: "Water motor repair", amount: 4800, paidTo: "Motor Service Vendor", status: "Pending" },
    { date: "2026-05-24", category: "Cleaning issue", amount: 2200, paidTo: "Sanitation Team", status: "Paid" },
    { date: "2026-05-20", category: "Street light issue", amount: 3450, paidTo: "Electrical Store", status: "Paid" },
    { date: "2026-05-16", category: "Common electricity", amount: 7900, paidTo: "Utility Account", status: "Paid" }
  ],
  workers: [
    { name: "Mahesh", role: "Security Guard", mobile: "Private", attendance: "Present", dutyTime: "08:00 AM - 08:00 PM", area: "Main Gate" },
    { name: "Pooja", role: "Sweeper", mobile: "Private", attendance: "Present", dutyTime: "07:00 AM - 11:00 AM", area: "Blocks A-C" },
    { name: "Ramesh", role: "Electrician", mobile: "Private", attendance: "Absent", dutyTime: "On Call", area: "All Blocks" },
    { name: "Iqbal", role: "Plumber", mobile: "Private", attendance: "Present", dutyTime: "10:00 AM - 04:00 PM", area: "Blocks D-H" },
    { name: "Sohan", role: "Carpenter", mobile: "Private", attendance: "Absent", dutyTime: "On Call", area: "Club Office" },
    { name: "Biren", role: "Labour", mobile: "Private", attendance: "Present", dutyTime: "09:00 AM - 05:00 PM", area: "Block D" },
    { name: "Arun", role: "Technician", mobile: "Private", attendance: "Present", dutyTime: "11:00 AM - 06:00 PM", area: "Water Plant" }
  ],
  visitors: [
    { name: "Amit Courier", house: "A-01", entry: "09:10 AM", exit: "09:22 AM", vehicleType: "Bike", vehicleMasked: "UP16 **** 42", purpose: "Delivery" },
    { name: "Deepak Vendor", house: "D-01", entry: "10:35 AM", exit: "-", vehicleType: "Mini Truck", vehicleMasked: "HR26 **** 19", purpose: "Vendor" },
    { name: "Neha Guest", house: "E-02", entry: "11:05 AM", exit: "-", vehicleType: "Car", vehicleMasked: "DL8C **** 87", purpose: "Guest" },
    { name: "Site Worker", house: "F-04", entry: "08:45 AM", exit: "-", vehicleType: "None", vehicleMasked: "Private", purpose: "Worker" }
  ],
  bankAccount: {
    accountName: "IBP Windsor Valley RWA",
    bankName: "Canara Bank",
    accountNumber: "Masked for public website",
    ifsc: "Available with RWA Treasurer",
    upi: "ppr.18882.20072024.00714042@cnrb",
    note: "Use the QR/UPI for society maintenance payments. Mention house number and month in payment remarks."
  },
  layoutBlocks: [
    { block: "A", title: "Block-A", plots: ["Commercial", "A-01", "A-02", "A-03", "A-04", "A-05", "A-06", "A-07", "A-08", "Other Plots"], className: "layout-a" },
    { block: "B", title: "Block-B", plots: ["B-01", "B-02", "B-03", "B-04", "B-05", "B-06", "B-07", "B-08", "B-09", "B-10", "B-11", "B-12"], className: "layout-b" },
    { block: "C", title: "Block-C", plots: ["C-01", "C-02", "C-03", "C-04", "C-05", "C-06", "C-07", "C-08", "C-09", "C-10", "C-11", "C-12"], className: "layout-c" },
    { block: "D", title: "Block-D", plots: ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06", "Other Size"], className: "layout-d" }
  ],
  locationNotes: [
    "Connected from Gaur Chowk and the service road corridor.",
    "Nearby references include school, hospital, proposed metro route, and main commercial access.",
    "Main entrance shown from the 40 ft wide road in the layout diagram.",
    "Diagram is a simplified web version for resident orientation, not a legal site plan."
  ],
  monthlyFinance: [
    { month: "May 2026", expected: 70000, received: 52000, pending: 18000, expenses: 18350, closingBalance: 33650 },
    { month: "April 2026", expected: 68000, received: 61000, pending: 7000, expenses: 26750, closingBalance: 34250 },
    { month: "March 2026", expected: 64000, received: 58500, pending: 5500, expenses: 22100, closingBalance: 36400 }
  ],
  payments: [
    { house: "A-01", resident: "Sanjeev Pande", month: "May 2026", amount: 1000, mode: "UPI", status: "Received" },
    { house: "A-02", resident: "Saumuya", month: "May 2026", amount: 1000, mode: "Bank Transfer", status: "Received" },
    { house: "B-03", resident: "Narendra Pratap Singh", month: "May 2026", amount: 1000, mode: "UPI", status: "Received" },
    { house: "B-10", resident: "Resident details pending", month: "May 2026", amount: 1000, mode: "Pending", status: "Pending" },
    { house: "C-03", resident: "Roshan Kumar", month: "May 2026", amount: 1000, mode: "Cash", status: "Received" },
    { house: "E-05", resident: "Resident details pending", month: "May 2026", amount: 1000, mode: "Pending", status: "Pending" }
  ],
  documents: [
    { title: "RWA Certificate", type: "Compliance", status: "Active", summary: "Official RWA Windsor Valley certificate PDF for public reference.", link: "assets/documents/RWA_Windsor_Valley_Certificate.pdf" },
    { title: "Maintenance Policy", type: "Policy", status: "Active", summary: "Monthly maintenance billing, due date, late fee, and expense approval rules." },
    { title: "Visitor Gate Pass Policy", type: "Security", status: "Active", summary: "Entry, exit, vehicle, delivery, and worker verification rules for the gate register." },
    { title: "Payment Collection Policy", type: "Accounts", status: "Active", summary: "Accepted payment modes, receipt tracking, bank reconciliation, and treasurer review." },
    { title: "Common Area Usage Policy", type: "Community", status: "Draft", summary: "Guidelines for cleaning, parking, noise, construction material, and shared electricity usage." }
  ],
  events: [
    { title: "Holi Milan", date: "March 2026", type: "Festival", media: "Photos + Video", summary: "Resident colors, group photos, music, refreshments, and children activities.", theme: "holi" },
    { title: "Diwali Celebration", date: "November 2026", type: "Festival", media: "Photos", summary: "Lighting, rangoli, diya decoration, sweets, and family group photos.", theme: "diwali" },
    { title: "Jagran Program", date: "October 2026", type: "Cultural", media: "Video", summary: "Evening devotional program, stage setup, prasad distribution, and community gathering.", theme: "jagran" },
    { title: "RWA Monthly Meeting", date: "Monthly", type: "Meeting", media: "Minutes + Photos", summary: "Maintenance review, payment collection update, open issues, and next action list.", theme: "meeting" }
  ],
  gateRules: [
    "Every visitor must share name, visiting house, purpose, entry time, and exit time at the gate.",
    "Full mobile numbers and full vehicle numbers must stay private and visible only to authorized security/RWA login users.",
    "Delivery and vendor entries should be marked with expected exit time and assigned house or block.",
    "Construction workers must carry daily approval from the resident, builder, or site supervisor.",
    "Night entries after 10:00 PM should be confirmed by the resident or security supervisor.",
    "Emergency service entries should be allowed immediately and recorded after the situation is stable."
  ]
};

const privateData = {
  residentContacts: "Stored only in the local Excel source. Do not publish phone numbers or email IDs to GitHub Pages.",
  workerMobiles: "Reserved for future login-based access.",
  fullVehicleNumbers: "Reserved for future login-based access.",
  documents: "Reserved for future login-based access."
};

const state = {
  block: "all",
  status: "all",
  query: ""
};

const statusClass = {
  "Occupied": "occupied",
  "Under Construction": "construction",
  "Empty Plot": "empty",
  "Builder Pending": "pending",
  "Rented": "rented",
  "Present": "present",
  "Absent": "absent",
  "Open": "open",
  "In Progress": "progress",
  "Paid": "paid",
  "Pending": "pending",
  "Received": "paid",
  "Draft": "pending",
  "Active": "paid",
  "Yes": "paid",
  "No": "pending"
};

const elements = {
  blockFilter: document.querySelector("#blockFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  globalSearch: document.querySelector("#globalSearch"),
  overviewCards: document.querySelector("#overviewCards"),
  propertyRows: document.querySelector("#propertyRows"),
  propertyChart: document.querySelector("#propertyChart"),
  blockChart: document.querySelector("#blockChart"),
  maintenanceCards: document.querySelector("#maintenanceCards"),
  expenseRows: document.querySelector("#expenseRows"),
  workerRows: document.querySelector("#workerRows"),
  visitorRows: document.querySelector("#visitorRows"),
  financeCards: document.querySelector("#financeCards"),
  financeMonthLabel: document.querySelector("#financeMonthLabel"),
  bankAccountDetails: document.querySelector("#bankAccountDetails"),
  collectionChart: document.querySelector("#collectionChart"),
  monthlyFinanceRows: document.querySelector("#monthlyFinanceRows"),
  paymentRows: document.querySelector("#paymentRows"),
  documentCards: document.querySelector("#documentCards"),
  gateRuleList: document.querySelector("#gateRuleList"),
  upiDetails: document.querySelector("#upiDetails"),
  layoutBlocks: document.querySelector("#layoutBlocks"),
  locationNotes: document.querySelector("#locationNotes"),
  eventCards: document.querySelector("#eventCards"),
  lastUpdated: document.querySelector("#lastUpdated"),
  propertyTotalLabel: document.querySelector("#propertyTotalLabel"),
  openIssueLabel: document.querySelector("#openIssueLabel")
};

function money(value) {
  return `INR ${Number(value).toLocaleString("en-IN")}`;
}

function getFilteredProperties() {
  const query = state.query.trim().toLowerCase();
  return publicData.properties.filter((property) => {
    const matchesBlock = state.block === "all" || property.block === state.block;
    const matchesStatus = state.status === "all" || property.status === state.status;
    const text = Object.values(property).join(" ").toLowerCase();
    return matchesBlock && matchesStatus && (!query || text.includes(query));
  });
}

function matchesQuery(record) {
  const query = state.query.trim().toLowerCase();
  return !query || Object.values(record).join(" ").toLowerCase().includes(query);
}

function badge(value) {
  const className = statusClass[value] || "";
  return `<span class="badge ${className}">${value}</span>`;
}

function renderFilters() {
  blocks.forEach((block) => {
    const option = document.createElement("option");
    option.value = block;
    option.textContent = `Block ${block}`;
    elements.blockFilter.append(option);
  });
}

function renderOverview() {
  const properties = state.block === "all"
    ? publicData.properties
    : publicData.properties.filter((property) => property.block === state.block);
  const count = (status) => properties.filter((property) => property.status === status).length;
  const occupied = count("Occupied") + count("Rented");
  const underConstruction = count("Under Construction");
  const emptyPlots = count("Empty Plot");
  const rwaMembers = properties.filter((property) => property.rwaMember).length;
  const nonRwaMembers = properties.length - rwaMembers;
  const openComplaints = publicData.maintenance.filter((issue) => issue.status !== "Closed").length;
  const activeWorkers = publicData.workers.filter((worker) => worker.attendance === "Present").length;
  const todayVisitors = publicData.visitors.length;
  const vehiclesParked = publicData.visitors.filter((visitor) => visitor.vehicleType !== "None" && visitor.exit === "-").length;
  const currentFinance = publicData.monthlyFinance[0];

  const metrics = [
    ["Blocks A to H", blocks.length, "Active layout blocks"],
    ["Total Plots/Houses", properties.length, "Filtered inventory"],
    ["Occupied Houses", occupied, "Resident names available"],
    ["Under Construction", underConstruction, "Owner or builder work"],
    ["Builder Pending", count("Builder Pending"), "Details pending"],
    ["RWA Members", rwaMembers, "Public member count"],
    ["Non-RWA Members", nonRwaMembers, "Follow-up required"],
    ["Open Complaints", openComplaints, "Maintenance queue"],
    ["Active Workers", activeWorkers, "Present today"],
    ["Today Visitors", todayVisitors, "Gate entries"],
    ["Vehicles Parked", vehiclesParked, "Currently inside"],
    ["Money Received", money(currentFinance.received), currentFinance.month]
  ];

  elements.overviewCards.innerHTML = metrics.map(([label, value, note]) => `
    <article class="metric-card">
      <strong>${label}</strong>
      <span>${value}</span>
      <small>${note}</small>
    </article>
  `).join("");

  elements.lastUpdated.textContent = `Updated ${publicData.lastUpdated}`;
  elements.propertyTotalLabel.textContent = `${properties.length} properties`;
  elements.openIssueLabel.textContent = `${openComplaints} open / active items`;
}

function renderCharts() {
  const properties = state.block === "all"
    ? publicData.properties
    : publicData.properties.filter((property) => property.block === state.block);
  const statuses = ["Occupied", "Rented", "Under Construction", "Empty Plot", "Builder Pending"];
  const max = Math.max(...statuses.map((status) => properties.filter((property) => property.status === status).length), 1);

  elements.propertyChart.innerHTML = statuses.map((status) => {
    const total = properties.filter((property) => property.status === status).length;
    return `
      <div class="bar-row">
        <span>${status}</span>
        <span class="bar-track"><i class="bar-fill" style="width:${(total / max) * 100}%"></i></span>
        <strong>${total}</strong>
      </div>
    `;
  }).join("");

  elements.blockChart.innerHTML = blocks.map((block) => {
    const blockProperties = publicData.properties.filter((property) => property.block === block);
    const active = blockProperties.filter((property) => ["Occupied", "Rented"].includes(property.status)).length;
    const percent = blockProperties.length ? Math.max((active / blockProperties.length) * 100, 8) : 8;
    return `
      <div class="block-bar">
        <i style="height:${percent * 1.45}px"></i>
        <span>${block}</span>
        <small>${active}/${blockProperties.length}</small>
      </div>
    `;
  }).join("");
}

function renderProperties() {
  const rows = getFilteredProperties();
  elements.propertyRows.innerHTML = rows.length ? rows.map((property) => `
    <tr>
      <td>Block ${property.block}</td>
      <td>${property.number}</td>
      <td>${badge(property.status)}</td>
      <td>${badge(property.rwaMember ? "Yes" : "No")}</td>
      <td>${property.occupant}</td>
      <td>${property.waterSource}</td>
    </tr>
  `).join("") : `<tr><td colspan="6" class="empty-state">No properties match the selected filters.</td></tr>`;
}

function renderMaintenance() {
  const issues = publicData.maintenance.filter((issue) => {
    const matchesBlock = state.block === "all" || issue.block.includes(state.block) || issue.block === "All";
    return matchesBlock && matchesQuery(issue);
  });
  elements.maintenanceCards.innerHTML = issues.length ? issues.map((issue) => `
    <article class="issue-card">
      <h3>${issue.title}</h3>
      <p>${issue.description}</p>
      <div class="issue-meta">
        ${badge(issue.status)}
        <span class="soft-pill">Block ${issue.block}</span>
        <span class="soft-pill">${issue.priority}</span>
      </div>
    </article>
  `).join("") : `<div class="empty-state">No maintenance items match the filters.</div>`;

  elements.expenseRows.innerHTML = publicData.expenses.filter(matchesQuery).map((expense) => `
    <tr>
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td>${money(expense.amount)}</td>
      <td>${expense.paidTo}</td>
      <td>${badge(expense.status)}</td>
    </tr>
  `).join("");
}

function renderFinance() {
  const current = publicData.monthlyFinance[0];
  const collectedPercent = Math.round((current.received / current.expected) * 100);
  const paidPayments = publicData.payments.filter((payment) => payment.status === "Received").length;
  const pendingPayments = publicData.payments.filter((payment) => payment.status === "Pending").length;
  const monthExpenses = publicData.expenses.reduce((total, expense) => total + expense.amount, 0);

  elements.financeMonthLabel.textContent = current.month;
  elements.financeCards.innerHTML = [
    ["Expected Collection", money(current.expected), "Monthly demand"],
    ["Money Received", money(current.received), `${collectedPercent}% collected`],
    ["Pending Collection", money(current.pending), "Follow-up list"],
    ["Expenses Paid", money(monthExpenses), "Current expense ledger"],
    ["Closing Balance", money(current.closingBalance), "After recorded expenses"],
    ["Receipts Logged", paidPayments, `${pendingPayments} pending entries`]
  ].map(([label, value, note]) => `
    <article class="finance-card">
      <strong>${label}</strong>
      <span>${value}</span>
      <small>${note}</small>
    </article>
  `).join("");

  const accountRows = [
    ["Account Name", publicData.bankAccount.accountName],
    ["Bank Name", publicData.bankAccount.bankName],
    ["Account No.", publicData.bankAccount.accountNumber],
    ["IFSC", publicData.bankAccount.ifsc],
    ["UPI", publicData.bankAccount.upi],
    ["Note", publicData.bankAccount.note]
  ];
  elements.bankAccountDetails.innerHTML = accountRows.map(([label, value]) => `
    <div>
      <strong>${label}</strong>
      <span>${value}</span>
    </div>
  `).join("");

  elements.upiDetails.innerHTML = `
    <strong>UPI ID</strong>
    <button class="copy-chip" type="button" data-copy="${publicData.bankAccount.upi}">${publicData.bankAccount.upi}</button>
    <span>${publicData.bankAccount.note}</span>
  `;

  const chartRows = [
    ["Received", current.received, current.expected],
    ["Pending", current.pending, current.expected],
    ["Expenses", current.expenses, current.expected]
  ];
  elements.collectionChart.innerHTML = chartRows.map(([label, value, max]) => `
    <div class="bar-row">
      <span>${label}</span>
      <span class="bar-track"><i class="bar-fill finance-fill" style="width:${(value / max) * 100}%"></i></span>
      <strong>${money(value)}</strong>
    </div>
  `).join("");

  elements.monthlyFinanceRows.innerHTML = publicData.monthlyFinance.map((row) => `
    <tr>
      <td>${row.month}</td>
      <td>${money(row.expected)}</td>
      <td>${money(row.received)}</td>
      <td>${money(row.pending)}</td>
      <td>${money(row.expenses)}</td>
      <td>${money(row.closingBalance)}</td>
    </tr>
  `).join("");

  elements.paymentRows.innerHTML = publicData.payments.filter(matchesQuery).map((payment) => `
    <tr>
      <td>${payment.house}</td>
      <td>${payment.resident}</td>
      <td>${payment.month}</td>
      <td>${money(payment.amount)}</td>
      <td>${payment.mode}</td>
      <td>${badge(payment.status)}</td>
    </tr>
  `).join("");
}

function renderDocuments() {
  elements.documentCards.innerHTML = publicData.documents.filter(matchesQuery).map((documentItem) => `
    <article class="document-card">
      <div class="document-icon">${documentItem.type.slice(0, 2).toUpperCase()}</div>
      <div>
        <h3>${documentItem.title}</h3>
        <p>${documentItem.summary}</p>
        <div class="issue-meta">
          <span class="soft-pill">${documentItem.type}</span>
          ${badge(documentItem.status)}
          ${documentItem.link ? `<a class="doc-link" href="${documentItem.link}" target="_blank" rel="noreferrer">Open PDF</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");

  elements.gateRuleList.innerHTML = publicData.gateRules.map((rule) => `<li>${rule}</li>`).join("");
}

function renderLayout() {
  elements.layoutBlocks.innerHTML = publicData.layoutBlocks.map((block) => `
    <section class="plot-zone ${block.className}">
      <h3>${block.title}</h3>
      <div class="plot-list">
        ${block.plots.map((plot) => `<span>${plot}</span>`).join("")}
      </div>
    </section>
  `).join("");

  elements.locationNotes.innerHTML = publicData.locationNotes.map((note) => `
    <div class="location-note">${note}</div>
  `).join("");
}

function renderEvents() {
  elements.eventCards.innerHTML = publicData.events.map((eventItem) => `
    <article class="event-card ${eventItem.theme}">
      <div class="event-media">
        <span>${eventItem.media}</span>
      </div>
      <div>
        <div class="event-meta">
          <span class="soft-pill">${eventItem.type}</span>
          <span class="soft-pill">${eventItem.date}</span>
        </div>
        <h3>${eventItem.title}</h3>
        <p>${eventItem.summary}</p>
        <button class="media-button" type="button">Add photos/video</button>
      </div>
    </article>
  `).join("");
}

function renderWorkers() {
  elements.workerRows.innerHTML = publicData.workers.filter(matchesQuery).map((worker) => `
    <tr>
      <td>${worker.name}</td>
      <td>${worker.role}</td>
      <td><span class="soft-pill">${worker.mobile}</span></td>
      <td>${badge(worker.attendance)}</td>
      <td>${worker.dutyTime}</td>
      <td>${worker.area}</td>
    </tr>
  `).join("");
}

function renderVisitors() {
  elements.visitorRows.innerHTML = publicData.visitors.filter(matchesQuery).map((visitor) => `
    <tr>
      <td>${visitor.name}</td>
      <td>${visitor.house}</td>
      <td>${visitor.entry}</td>
      <td>${visitor.exit}</td>
      <td>${visitor.vehicleType}<br><span class="soft-pill">${visitor.vehicleMasked}</span></td>
      <td>${visitor.purpose}</td>
    </tr>
  `).join("");
}

function render() {
  renderOverview();
  renderCharts();
  renderProperties();
  renderMaintenance();
  renderFinance();
  renderDocuments();
  renderLayout();
  renderEvents();
  renderWorkers();
  renderVisitors();
}

elements.blockFilter.addEventListener("change", (event) => {
  state.block = event.target.value;
  render();
});

elements.statusFilter.addEventListener("change", (event) => {
  state.status = event.target.value;
  render();
});

elements.globalSearch.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

document.addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (!copyButton || !navigator.clipboard) {
    return;
  }
  await navigator.clipboard.writeText(copyButton.dataset.copy);
  copyButton.textContent = "UPI copied";
  window.setTimeout(() => {
    copyButton.textContent = copyButton.dataset.copy;
  }, 1400);
});

renderFilters();
render();

window.publicSocietyData = publicData;

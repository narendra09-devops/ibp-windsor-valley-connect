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
  lastUpdated: "30 May 2026, 01:30 PM",
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
    { date: "2026-05-28", category: "Water motor repair", amount: "₹4,800", paidTo: "Motor Service Vendor", status: "Pending" },
    { date: "2026-05-24", category: "Cleaning issue", amount: "₹2,200", paidTo: "Sanitation Team", status: "Paid" },
    { date: "2026-05-20", category: "Street light issue", amount: "₹3,450", paidTo: "Electrical Store", status: "Paid" },
    { date: "2026-05-16", category: "Common electricity", amount: "₹7,900", paidTo: "Utility Account", status: "Paid" }
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
    { name: "Deepak Vendor", house: "D-14", entry: "10:35 AM", exit: "-", vehicleType: "Mini Truck", vehicleMasked: "HR26 **** 19", purpose: "Vendor" },
    { name: "Neha Guest", house: "E-21", entry: "11:05 AM", exit: "-", vehicleType: "Car", vehicleMasked: "DL8C **** 87", purpose: "Guest" },
    { name: "Site Worker", house: "F-04", entry: "08:45 AM", exit: "-", vehicleType: "None", vehicleMasked: "Private", purpose: "Worker" }
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
  "Pending": "pending"
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
  lastUpdated: document.querySelector("#lastUpdated"),
  propertyTotalLabel: document.querySelector("#propertyTotalLabel"),
  openIssueLabel: document.querySelector("#openIssueLabel")
};

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

  const metrics = [
    ["Blocks A to H", blocks.length, "Active layout blocks"],
    ["Total Plots/Houses", properties.length, "Filtered inventory"],
    ["Occupied Houses", occupied, "Includes rented homes"],
    ["Under Construction", underConstruction, "Owner or builder work"],
    ["Empty Plots", emptyPlots, "No active connection"],
    ["RWA Members", rwaMembers, "Public member count"],
    ["Non-RWA Members", nonRwaMembers, "Follow-up required"],
    ["Open Complaints", openComplaints, "Maintenance queue"],
    ["Active Workers", activeWorkers, "Present today"],
    ["Today Visitors", todayVisitors, "Gate entries"],
    ["Vehicles Parked", vehiclesParked, "Currently inside"]
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
      <td>${expense.amount}</td>
      <td>${expense.paidTo}</td>
      <td>${badge(expense.status)}</td>
    </tr>
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

renderFilters();
render();

window.publicSocietyData = publicData;

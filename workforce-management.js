const state = { workers:null, attendance:null, payments:null, holidays:null, search:"", role:"all", status:"all", payment:"all", area:"all", calendarWorker:"WRK-001" };
const byId = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" })[char]);

function showToast(message){ const toast=byId("toast"); toast.textContent=message; toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"),2200); }
function unique(values){ return [...new Set(values)].sort(); }
function options(values,label){ return [`<option value="all">${label}</option>`,...values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)].join(""); }
function workerById(id){ return state.workers.workers.find(w=>w.id===id); }
function paymentByWorker(id){ return state.payments.payments.find(p=>p.workerId===id) || {}; }
function recordsFor(id){ return state.attendance.records.filter(r=>r.workerId===id); }

function fillFilters(){
  const workers=state.workers.workers;
  byId("roleFilter").innerHTML=options(unique(workers.map(w=>w.role)),"All Roles");
  byId("statusFilter").innerHTML=options(unique(workers.map(w=>w.attendance)),"All Statuses");
  byId("paymentFilter").innerHTML=options(unique(workers.map(w=>w.paymentStatus)),"All Payments");
  byId("areaFilter").innerHTML=options(unique(workers.map(w=>w.area)),"All Areas");
  byId("calendarWorker").innerHTML=workers.map(w=>`<option value="${w.id}">${escapeHtml(w.name)} - ${escapeHtml(w.role)}</option>`).join("");
}

function filteredWorkers(){
  return state.workers.workers.filter(w=>{
    const text=JSON.stringify(w).toLowerCase();
    return (!state.search || text.includes(state.search)) && (state.role==="all"||w.role===state.role) && (state.status==="all"||w.attendance===state.status) && (state.payment==="all"||w.paymentStatus===state.payment) && (state.area==="all"||w.area===state.area);
  });
}

function renderSummary(){
  const workers=state.workers.workers;
  const rows=[
    ["Total Workers",workers.length,"security"],["Present Today",workers.filter(w=>w.attendance==="Present").length,"technician"],["Absent Today",workers.filter(w=>w.attendance==="Absent").length,"absent"],["On Leave",workers.filter(w=>w.attendance==="On Leave").length,"electrician"],["On Call",workers.filter(w=>w.attendance==="On Call").length,"labour"],["Security Staff",workers.filter(w=>w.role==="Security Guard").length,"security"],["Cleaning Staff",workers.filter(w=>w.role==="Sweeper").length,"cleaning"],["Maintenance Staff",workers.filter(w=>["Electrician","Plumber","Technician","Water Operator","Maintenance Helper"].includes(w.role)).length,"plumber"],["Pending Payments",workers.filter(w=>w.paymentStatus==="Pending").length,"pending"],["Paid This Month",workers.filter(w=>w.paymentStatus==="Paid").length,"technician"]
  ];
  byId("summaryCards").innerHTML=rows.map(([label,value,theme])=>`<article class="summary-card ${theme}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></article>`).join("");
}

function renderWorkers(){
  byId("workerCards").innerHTML=filteredWorkers().map(w=>`<article class="worker-card ${w.theme}">
    <div class="card-top"><span class="worker-icon">${escapeHtml(w.role.slice(0,3).toUpperCase())}</span><span class="status-badge">${escapeHtml(w.attendance)}</span></div>
    <h3>${escapeHtml(w.name)}</h3><p>${escapeHtml(w.role)}</p>
    <div class="worker-meta"><span><strong>${escapeHtml(w.shift)}</strong>Duty Shift</span><span><strong>${escapeHtml(w.area)}</strong>Assigned Area</span></div>
    <div class="badge-row"><span class="mini-badge ${w.paymentStatus==="Paid"?"paid":w.paymentStatus==="Pending"?"pending":""}">${escapeHtml(w.paymentStatus)}</span></div>
    <button class="details-button" type="button" data-worker-id="${w.id}">View Details</button>
  </article>`).join("") || "<article class=\"worker-card\"><h3>No workers found</h3></article>";
}

function renderAttendance(){
  const rows=state.attendance.records.filter(r=>r.date==="2026-05-31");
  byId("attendanceRows").innerHTML=`<table><thead><tr><th>Worker</th><th>Role</th><th>Date</th><th>Status</th><th>Shift</th><th>Check-in</th><th>Check-out</th><th>Area</th><th>Marked By</th><th>Remarks</th></tr></thead><tbody>${rows.map(r=>{const w=workerById(r.workerId);return `<tr><td>${escapeHtml(w.name)}</td><td>${escapeHtml(w.role)}</td><td>${r.date}</td><td>${r.status}</td><td>${r.shift}</td><td>${r.checkIn}</td><td>${r.checkOut}</td><td>${r.area}</td><td>${r.markedBy}</td><td>${r.remarks}</td></tr>`}).join("")}</tbody></table>`;
}

function statusCounts(records){ return ["Present","Absent","On Leave","Holiday","On Call","Half Day","Weekly Off"].map(s=>[s,records.filter(r=>r.status===s).length]); }
function renderCalendar(){
  const id=state.calendarWorker; const records=recordsFor(id); const byDate=Object.fromEntries(records.map(r=>[Number(r.date.slice(8,10)),r]));
  const counts=statusCounts(records); const payable=records.filter(r=>["Present","Half Day","On Call"].includes(r.status)).length;
  byId("calendarStats").innerHTML=[...counts,["Payable Days",payable]].map(([label,value])=>`<article class="summary-card security"><strong>${label}</strong><span>${value}</span></article>`).join("");
  byId("attendanceCalendar").innerHTML=Array.from({length:31},(_,i)=>i+1).map(day=>{const rec=byDate[day]; const status=rec?rec.status:""; return `<button type="button" class="calendar-day cal-${status.replaceAll(" ","\\ ")}" data-action="${rec?`${rec.date} ${status} ${rec.remarks}`:`2026-05-${String(day).padStart(2,"0")} no record`}"><strong>${day}</strong><span>${status||"No record"}</span></button>`}).join("");
}

function renderHolidays(){ byId("holidayCards").innerHTML=state.holidays.records.map(h=>{const w=workerById(h.workerId);return `<article class="worker-card electrician"><span class="status-badge">${h.type}</span><h3>${h.title}</h3><p>${h.date} / ${w.name}</p><p>${h.remarks}</p></article>`}).join(""); }
function renderPayments(){ byId("paymentCards").innerHTML=state.payments.payments.map(p=>{const w=workerById(p.workerId);return `<article class="worker-card ${p.status==="Paid"?"technician":p.status==="Pending"?"pending":"security"}"><span class="status-badge">${p.status}</span><h3>${w.name}</h3><p>${w.role}</p><p>Paid: ${p.paidAmount} / Pending: ${p.pendingAmount}</p><p>${p.mode} / ${p.paymentDate}</p></article>`}).join(""); }
function renderShifts(){ byId("shiftCards").innerHTML=state.workers.workers.map(w=>`<article class="worker-card ${w.theme}"><h3>${w.name}</h3><p>${w.role}</p><p>${w.shift}</p><p>${w.area}</p></article>`).join(""); }
function renderReports(){ byId("reportCards").innerHTML=["Attendance Summary","Security Attendance","Sweeper Attendance","Electrician Activity","Plumber Activity","Salary Status","Monthly Payment Report"].map(r=>`<article class="worker-card security"><h3>${r}</h3><p>Static report placeholder generated from worker JSON.</p><button type="button" data-action="Generate ${r}">Generate Report</button></article>`).join(""); }

function openWorker(id){
  const w=workerById(id); const recs=recordsFor(id); const payment=paymentByWorker(id);
  byId("modalContent").innerHTML=`<div class="modal-body ${w.theme}"><div class="modal-hero"><p class="eyebrow">${w.role}</p><h2 id="modalTitle">${w.name}</h2><p>Admin remarks, mobile number, ID proof and salary amount are hidden from public view.</p></div>
  <div class="detail-grid"><div><strong>Attendance</strong><br>${w.attendance}</div><div><strong>Shift</strong><br>${w.shift}</div><div><strong>Area</strong><br>${w.area}</div><div><strong>Payment</strong><br>${w.paymentStatus}</div><div><strong>Present Days</strong><br>${recs.filter(r=>r.status==="Present").length}</div><div><strong>Leave/Holiday</strong><br>${recs.filter(r=>["On Leave","Holiday"].includes(r.status)).length}</div></div>
  <div class="detail-panel"><h3>Payment Summary</h3><p>Monthly charge: ${payment.monthlyCharge || "Placeholder"} / Paid: ${payment.paidAmount || "0"} / Pending: ${payment.pendingAmount || "0"} / Mode: ${payment.mode || "-"}</p></div>
  <div class="detail-panel"><h3>Work History</h3><p>${recs.map(r=>`${r.date}: ${r.status} (${r.remarks})`).join("<br>")}</p></div>
  <div class="detail-panel"><h3>Documents Placeholder</h3><p>ID proof, contracts and bank documents are admin-only.</p></div>
  <div class="modal-actions"><button type="button" data-action="Generate worker profile report">Generate Report</button></div></div>`;
  const modal=byId("workerModal"); if(typeof modal.showModal==="function") modal.showModal(); else modal.setAttribute("open","");
}

function setupEvents(){
  byId("lastUpdated").textContent=`Updated ${state.workers.lastUpdated}`;
  ["searchInput","roleFilter","statusFilter","paymentFilter","areaFilter"].forEach(id=>byId(id).addEventListener(id==="searchInput"?"input":"change",e=>{ const map={searchInput:"search",roleFilter:"role",statusFilter:"status",paymentFilter:"payment",areaFilter:"area"}; state[map[id]]=id==="searchInput"?e.target.value.trim().toLowerCase():e.target.value; renderWorkers(); }));
  document.querySelector(".tabs").addEventListener("click",e=>{const btn=e.target.closest("[data-tab]"); if(!btn)return; document.querySelectorAll(".tabs button,.tab-panel").forEach(el=>el.classList.remove("active")); btn.classList.add("active"); byId(btn.dataset.tab).classList.add("active");});
  byId("calendarWorker").addEventListener("change",e=>{state.calendarWorker=e.target.value; renderCalendar();});
  byId("workerCards").addEventListener("click",e=>{const btn=e.target.closest("[data-worker-id]"); if(btn) openWorker(btn.dataset.workerId);});
  document.addEventListener("click",e=>{const action=e.target.closest("[data-action]"); if(action) showToast(`${action.dataset.action}: admin workflow placeholder.`);});
  byId("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark"); localStorage.setItem("ibpWorkforceTheme",document.body.classList.contains("dark")?"dark":"light");});
  if(localStorage.getItem("ibpWorkforceTheme")==="dark") document.body.classList.add("dark");
}

async function init(){
  const [w,a,p,h]=await Promise.all([fetch("data/workers.json"),fetch("data/worker-attendance.json"),fetch("data/worker-payments.json"),fetch("data/worker-holidays.json")]);
  state.workers=await w.json(); state.attendance=await a.json(); state.payments=await p.json(); state.holidays=await h.json();
  fillFilters(); setupEvents(); renderSummary(); renderWorkers(); renderAttendance(); renderCalendar(); renderHolidays(); renderPayments(); renderShifts(); renderReports();
}
init().catch(error=>document.body.insertAdjacentHTML("afterbegin",`<div class="access-strip">Unable to load workforce data: ${escapeHtml(error.message)}</div>`));

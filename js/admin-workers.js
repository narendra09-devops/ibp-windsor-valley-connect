async function loadAdminWorkers() {
  const [workersResponse, adminResponse] = await Promise.all([fetch("data/workers.json"), fetch("data/workers-admin.json")]);
  const workersData = await workersResponse.json();
  const adminData = await adminResponse.json();
  const target = document.getElementById("adminWorkerCards");
  if (!target) return;
  target.innerHTML = workersData.workers.map((worker) => `
    <article class="worker-card ${worker.theme}">
      <div class="card-top"><span class="worker-icon">${worker.role.slice(0,3).toUpperCase()}</span><span class="status-badge">${worker.attendance}</span></div>
      <h3>${worker.name}</h3><p>${worker.role} / ${worker.area}</p><p>Admin permissions prepared: ${Object.keys(adminData.permissions).length} roles</p>
      <button type="button" data-admin-action="Edit ${worker.name}">Edit</button>
      <button type="button" data-admin-action="Mark attendance for ${worker.name}">Attendance</button>
      <button type="button" data-admin-action="Update payment for ${worker.name}">Payment</button>
    </article>
  `).join("");
}
loadAdminWorkers().catch((error) => document.body.insertAdjacentHTML("afterbegin", `<div class="access-strip">Unable to load admin workers: ${error.message}</div>`));

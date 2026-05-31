async function loadAdminVisitors(){
  const [visitorsResponse, adminResponse]=await Promise.all([fetch("data/visitor-records.json"),fetch("data/visitor-admin.json")]);
  const visitorsData=await visitorsResponse.json(); const adminData=await adminResponse.json();
  const adminTarget=document.getElementById("adminVisitorCards");
  if(adminTarget){adminTarget.innerHTML=visitorsData.visitors.map(v=>`<article class="visitor-card ${v.theme}"><div class="card-top"><span class="visitor-icon">${v.type.slice(0,3).toUpperCase()}</span><span class="status-badge">${v.approvalStatus}</span></div><h3>${v.name}</h3><p>${v.block}-${v.house} / ${v.purpose}</p><p>Admin roles: ${Object.keys(adminData.roles).length}</p><button type="button" data-admin-action="Edit ${v.name}">Edit</button><button type="button" data-admin-action="Update exit ${v.name}">Update Exit</button><button type="button" data-admin-action="Archive ${v.name}">Archive</button></article>`).join("")}
  const approvalTarget=document.getElementById("approvalCards");
  if(approvalTarget){approvalTarget.innerHTML=visitorsData.visitors.filter(v=>["Pending","No Response"].includes(v.approvalStatus)).map(v=>`<article class="visitor-card pending"><span class="status-badge">${v.approvalStatus}</span><h3>${v.name}</h3><p>${v.block}-${v.house} / ${v.resident}</p><button type="button" data-admin-action="Send approval request for ${v.name}">Send Approval Request</button><button type="button" data-admin-action="Mark allowed ${v.name}">Allowed</button><button type="button" data-admin-action="Mark rejected ${v.name}">Rejected</button></article>`).join("")}
}
loadAdminVisitors().catch(error=>document.body.insertAdjacentHTML("afterbegin",`<div class="access-strip">Unable to load admin visitors: ${error.message}</div>`));

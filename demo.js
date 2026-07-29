const DEMO_KEY = "acta-demo-session-v1";

const seed = {
  role: "Delivery Lead",
  project: "Dublin Programme · Production",
  tasks: [
    { id: 1, title: "Approve steam valve replacement permit", module: "Safety", reference: "PTW-1042", due: "Today", priority: "Critical", complete: false },
    { id: 2, title: "Review process skid turnover dossier", module: "Vendor", reference: "VDR-018", due: "Tomorrow", priority: "High", complete: false },
    { id: 3, title: "Close mechanical punch item", module: "Construction", reference: "CP-014", due: "Friday", priority: "Medium", complete: false },
    { id: 4, title: "Accept Tier 2 utility escalation", module: "Tier boards", reference: "T2-041", due: "Today", priority: "High", complete: false },
    { id: 5, title: "Confirm QMS system-list revision", module: "Systems", reference: "SYS-001", due: "02 Aug", priority: "Normal", complete: false },
  ],
  documents: [
    { id: 1, number: "URS-014", title: "Clean Utility User Requirements", system: "SYS-014", stage: "Approval 1", status: "Awaiting your approval", comments: 8 },
    { id: 2, number: "VDR-018", title: "Process Skid Turnover Dossier", system: "SYS-022", stage: "Review", status: "In review", comments: 12 },
    { id: 3, number: "SOP-031", title: "Preventive Maintenance Procedure", system: "SYS-001", stage: "Quality approval", status: "Stage 1 complete", comments: 4 },
    { id: 4, number: "FAT-009", title: "Packaging Line FAT Report", system: "SYS-031", stage: "Complete", status: "Approved", comments: 6 },
  ],
  permits: [
    { id: 1, number: "PTW-1042", title: "Steam valve replacement", location: "Utilities", type: "Hot work", status: "Awaiting approval" },
    { id: 2, number: "PTW-1038", title: "Cable tray installation", location: "Production A", type: "Work at height", status: "Ongoing" },
    { id: 3, number: "PTW-1031", title: "Vessel inspection", location: "Tank farm", type: "Confined space", status: "Closed" },
  ],
  tiers: [
    { id: 1, title: "Confirm shutdown window", owner: "Operations", status: "Open", tier: 1 },
    { id: 2, title: "Resolve utility isolation conflict", owner: "Delivery", status: "Awaiting acceptance", tier: 2 },
    { id: 3, title: "Approve additional commissioning resource", owner: "Site leadership", status: "Open", tier: 3 },
  ],
  construction: [
    { scope: "Mechanical completion", company: "BuildRight", system: "SYS-014", progress: 92, status: "Ready for owner approval" },
    { scope: "Electrical installation", company: "VoltWorks", system: "SYS-014", progress: 76, status: "In progress" },
    { scope: "Controls integration", company: "Axis Automation", system: "SYS-022", progress: 64, status: "2 open punches" },
  ],
};

const cloneSeed = () => JSON.parse(JSON.stringify(seed));
const gate = document.querySelector("#demo-gate");
const app = document.querySelector("#demo-app");
const view = document.querySelector("#demo-view");
const title = document.querySelector("#demo-title");
const breadcrumb = document.querySelector("#demo-breadcrumb");
const toast = document.querySelector("#demo-toast");
let activeView = "overview";
let state = null;

function save() {
  sessionStorage.setItem(DEMO_KEY, JSON.stringify(state));
}

function initials(value) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2400);
}

function enterDemo(role) {
  state = JSON.parse(sessionStorage.getItem(DEMO_KEY) || "null") || cloneSeed();
  state.role = role || state.role;
  save();
  gate.hidden = true;
  app.hidden = false;
  document.querySelector("#role-switcher").value = state.role;
  document.querySelector("#project-switcher").value = state.project;
  document.querySelector("#demo-avatar").textContent = initials(state.role);
  render();
}

function resetDemo() {
  const role = state?.role || "Delivery Lead";
  const project = state?.project || seed.project;
  state = cloneSeed();
  state.role = role;
  state.project = project;
  save();
  render();
  showToast("Demonstration data reset.");
}

function signOut() {
  sessionStorage.removeItem(DEMO_KEY);
  state = null;
  app.hidden = true;
  gate.hidden = false;
  document.querySelector("#gate-role").value = "Delivery Lead";
}

function actionButton(label, action, id, secondary = false) {
  return `<button class="table-action${secondary ? " secondary" : ""}" data-action="${action}" data-id="${id}">${label}</button>`;
}

function overviewTemplate() {
  const open = state.tasks.filter((task) => !task.complete);
  const complete = state.tasks.filter((task) => task.complete);
  return `
    <div class="demo-welcome">
      <div><span class="demo-eyebrow">Wednesday, 29 July 2026</span><h2>Good afternoon, ${state.role}.</h2><p>Here is what needs your attention across ${state.project}.</p></div>
      <button class="demo-primary" data-action="new-task">+ Add an action</button>
    </div>
    <div class="demo-metrics">
      <article><span>Open work</span><strong>${open.length + 37}</strong><small><b>8</b> due this week</small></article>
      <article><span>Awaiting decision</span><strong>${state.documents.filter((doc) => doc.status.includes("approval")).length + 9}</strong><small><b>3</b> assigned to you</small></article>
      <article class="risk"><span>At risk</span><strong>6</strong><small>Constraints or overdue</small></article>
      <article><span>Execution readiness</span><strong>87%</strong><small><b>+4%</b> this week</small></article>
    </div>
    <div class="demo-grid">
      <article class="demo-panel span-2">
        <header><div><span class="demo-eyebrow">Assigned execution</span><h3>My work</h3></div><span class="panel-count">${open.length} shown</span></header>
        <div class="demo-table-wrap">
          <table class="demo-table"><thead><tr><th>Priority</th><th>Action</th><th>Source</th><th>Due</th><th></th></tr></thead>
          <tbody>${open.map((task) => `<tr><td><span class="priority-pill ${task.priority.toLowerCase()}">${task.priority}</span></td><td><b>${task.title}</b><small>${task.reference}</small></td><td>${task.module}</td><td>${task.due}</td><td>${actionButton("Complete", "complete-task", task.id)}</td></tr>`).join("")}</tbody></table>
        </div>
        ${complete.length ? `<details class="completed-demo"><summary>${complete.length} completed action${complete.length === 1 ? "" : "s"}</summary>${complete.map((task) => `<p><span>✓</span>${task.title}<small>Completed in this demo session</small></p>`).join("")}</details>` : ""}
      </article>
      <article class="demo-panel">
        <header><div><span class="demo-eyebrow">Six-week view</span><h3>Delivery pulse</h3></div><span class="positive">83%</span></header>
        <div class="demo-chart"><i style="height:45%"></i><i style="height:62%"></i><i style="height:54%"></i><i style="height:72%"></i><i style="height:81%"></i><i style="height:88%"></i></div>
        <div class="chart-axis"><span>W31</span><span>W36</span></div>
        <div class="chart-legend"><span><i></i> Planned completion</span><span>4 constraints open</span></div>
      </article>
      <article class="demo-panel">
        <header><div><span class="demo-eyebrow">Recent activity</span><h3>Execution thread</h3></div></header>
        <div class="activity-list">
          <p><i class="activity-icon approved">✓</i><span><b>URS-014 advanced to approval</b><small>Maeve completed review · 14:26</small></span></p>
          <p><i class="activity-icon">↗</i><span><b>Utility constraint escalated</b><small>Tier 1 → Tier 2 · 13:48</small></span></p>
          <p><i class="activity-icon amber">!</i><span><b>Construction punch overdue</b><small>SYS-022 · 11:06</small></span></p>
        </div>
      </article>
    </div>`;
}

function planningTemplate() {
  return `
    <div class="demo-welcome compact"><div><span class="demo-eyebrow">System-linked pull plan</span><h2>Area 2 execution plan</h2><p>Cross-stream sequencing with five working days per week.</p></div><button class="demo-primary" data-action="add-plan-task">+ Add task</button></div>
    <div class="planning-summary"><article><span>Overdue</span><strong>3</strong></article><article><span>Due this week</span><strong>8</strong></article><article><span>Six-week lookahead</span><strong>31</strong></article><article><span>Open constraints</span><strong>4</strong></article></div>
    <article class="demo-panel plan-panel">
      <div class="plan-toolbar"><span>Today · W31</span><div><button>−</button><button>Fit 6 weeks</button><button>+</button></div></div>
      <div class="pull-grid">
        <div class="pull-header"><b>Delivery row</b>${["Mon 27","Tue 28","Wed 29","Thu 30","Fri 31","Mon 03","Tue 04","Wed 05","Thu 06","Fri 07"].map((day) => `<span>${day}</span>`).join("")}</div>
        <div class="pull-row"><b>SYS-014<br><small>Mechanical</small></b><i class="pull-task green" style="grid-column:2 / span 3">Pipework completion</i><i class="pull-task blue" style="grid-column:5 / span 2">Pressure test</i><i class="pull-task purple" style="grid-column:8 / span 2">Handover</i></div>
        <div class="pull-row"><b>SYS-014<br><small>Electrical</small></b><i class="pull-task amber" style="grid-column:3 / span 2">Cable pull</i><i class="pull-task green" style="grid-column:6 / span 3">Terminate &amp; test</i></div>
        <div class="pull-row"><b>SYS-022<br><small>Controls</small></b><i class="pull-task blue constrained" style="grid-column:4 / span 3">Panel integration <em>!</em></i><i class="pull-task purple" style="grid-column:9 / span 2">SAT</i></div>
        <div class="today-line"></div>
      </div>
      <div class="plan-key"><span><i class="green"></i>Complete / on track</span><span><i class="blue"></i>In progress</span><span><i class="amber"></i>At risk</span><span><i class="purple"></i>Milestone</span></div>
    </article>`;
}

function tierTemplate() {
  const columns = [1, 2, 3].map((tier) => {
    const items = state.tiers.filter((item) => item.tier === tier);
    return `<article class="tier-column"><header><span>Tier ${tier}</span><b>${tier === 1 ? "Area delivery" : tier === 2 ? "Project coordination" : "Site leadership"}</b><small>${items.length} active</small></header><div>${items.map((item) => `<section><span class="tier-status">${item.status}</span><h4>${item.title}</h4><p>Owner · ${item.owner}</p>${tier < 3 ? actionButton("Escalate to Tier " + (tier + 1), "escalate-tier", item.id) : actionButton("Resolve", "resolve-tier", item.id)}</section>`).join("")}<button class="add-card">+ Add item</button></div></article>`;
  });
  return `<div class="demo-welcome compact"><div><span class="demo-eyebrow">Explicit ownership</span><h2>Execution hand-off network</h2><p>Escalate work with linked notes and transparent acceptance.</p></div><button class="demo-primary">Configure network</button></div><div class="tier-network">${columns.join('<div class="tier-arrow">→</div>')}</div><div class="demo-panel tier-history"><header><div><span class="demo-eyebrow">Shared activity</span><h3>Hand-off history</h3></div></header><p><b>T2-041 accepted by Project coordination</b><span>Original Tier 1 item remains linked · 13:48</span></p><p><b>Utility isolation response added</b><span>Visible to Area delivery and Project coordination · 14:03</span></p></div>`;
}

function documentsTemplate() {
  return `<div class="demo-welcome compact"><div><span class="demo-eyebrow">Controlled records</span><h2>Document review &amp; approval</h2><p>Shared review comments, staged approval and immutable decisions.</p></div><button class="demo-primary">+ Add document</button></div>
  <article class="demo-panel"><div class="filter-row"><input value="" placeholder="Search number, title or system…"><select><option>All stages</option><option>Review</option><option>Approval</option></select><select><option>All systems</option><option>SYS-014</option><option>SYS-022</option></select></div>
  <div class="demo-table-wrap"><table class="demo-table"><thead><tr><th>Document</th><th>System</th><th>Stage</th><th>Comments</th><th>Status</th><th></th></tr></thead><tbody>${state.documents.map((doc) => `<tr><td><b>${doc.number}</b><small>${doc.title}</small></td><td>${doc.system}</td><td>${doc.stage}</td><td>${doc.comments}</td><td><span class="record-status ${doc.status === "Approved" ? "approved" : ""}">${doc.status}</span></td><td>${doc.status.includes("your approval") ? actionButton("Approve", "approve-doc", doc.id) : actionButton(doc.stage === "Review" ? "Open review" : "View", "view-doc", doc.id, true)}</td></tr>`).join("")}</tbody></table></div></article>
  <div class="document-preview demo-panel"><div class="fake-pdf"><span>URS-014</span><h3>Clean Utility User Requirements</h3><p>Controlled document preview</p><div></div><div></div><div class="short"></div></div><aside><span class="demo-eyebrow">Review thread</span><h3>8 comments</h3><p><b>Maeve Lynch</b><small>Clarify the operating pressure range.</small></p><p><b>James Ryan</b><small>Updated in revision 3. Ready to resolve.</small></p><button class="table-action secondary" data-action="comment-doc">Add anchored comment</button></aside></div>`;
}

function safetyTemplate() {
  return `<div class="demo-welcome compact"><div><span class="demo-eyebrow">Visible, controlled work</span><h2>Safety execution</h2><p>Permits, locations and approved RAMS in one operational view.</p></div><button class="demo-primary">+ Raise permit</button></div>
  <div class="safety-metrics"><article><strong>4</strong><span>Upcoming</span></article><article><strong>7</strong><span>Ongoing</span></article><article><strong>2</strong><span>Awaiting approval</span></article><article><strong>18</strong><span>Closed this month</span></article></div>
  <div class="demo-grid"><article class="demo-panel span-2"><header><div><span class="demo-eyebrow">Permit register</span><h3>Active and upcoming work</h3></div></header><div class="demo-table-wrap"><table class="demo-table"><thead><tr><th>Permit</th><th>Location</th><th>Work type</th><th>Status</th><th></th></tr></thead><tbody>${state.permits.map((permit) => `<tr><td><b>${permit.number}</b><small>${permit.title}</small></td><td>${permit.location}</td><td>${permit.type}</td><td><span class="record-status">${permit.status}</span></td><td>${permit.status === "Awaiting approval" ? actionButton("Approve", "approve-permit", permit.id) : permit.status === "Ongoing" ? actionButton("Close", "close-permit", permit.id) : actionButton("View PDF", "view-permit", permit.id, true)}</td></tr>`).join("")}</tbody></table></div></article>
  <article class="demo-panel site-map"><header><div><span class="demo-eyebrow">Live site view</span><h3>Work locations</h3></div></header><div class="map-canvas"><span class="building b1">Production A<i class="map-pin active">2</i></span><span class="building b2">Utilities<i class="map-pin pending">1</i></span><span class="building b3">Warehouse</span><span class="building b4">Tank farm<i class="map-pin">1</i></span><span class="road"></span></div></article></div>`;
}

function constructionTemplate() {
  return `<div class="demo-welcome compact"><div><span class="demo-eyebrow">System completion</span><h2>Construction delivery</h2><p>Scope completion, punches and accountable electronic sign-off.</p></div><button class="demo-primary">+ Construction package</button></div>
  <div class="construction-header demo-panel"><div><span>Package</span><strong>Area 2 Clean Utilities</strong><small>CP-014 · 3 systems · 3 contractor companies</small></div><div class="overall-ring"><b>78%</b><span>overall</span></div><div><span>Package owner</span><strong>Bryan Goodson</strong><small>Target completion · 14 Aug 2026</small></div></div>
  <div class="scope-grid">${state.construction.map((item, index) => `<article class="scope-card"><header><span>${item.system}</span><i>${item.progress}%</i></header><h3>${item.scope}</h3><p>${item.company}</p><div class="progress"><i style="width:${item.progress}%"></i></div><footer><span>${item.status}</span>${item.progress > 85 ? actionButton("Review sign-off", "sign-scope", index) : actionButton("Open scope", "view-scope", index, true)}</footer></article>`).join("")}</div>
  <article class="demo-panel punch-panel"><header><div><span class="demo-eyebrow">Punch management</span><h3>Open punch items</h3></div><button class="demo-primary">+ Add punch</button></header><div class="punch-row"><span class="priority-pill critical">A</span><div><b>Insulation missing at valve XV-204</b><small>SYS-014 · Mechanical · BuildRight</small></div><span>Due today</span><button class="table-action">Close</button></div><div class="punch-row"><span class="priority-pill high">B</span><div><b>Update cable identification labels</b><small>SYS-014 · Electrical · VoltWorks</small></div><span>Due Friday</span><button class="table-action secondary">Open</button></div></article>`;
}

function analyticsTemplate() {
  return `<div class="demo-welcome compact"><div><span class="demo-eyebrow">Permission-aware intelligence</span><h2>Execution analytics</h2><p>Filter every accessible record without losing the route back to its source.</p></div><button class="demo-primary" data-action="export-demo">Export report</button></div>
  <div class="analytics-filters"><label>System<select><option>All systems</option><option>SYS-014</option><option>SYS-022</option></select></label><label>Source<select><option>All modules</option><option>Construction</option><option>Documents</option></select></label><label>Status<select><option>All statuses</option><option>Open</option><option>Approved</option></select></label><button class="table-action secondary">Apply filters</button></div>
  <div class="demo-metrics analytics"><article><span>Accessible records</span><strong>284</strong><small>Across 11 modules</small></article><article><span>Completed on time</span><strong>86%</strong><small><b>+3%</b> this month</small></article><article><span>Open decisions</span><strong>17</strong><small>5 overdue</small></article><article><span>Systems impacted</span><strong>24</strong><small>Approved list v3.0</small></article></div>
  <div class="demo-grid"><article class="demo-panel span-2"><header><div><span class="demo-eyebrow">Cross-module delivery</span><h3>Execution status by source</h3></div></header><div class="horizontal-chart">${[["Planning",82],["Documents",74],["Construction",68],["Vendor",79],["Safety",91]].map(([name,value]) => `<p><span>${name}</span><i><b style="width:${value}%"></b></i><strong>${value}%</strong></p>`).join("")}</div></article><article class="demo-panel risk-panel"><header><div><span class="demo-eyebrow">Risk concentration</span><h3>Attention required</h3></div></header><div class="risk-number">6<small>records at risk</small></div><p><span>SYS-014</span><b>3</b></p><p><span>SYS-022</span><b>2</b></p><p><span>SYS-031</span><b>1</b></p></article></div>`;
}

const templates = {
  overview: overviewTemplate,
  planning: planningTemplate,
  tiers: tierTemplate,
  documents: documentsTemplate,
  safety: safetyTemplate,
  construction: constructionTemplate,
  analytics: analyticsTemplate,
};

const viewNames = {
  overview: "My work",
  planning: "Planning",
  tiers: "Tier boards",
  documents: "Documents",
  safety: "Safety",
  construction: "Construction",
  analytics: "Analytics",
};

function render() {
  title.textContent = viewNames[activeView];
  breadcrumb.textContent = `Execution / ${viewNames[activeView]}`;
  view.innerHTML = templates[activeView]();
  document.querySelectorAll("#demo-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeView);
  });
}

document.querySelector("#launch-demo").addEventListener("click", () => {
  enterDemo(document.querySelector("#gate-role").value);
});

document.querySelector("#demo-signout").addEventListener("click", signOut);
document.querySelector("#reset-demo").addEventListener("click", resetDemo);

document.querySelector("#role-switcher").addEventListener("change", (event) => {
  state.role = event.target.value;
  document.querySelector("#demo-avatar").textContent = initials(state.role);
  save();
  render();
  showToast(`Viewing Acta as ${state.role}.`);
});

document.querySelector("#project-switcher").addEventListener("change", (event) => {
  state.project = event.target.value;
  save();
  render();
  showToast(`Switched to ${state.project}.`);
});

document.querySelector("#demo-nav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  activeView = button.dataset.view;
  render();
});

view.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "complete-task") {
    state.tasks.find((item) => item.id === id).complete = true;
    save();
    render();
    showToast("Action completed and moved to completed work.");
  } else if (action === "approve-doc") {
    const document = state.documents.find((item) => item.id === id);
    document.status = "Approved";
    document.stage = "Complete";
    save();
    render();
    showToast("Demo decision recorded. Production requires an electronic signature.");
  } else if (action === "approve-permit") {
    state.permits.find((item) => item.id === id).status = "Approved";
    save();
    render();
    showToast("Permit approved in this demonstration session.");
  } else if (action === "close-permit") {
    state.permits.find((item) => item.id === id).status = "Closed";
    save();
    render();
    showToast("Permit closed and completion date recorded.");
  } else if (action === "escalate-tier") {
    const item = state.tiers.find((entry) => entry.id === id);
    item.tier += 1;
    item.status = "Awaiting acceptance";
    save();
    render();
    showToast(`Item handed off to Tier ${item.tier}.`);
  } else if (action === "resolve-tier") {
    state.tiers = state.tiers.filter((item) => item.id !== id);
    save();
    render();
    showToast("Tier item resolved with linked history retained.");
  } else if (action === "export-demo") {
    showToast("Demo export simulated. No file or data was retained.");
  } else if (action === "comment-doc") {
    state.documents[0].comments += 1;
    save();
    render();
    showToast("Anchored review comment added to the demo thread.");
  } else {
    showToast("Interaction simulated in the browser-only demonstration.");
  }
});

if (sessionStorage.getItem(DEMO_KEY)) enterDemo();

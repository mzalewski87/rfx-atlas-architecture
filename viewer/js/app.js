/**
 * App shell: modes (overview, flows, scenarios, presentation), left panel, component
 * drawer, level presets, search. English only.
 */
class AppController {
  constructor(data) {
    this.data = data;
    this.mode = "overview";
    this.slide = 0;
    this.diagram = new ArchitectureDiagram(document.getElementById("architecture-svg"), data, (id) => this.selectComponent(id));
    this.animator = new TrafficFlowAnimator(this.diagram, data.trafficFlows);
    this.simulator = new FailureSimulator(this.diagram, data.scenarios);
    this.renderPresets();
    this.setupDOM();
    this.renderLeftPanel();
    this.setupSearch();
  }

  renderPresets() {
    const bar = document.getElementById("quick-nav");
    bar.innerHTML =
      `<span class="nav-label">LEVEL:</span>` +
      this.data.presets
        .map((p, i) => `<button class="nav-btn ${i === 0 ? "active" : ""}" data-view="${p.id}">${p.label}</button>`)
        .join("");
    bar.querySelectorAll(".nav-btn").forEach((b) => b.addEventListener("click", () => this.setViewPreset(b.dataset.view)));
  }

  setupDOM() {
    document.querySelectorAll(".mode-tab").forEach((t) => t.addEventListener("click", () => this.switchMode(t.dataset.mode)));
    document.getElementById("btn-zoom-in").addEventListener("click", () => this.diagram.zoom(1.2));
    document.getElementById("btn-zoom-out").addEventListener("click", () => this.diagram.zoom(0.8));
    document.getElementById("btn-zoom-reset").addEventListener("click", () => this.diagram.resetView());
    document.getElementById("btn-fullscreen").addEventListener("click", () =>
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {})
    );
    document.getElementById("btn-close-drawer").addEventListener("click", () => this.closeDrawer());
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeDrawer();
      if (this.mode !== "presentation") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") this.nextSlide();
      if (e.key === "ArrowLeft" || e.key === "PageUp") this.prevSlide();
    });
    window.addEventListener("resize", () => this.mode !== "presentation" && this.diagram.resetView());
  }

  switchMode(mode) {
    this.mode = mode;
    document.querySelectorAll(".mode-tab").forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
    this.animator.stop();
    this.simulator.resetAll();
    document.getElementById("presentation-bar").classList.toggle("hidden", mode !== "presentation");
    this.renderLeftPanel();
    // Let the layout settle (drawer / panel insets) before fitting the diagram.
    requestAnimationFrame(() => (mode === "presentation" ? this.showSlide(0) : this.diagram.resetView()));
  }

  renderLeftPanel() {
    const title = document.getElementById("panel-title");
    const body = document.getElementById("panel-dynamic-content");
    if (this.mode === "overview") {
      title.textContent = "Architecture overview";
      body.innerHTML = `
        <p class="panel-intro">RFx Atlas runs in one Google Cloud project: four workloads on private GKE Autopilot nodes,
        a private Cloud SQL database that doubles as job queue and event log, Cloud Storage, Secret Manager and
        Vertex AI models. There is no public endpoint.</p>
        <div class="legend">
          <div><span class="legend-line link-control"></span>Access / control plane</div>
          <div><span class="legend-line link-data"></span>Data and jobs</div>
          <div><span class="legend-line link-ai"></span>Model calls (Vertex AI)</div>
          <div><span class="legend-line link-secret"></span>Secrets and identity</div>
          <div><span class="legend-line link-egress"></span>Egress to documentation</div>
          <div><span class="legend-line link-deploy"></span>Deployment</div>
        </div>
        <p class="panel-hint">Click any component for its specification. Drag to pan, scroll to zoom.
        <strong>Traffic Flows</strong> animates requests end to end; <strong>Failure Simulator</strong> walks through
        what happens when parts fail.</p>
        <p class="panel-hint">Last reviewed against the system: ${this.data.projectInfo.lastReviewed}.</p>`;
    } else if (this.mode === "flows") {
      title.textContent = "Request & data flows";
      body.innerHTML =
        `<div id="flow-narration-placeholder"></div><div class="flow-list">` +
        this.data.trafficFlows
          .map(
            (f) => `<div class="flow-card" data-flow-id="${f.id}" style="--flow-color:${f.color}" onclick="window.app.selectFlow('${f.id}')">
              <div class="flow-title"><span>${f.name}</span><span class="flow-dot" style="background:${f.color}"></span></div>
              <div class="flow-desc">${f.description}</div></div>`
          )
          .join("") +
        `</div>`;
    } else if (this.mode === "scenarios") {
      title.textContent = "Failure scenarios";
      body.innerHTML =
        `<div id="scenario-narration-placeholder"></div><div class="flow-list">` +
        this.data.scenarios
          .map(
            (s) => `<div class="scenario-card" data-scenario-id="${s.id}" onclick="window.app.selectScenario('${s.id}')">
              <div class="scenario-header"><span class="scenario-tag">${s.tag}</span></div>
              <div class="scenario-title">${s.name}</div><div class="scenario-desc">${s.description}</div></div>`
          )
          .join("") +
        `</div>`;
    } else {
      title.textContent = "Guided walkthrough";
      body.innerHTML = `<p class="panel-intro">A short tour of the design decisions. Use the buttons below the diagram or the arrow keys.</p>
        <ul class="slide-index">${this.data.presentationSlides
          .map((s, i) => `<li><a href="#" onclick="window.app.showSlide(${i}); return false;">${s.title}</a></li>`)
          .join("")}</ul>`;
    }
  }

  selectFlow(id) {
    document.querySelectorAll(".flow-card").forEach((c) => c.classList.toggle("active", c.dataset.flowId === id));
    this.animator.startFlow(id);
    document.getElementById("panel-dynamic-content").scrollTop = 0;
  }

  updateFlowNarration(flow, step, i) {
    const holder = document.getElementById("flow-narration-placeholder");
    if (!holder) return;
    holder.innerHTML = `
      <div class="narration-box" style="border-left:3px solid ${flow.color}">
        <div class="narration-step-indicator">STEP ${i + 1} OF ${flow.steps.length}</div>
        <div class="narration-title">${step.title}</div>
        <div class="narration-body">${step.text}</div>
        <div class="playback-controls">
          <button class="btn-playback" onclick="window.app.animator.prevStep()">⏮ Prev</button>
          <button class="btn-playback primary" id="btn-flow-play" onclick="window.app.toggleFlowPlay()">${this.animator.isPlaying ? "⏸ Pause" : "▶ Play"}</button>
          <button class="btn-playback" onclick="window.app.animator.nextStep()">Next ⏭</button>
        </div>
      </div>`;
  }

  toggleFlowPlay() {
    const playing = this.animator.togglePlay();
    const b = document.getElementById("btn-flow-play");
    if (b) b.textContent = playing ? "⏸ Pause" : "▶ Play";
  }

  selectScenario(id) {
    document.querySelectorAll(".scenario-card").forEach((c) => c.classList.toggle("active", c.dataset.scenarioId === id));
    this.simulator.startScenario(id);
    document.getElementById("panel-dynamic-content").scrollTop = 0;
  }

  updateScenarioUI(scn, step, i) {
    const holder = document.getElementById("scenario-narration-placeholder");
    if (!holder) return;
    const color = { failure: "#EF4444", action: "#F59E0B", restored: "#10B981", normal: "#10B981" }[step.status] || "#F59E0B";
    holder.innerHTML = `
      <div class="narration-box" style="border-left:3px solid ${color}">
        <div class="narration-step-indicator" style="color:${color}">PHASE ${i + 1} OF ${scn.steps.length} · ${step.phase.toUpperCase()}</div>
        <div class="narration-body" style="color:#fff">${step.message}</div>
        <div class="playback-controls">
          <button class="btn-playback" onclick="window.app.simulator.prevStep()">⏮ Back</button>
          <button class="btn-playback primary" onclick="window.app.simulator.nextStep()">Next phase ⏭</button>
          <button class="btn-playback" onclick="window.app.selectScenario('${scn.id}')">↺ Reset</button>
        </div>
      </div>`;
  }

  showSlide(i) {
    const slides = this.data.presentationSlides;
    if (i < 0 || i >= slides.length) return;
    this.slide = i;
    const s = slides[i];
    document.getElementById("pres-slide-title").textContent = s.title;
    document.getElementById("pres-slide-counter").textContent = `SLIDE ${i + 1} OF ${slides.length}`;
    document.getElementById("pres-slide-content").innerHTML = s.content;
    if (s.focus === "global") this.diagram.resetView();
    else this.diagram.focusOn(s.focus, s.zoom || 1.2);
  }

  nextSlide() {
    this.showSlide(this.slide + 1);
  }

  prevSlide() {
    this.showSlide(this.slide - 1);
  }

  selectComponent(id) {
    const c = this.data.components[id];
    if (!c) return;
    this.diagram.highlightNode(id);
    document.getElementById("drawer-title").textContent = c.name;
    document.getElementById("drawer-cat").textContent = c.category;
    document.getElementById("drawer-icon-holder").innerHTML = ICONS[c.icon] || "";
    document.getElementById("drawer-summary").textContent = c.summary;
    document.getElementById("drawer-specs-table").innerHTML = Object.entries(c.details || {})
      .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
      .join("");
    document.getElementById("component-drawer").classList.add("open");
    document.body.classList.add("drawer-open");
  }

  closeDrawer() {
    const wasOpen = document.getElementById("component-drawer").classList.contains("open");
    document.getElementById("component-drawer").classList.remove("open");
    if (wasOpen && this.mode === "overview") requestAnimationFrame(() => this.diagram.resetView());
    document.body.classList.remove("drawer-open");
    this.diagram.clearHighlights();
  }

  setViewPreset(id) {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === id));
    const p = this.data.presets.find((x) => x.id === id);
    if (!p || !p.focus) {
      this.diagram.resetView();
      return;
    }
    this.diagram.focusOn(p.focus, p.zoom || 1.2);
    if (p.select) this.selectComponent(p.select);
  }

  setupSearch() {
    const input = document.getElementById("search-input");
    input.addEventListener("input", () => {
      const q = input.value.toLowerCase().trim();
      if (!q) return this.diagram.clearHighlights();
      for (const [id, c] of Object.entries(this.data.components)) {
        if ((c.name + " " + c.summary + " " + JSON.stringify(c.details)).toLowerCase().includes(q)) {
          this.diagram.focusOn(id, 1.35);
          this.selectComponent(id);
          break;
        }
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new AppController(ARCHITECTURE_DATA);
});

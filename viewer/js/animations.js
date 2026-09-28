/**
 * Flow animation: each step highlights its nodes and sends particles along the drawn
 * links between consecutive nodes (straight lines where no link is drawn).
 */
class TrafficFlowAnimator {
  constructor(diagram, flows) {
    this.diagram = diagram;
    this.flows = flows;
    this.flow = null;
    this.index = 0;
    this.isPlaying = false;
    this.timer = null;
    this.particles = [];
    this.stepMs = 5000;
  }

  startFlow(id) {
    this.stop();
    this.flow = this.flows.find((f) => f.id === id);
    if (!this.flow) return;
    this.index = 0;
    this.isPlaying = true;
    this.render();
  }

  render() {
    this.clearParticles();
    const step = this.flow && this.flow.steps[this.index];
    if (!step) return;
    window.app?.updateFlowNarration(this.flow, step, this.index);
    const d = this.diagram;
    d.clearHighlights();
    step.nodes.forEach((id) => d.svg.querySelector(`#node-${id}`)?.classList.add("highlighted"));
    for (let i = 0; i < step.nodes.length - 1; i++) {
      const link = d.findLink(step.nodes[i], step.nodes[i + 1]);
      if (link) {
        link.classList.add("flow-active");
        link.style.stroke = this.flow.color;
      }
      this.spawn(step.nodes[i], step.nodes[i + 1], link, i * 550);
    }
    if (this.isPlaying) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.nextStep(), this.stepMs);
    }
  }

  spawn(fromId, toId, link, delay) {
    const d = this.diagram;
    const a = d.nodePositions[fromId], b = d.nodePositions[toId];
    if (!a || !b) return;
    const layer = d.svg.querySelector("#animation-layer");
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("class", "flow-particle");
    g.innerHTML = `<circle r="9" fill="${this.flow.color}" opacity="0.35"/><circle r="4" fill="#fff"/>`;
    layer.appendChild(g);
    this.particles.push(g);
    // Follow the drawn link; reverse it when the flow runs against the link direction.
    const reversed = link && link.id === `link-${toId}--${fromId}`;
    const len = link ? link.getTotalLength() : 0;
    const point = (t) => {
      if (link) {
        const p = link.getPointAtLength((reversed ? 1 - t : t) * len);
        return [p.x, p.y];
      }
      return [a.cx + (b.cx - a.cx) * t, a.cy + (b.cy - a.cy) * t];
    };
    const start = performance.now() + delay;
    const dur = 1700;
    const tick = (now) => {
      if (!this.particles.includes(g)) return;
      if (now < start) return requestAnimationFrame(tick);
      const t = ((now - start) % (dur + 600)) / dur;
      if (t <= 1) {
        const [x, y] = point(t);
        g.setAttribute("transform", `translate(${x}, ${y})`);
        g.style.opacity = 1;
      } else {
        g.style.opacity = 0;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  nextStep() {
    if (!this.flow) return;
    this.index = (this.index + 1) % this.flow.steps.length;
    this.render();
  }

  prevStep() {
    if (!this.flow) return;
    this.index = (this.index - 1 + this.flow.steps.length) % this.flow.steps.length;
    this.render();
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) this.render();
    else clearTimeout(this.timer);
    return this.isPlaying;
  }

  clearParticles() {
    this.particles.forEach((p) => p.remove());
    this.particles = [];
  }

  stop() {
    clearTimeout(this.timer);
    this.isPlaying = false;
    this.clearParticles();
    this.flow = null;
    this.diagram.clearHighlights();
  }
}

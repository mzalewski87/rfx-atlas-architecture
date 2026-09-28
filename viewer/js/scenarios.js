/**
 * Failure simulator: steps through a scenario, colouring affected nodes by status
 * (failure = red pulse, action = amber, restored/normal = green).
 */
class FailureSimulator {
  constructor(diagram, scenarios) {
    this.diagram = diagram;
    this.scenarios = scenarios;
    this.scenario = null;
    this.index = 0;
  }

  startScenario(id) {
    this.resetAll();
    this.scenario = this.scenarios.find((s) => s.id === id);
    if (!this.scenario) return;
    this.index = 0;
    this.render();
  }

  render() {
    const step = this.scenario && this.scenario.steps[this.index];
    if (!step) return;
    const d = this.diagram;
    d.clearHighlights();
    d.clearStates();
    const cls = { failure: "failing", action: "acting", restored: "restored", normal: "restored" }[step.status] || "acting";
    step.affectedNodes.forEach((id) => d.svg.querySelector(`#node-${id}`)?.classList.add(cls));
    const first = step.affectedNodes.map((id) => d.nodePositions[id]).filter(Boolean);
    if (first.length) {
      const cx = first.reduce((s, p) => s + p.cx, 0) / first.length;
      const cy = first.reduce((s, p) => s + p.cy, 0) / first.length;
      d.nodePositions.__focus = { cx, cy };
      d.focusOn("__focus", 1.05);
      delete d.nodePositions.__focus;
    }
    window.app?.updateScenarioUI(this.scenario, step, this.index);
  }

  nextStep() {
    if (!this.scenario) return;
    if (this.index < this.scenario.steps.length - 1) this.index++;
    this.render();
  }

  prevStep() {
    if (!this.scenario) return;
    if (this.index > 0) this.index--;
    this.render();
  }

  resetAll() {
    this.scenario = null;
    this.diagram.clearStates();
    this.diagram.clearHighlights();
  }
}

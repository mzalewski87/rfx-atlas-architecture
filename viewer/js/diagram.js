/**
 * Data-driven SVG diagram engine: zones, nodes and links come from ARCHITECTURE_DATA.
 * Pan (drag), zoom (wheel / buttons), focus on a node or zone, highlight and failure states.
 */
const SVG_NS = "http://www.w3.org/2000/svg";

class ArchitectureDiagram {
  constructor(svg, data, onSelect) {
    this.svg = svg;
    this.data = data;
    this.onSelect = onSelect;
    this.scale = 1;
    this.tx = 0;
    this.ty = 0;
    this.nodePositions = {};
    this.zonePositions = {};
    this.render();
    this.setupEvents();
    requestAnimationFrame(() => this.resetView());
  }

  // ---------------------------------------------------------------- render ---
  render() {
    const { width, height } = this.data.canvas;
    this.svg.innerHTML = `
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(148,163,184,0.06)" stroke-width="1"/>
        </pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B"/>
        </marker>
      </defs>
      <g id="viewport">
        <rect x="-2000" y="-2000" width="${width + 4000}" height="${height + 4000}" fill="url(#grid)"/>
        <g id="zones-layer"></g>
        <g id="links-layer"></g>
        <g id="nodes-layer"></g>
        <g id="animation-layer"></g>
      </g>`;
    this.viewport = this.svg.querySelector("#viewport");
    this.renderZones();
    this.data.nodes.forEach((n) => this.registerNode(n));
    this.renderLinks();
    this.renderNodes();
    this.updateTransform();
  }

  renderZones() {
    const layer = this.svg.querySelector("#zones-layer");
    let html = "";
    for (const z of this.data.zones) {
      this.zonePositions[z.id] = { x: z.x, y: z.y, w: z.w, h: z.h, cx: z.x + z.w / 2, cy: z.y + z.h / 2 };
      html += `
        <g id="${z.id}" class="zone">
          <rect class="zone-box ${z.cls || ""}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="14"/>
          <text class="zone-title" x="${z.x + 16}" y="${z.y + 22}">${z.title}</text>
          ${z.sub ? `<text class="zone-sub" x="${z.x + 16}" y="${z.y + 38}">${z.sub}</text>` : ""}
        </g>`;
    }
    layer.innerHTML = html;
  }

  registerNode(n) {
    this.nodePositions[n.id] = { x: n.x, y: n.y, w: n.w, h: n.h, cx: n.x + n.w / 2, cy: n.y + n.h / 2 };
  }

  renderNodes() {
    this.svg.querySelector("#nodes-layer").innerHTML = this.data.nodes.map((n) => this.nodeHtml(n)).join("");
  }

  /** Card with icon, title, subtitle and optional badge; text shrinks to fit before clipping. */
  nodeHtml(cfg) {
    const icon = ICONS[cfg.icon] || ICONS.job;
    const CH_TITLE = 0.56, CH_MONO = 0.6;
    const badge = cfg.badge || "";
    const badgeW = badge ? Math.max(30, Math.round(badge.length * 8.5 * 0.62) + 14) : 0;
    const fit = (text, room, max, min, ratio) => {
      if (!text) return { size: max, text: "" };
      let size = max;
      while (size > min && text.length * size * ratio > room) size -= 0.5;
      if (text.length * size * ratio > room) {
        const keep = Math.max(3, Math.floor(room / (size * ratio)) - 1);
        return { size, text: text.slice(0, keep).trimEnd() + "…" };
      }
      return { size, text };
    };
    const small = cfg.h < 56;
    const iconSize = small ? 26 : 32;
    const textX = iconSize + 10;
    const t = fit(cfg.title, cfg.w - textX - 24 - (badgeW ? badgeW + 8 : 0), small ? 10.5 : 11.5, 7.5, CH_TITLE);
    const s = fit(cfg.sub || "", cfg.w - textX - 22, small ? 8.5 : 9.5, 7, CH_MONO);
    const titleY = small ? 15 : 18;
    const subY = small ? 29 : 34;
    const iconY = (cfg.h - iconSize) / 2 - 8;
    return `
      <g id="node-${cfg.id}" class="arch-node" transform="translate(${cfg.x}, ${cfg.y})" onclick="window.app.selectComponent('${cfg.id}')">
        <rect class="node-card" width="${cfg.w}" height="${cfg.h}" />
        <g transform="translate(10, 8)">
          <g class="node-icon" transform="translate(0, ${iconY})"><svg width="${iconSize}" height="${iconSize}" viewBox="0 0 32 32">${icon.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg></g>
          <text class="node-title" font-size="${t.size}" x="${textX}" y="${titleY}">${t.text}<title>${cfg.title}</title></text>
          <text class="node-subtitle" font-size="${s.size}" x="${textX}" y="${subY}">${s.text}</text>
        </g>
        ${badge ? `<rect class="node-badge ${cfg.badgeClass || "info-bg"}" x="${cfg.w - badgeW - 8}" y="7" width="${badgeW}" height="16" rx="4"/>
          <text class="node-badge-text" x="${cfg.w - badgeW / 2 - 8}" y="18.5" text-anchor="middle">${badge}</text>` : ""}
      </g>`;
  }

  /** Curved link between the facing sides of two nodes. */
  linkPath(fromId, toId) {
    const a = this.nodePositions[fromId], b = this.nodePositions[toId];
    if (!a || !b) return null;
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    let p1, p2, horizontal;
    if (Math.abs(dx) / (a.w + b.w) > Math.abs(dy) / (a.h + b.h)) {
      horizontal = true;
      p1 = { x: dx > 0 ? a.x + a.w : a.x, y: a.cy };
      p2 = { x: dx > 0 ? b.x : b.x + b.w, y: b.cy };
    } else {
      horizontal = false;
      p1 = { x: a.cx, y: dy > 0 ? a.y + a.h : a.y };
      p2 = { x: b.cx, y: dy > 0 ? b.y : b.y + b.h };
    }
    const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
    const d = horizontal
      ? `M ${p1.x} ${p1.y} C ${mx} ${p1.y}, ${mx} ${p2.y}, ${p2.x} ${p2.y}`
      : `M ${p1.x} ${p1.y} C ${p1.x} ${my}, ${p2.x} ${my}, ${p2.x} ${p2.y}`;
    return { d, p1, p2 };
  }

  renderLinks() {
    const layer = this.svg.querySelector("#links-layer");
    layer.innerHTML = this.data.links
      .map((l) => {
        const p = this.linkPath(l.from, l.to);
        return p ? `<path id="link-${l.from}--${l.to}" class="arch-link link-${l.cls || "data"}" d="${p.d}" marker-end="url(#arrow)"/>` : "";
      })
      .join("");
  }

  /** The drawn link between two nodes (either direction), for flow animation. */
  findLink(a, b) {
    return this.svg.querySelector(`#link-${a}--${b}`) || this.svg.querySelector(`#link-${b}--${a}`);
  }

  // ---------------------------------------------------------------- camera ---
  setupEvents() {
    this.svg.addEventListener("mousedown", (e) => {
      if (e.target.closest(".arch-node")) return;
      this.panning = true;
      this.sx = e.clientX - this.tx;
      this.sy = e.clientY - this.ty;
    });
    window.addEventListener("mousemove", (e) => {
      if (!this.panning) return;
      this.tx = e.clientX - this.sx;
      this.ty = e.clientY - this.sy;
      this.updateTransform();
    });
    window.addEventListener("mouseup", () => (this.panning = false));
    this.svg.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX, e.clientY);
      },
      { passive: false }
    );
  }

  updateTransform() {
    if (this.viewport) this.viewport.setAttribute("transform", `translate(${this.tx}, ${this.ty}) scale(${this.scale})`);
  }

  zoom(factor, clientX, clientY) {
    const r = this.svg.getBoundingClientRect();
    const mx = clientX !== undefined ? clientX - r.left : r.width / 2;
    const my = clientY !== undefined ? clientY - r.top : r.height / 2;
    const next = Math.min(Math.max(this.scale * factor, 0.3), 2.8);
    this.tx = mx - (mx - this.tx) * (next / this.scale);
    this.ty = my - (my - this.ty) * (next / this.scale);
    this.scale = next;
    this.updateTransform();
  }

  resetView() {
    const r = this.svg.getBoundingClientRect();
    const { width, height } = this.data.canvas;
    const s = Math.min((r.width - 40) / width, (r.height - 40) / height);
    this.scale = Math.max(0.3, Math.min(s, 1.2));
    this.tx = (r.width - width * this.scale) / 2;
    this.ty = Math.max(10, (r.height - height * this.scale) / 2);
    this.updateTransform();
    this.clearHighlights();
  }

  focusOn(id, zoom = 1.2) {
    const t = this.nodePositions[id] || this.zonePositions[id];
    if (!t) {
      this.resetView();
      return;
    }
    const r = this.svg.getBoundingClientRect();
    this.scale = zoom;
    this.tx = r.width / 2 - t.cx * zoom;
    this.ty = r.height / 2 - t.cy * zoom;
    this.updateTransform();
    if (this.nodePositions[id]) this.highlightNode(id);
  }

  // ------------------------------------------------------------ highlights ---
  highlightNode(id) {
    this.clearHighlights();
    this.svg.querySelector(`#node-${id}`)?.classList.add("highlighted");
    this.selectedNodeId = id;
  }

  clearHighlights() {
    this.svg.querySelectorAll(".arch-node").forEach((n) => n.classList.remove("highlighted", "selected"));
    this.svg.querySelectorAll(".arch-link").forEach((l) => {
      l.classList.remove("flow-active");
      l.style.stroke = "";
    });
    this.selectedNodeId = null;
  }

  clearStates() {
    this.svg.querySelectorAll(".arch-node").forEach((n) => n.classList.remove("failing", "acting", "restored"));
  }
}

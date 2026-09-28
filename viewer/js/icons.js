/**
 * Inline SVG icons (32x32), keyed by name. No external assets: the viewer works from file://.
 */
const tile = (bg, inner) =>
  `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="${bg}"/>${inner}</svg>`;
const S = 'fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  browser: tile("#1E3A5F", `<rect x="6" y="8" width="20" height="16" rx="2" ${S}/><path d="M6 12h20" ${S}/><circle cx="9" cy="10" r=".8" fill="#fff"/>`),
  tunnel: tile("#0E7490", `<path d="M5 20c0-6 5-11 11-11s11 5 11 11" ${S}/><path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" ${S}/><path d="M16 20v5M13 23l3 3 3-3" ${S}/>`),
  tooling: tile("#334155", `<path d="M8 11l4 4-4 4M14 20h9" ${S}/><rect x="5" y="7" width="22" height="18" rx="2" ${S}/>`),
  docs: tile("#1D4ED8", `<path d="M10 6h9l5 5v15H10z" ${S}/><path d="M19 6v5h5M13 16h8M13 20h8" ${S}/>`),
  gitbook: tile("#0F766E", `<path d="M7 10l9-4 9 4-9 4z" ${S}/><path d="M7 16l9 4 9-4M7 22l9 4 9-4" ${S}/>`),
  github: tile("#24292F", `<path d="M16 6a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 16 6z" fill="#fff"/>`),
  lock: tile("#7C3AED", `<rect x="9" y="14" width="14" height="11" rx="2" ${S}/><path d="M12 14v-3a4 4 0 0 1 8 0v3" ${S}/>`),
  control: tile("#1E40AF", `<circle cx="16" cy="16" r="9" ${S}/><path d="M16 7v18M7 16h18" ${S}/><circle cx="16" cy="16" r="3" fill="#fff"/>`),
  gke: tile("#326CE5", `<path d="M16 5l9 5v12l-9 5-9-5V10z" ${S}/><circle cx="16" cy="16" r="3.5" ${S}/><path d="M16 9v3.5M16 19.5V23M10 12.5l3 2M19 17.5l3 2M22 12.5l-3 2M13 17.5l-3 2" ${S}/>`),
  nginx: tile("#009639", `<path d="M11 22V10l10 12V10" ${S}/>`),
  api: tile("#0891B2", `<path d="M11 10l-5 6 5 6M21 10l5 6-5 6M18 8l-4 16" ${S}/>`),
  worker: tile("#EA580C", `<circle cx="16" cy="16" r="4" ${S}/><path d="M16 6v3M16 23v3M6 16h3M23 16h3M9 9l2 2M21 21l2 2M23 9l-2 2M11 21l-2 2" ${S}/>`),
  sync: tile("#16A34A", `<path d="M23 12a8 8 0 0 0-14-3l-2 2M9 20a8 8 0 0 0 14 3l2-2" ${S}/><path d="M7 7v4h4M25 25v-4h-4" ${S}/>`),
  job: tile("#475569", `<rect x="8" y="7" width="16" height="19" rx="2" ${S}/><path d="M12 12h8M12 16h8M12 20h5" ${S}/>`),
  shield: tile("#B91C1C", `<path d="M16 5l9 4v6c0 6-4 10-9 12-5-2-9-6-9-12V9z" ${S}/><path d="M12 16l3 3 5-6" ${S}/>`),
  key: tile("#A16207", `<circle cx="11" cy="16" r="4" ${S}/><path d="M15 16h11M22 16v4M26 16v3" ${S}/>`),
  index: tile("#9333EA", `<circle cx="14" cy="14" r="6" ${S}/><path d="M18.5 18.5L25 25" ${S}/><path d="M11 14h6M14 11v6" ${S}/>`),
  nat: tile("#0369A1", `<path d="M6 16h20M20 10l6 6-6 6" ${S}/><circle cx="9" cy="16" r="3" ${S}/>`),
  sql: tile("#2563EB", `<ellipse cx="16" cy="9" rx="8" ry="3" ${S}/><path d="M8 9v14c0 1.7 3.6 3 8 3s8-1.3 8-3V9M8 16c0 1.7 3.6 3 8 3s8-1.3 8-3" ${S}/>`),
  queue: tile("#4338CA", `<rect x="6" y="9" width="5" height="14" rx="1" ${S}/><rect x="13.5" y="9" width="5" height="14" rx="1" ${S}/><rect x="21" y="9" width="5" height="14" rx="1" ${S}/>`),
  gcs: tile("#2563EB", `<rect x="6" y="8" width="20" height="6" rx="1.5" ${S}/><rect x="6" y="18" width="20" height="6" rx="1.5" ${S}/><circle cx="10" cy="11" r=".9" fill="#fff"/><circle cx="10" cy="21" r=".9" fill="#fff"/>`),
  secret: tile("#7C3AED", `<path d="M16 5l9 4v6c0 6-4 10-9 12-5-2-9-6-9-12V9z" ${S}/><circle cx="16" cy="15" r="2.5" ${S}/><path d="M16 17.5V21" ${S}/>`),
  registry: tile("#0E7490", `<rect x="6" y="10" width="20" height="14" rx="2" ${S}/><path d="M10 10V7h12v3M11 15h10M11 19h10" ${S}/>`),
  iam: tile("#15803D", `<circle cx="16" cy="12" r="4" ${S}/><path d="M8 25c1-4.5 4.3-7 8-7s7 2.5 8 7" ${S}/>`),
  gemini: tile("#1A73E8", `<path d="M16 5c1 6 5 10 11 11-6 1-10 5-11 11-1-6-5-10-11-11 6-1 10-5 11-11z" fill="#fff"/>`),
  claude: tile("#C2410C", `<path d="M16 6v20M6 16h20M9 9l14 14M23 9L9 23" ${S}/>`),
  panw: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="#1E293B"/><path d="M24 8s4.5 5.5 4.5 10c0 2.8-2 4.8-4.5 4.8s-4.5-2-4.5-4.8C19.5 13.5 24 8 24 8z" fill="#FA582D"/><path d="M24 24c-7.2 0-13 5.8-13 13 0 1.5.3 3 .7 4.2 2.1-3 5.8-5 10.1-5 2.6 0 4.9.8 6.7 2.2-1-2.6-1.5-5.4-1.5-8.4 0-2.5.8-4.8 2.2-6.7-1.6.4-3.4.7-5.2.7z" fill="#FA582D"/></svg>`,
  gcp: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="#1E293B"/><path d="M29 17l2.6-2.6.2-1.1A12 12 0 0 0 12.4 20l.9-.1 5.2-.9.4-.4a6.6 6.6 0 0 1 9-.7z" fill="#EA4335"/><path d="M36 19a12 12 0 0 0-3.6-5.8L28.8 17a6.4 6.4 0 0 1 2.4 5.1v.6a3.2 3.2 0 1 1 0 6.4h-6.4l-.6.7v3.8l.6.6h6.4A8.3 8.3 0 0 0 36 19z" fill="#4285F4"/><path d="M18.4 34.2h6.4v-5.1h-6.4a3.2 3.2 0 0 1-1.3-.3l-.9.3-2.6 2.5-.2.9a8.3 8.3 0 0 0 5 1.7z" fill="#34A853"/><path d="M18.4 17.6a8.3 8.3 0 0 0-5 14.9l3.7-3.7a3.2 3.2 0 1 1 4.2-4.2l3.7-3.7a8.3 8.3 0 0 0-6.6-3.3z" fill="#FBBC05"/></svg>`
};

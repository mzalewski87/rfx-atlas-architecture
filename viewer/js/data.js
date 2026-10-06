/**
 * RFx Atlas — architecture data model.
 *
 * This file is the single source of truth for the viewer: layout (zones, nodes, links),
 * component specifications, request/data flows, failure scenarios and the guided
 * walkthrough. The engine (diagram.js, animations.js, scenarios.js, app.js) is generic.
 *
 * KEEP IN SYNC with docs/ARCHITECTURE.md and docs/DEPLOYMENT.md in the RFx Atlas
 * repository: every architectural change there updates this file in the same change.
 *
 * Layout units are SVG pixels on a 1740 x 1060 canvas. Nodes: {id, x, y, w, h}.
 */

const ARCHITECTURE_DATA = {
  projectInfo: {
    title: "RFx Atlas",
    subtitle: "Interactive Architecture Viewer & Resilience Simulator",
    badge: "GKE · Vertex AI",
    repoUrl: "https://github.com/mzalewski87/rfx-atlas-architecture",
    lastReviewed: "2026-10-01"
  },

  canvas: { width: 1740, height: 1060 },

  // ------------------------------------------------------------------ zones ---
  zones: [
    { id: "zone-workstation", x: 30, y: 30, w: 940, h: 160, cls: "zone-external",
      title: "Engineer workstation", sub: "Browser · kubectl · deployment tooling · backups kept off-platform" },
    { id: "zone-sources", x: 1000, y: 30, w: 710, h: 160, cls: "zone-external",
      title: "Public documentation sources (GET only, robots.txt respected)", sub: "Egress through Cloud NAT" },
    { id: "zone-gcp", x: 30, y: 230, w: 1680, h: 800, cls: "zone-gcp",
      title: "Google Cloud project — region europe-west4", sub: "Terraform: deploy/terraform · no public endpoint" },
    { id: "zone-vpc", x: 50, y: 350, w: 1060, h: 660, cls: "zone-vpc",
      title: "VPC rfx-atlas-vpc", sub: "subnet 10.60.0.0/20 · pods 10.64.0.0/14 · services 10.68.0.0/20" },
    { id: "zone-gke", x: 70, y: 400, w: 770, h: 410, cls: "zone-gke",
      title: "GKE Autopilot — private nodes · namespace rfx-atlas", sub: "default-deny ingress · Workload Identity" },
    { id: "zone-psa", x: 70, y: 840, w: 1020, h: 150, cls: "zone-psa",
      title: "Private Services Access (VPC peering)", sub: "Cloud SQL — private IP only, TLS required" },
    { id: "zone-managed", x: 1130, y: 350, w: 560, h: 660, cls: "zone-managed",
      title: "Google-managed services", sub: "reached over Private Google Access" }
  ],

  // ------------------------------------------------------------------ nodes ---
  nodes: [
    { id: "browser", x: 50, y: 85, w: 200, h: 64, icon: "browser", title: "Web browser", sub: "React UI · SSE" },
    { id: "tunnel", x: 270, y: 85, w: 200, h: 64, icon: "tunnel", title: "kubectl port-forward", sub: "localhost:8080 → gateway" },
    { id: "tooling", x: 490, y: 85, w: 165, h: 64, icon: "tooling", title: "Deploy tooling", sub: "terraform · docker" },
    { id: "offsite", x: 675, y: 85, w: 280, h: 64, icon: "lock", title: "Off-platform backup", sub: "encrypted .rfxbak + passphrase" },

    { id: "src-techdocs", x: 1015, y: 78, w: 222, h: 46, icon: "docs", title: "techdocs", sub: "docs.paloaltonetworks.com" },
    { id: "src-gitbook", x: 1244, y: 78, w: 222, h: 46, icon: "gitbook", title: "Cortex GitBook", sub: "Cortex / Cortex Cloud" },
    { id: "src-pandev", x: 1473, y: 78, w: 222, h: 46, icon: "docs", title: "pan.dev + Portkey", sub: "developer & AI gateway docs" },
    { id: "src-github", x: 1015, y: 132, w: 222, h: 46, icon: "github", title: "GitHub (P2)", sub: "OpenAPI specifications" },
    { id: "src-koi", x: 1244, y: 132, w: 222, h: 46, icon: "lock", title: "Koi docs", sub: "authenticated (headless)" },
    { id: "src-www", x: 1473, y: 132, w: 222, h: 46, icon: "docs", title: "paloaltonetworks.com", sub: "datasheet catalogue · authorised PDFs" },

    { id: "control-plane", x: 60, y: 272, w: 300, h: 56, icon: "control", title: "GKE control plane", sub: "DNS endpoint · IAM-authorised" },
    { id: "iam-user", x: 380, y: 272, w: 260, h: 56, icon: "iam", title: "Cloud IAM", sub: "user roles gate kubectl & secrets" },

    { id: "gateway", x: 90, y: 455, w: 220, h: 64, icon: "nginx", title: "gateway", sub: "nginx · UI + /api proxy", badge: "×1" },
    { id: "api", x: 330, y: 455, w: 220, h: 64, icon: "api", title: "api", sub: "FastAPI · REST · SSE", badge: "×1" },
    { id: "worker", x: 570, y: 455, w: 250, h: 64, icon: "worker", title: "worker", sub: "analysis · OCR · translation · index", badge: "×2" },
    { id: "netpol", x: 90, y: 575, w: 220, h: 64, icon: "shield", title: "NetworkPolicy", sub: "default-deny · gateway→api" },
    { id: "init", x: 330, y: 575, w: 220, h: 64, icon: "job", title: "init job", sub: "migrations · first admin" },
    { id: "sync", x: 570, y: 575, w: 250, h: 64, icon: "sync", title: "sync", sub: "doc sync · headless browser", badge: "×2" },
    { id: "k8s-secrets", x: 90, y: 700, w: 220, h: 64, icon: "key", title: "Kubernetes Secrets", sub: "DB URL · admin password" },
    { id: "index-cache", x: 330, y: 700, w: 220, h: 64, icon: "index", title: "BM25 index", sub: "in memory · hot reload" },
    { id: "worker-interactive", x: 570, y: 700, w: 250, h: 64, icon: "worker", title: "worker-interactive", sub: "renders · chat · file intake", badge: "×2" },

    { id: "nat", x: 870, y: 455, w: 220, h: 64, icon: "nat", title: "Cloud Router + NAT", sub: "egress for private nodes" },

    { id: "sql", x: 90, y: 900, w: 320, h: 72, icon: "sql", title: "Cloud SQL PostgreSQL 16", sub: "cases · results · users · memory" },
    { id: "queue", x: 430, y: 900, w: 320, h: 72, icon: "queue", title: "Job queue + event log", sub: "SKIP LOCKED · heartbeats · SSE source" },
    { id: "backups", x: 770, y: 900, w: 300, h: 72, icon: "sql", title: "Database backups", sub: "daily + PITR, inside the project" },

    { id: "gcs", x: 1150, y: 410, w: 250, h: 72, icon: "gcs", title: "Cloud Storage", sub: "files · corpus · outputs · index" },
    { id: "secrets", x: 1420, y: 410, w: 250, h: 72, icon: "secret", title: "Secret Manager", sub: "DB · admin · Koi (write-only)" },
    { id: "registry", x: 1150, y: 520, w: 250, h: 72, icon: "registry", title: "Artifact Registry", sub: "app · gateway · sync images" },
    { id: "wi", x: 1420, y: 520, w: 250, h: 72, icon: "iam", title: "Workload Identity", sub: "SA per workload · no keys" },
    { id: "gemini", x: 1150, y: 660, w: 250, h: 72, icon: "gemini", title: "Vertex AI — Gemini", sub: "2.5 in EU · 3.x on global", badge: "EU+G" },
    { id: "claude", x: 1420, y: 660, w: 250, h: 72, icon: "claude", title: "Vertex AI — Claude", sub: "Sonnet 5 · Opus 5.5 · global", badge: "GLOBAL", badgeClass: "warn-bg" }
  ],

  // ------------------------------------------------------------------ links ---
  // cls: control | data | ai | egress | deploy | secret
  links: [
    { from: "browser", to: "tunnel", cls: "control" },
    { from: "tunnel", to: "control-plane", cls: "control" },
    { from: "control-plane", to: "gateway", cls: "control" },
    { from: "gateway", to: "api", cls: "data" },
    { from: "api", to: "queue", cls: "data" },
    { from: "api", to: "sql", cls: "data" },
    { from: "worker", to: "queue", cls: "data" },
    { from: "sync", to: "queue", cls: "data" },
    { from: "init", to: "sql", cls: "data" },
    { from: "api", to: "gcs", cls: "data" },
    { from: "worker", to: "gcs", cls: "data" },
    { from: "sync", to: "gcs", cls: "data" },
    { from: "worker", to: "index-cache", cls: "data" },
    { from: "worker", to: "gemini", cls: "ai" },
    { from: "worker", to: "claude", cls: "ai" },
    { from: "worker-interactive", to: "queue", cls: "data" },
    { from: "worker-interactive", to: "gcs", cls: "data" },
    { from: "worker-interactive", to: "index-cache", cls: "data" },
    { from: "worker-interactive", to: "claude", cls: "ai" },
    { from: "worker-interactive", to: "gemini", cls: "ai" },
    { from: "api", to: "secrets", cls: "secret" },
    { from: "sync", to: "secrets", cls: "secret" },
    { from: "sync", to: "nat", cls: "egress" },
    { from: "nat", to: "src-techdocs", cls: "egress" },
    { from: "nat", to: "src-koi", cls: "egress" },
    { from: "tooling", to: "control-plane", cls: "deploy" },
    { from: "tooling", to: "registry", cls: "deploy" },
    { from: "registry", to: "worker", cls: "deploy" },
    { from: "k8s-secrets", to: "api", cls: "secret" },
    { from: "wi", to: "worker", cls: "secret" },
    { from: "wi", to: "worker-interactive", cls: "secret" },
    { from: "sql", to: "backups", cls: "data" },
    { from: "browser", to: "offsite", cls: "data" }
  ],

  // ------------------------------------------------------------ view presets ---
  presets: [
    { id: "overview", label: "🌐 Overview" },
    { id: "gke", label: "☸️ GKE workloads", focus: "zone-gke", zoom: 1.25, select: "worker" },
    { id: "data", label: "🗄️ Data & secrets", focus: "zone-psa", zoom: 1.05, select: "queue" },
    { id: "ai", label: "✨ Vertex AI", focus: "claude", zoom: 1.35, select: "claude" },
    { id: "sources", label: "📚 Documentation sync", focus: "zone-sources", zoom: 1.1, select: "sync" },
    { id: "access", label: "🔐 Access path", focus: "tunnel", zoom: 1.3, select: "tunnel" }
  ],

  // ------------------------------------------------------------- components ---
  components: {
    browser: {
      name: "Web browser (RFx Atlas UI)", category: "Client", icon: "browser",
      summary: "React single-page app served by the gateway. Talks only to the relative /api/v1 path on the same origin, so no CORS and no external requests (CSP default-src 'self').",
      details: {
        "Stack": "React 19, TypeScript, Vite, Tailwind",
        "Session": "HTTP-only, SameSite=Strict cookie (rfx_session)",
        "Live updates": "EventSource on /api/v1/events (job, case, result, comment events)",
        "Assistant stream": "POST reply read as a server-sent event stream",
        "Languages": "English / Polish (UI, reports, in-app help)",
        "Roles": "SC/DC · Read-only · Administrator"
      }
    },
    tunnel: {
      name: "kubectl port-forward", category: "Access path", icon: "tunnel",
      summary: "The only way into the platform: an authenticated tunnel over the Kubernetes API to the gateway Service. There is no Ingress, no load balancer and no public IP.",
      details: {
        "Command": "kubectl -n rfx-atlas port-forward svc/gateway 8080:80",
        "Authentication": "Google identity (gke-gcloud-auth-plugin) + IAM",
        "Exposure": "Loopback only on the engineer's workstation",
        "Resilience": "The UI reconnects its event stream after a tunnel drop"
      }
    },
    tooling: {
      name: "Deployment tooling", category: "Deployment", icon: "tooling",
      summary: "Everything needed to deploy from an empty project: preflight checks, Terraform for the infrastructure, deploy.sh for images and manifests, post-deploy.sh for first-run tasks.",
      details: {
        "deploy/preflight.sh": "tools, gcloud + ADC credentials, billing, owner/editor (read-only)",
        "deploy/terraform": "VPC, NAT, GKE Autopilot, Cloud SQL, bucket, registry, secrets, IAM (~45 resources)",
        "deploy/deploy.sh": "build 3 images (content-hash tags) → push → Secrets → apply → init job → rollout",
        "deploy/post-deploy.sh": "model discovery + first documentation sync",
        "Guide": "docs/DEPLOYMENT.md"
      }
    },
    "src-techdocs": {
      name: "techdocs (docs.paloaltonetworks.com)", category: "Documentation source · P1", icon: "docs",
      summary: "Official product documentation, including Hardware Reference books (dimensions, power, interfaces, certifications) tagged by hardware family.",
      details: { "Diff key": "sitemap lastmod", "Schedule": "daily", "Size": "~20k pages", "Rate": "~1 request/s, identifying User-Agent" }
    },
    "src-gitbook": {
      name: "Cortex documentation (GitBook)", category: "Documentation source · P1", icon: "gitbook",
      summary: "Cortex XSIAM, XDR, XSOAR, Xpanse and Cortex Cloud documentation from the GitBook portal (Markdown source per page).",
      details: { "Diff key": "per-space sitemap lastmod", "Schedule": "daily", "Special case": "HTTP 200 'Page Not Found' pages detected and skipped" }
    },
    "src-pandev": {
      name: "pan.dev and Portkey", category: "Documentation source · P1", icon: "docs",
      summary: "Developer documentation (pan.dev) and AI-gateway documentation (Portkey).",
      details: { "pan.dev diff key": "content hash (no lastmod published)", "pan.dev schedule": "daily 03:50 (Europe/Warsaw)", "Portkey": "Markdown source, daily 03:20" }
    },
    "src-github": {
      name: "GitHub — PaloAltoNetworks", category: "Documentation source · P2", icon: "github",
      summary: "OpenAPI specifications from official repositories; supporting evidence below official documentation.",
      details: { "Tier": "P2", "Schedule": "manual" }
    },
    "src-koi": {
      name: "Koi documentation", category: "Documentation source · P1 (authenticated)", icon: "lock",
      summary: "Requires a user account. The sync workload signs in with a headless browser using credentials an administrator entered (write-only). Multi-factor or CAPTCHA steps are never bypassed — a session cookie can be supplied instead.",
      details: { "Credentials": "Secret Manager rfx-atlas-koi-credentials / -session", "Failure state": "auth_required with reason", "Schedule": "daily" }
    },
    "src-www": {
      name: "paloaltonetworks.com datasheets", category: "Catalogue + authorised download", icon: "docs",
      summary: "A daily job (05:00) reads the sitemap and the datasheet pages (allowed by robots.txt) into a catalogue: title, edition date, PDF address. The PDFs sit under /content/dam/, which robots.txt asks automated clients to skip; with the site owner's approval for internal use, an administrator can switch on an authorised download that records the basis of that approval. Otherwise administrators upload the PDFs by hand. Either way each file passes the same edition check (older refused, identical skipped, newer replaces).",
      details: { "Catalogue": "daily 05:00, incremental by sitemap lastmod, 1 request/s", "New datasheets": "first seen after the last review: administrators get a notice until they mark them reviewed", "Authorised download": "off by default; admin switch records approval, who and when; datasheet PDFs only, identified, 3 s between files", "Other sources": "robots.txt honoured for every other automated fetch" }
    },
    "control-plane": {
      name: "GKE control plane", category: "Kubernetes", icon: "control",
      summary: "No public IP endpoint. kubectl reaches the API server through the GKE DNS endpoint; every request is authorised by Google IAM.",
      details: { "Endpoint": "DNS endpoint (allow_external_traffic, IAM-gated)", "IP endpoint": "disabled", "Release channel": "REGULAR" }
    },
    "iam-user": {
      name: "Cloud IAM (operators)", category: "Identity", icon: "iam",
      summary: "Operator access to the cluster and to Secret Manager (initial admin password) is governed by the operator's Google identity and project roles.",
      details: { "Deployer": "Owner (or Editor + Project IAM Admin + Service Networking Admin)", "Daily use": "container access to port-forward" }
    },
    gateway: {
      name: "gateway (nginx)", category: "Workload", icon: "nginx",
      summary: "Serves the built web UI and proxies /api to the API. Same origin for UI and API; strict security headers; event streams unbuffered.",
      details: { "Image": "gateway (web/dist + nginx.conf)", "Resources": "50m CPU / 64–128 Mi", "Headers": "CSP default-src 'self', frame-ancestors 'none', nosniff", "Upload limit": "210 MB", "Identity": "none" }
    },
    api: {
      name: "api (FastAPI)", category: "Workload", icon: "api",
      summary: "REST API, server-sent events, uploads and access control. Enforces per-case access (creator, co-owners, collaborators, read-only members, administrators read-only) on every case endpoint, the job list and the event stream. Streams backups encrypted with the downloader's passphrase and decrypts uploaded ones. Serves the dashboard (case statistics, users online, live pool load) and the business status of cases (owners only, with a comment). Holds no model permission.",
      details: { "Replicas": "1", "Resources": "250m CPU / 512 Mi–1 Gi", "Service account": "rfx-atlas-api", "Permissions": "bucket objects, Koi secret versions (write-only)", "Auth": "Argon2 passwords, server-side sessions", "Contract": "docs/api/openapi.json", "Backups": "encrypt on download, decrypt on upload (4 GiB temporary disk)", "Previews": "DOCX / XLSX / PDF rendered to data, user guide as a PDF", "Memory export": "all memory entries and reference specifications as XLSX or JSON" }
    },
    worker: {
      name: "worker", category: "Workload", icon: "worker",
      summary: "Claims every job kind except documentation sync from the PostgreSQL queue: OCR, segmentation, judge, evaluation, hardware sizing (appliances and VM-Series credits), translation of generated text, search-index builds and platform backups and restores (and short jobs when idle). With worker-interactive and sync, the only workloads allowed to call Vertex AI.",
      details: { "Replicas": "2 (two analyses at once; scale on queue depth next)", "Resources": "500m CPU / 1–2 Gi", "Excludes": "source.sync jobs", "Evaluation": "4 requirements in parallel, resumable", "Shutdown": "SIGTERM → stop between items, requeue (120 s grace)", "Also runs": "scheduler (Europe/Warsaw: syncs from 03:00, datasheet catalogue 05:00, automatic backup 05:30; one run per slot under a row lock) + orphaned-job reaper" }
    },
    "worker-interactive": {
      name: "worker-interactive", category: "Workload", icon: "worker",
      summary: "The same runner and identity as worker, limited to the short jobs a person waits for (RFX_WORKER_POOL=interactive): document renders and write-back, assistant turns, file intake and content classification, price-list parsing, product-document ingest, model discovery. They never queue behind a long judge or evaluation run.",
      details: { "Replicas": "2", "Resources": "500m CPU / 1–2 Gi", "Service account": "rfx-atlas-worker (Vertex AI)", "Kinds": "queue.INTERACTIVE_KINDS", "Queue positions": "the Activity panel shows how many jobs of the same pool wait ahead" }
    },
    netpol: {
      name: "NetworkPolicy", category: "Kubernetes security", icon: "shield",
      summary: "Default-deny ingress in the namespace; only the gateway may reach the API. Workers accept no inbound traffic at all.",
      details: { "Policies": "default-deny-ingress · api-from-gateway · gateway-ingress" }
    },
    init: {
      name: "init job", category: "Kubernetes Job", icon: "job",
      summary: "Runs on every deploy before rollout: Alembic migrations and creation of the first administrator (idempotent).",
      details: { "Source": "deploy/k8s/base/init-job.yaml", "Admin password": "from Secret Manager via Kubernetes Secret" }
    },
    sync: {
      name: "sync", category: "Workload", icon: "sync",
      summary: "Documentation synchronisation only. Incremental (lastmod or content hash), resumable, polite (GET only, robots.txt, rate limits). Includes a headless browser for the authenticated Koi source.",
      details: { "Replicas": "2 (two sources in parallel)", "Resources": "500m CPU / 1–2 Gi", "Service account": "rfx-atlas-sync (Vertex AI, Koi secret read)", "After a change": "queues one index build (debounced)", "Interrupted": "stops between documents, resumes on another pod" }
    },
    "k8s-secrets": {
      name: "Kubernetes Secrets", category: "Kubernetes", icon: "key",
      summary: "Written by deploy.sh from Secret Manager at deploy time; never stored in manifests or the repository.",
      details: { "rfx-atlas-db": "RFX_DATABASE_URL (sslmode=require)", "rfx-atlas-admin": "initial admin password" }
    },
    "index-cache": {
      name: "BM25 search index", category: "Knowledge", icon: "index",
      summary: "Compact numpy BM25 over ~200k passages from ~40k documents, built by an index.build job and published as a snapshot. API and worker load it into memory and switch when a newer snapshot is published (checked every 60 s).",
      details: { "Build": "~30 s, re-applies product routing and hardware-family tags", "Queries": "3–20 ms", "Duplicates": "identical passages collapsed at query time", "Filters": "product, hardware family (e.g. PA-5400, ION 3200)" }
    },
    nat: {
      name: "Cloud Router + Cloud NAT", category: "Network", icon: "nat",
      summary: "Egress for the private nodes: documentation sync reaches public documentation hosts. No inbound path.",
      details: { "IPs": "automatically allocated", "Logging": "errors only" }
    },
    sql: {
      name: "Cloud SQL — PostgreSQL 16", category: "Data", icon: "sql",
      summary: "System of record: users, cases, members, comments, files, requirements, runs, results, outputs, memory, product documents, sync state, settings, model-call log.",
      details: { "Connectivity": "private IP only (Private Services Access), TLS required", "Tier": "db-custom-1-3840 (ZONAL)", "Migrations": "Alembic, run by the init job" }
    },
    queue: {
      name: "Job queue + event log", category: "Data", icon: "queue",
      summary: "Jobs are rows claimed with SELECT … FOR UPDATE SKIP LOCKED; running jobs send heartbeats. Every state change is an event row, streamed to browsers over SSE with Last-Event-ID resume.",
      details: { "Retries": "up to 3 attempts",
        "Deferral": "not_before: a job waiting for a knowledge refresh is re-checked every 20 s without holding a worker", "Lost jobs": "no heartbeat for 15 min → job.lost, requeued while attempts remain", "SSE filtering": "per user: only events of cases they may see" }
    },
    backups: {
      name: "Database backups (Cloud SQL)", category: "Data", icon: "sql",
      summary: "Automated daily backups with point-in-time recovery; on-demand backups before risky migrations. They live inside the project — to rebuild the platform elsewhere, use a platform backup kept off-platform.",
      details: { "Window": "02:00 UTC", "PITR": "enabled", "Scope": "database only, same project" }
    },
    offsite: {
      name: "Off-platform backup", category: "Disaster recovery", icon: "lock",
      summary: "An encrypted package of everything the platform created — users, cases, files, results and overrides, team memory, product documents, price lists, settings — downloaded by an administrator and kept outside the platform. A fresh deployment from the repository plus this one file gives the same platform, 1:1.",
      details: {
        "Format": "gzip'd tar (manifest, one JSONL per table, objects) encrypted with AES-256-GCM in 1 MiB frames",
        "Key": "scrypt from the administrator's passphrase — never stored by the platform",
        "Integrity": "header-bound associated data: truncated, reordered or altered files fail",
        "Not included": "documentation corpus and index (re-synced), source credentials, tunnel IAM/RBAC",
        "Restore": "Backups page (upload → check → type RESTORE) or rfx-atlas-admin backup-restore",
        "Automatic": "every day at 05:30 (Europe/Warsaw); the ten newest packages stay in the bucket", "Reminder": "administrators see a bar while the newest backup is not downloaded, and after 7 days without a download"
      }
    },
    gcs: {
      name: "Cloud Storage bucket", category: "Data", icon: "gcs",
      summary: "Customer files and page images, the documentation corpus (one file per page with metadata), generated outputs, product documents, price lists, index snapshots and backup packages (backups/, the ten newest).",
      details: { "Name": "<project>-rfx-atlas", "Access": "uniform, public access prevented", "Versioning": "on (5 archived versions kept)" }
    },
    secrets: {
      name: "Secret Manager", category: "Security", icon: "secret",
      summary: "Generated database and initial admin passwords; Koi credentials and session written only by the API (no read endpoint exists) and read only by sync.",
      details: { "Replication": "user-managed, europe-west4", "API": "secretVersionManager on Koi secrets", "sync": "secretAccessor on Koi secrets" }
    },
    registry: {
      name: "Artifact Registry", category: "Delivery", icon: "registry",
      summary: "Docker images app, gateway and sync, tagged by a hash of the sources.",
      details: { "Retention": "20 most recent versions", "Pull": "node service account (reader)" }
    },
    wi: {
      name: "Workload Identity", category: "Security", icon: "iam",
      summary: "One Google service account per workload, bound to its Kubernetes service account. No service-account keys anywhere.",
      details: { "api": "bucket objects, Koi secret versions", "worker": "bucket objects, Vertex AI user", "sync": "bucket objects, Vertex AI user, Koi secret read" }
    },
    gemini: {
      name: "Vertex AI — Gemini", category: "Models", icon: "gemini",
      summary: "OCR of scanned pages (verbatim transcription in the source language), in the EU region — and every model task of an EU-resident case: routes whose endpoint is outside the EU switch automatically to Gemini here, including the assistant's tool loop.",
      details: { "OCR (default)": "gemini-3.5-flash-lite → gemini-3.8-flash, global endpoint (Gemini 3.x is served only there)", "EU-resident / anonymised cases": "OCR gemini-2.5-flash → 2.5-pro; gemini-2.5-pro for segmentation, judge, evaluation, assistant; 2.5-flash for translation — europe-west4", "Gemma": "not offered as a managed Vertex AI endpoint" }
    },
    claude: {
      name: "Vertex AI — Claude", category: "Models", icon: "claude",
      summary: "Segmentation, translation, judge, evaluation and the assistant for cases without the EU-residency flag. Runs on the global endpoint until EU quota is available — requests may be processed outside the EU. Routing is a setting, switchable without a release.",
      details: { "Default": "claude-sonnet-5", "Escalation": "claude-opus-5-5 (uncertain verdicts, deep evaluation, deep judge)", "Discovery": "models.discover probes every model per region", "Logged": "every call in llm_calls (tokens, latency, case)" }
    }
  },

  // ----------------------------------------------------------------- flows ---
  trafficFlows: [
    {
      id: "flow-access", name: "1. Sign-in and UI access", color: "#38BDF8",
      description: "How an engineer reaches the platform without any public endpoint.",
      steps: [
        { title: "Authenticated tunnel", text: "kubectl port-forward opens a tunnel through the GKE DNS endpoint; Google IAM authorises the engineer's identity.", nodes: ["browser", "tunnel", "control-plane"] },
        { title: "Gateway", text: "The tunnel lands on the gateway Service. nginx serves the UI and proxies /api on the same origin.", nodes: ["control-plane", "gateway"] },
        { title: "Sign-in", text: "The API verifies the Argon2 password hash and creates a server-side session; the browser gets an HTTP-only SameSite=Strict cookie.", nodes: ["gateway", "api", "sql"] },
        { title: "Clone", text: "Language, data residency and anonymisation are fixed for a case; a clone copies its files and redaction terms into a new case with new settings and reads the files again.", nodes: ["browser", "api", "gcs", "queue"] },
        { title: "Only my cases", text: "Case lists, jobs and the event stream are filtered to the cases the user created or was invited to (administrators: all, read-only).", nodes: ["api", "queue", "browser"] }
      ]
    },
    {
      id: "flow-ingest", name: "2. Tender upload and ingest", color: "#10B981",
      description: "A tender document becomes atomic, classified requirements with anchors into the source file.",
      steps: [
        { title: "Upload", text: "The browser uploads XLSX/DOCX/PDF/TXT/MD/JPEG/TIFF (≤200 MB). The API stores the original in Cloud Storage and queues file.inspect.", nodes: ["browser", "gateway", "api", "gcs"] },
        { title: "Queue", text: "The job row is claimed by the worker with SKIP LOCKED; progress events stream back to the browser.", nodes: ["api", "queue", "worker"] },
        { title: "Extract and OCR", text: "Text is extracted with anchors (sheet/row, paragraph, page). Scanned pages are rendered and transcribed by Gemini in europe-west4.", nodes: ["worker", "gcs", "gemini"] },
        { title: "Anonymisation review", text: "For a case created with the anonymisation review (a setting fixed at creation, like the languages and EU residency), a local scan — no model — proposes people, organisations, contact data, addresses and checksum-validated identifiers. The anonymisation review also forces EU data residency. Processing waits until the engineer ticks what to redact; from then on every model call of the case masks those terms and stays in europe-west4.", nodes: ["worker", "sql", "browser"] },
        { title: "Classify the file", text: "worker-interactive tags each file with its content (offer description, functional / organisational / legal / additional requirements, other). A file with nothing technical only gets a suggestion to exclude its requirements — the engineer decides. Every format can be previewed.", nodes: ["worker-interactive", "claude", "sql"] },
        { title: "Redact, then segment", text: "Redaction terms are masked, then Claude splits blocks into atomic requirements with English working text; block references keep the anchors. EU-resident cases use Gemini in europe-west4 instead.", nodes: ["worker", "claude", "gemini"] },
        { title: "Ready", text: "Requirements are stored; case.state events refresh the case view live.", nodes: ["worker", "sql", "queue", "browser"] }
      ]
    },
    {
      id: "flow-eval", name: "3. Judge and evaluation", color: "#FA582D",
      description: "Retrieval-grounded grading with escalation and a policy layer that can only lower a verdict.",
      steps: [
        { title: "Knowledge state", text: "Before the judge or any evaluation the UI shows the index date and an estimated refresh time. Refreshing queues the chosen syncs; the analysis job defers itself in the queue (not_before) until the syncs and the index build finish, then loads the new index. Or the user proceeds with the current state.", nodes: ["browser", "api", "queue", "sync", "index-cache"] },
        { title: "Judge", text: "A fit profile from retrieval plus Claude's justified recommendation: which products cover which requirements — on Sonnet, or on Opus 5.5 when the engineer ticks the stronger model. The engineer confirms the offer scope.", nodes: ["worker", "index-cache", "claude"] },
        { title: "Retrieve", text: "For each requirement: confirmed memory (tier M), in-scope passages, labelled out-of-offer passages; a named hardware model (e.g. PA-5430) pulls its family's Hardware Reference and datasheets.", nodes: ["worker", "index-cache", "sql"] },
        { title: "Grade", text: "Claude Sonnet returns verdict, justification, cited snippets and verbatim decisive phrases (validated server-side).", nodes: ["worker", "claude"] },
        { title: "Escalate", text: "Uncertain verdicts (partial, needs verification, low confidence) are re-graded by Claude Opus 5.5. PARTIAL answers are split into what is met and what is not; NEEDS VERIFICATION into what is certain and what must be verified.", nodes: ["worker", "claude"] },
        { title: "Policy layer", text: "Deterministic rules only weaken: no citation, community-only sources, product outside the offer, low term coverage.", nodes: ["worker", "sql"] },
        { title: "Hardware sizing", text: "Hardware requirements become measurable constraints from the tender's original wording, matched in code against the per-model figures read from the loaded datasheets (decryption throughput approximated by Threat Prevention). Quantities come from the case documents — a mandatory HA requirement means at least a pair — and capacities scale across units; only models still sold are proposed — each is checked against the active price list, and one without an orderable device SKU is marked and never recommended; Claude advises a model and quantity with reasons. VM-Series / CN-Series are sized in vCPUs and Software NGFW credits. A changed quantity is an override with its author.", nodes: ["worker", "claude", "sql"] },
        { title: "Translate", text: "In a Polish case, a case.translate job translates justifications and the judge's rationale and reasons, and stores them beside the English originals; cited evidence is never translated. The UI can switch back to the original.", nodes: ["worker", "claude", "sql"] },
        { title: "Engineer knowledge", text: "An override needs the engineer's written justification (links optional). By default it becomes a global, authored memory entry for the chosen products — Polish is translated to English by the worker — so every later case grades with it.", nodes: ["browser", "api", "sql", "worker"] },
        { title: "Live review", text: "result.updated events stream to the browser; engineers override verdicts (raising needs a source) and comment.", nodes: ["queue", "api", "browser"] }
      ]
    },
    {
      id: "flow-outputs", name: "4. Outputs and write-back", color: "#A855F7",
      description: "Compliance matrix, summary, BOM, or the answers written into the customer's own file.",
      steps: [
        { title: "Confirm and request", text: "The engineer confirms having reviewed every requirement and the assessment; they become the document's owner. Read-only members download existing documents but generate none. The API queues output.render.", nodes: ["browser", "api", "queue"] },
        { title: "Render", text: "worker-interactive reads the run and, for write-back, the original file; XLSX/DOCX are filled in a copy (with Engineer notes and Documentation columns), PDF annotated; stored translations are reused. The executive summary is client-ready — logo, statistics, blockers, proposed hardware — and closes with the owner's sign-off stamp.", nodes: ["worker-interactive", "sql", "gcs"] },
        { title: "Bill of materials", text: "With an official price list (every sheet parsed; eliminated, lab, NFR and past end-of-life SKUs excluded): appliance SKUs, per-device subscriptions and support for the tender's term, HA-pair SKUs, the smallest virtual Panorama licence, Software NGFW credits for VM-Series, extended prices and a total. A model with no device SKU (no longer sold) gets a note instead of an empty price; file names keep national letters.", nodes: ["worker-interactive", "gcs", "sql"] },
        { title: "Download", text: "output.ready event; the file is downloaded through the API with its server-side name.", nodes: ["gcs", "api", "gateway", "browser"] }
      ]
    },
    {
      id: "flow-chat", name: "5. Assistant turn", color: "#F59E0B",
      description: "A tool-using model loop that runs in worker-interactive; the API only relays the stream.",
      steps: [
        { title: "Message", text: "POST to the chat session (general or per case; access to the case is checked). The API queues chat.turn and keeps the response open as a stream.", nodes: ["browser", "api", "queue"] },
        { title: "Tool loop", text: "worker-interactive runs Claude (Gemini function calling for EU-resident cases) with tools: search_knowledge (hardware-aware), case_overview, requirement_verdict, propose_memory, propose_override.", nodes: ["worker-interactive", "claude", "gemini", "index-cache", "sql"] },
        { title: "Stream", text: "Tool calls, results and the Markdown answer with documentation links stream back; proposals wait for the engineer's approval.", nodes: ["worker-interactive", "queue", "api", "browser"] }
      ]
    },
    {
      id: "flow-sync", name: "6. Documentation sync and index build", color: "#22C55E",
      description: "Incremental, scheduled mirroring of official documentation into the corpus and a new index snapshot.",
      steps: [
        { title: "Schedule", text: "The scheduler (in every worker) queues source.sync on each source's cron, evaluated in Europe/Warsaw: every source nightly from 03:00, ten minutes apart; a sync pod claims it.", nodes: ["queue", "sync"] },
        { title: "Fetch politely", text: "GET only, robots.txt, ~1 request/s, identifying User-Agent, via Cloud NAT. Only changed pages are fetched (lastmod or content hash).", nodes: ["sync", "nat", "src-techdocs"] },
        { title: "Corpus", text: "Each page is stored with its product and tier; sync state is recorded per document.", nodes: ["sync", "gcs", "sql"] },
        { title: "Index build", text: "A changed sync queues one debounced index.build; the worker builds BM25, applying current product routing and hardware tags, and publishes a snapshot.", nodes: ["queue", "worker", "gcs"] },
        { title: "Hot swap", text: "API and worker load the new snapshot within 60 s; no restart.", nodes: ["gcs", "index-cache", "api"] }
      ]
    },
    {
      id: "flow-koi", name: "7. Authenticated source (Koi)", color: "#E879F9",
      description: "Write-only credentials, headless sign-in, no challenge bypass.",
      steps: [
        { title: "Enter credentials", text: "An administrator enters the Koi e-mail and password; the API adds a Secret Manager version. No endpoint ever returns them.", nodes: ["browser", "api", "secrets"] },
        { title: "Sign in", text: "The sync pod reads the secret and signs in with a headless browser.", nodes: ["secrets", "sync", "nat", "src-koi"] },
        { title: "Challenge?", text: "On MFA or CAPTCHA the source becomes auth_required; an administrator can paste a session cookie instead.", nodes: ["sync", "sql", "browser"] }
      ]
    },
    {
      id: "flow-deploy", name: "8. Deployment pipeline", color: "#94A3B8",
      description: "From an empty project to a running platform.",
      steps: [
        { title: "Infrastructure", text: "Terraform enables APIs and creates the VPC, NAT, GKE Autopilot, Cloud SQL, bucket, registry, secrets and Workload Identity bindings.", nodes: ["tooling", "control-plane", "sql", "gcs", "secrets", "wi"] },
        { title: "Images", text: "deploy.sh builds app, gateway and sync images (linux/amd64) with content-hash tags and pushes them.", nodes: ["tooling", "registry"] },
        { title: "Secrets and manifests", text: "Database URL and admin password go from Secret Manager into Kubernetes Secrets; manifests are applied.", nodes: ["secrets", "k8s-secrets", "control-plane"] },
        { title: "Migrate and roll out", text: "The init job migrates the database and creates the first admin; deployments roll out; running jobs are handed over gracefully.", nodes: ["init", "sql", "gateway", "api", "worker", "sync"] }
      ]
    },
    {
      id: "flow-backup", name: "9. Backup and rebuild", color: "#F43F5E",
      description: "Everything the platform created leaves it as one encrypted file, and comes back on a fresh deployment.",
      steps: [
        { title: "Create", text: "The scheduler queues an automatic backup every day at 05:30 (an administrator can also create one); backup.create reads every non-transient table in one transaction and the user objects (case files, outputs, price lists, product documents) into a package in the bucket.", nodes: ["browser", "api", "queue", "worker", "sql", "gcs"] },
        { title: "Download encrypted", text: "The API streams the package encrypted with the administrator's passphrase (AES-256-GCM, scrypt); the passphrase is never stored. The file is kept outside the platform.", nodes: ["gcs", "api", "gateway", "browser", "offsite"] },
        { title: "Rebuild", text: "A new platform is deployed from the repository: Terraform, deploy.sh, migrations, the first administrator.", nodes: ["tooling", "control-plane", "registry", "init", "sql"] },
        { title: "Upload and check", text: "The administrator uploads the file with its passphrase; the API decrypts it and checks the format and schema version before anything is replaced.", nodes: ["offsite", "browser", "api", "gcs"] },
        { title: "Restore", text: "backup.restore writes the objects, replaces every backed-up table in one transaction, removes what the backup lacks and signs everyone out.", nodes: ["worker", "sql", "gcs", "queue"] },
        { title: "Re-sync", text: "The documentation re-syncs and the index rebuilds by themselves; source credentials and tunnel access are set up again.", nodes: ["sync", "nat", "src-techdocs", "worker", "index-cache"] }
      ]
    },
    {
      id: "flow-workflow", name: "10. Case workflow, questions and dashboard", color: "#0EA5E9",
      description: "From the first answer to the outcome: questions to the customer, business status, and the dashboard.",
      steps: [
        { title: "Big picture", text: "Before the judge, the worker reads every document row into the tender's big picture (organisation, sites and links, users, whether sites need equipment); the judge fits the whole deployment and sizing turns sites into device groups.", nodes: ["worker", "claude", "sql"] },
        { title: "Questions to the customer", text: "For requirements that are unclear or not met as written, the worker writes one question each, phrased so that 'yes' means compliance; they leave as a signed-off XLSX.", nodes: ["browser", "api", "queue", "worker", "claude", "gcs"] },
        { title: "Answers and re-grading", text: "The customer's filled questionnaire is imported; the answered requirements are graded again with the answer as context. Answers never become knowledge.", nodes: ["browser", "api", "worker", "sql"] },
        { title: "Business status", text: "An owner moves the case to awaiting customer reply, final answer sent, won, lost or archived — always with a comment, kept as history.", nodes: ["browser", "api", "sql"] },
        { title: "Dashboard", text: "Cases by status and step, users online (session activity in the last 5 minutes) and the live load of each worker pool, refreshed every 10 seconds.", nodes: ["browser", "api", "sql", "queue"] }
      ]
    }
  ],

  // -------------------------------------------------------------- scenarios ---
  scenarios: [
    {
      id: "scn-rebuild", tag: "Disaster recovery", name: "Platform rebuilt from scratch",
      description: "The whole environment is gone — cluster, database, bucket — and the platform must come back as it was.",
      steps: [
        { phase: "Lost", status: "failure", message: "Nothing is left in the project: no database, no files, no in-project database backups.", affectedNodes: ["sql", "gcs", "backups"] },
        { phase: "Redeploy", status: "action", message: "Terraform and deploy.sh stand up an empty platform from the repository in about 30 minutes.", affectedNodes: ["tooling", "control-plane", "init"] },
        { phase: "Restore", status: "action", message: "The administrator uploads the latest off-platform backup with its passphrase and restores it: users, cases, files, results, overrides, memory, price lists and settings return 1:1.", affectedNodes: ["offsite", "api", "worker", "sql", "gcs"] },
        { phase: "Back in service", status: "restored", message: "Users sign in with their own passwords; the documentation re-syncs and the index rebuilds in the background; source credentials and tunnel access are re-applied.", affectedNodes: ["browser", "sync", "index-cache"] }
      ]
    },
    {
      id: "scn-busy", tag: "Load", name: "Several consultants at once",
      description: "Two evaluations run while other consultants render documents and ask the assistant.",
      steps: [
        { phase: "Analyses running", status: "normal", message: "Both worker replicas grade one evaluation each (4 requirements in parallel per replica).", affectedNodes: ["worker", "claude"] },
        { phase: "Short jobs arrive", status: "action", message: "A write-back render and an assistant turn are queued; worker-interactive claims them at once instead of waiting behind the analyses.", affectedNodes: ["worker-interactive", "queue"] },
        { phase: "Backlog visible", status: "failure", message: "A third evaluation waits; the Activity panel shows its position in the analysis queue.", affectedNodes: ["queue", "browser"] },
        { phase: "Drains", status: "restored", message: "The next free worker claims it. If waits become routine, raise the worker replicas (queue-depth autoscaling is the next step).", affectedNodes: ["worker"] }
      ]
    },
    {
      id: "scn-worker-restart", tag: "Rolling deploy", name: "Worker restarted mid-evaluation",
      description: "A deploy or node upgrade sends SIGTERM to the worker while an evaluation is running.",
      steps: [
        { phase: "Running", status: "normal", message: "The worker grades requirements (4 in parallel) and commits each result as it finishes.", affectedNodes: ["worker"] },
        { phase: "SIGTERM", status: "failure", message: "Kubernetes signals termination (120 s grace period).", affectedNodes: ["worker"] },
        { phase: "Graceful stop", status: "action", message: "The worker stops between batches, commits, and requeues the job without spending an attempt.", affectedNodes: ["worker", "queue"] },
        { phase: "Resume", status: "restored", message: "The new pod claims the job and grades only the requirements without a result. Nothing is graded twice.", affectedNodes: ["worker", "sql"] }
      ]
    },
    {
      id: "scn-worker-crash", tag: "Crash", name: "Worker disappears without warning",
      description: "The pod is killed (out of memory, node failure) and never signals.",
      steps: [
        { phase: "Heartbeats stop", status: "failure", message: "The running job stops updating its heartbeat.", affectedNodes: ["worker", "queue"] },
        { phase: "Reaper", status: "action", message: "Every worker runs a reaper each minute; after 15 minutes of silence the job is marked job.lost.", affectedNodes: ["queue"] },
        { phase: "Requeue", status: "restored", message: "While attempts remain (3), the job is requeued and resumes on a healthy worker; evaluation skips finished requirements.", affectedNodes: ["worker"] }
      ]
    },
    {
      id: "scn-model", tag: "Model outage", name: "Vertex AI call fails or has no quota",
      description: "Claude returns errors, times out, or the routed region has no quota.",
      steps: [
        { phase: "Call fails", status: "failure", message: "The client retries with backoff; the call still fails.", affectedNodes: ["claude"] },
        { phase: "Isolation", status: "action", message: "One requirement's failure is recorded as grading_error (needs verification) — the run continues. A failed judge falls back to the evidence profile only.", affectedNodes: ["worker", "sql"] },
        { phase: "Diagnose", status: "action", message: "Settings → Check available models runs models.discover: ✓/✗ per model and region with the reason (no access, no quota).", affectedNodes: ["worker", "claude", "gemini"] },
        { phase: "Reroute", status: "restored", message: "An administrator changes the route (model or region) in Settings; the next job uses it — no release.", affectedNodes: ["api", "sql"] }
      ]
    },
    {
      id: "scn-sync-interrupted", tag: "Long job", name: "Documentation sync interrupted",
      description: "A multi-hour techdocs sync is running when the sync pod is replaced.",
      steps: [
        { phase: "Interrupted", status: "failure", message: "SIGTERM reaches the sync pod mid-listing.", affectedNodes: ["sync"] },
        { phase: "Hand-over", status: "action", message: "The sync stops between documents, records its state and requeues; the second sync replica or the new pod picks it up within seconds.", affectedNodes: ["sync", "queue"] },
        { phase: "Incremental", status: "restored", message: "Already stored pages are skipped by their diff key; nothing is fetched twice.", affectedNodes: ["sync", "gcs", "src-techdocs"] }
      ]
    },
    {
      id: "scn-tunnel", tag: "Client", name: "Tunnel or network drops",
      description: "The engineer's connection or the port-forward breaks.",
      steps: [
        { phase: "Drop", status: "failure", message: "The browser loses the gateway; the event stream disconnects.", affectedNodes: ["tunnel", "browser"] },
        { phase: "Jobs continue", status: "action", message: "Jobs run server-side and are unaffected.", affectedNodes: ["worker", "queue"] },
        { phase: "Reconnect", status: "restored", message: "After port-forward is restarted, EventSource reconnects with Last-Event-ID and the UI refetches — no event is lost.", affectedNodes: ["tunnel", "gateway", "api", "browser"] }
      ]
    },
    {
      id: "scn-access", tag: "Security", name: "Unauthorised access attempts",
      description: "A user tries to open or change a case that is not theirs.",
      steps: [
        { phase: "Direct link", status: "failure", message: "An outsider opens a case URL or its run, file, output or event stream.", affectedNodes: ["browser", "api"] },
        { phase: "Hidden", status: "action", message: "case_access returns 404 — the case's existence is not disclosed; events of other cases are filtered out of the stream.", affectedNodes: ["api", "queue"] },
        { phase: "Read-only", status: "action", message: "A read-only member may view, download and comment; any change returns 403. Only the creator deletes, retyping the name.", affectedNodes: ["api", "sql"] }
      ]
    },
    {
      id: "scn-koi-challenge", tag: "Authenticated source", name: "Koi sign-in challenge",
      description: "The documentation provider presents MFA or a CAPTCHA.",
      steps: [
        { phase: "Challenge", status: "failure", message: "The headless sign-in meets a challenge it must not bypass.", affectedNodes: ["src-koi", "sync"] },
        { phase: "Flagged", status: "action", message: "The source becomes auth_required with the reason; other sources are unaffected.", affectedNodes: ["sync", "sql"] },
        { phase: "Session cookie", status: "restored", message: "An administrator pastes a session cookie (write-only); the next sync uses it.", affectedNodes: ["browser", "api", "secrets", "sync"] }
      ]
    }
  ],

  // --------------------------------------------------------- presentation ---
  presentationSlides: [
    { title: "1. What RFx Atlas does", focus: "global", zoom: 1.0, content: `
      <p>RFx Atlas answers RFI / RFP / RFQ documents against the Palo Alto Networks portfolio: it ingests the tender, splits it into requirements, recommends the fitting products, grades every requirement against official documentation and produces a compliance matrix, a summary, a bill of materials and the customer's own file with answers filled in — in English and Polish.</p>
      <div class="callout-box"><strong>Every verdict is a proposal.</strong> The platform shows its evidence — cited passages with the decisive phrases highlighted — so an engineer can check it quickly.</div>` },
    { title: "2. No public endpoint", focus: "tunnel", zoom: 1.35, content: `
      <p>There is no Ingress, load balancer or public IP. Engineers reach the UI with <code>kubectl port-forward</code> through the GKE <strong>DNS endpoint</strong>, authorised by Google IAM. Nodes are private; Cloud SQL has a private IP only.</p>` },
    { title: "3. Five workloads, one queue", focus: "zone-gke", zoom: 1.25, content: `
      <ul><li><strong>gateway</strong> — UI and /api proxy (same origin).</li><li><strong>api</strong> — REST, event stream, access control; no model permission.</li><li><strong>worker</strong> ×2 — the analysis pipeline, translation, index builds.</li><li><strong>worker-interactive</strong> ×2 — document renders, assistant turns, file intake, so they never wait behind an analysis.</li><li><strong>sync</strong> ×2 — documentation mirroring.</li></ul>
      <p>They coordinate through a PostgreSQL job queue (SKIP LOCKED, heartbeats) and an event log streamed to browsers.</p>` },
    { title: "4. Least privilege", focus: "wi", zoom: 1.35, content: `
      <p>One service account per workload via Workload Identity — no keys. Only the workers (worker, worker-interactive) and sync may call Vertex AI. Koi credentials are write-only through the API and readable only by sync. Inside the namespace, a default-deny NetworkPolicy lets only the gateway reach the API.</p>` },
    { title: "5. Grounded grading", focus: "index-cache", zoom: 1.3, content: `
      <p>Each requirement is graded against passages retrieved from ~40k synced documents (BM25), confirmed institutional memory and, for named hardware models, that family's Hardware Reference and datasheets. Claude Sonnet grades; Opus 5.5 re-checks uncertain verdicts; a deterministic policy layer can only lower a verdict.</p>` },
    { title: "6. Models and data residency", focus: "claude", zoom: 1.35, content: `
      <p>Gemini OCR runs in europe-west4. Claude runs on the Vertex AI <strong>global</strong> endpoint until EU quota is granted — requests may be processed outside the EU. A case flagged <strong>EU data residency</strong> switches automatically: every task whose model runs outside the EU uses Gemini 2.5 in europe-west4 instead. Routing is a setting: a discovery job checks which models answer in which region, and a route change needs no release.</p>` },
    { title: "7. Official knowledge, politely", focus: "zone-sources", zoom: 1.1, content: `
      <p>Documentation is mirrored incrementally: GET only, robots.txt honoured, rate-limited, identifying User-Agent. Every source syncs nightly from 03:00; datasheet pages feed a catalogue checked daily, with new datasheets flagged for review; the PDFs, which robots.txt asks automated clients to skip, arrive by an administrator-authorised download (site owner's approval recorded) or by manual upload, both through the same edition check.</p>` },
    { title: "8. Built to recover", focus: "queue", zoom: 1.2, content: `
      <p>Deploys hand running jobs over gracefully; lost workers are detected by heartbeats; evaluations and syncs resume where they stopped; one failed model call never sinks a run. See the Failure Simulator tab.</p>` },
    { title: "9. Reproducible deployment", focus: "tooling", zoom: 1.35, content: `
      <p>An empty Google Cloud project with billing is enough: <code>preflight.sh</code> → Terraform → <code>deploy.sh</code> → <code>post-deploy.sh</code>. The step-by-step guide is <code>docs/DEPLOYMENT.md</code> in the private repository.</p>` },
    { title: "10. Data that survives the platform", focus: "offsite", zoom: 1.35, content: `
      <p>Everything the team creates — cases, files, verdict overrides, team memory, price lists, settings, accounts — leaves the platform as one <strong>encrypted backup file</strong> (AES-256-GCM, passphrase never stored). A fresh deployment plus that file gives the same platform, 1:1; the documentation corpus re-syncs by itself.</p>
      <div class="callout-box"><strong>Keep a recent backup off-platform.</strong> A backup is made automatically every day at 05:30; administrators are reminded until the newest one is downloaded.</div>` }
  ]
};

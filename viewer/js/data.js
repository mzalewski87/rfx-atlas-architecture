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
    lastReviewed: "2026-09-28"
  },

  canvas: { width: 1740, height: 1060 },

  // ------------------------------------------------------------------ zones ---
  zones: [
    { id: "zone-workstation", x: 30, y: 30, w: 640, h: 160, cls: "zone-external",
      title: "Engineer workstation", sub: "Browser · kubectl · deployment tooling" },
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

    { id: "src-techdocs", x: 1015, y: 78, w: 222, h: 46, icon: "docs", title: "techdocs", sub: "docs.paloaltonetworks.com" },
    { id: "src-gitbook", x: 1244, y: 78, w: 222, h: 46, icon: "gitbook", title: "Cortex GitBook", sub: "Cortex / Cortex Cloud" },
    { id: "src-pandev", x: 1473, y: 78, w: 222, h: 46, icon: "docs", title: "pan.dev + Portkey", sub: "developer & AI gateway docs" },
    { id: "src-github", x: 1015, y: 132, w: 222, h: 46, icon: "github", title: "GitHub (P2)", sub: "OpenAPI specifications" },
    { id: "src-koi", x: 1244, y: 132, w: 222, h: 46, icon: "lock", title: "Koi docs", sub: "authenticated (headless)" },
    { id: "src-www", x: 1473, y: 132, w: 222, h: 46, icon: "docs", title: "paloaltonetworks.com", sub: "datasheet PDFs: not crawled" },

    { id: "control-plane", x: 60, y: 272, w: 300, h: 56, icon: "control", title: "GKE control plane", sub: "DNS endpoint · IAM-authorised" },
    { id: "iam-user", x: 380, y: 272, w: 260, h: 56, icon: "iam", title: "Cloud IAM", sub: "user roles gate kubectl & secrets" },

    { id: "gateway", x: 90, y: 455, w: 220, h: 64, icon: "nginx", title: "gateway", sub: "nginx · UI + /api proxy", badge: "×1" },
    { id: "api", x: 330, y: 455, w: 220, h: 64, icon: "api", title: "api", sub: "FastAPI · REST · SSE", badge: "×1" },
    { id: "worker", x: 570, y: 455, w: 250, h: 64, icon: "worker", title: "worker", sub: "pipeline · chat · index", badge: "×1" },
    { id: "netpol", x: 90, y: 575, w: 220, h: 64, icon: "shield", title: "NetworkPolicy", sub: "default-deny · gateway→api" },
    { id: "init", x: 330, y: 575, w: 220, h: 64, icon: "job", title: "init job", sub: "migrations · first admin" },
    { id: "sync", x: 570, y: 575, w: 250, h: 64, icon: "sync", title: "sync", sub: "doc sync · headless browser", badge: "×2" },
    { id: "k8s-secrets", x: 90, y: 700, w: 220, h: 64, icon: "key", title: "Kubernetes Secrets", sub: "DB URL · admin password" },
    { id: "index-cache", x: 330, y: 700, w: 490, h: 64, icon: "index", title: "BM25 index (in memory, per pod)", sub: "snapshot from Cloud Storage · reloads on publish" },

    { id: "nat", x: 870, y: 455, w: 220, h: 64, icon: "nat", title: "Cloud Router + NAT", sub: "egress for private nodes" },

    { id: "sql", x: 90, y: 900, w: 320, h: 72, icon: "sql", title: "Cloud SQL PostgreSQL 16", sub: "cases · results · users · memory" },
    { id: "queue", x: 430, y: 900, w: 320, h: 72, icon: "queue", title: "Job queue + event log", sub: "SKIP LOCKED · heartbeats · SSE source" },
    { id: "backups", x: 770, y: 900, w: 300, h: 72, icon: "sql", title: "Backups", sub: "daily + point-in-time recovery" },

    { id: "gcs", x: 1150, y: 410, w: 250, h: 72, icon: "gcs", title: "Cloud Storage", sub: "files · corpus · outputs · index" },
    { id: "secrets", x: 1420, y: 410, w: 250, h: 72, icon: "secret", title: "Secret Manager", sub: "DB · admin · Koi (write-only)" },
    { id: "registry", x: 1150, y: 520, w: 250, h: 72, icon: "registry", title: "Artifact Registry", sub: "app · gateway · sync images" },
    { id: "wi", x: 1420, y: 520, w: 250, h: 72, icon: "iam", title: "Workload Identity", sub: "SA per workload · no keys" },
    { id: "gemini", x: 1150, y: 660, w: 250, h: 72, icon: "gemini", title: "Vertex AI — Gemini", sub: "OCR · europe-west4", badge: "EU" },
    { id: "claude", x: 1420, y: 660, w: 250, h: 72, icon: "claude", title: "Vertex AI — Claude", sub: "Sonnet · Opus · global", badge: "GLOBAL", badgeClass: "warn-bg" }
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
    { from: "sql", to: "backups", cls: "data" }
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
      details: { "pan.dev diff key": "content hash (no lastmod published)", "pan.dev schedule": "weekly", "Portkey": "Markdown source, daily" }
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
      name: "paloaltonetworks.com datasheets", category: "Not crawled", icon: "docs",
      summary: "Datasheet PDFs live under /content/dam/, which robots.txt disallows for automated clients. The platform never fetches them; users download a datasheet in the browser and upload it as a product document (tagged by product and hardware model).",
      details: { "Rule": "robots.txt is honoured for every automated fetch", "Alternative": "Knowledge → Datasheets and technical specifications (upload)" }
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
      summary: "REST API, server-sent events, uploads and access control. Enforces per-case access (creator, invited members, administrators read-only) on every case endpoint, the job list and the event stream. Holds no model permission.",
      details: { "Replicas": "1", "Resources": "250m CPU / 512 Mi–1 Gi", "Service account": "rfx-atlas-api", "Permissions": "bucket objects, Koi secret versions (write-only)", "Auth": "Argon2 passwords, server-side sessions", "Contract": "docs/api/openapi.json" }
    },
    worker: {
      name: "worker", category: "Workload", icon: "worker",
      summary: "Claims jobs from the PostgreSQL queue: ingest, OCR, segmentation, judge, evaluation, outputs, assistant turns, product-document ingest, model discovery and search-index builds. The only workload (with sync) allowed to call Vertex AI.",
      details: { "Replicas": "1 (scales horizontally)", "Resources": "500m CPU / 1–2 Gi", "Excludes": "source.sync jobs", "Evaluation": "4 requirements in parallel, resumable", "Shutdown": "SIGTERM → stop between items, requeue (120 s grace)", "Also runs": "sync scheduler + orphaned-job reaper" }
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
      name: "Database backups", category: "Data", icon: "sql",
      summary: "Automated daily backups with point-in-time recovery; on-demand backups before risky migrations.",
      details: { "Window": "02:00 UTC", "PITR": "enabled" }
    },
    gcs: {
      name: "Cloud Storage bucket", category: "Data", icon: "gcs",
      summary: "Customer files and page images, the documentation corpus (one file per page with metadata), generated outputs, product documents and index snapshots.",
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
      summary: "OCR of scanned pages (verbatim transcription in the source language), in the EU region.",
      details: { "Default": "gemini-2.5-flash", "Escalation": "gemini-2.5-pro (illegible or truncated pages)", "Region": "europe-west4" }
    },
    claude: {
      name: "Vertex AI — Claude", category: "Models", icon: "claude",
      summary: "Segmentation, translation, judge, evaluation and the assistant. Runs on the global endpoint until EU quota is available — requests may be processed outside the EU. Routing is a setting, switchable without a release.",
      details: { "Default": "claude-sonnet-5", "Escalation": "claude-opus-5 (uncertain verdicts, deep mode)", "Discovery": "models.discover probes every model per region", "Logged": "every call in llm_calls (tokens, latency, case)" }
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
        { title: "Redact, then segment", text: "Redaction terms are masked, then Claude splits blocks into atomic requirements with English working text; block references keep the anchors.", nodes: ["worker", "claude"] },
        { title: "Ready", text: "Requirements are stored; case.state events refresh the case view live.", nodes: ["worker", "sql", "queue", "browser"] }
      ]
    },
    {
      id: "flow-eval", name: "3. Judge and evaluation", color: "#FA582D",
      description: "Retrieval-grounded grading with escalation and a policy layer that can only lower a verdict.",
      steps: [
        { title: "Knowledge state", text: "Before the judge or any evaluation the UI shows the index date and an estimated refresh time. Refreshing queues the chosen syncs; the analysis job defers itself in the queue (not_before) until the syncs and the index build finish, then loads the new index. Or the user proceeds with the current state.", nodes: ["browser", "api", "queue", "sync", "index-cache"] },
        { title: "Judge", text: "A fit profile from retrieval plus Claude's justified recommendation: which products cover which requirements. The engineer confirms the offer scope.", nodes: ["worker", "index-cache", "claude"] },
        { title: "Retrieve", text: "For each requirement: confirmed memory (tier M), in-scope passages, labelled out-of-offer passages; a named hardware model (e.g. PA-5430) pulls its family's Hardware Reference and datasheets.", nodes: ["worker", "index-cache", "sql"] },
        { title: "Grade", text: "Claude Sonnet returns verdict, justification, cited snippets and verbatim decisive phrases (validated server-side).", nodes: ["worker", "claude"] },
        { title: "Escalate", text: "Uncertain verdicts (partial, needs verification, low confidence) are re-graded by Claude Opus.", nodes: ["worker", "claude"] },
        { title: "Policy layer", text: "Deterministic rules only weaken: no citation, community-only sources, product outside the offer, low term coverage.", nodes: ["worker", "sql"] },
        { title: "Live review", text: "result.updated events stream to the browser; engineers override verdicts (raising needs a source) and comment.", nodes: ["queue", "api", "browser"] }
      ]
    },
    {
      id: "flow-outputs", name: "4. Outputs and write-back", color: "#A855F7",
      description: "Compliance matrix, summary, BOM, or the answers written into the customer's own file.",
      steps: [
        { title: "Request", text: "The browser requests an output (read access suffices); the API queues output.render.", nodes: ["browser", "api", "queue"] },
        { title: "Render", text: "The worker reads the run and, for write-back, the original file; XLSX/DOCX are filled in a copy, PDF annotated; BOM maps to an optional SKU price list.", nodes: ["worker", "sql", "gcs"] },
        { title: "Download", text: "output.ready event; the file is downloaded through the API with its server-side name.", nodes: ["gcs", "api", "gateway", "browser"] }
      ]
    },
    {
      id: "flow-chat", name: "5. Assistant turn", color: "#F59E0B",
      description: "A tool-using Claude loop that runs in the worker; the API only relays the stream.",
      steps: [
        { title: "Message", text: "POST to the chat session (general or per case; access to the case is checked). The API queues chat.turn and keeps the response open as a stream.", nodes: ["browser", "api", "queue"] },
        { title: "Tool loop", text: "The worker runs Claude with tools: search_knowledge (hardware-aware), case_overview, requirement_verdict, propose_memory, propose_override.", nodes: ["worker", "claude", "index-cache", "sql"] },
        { title: "Stream", text: "Tool calls, results and the Markdown answer with documentation links stream back; proposals wait for the engineer's approval.", nodes: ["worker", "queue", "api", "browser"] }
      ]
    },
    {
      id: "flow-sync", name: "6. Documentation sync and index build", color: "#22C55E",
      description: "Incremental, scheduled mirroring of official documentation into the corpus and a new index snapshot.",
      steps: [
        { title: "Schedule", text: "The scheduler (in every worker) queues source.sync on each source's cron; a sync pod claims it.", nodes: ["queue", "sync"] },
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
    }
  ],

  // -------------------------------------------------------------- scenarios ---
  scenarios: [
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
    { title: "3. Four workloads, one queue", focus: "zone-gke", zoom: 1.25, content: `
      <ul><li><strong>gateway</strong> — UI and /api proxy (same origin).</li><li><strong>api</strong> — REST, event stream, access control; no model permission.</li><li><strong>worker</strong> — the pipeline, assistant turns, index builds.</li><li><strong>sync</strong> ×2 — documentation mirroring.</li></ul>
      <p>They coordinate through a PostgreSQL job queue (SKIP LOCKED, heartbeats) and an event log streamed to browsers.</p>` },
    { title: "4. Least privilege", focus: "wi", zoom: 1.35, content: `
      <p>One service account per workload via Workload Identity — no keys. Only worker and sync may call Vertex AI. Koi credentials are write-only through the API and readable only by sync. Inside the namespace, a default-deny NetworkPolicy lets only the gateway reach the API.</p>` },
    { title: "5. Grounded grading", focus: "index-cache", zoom: 1.3, content: `
      <p>Each requirement is graded against passages retrieved from ~40k synced documents (BM25), confirmed institutional memory and, for named hardware models, that family's Hardware Reference and datasheets. Claude Sonnet grades; Opus re-checks uncertain verdicts; a deterministic policy layer can only lower a verdict.</p>` },
    { title: "6. Models and data residency", focus: "claude", zoom: 1.35, content: `
      <p>Gemini OCR runs in europe-west4. Claude runs on the Vertex AI <strong>global</strong> endpoint until EU quota is granted — requests may be processed outside the EU. Routing is a setting: a discovery job checks which models answer in which region, and a route change needs no release.</p>` },
    { title: "7. Official knowledge, politely", focus: "zone-sources", zoom: 1.1, content: `
      <p>Documentation is mirrored incrementally: GET only, robots.txt honoured, rate-limited, identifying User-Agent. Datasheet PDFs that robots.txt disallows are never crawled — users upload them, tagged by product and hardware model.</p>` },
    { title: "8. Built to recover", focus: "queue", zoom: 1.2, content: `
      <p>Deploys hand running jobs over gracefully; lost workers are detected by heartbeats; evaluations and syncs resume where they stopped; one failed model call never sinks a run. See the Failure Simulator tab.</p>` },
    { title: "9. Reproducible deployment", focus: "tooling", zoom: 1.35, content: `
      <p>An empty Google Cloud project with billing is enough: <code>preflight.sh</code> → Terraform → <code>deploy.sh</code> → <code>post-deploy.sh</code>. The step-by-step guide is <code>docs/DEPLOYMENT.md</code> in the private repository.</p>` }
  ]
};

# RFx Atlas — Interactive Architecture Viewer

**Live:** <https://mzalewski87.github.io/rfx-atlas-architecture/>

An interactive walkthrough of the architecture of **RFx Atlas**, a self-hosted platform on Google
Cloud that answers RFI / RFP / RFQ documents against the Palo Alto Networks portfolio: tender
ingest with OCR, requirement segmentation, a portfolio judge, retrieval-grounded evaluation with
Claude on Vertex AI, reports, bill of materials and answers written back into the customer's files.

The application source is in a private repository; this repository holds only the viewer.

## What the viewer shows

| Mode | Contents |
|---|---|
| **Overview** | Every component — engineer workstation, GKE Autopilot workloads, Cloud SQL (also the job queue and event log), Cloud Storage, Secret Manager, Artifact Registry, Workload Identity, Vertex AI (Gemini, Claude), Cloud NAT and the documentation sources — with a specification panel for each. |
| **Traffic Flows** | Animated end-to-end flows: sign-in over the tunnel, tender ingest, judge and evaluation, outputs and write-back, an assistant turn, documentation sync and index build, the authenticated Koi source, and the deployment pipeline. |
| **Failure Simulator** | What happens when parts fail: worker restarted mid-evaluation, worker crash (heartbeats and the reaper), model outage or missing quota, interrupted sync, tunnel drop, unauthorised access, sign-in challenge on an authenticated source. |
| **Guided Walkthrough** | A short presentation of the main design decisions. |

Drag to pan, scroll to zoom, click a component for its specification, search from the header.

## Architecture at a glance

- One Google Cloud project, region `europe-west4`, built by Terraform.
- **No public endpoint**: private GKE nodes, no public control-plane IP (IAM-authorised DNS
  endpoint), no Ingress or load balancer; users connect with `kubectl port-forward`.
- Four workloads — `gateway` (UI + API proxy), `api`, `worker`, `sync` ×2 — coordinated through a
  PostgreSQL job queue (`SKIP LOCKED`, heartbeats) and an event log streamed to browsers (SSE).
- Least privilege: one service account per workload via Workload Identity, no keys; only `worker`
  and `sync` may call Vertex AI; third-party credentials are write-only.
- Models: Gemini OCR in `europe-west4`; Claude Sonnet (Opus for escalation) on the Vertex AI
  `global` endpoint pending EU quota.
- Documentation mirrored incrementally from official sources: GET only, robots.txt honoured.

## Run locally

Open `viewer/index.html` in a browser. No build step, no server, no network access needed.

## Repository layout

| Path | Contents |
|---|---|
| `viewer/index.html` | the app |
| `viewer/js/data.js` | **the architecture data model** — zones, nodes, links, component specifications, flows, scenarios, slides |
| `viewer/js/diagram.js` | data-driven SVG engine (layout from `data.js`, pan/zoom, focus, states) |
| `viewer/js/animations.js`, `scenarios.js`, `app.js`, `icons.js` | flow animation, failure simulator, app shell, icons |
| `viewer/css/styles.css`, `rfx.css` | shared viewer styling and RFx Atlas additions |
| `.github/workflows/pages.yml` | validates the bundle and the data model, publishes to GitHub Pages |

## Keeping it current

**This viewer must be updated with every architectural change of RFx Atlas**, in step with the
platform's `docs/ARCHITECTURE.md` and `docs/DEPLOYMENT.md`. Architectural changes include a new or
removed workload, data store, external service or documentation source; changes to identity,
network, access control or data residency; a new pipeline stage or job kind; a changed request or
data flow.

Almost every update is an edit to `viewer/js/data.js` only:

1. add or change nodes (`nodes`, with coordinates inside their `zones`), their `components`
   specification and the `links`;
2. update the affected `trafficFlows` and `scenarios` steps;
3. update `projectInfo.lastReviewed`;
4. open `viewer/index.html` locally and check the layout.

The publish workflow fails on dangling references (a flow, scenario, link or preset naming a node
or zone that does not exist, or a node without a specification).

## License

MIT

# VulnBatch Requirements Traceability

Status meanings:

- `complete`: implementation exists and its mapped validation ran successfully.
- `in-progress`: useful implementation exists, but part of the requirement or its acceptance proof is missing.
- `blocked`: a reproducible blocker prevents the acceptance gate from passing.

The primary integration evidence is
[`scripts/validation/smoke_e2e.py`](../scripts/validation/smoke_e2e.py). Its latest successful result is written
to `tmp/e2e/summary.json`. Unit coverage is under [`tests/unit`](../tests/unit). The 100,000-row proof is
[`scripts/validation/load_100k.py`](../scripts/validation/load_100k.py), with its latest result in
`tmp/load-100k/summary.json`.

## Design requirements

| ID | Requirement | Implementation / data | API / UI | Validation | Status |
|---|---|---|---|---|---|
| DES-001 | Docker-first web, worker, PostgreSQL stack on port 8787 | `compose.yaml`, `Dockerfile`, persistent DB/upload/report volumes | one local URL, health/readiness | clean easy-start and Compose health | complete |
| DES-002 | Secure first-run administrator and local roles | auth/security modules; users, roles, sessions, attempts | setup, login, logout, user administration UI/API | first-run, admin, read-only, CSRF and authorization E2E | complete |
| DES-003 | Immutable hash-addressed evidence and idempotent imports | `api/routes/imports.py`, `imports/processor.py`; source/import records | Imports UI/API | upload, duplicate/no-reprocessing, persisted evidence E2E | complete |
| DES-004 | Tenable VM CSV and JSON | `imports/tenable.py` | upload/import summary | parser unit fixtures and worker E2E | complete |
| DES-005 | Safely parsed Nessus XML | `imports/nessus.py`, defused XML | upload/import summary | safe fixture, external-entity rejection, worker E2E | complete |
| DES-006 | Generic CSV preview, mapping, reusable profiles, commit | `imports/generic_csv.py`; `import_profiles` | preview/commit UI/API | preview/commit E2E and mapping unit tests; saved profile listing/editing is absent | in-progress |
| DES-007 | Medium/Low tracked scope and excluded counts | parser/processor/settings; import summaries | settings and import summary | severity unit tests and E2E | complete |
| DES-008 | Canonical assets and separate identifier evidence | assets, identifiers, identifier observations | host/detail APIs/UI | normalization unit tests, MAC query and persisted-state E2E | complete |
| DES-009 | Conservative matching and identity review | `identity/resolver.py`; review records | review queue and resolution UI/API | conflicting strong identifiers and manual resolution E2E | complete |
| DES-010 | Merge, split, move, verify, shared IP, pin, reject and undo | `api/routes/identity.py`; identity events | APIs and review UI | resolver scenarios pass; database-backed merge/split/undo and full UI workflows are not automated | in-progress |
| DES-011 | Definition separated from asset finding identity | definition/finding models and unique constraints | finding/plugin/detail UI/API | identity/lifecycle unit tests and recurring-import E2E | complete |
| DES-012 | Lifecycle history and safe reconciliation | `findings/lifecycle.py`; observations/status history | finding status API/UI | unit lifecycle proof; complete-scope comparability still relies on explicit administrator declaration | in-progress |
| DES-013 | Separate maturity and SLA clocks | `findings/calculations.py`, processor fields | finding/host/report surfaces | maturity, emergency, earliest-First-Found and SLA unit tests | complete |
| DES-014 | Ownership, classifications, tags and notes | asset/tag models and asset update/export services | host detail and report surfaces | snapshot mutation/formula E2E; bulk metadata CSV I/O is not implemented | in-progress |
| DES-015 | Practical administrative React UI | `frontend/src/pages`, versioned REST backend | dashboard, hosts, findings, imports, review, views, exports, audit, users, settings | lint/typecheck/unit/build pass; callable browser E2E surface unavailable | in-progress |
| DES-016 | XLSX Host Summary, Finding Detail and metadata | snapshot service and constant-memory generator | report builder/history/download | real XLSX E2E with sheet, snapshot and hash checks | complete |
| DES-017 | CSV and printable HTML reports | shared snapshot generator | report builder/history/download | real CSV/HTML provenance, formula and hash checks | complete |
| DES-018 | Private/shared saved views | saved-view service/model | Saved Views and Report Builder | save, revision mutation and durable export E2E | complete |
| DES-019 | Auditable security and data operations | audit service/events | Audit UI/API | 34-event E2E with required import/export/identity/user events | complete |
| DES-020 | Retention and PostgreSQL backup/restore | maintenance service and ops scripts | settings/docs | cleanup implementation; backup/checksum/restore/persistence validation passed | complete |
| DES-021 | 100,000-row import and large-export proof | `scripts/validation/load_100k.py` | worker/import/export status | 100k input stayed within memory but did not finish within 30 minutes; export phase was not reached | blocked |
| DES-022 | Documentation and OpenAPI | `docs`, README, FastAPI metadata | `/docs`, beginner launch guide | links/commands reviewed; runtime API exercised by E2E | complete |

## Host Query Export requirements

| ID | Requirement | Implementation | Validation | Status |
|---|---|---|---|---|
| HQE-1 | One versioned typed query contract and shared service | `schemas/query.py`, `queries/service.py` used by list, preview, saved views and exports | list/preview/export parity in E2E | complete |
| HQE-2 | Exactly one selected/query/saved-view asset scope | discriminated request model and export resolver | all three distinct modes exercised | complete |
| HQE-3 | Required host, identifier, metadata, derived and finding filters | strict schema and shared query builder with indexes in `0001_initial_schema.py` | representative filters pass; exhaustive database-backed per-filter suite is incomplete | in-progress |
| HQE-4 | Deterministic AND/OR, tags, normalization, IP scope and sorting | query normalizer/builder with UUID tie-breaker | MAC normalization and injection-like value E2E; exhaustive tag/current-history proof is incomplete | in-progress |
| HQE-5 | Preview count, sample, finding estimate and warnings | `POST /api/v1/assets/query/preview` | count parity and warning path E2E | complete |
| HQE-6 | Durable auditable export snapshot | export job plus asset/finding snapshot rows | post-submission asset/view mutation does not change report | complete |
| HQE-7 | Finding scope separate from asset scope | typed `FindingScopeV1` persisted on export | selected/query/saved-view exports with scoped counts | complete |
| HQE-8 | Preview/create/status/download/cancel/retry APIs | versioned assets/exports routes | create/status/download and permission E2E; safe handlers implemented | complete |
| HQE-9 | Explicit selected versus all-matching UI, views and progress | Hosts, Report Builder, Saved Views and Exports pages | component/build proof; browser E2E unavailable and form exposes a useful subset of backend filters | in-progress |
| HQE-10 | Same snapshot, metadata and formula safety in all formats | `exports/service.py`, `exports/generator.py` | XLSX/CSV/HTML snapshot, provenance, hash and formula E2E | complete |
| HQE-11 | Async, indexed, bounded generation and actionable failure | PostgreSQL worker queue, indexes, streaming generators, retry/cleanup | small E2E passes; 100k import exceeds 30 minutes and progress remains invisible until transaction commit | blocked |
| HQE-12 | Sixteen required query/export validations | unit, component and integration validators | many scenarios pass, but exhaustive parity/filter/browser/large-memory gates do not | blocked |

## Safety invariants

| ID | Invariant | Enforcement | Validation | Status |
|---|---|---|---|---|
| SAFE-001 | Never silently merge ambiguous assets | resolver conflict rules and review queue | resolver unit scenarios and conflict-resolution E2E | complete |
| SAFE-002 | Preserve association evidence, rule, confidence and dates | identifier observations linked to immutable import rows | persisted evidence and identity E2E | complete |
| SAFE-003 | Manual decisions override automation | verified/manual override flags and priority | resolver unit proof; full future-import database scenario absent | in-progress |
| SAFE-004 | Missing source values remain null | parser normalization | sanitized parser fixtures | complete |
| SAFE-005 | Absence is not remediation | lifecycle defaults and guarded `not_observed` reconciliation | partial/authoritative unit proof; comparable scope not independently verified | in-progress |
| SAFE-006 | Maturity and SLA use separate preserved dates | calculation service and separate persisted fields | source precedence, earliest First Found and SLA tests | complete |
| SAFE-007 | Query values are data, never SQL | strict Pydantic allowlist and SQLAlchemy expressions | unknown fields rejected; injection-like value E2E | complete |
| SAFE-008 | Exports are permission checked, audited, formula safe and traceable | routes, snapshots, generator and audit events | administrator/read-only ownership, hashes and all formats E2E | complete |
| SAFE-009 | No universal password, telemetry or default external calls | first-run setup and local-only defaults | clean setup and configuration inspection | complete |

## Reproducible blockers

### Core: 100,000-row import and export

`python scripts/validation/load_100k.py` generated and uploaded a 56,400,352-byte Tenable CSV containing
100 assets and 100,000 findings. Under the normal Compose limits, the worker used about 86 MiB of 2 GiB and
PostgreSQL used about 221 MiB of 2 GiB, but the import did not commit within the 1,800-second limit. The API
continued to report `queued` because import processing occurs inside one transaction. The worker was stopped
to roll back the synthetic job. The large query/export phase therefore could not run.

### Validation environment: browser automation

The required in-app browser JavaScript control surface was not available in this task. Standalone browser
automation was not substituted. Frontend lint, type checking, component tests and production build ran, and
the real API/export workflow ran, but the required browser download flow and screenshots remain unverified.


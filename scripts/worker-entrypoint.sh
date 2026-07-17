#!/bin/sh
set -eu

umask 027

python /app/scripts/ops/wait-for-database.py

if ! alembic current --check-heads >/dev/null; then
    echo "Database schema is not at the current Alembic head; start the web service to apply migrations." >&2
    exit 1
fi

echo "Starting VulnBatch worker."
exec vulnbatch-worker

# Validation

The isolated frontend passed `npm ci` / `npm run build` after preparation (ticketing uses an updated lockfile without the obsolete automatic react-snap step). The backend was inspected for configuration handling; a full deployed workflow with a populated MySQL database has not been certified. Missing original media is intentionally replaced with neutral demo placeholders. Bundle-size warnings remain.

Run the application only with synthetic records and operator-supplied local settings. This source snapshot does not include the original repository's history or its data artifacts.

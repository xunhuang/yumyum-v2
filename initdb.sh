# set your CONN in your env

init_schema() {
   psql -Atx $CONN < schema.sql
}

load_legacy_venues() {
   psql -Atx $CONN -c "\copy venues from './data/VenuesExport-2020/venues.csv' with delimiter as ',' csv header quote as '\"'  "
}

$1

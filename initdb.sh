# set your CONN in your env

init_schema() {
   psql -Atx $CONN < schema.sql
}

$1

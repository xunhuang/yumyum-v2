
cat venue-export-2020.json |jq "[.venues | to_entries[] |.value]" > venues.json
FIELDS=`cat venues.json |jq -r ".[] | to_entries[] |.key" |sort |uniq  | paste -d, -s -`
cat venues.json | json2csv -f $FIELDS  >venues.csv

# From psql, create a table venues with all these fields, pay attention to the field types
# \copy venues from 'path/to/venues.csv' CSV HEADER DELIMITER ',';
# Note that imageList will be text with json array in it


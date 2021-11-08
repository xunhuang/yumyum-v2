cat global-11-04-2021.json|jq -r -f process.jq > clean.json
FIELDS=`cat clean.json |jq -r ".[] | to_entries[] |.key" |sort |uniq  | paste -d, -s -`
cat clean.json | json2csv -f $FIELDS  >clean.csv

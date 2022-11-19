
Download Data
-------------

npm install 
npx ts-node src/index.ts > today.json 

# cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "california") | select ( ._highlightResult .area_name .value | IN ("East Bay", "Marin", "Monterey", "Peninsula", "South Bay", "Wine Country", "San Francisco"))  ] ' > ../../public/data/bayarea.json
#cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "new-york-state") ] ' > ../../public/data/nyc.json



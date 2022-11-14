
Download Data
-------------

npm install 
npm run start > today.json 

cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "california") | select ( ._highlightResult .area_name .value | IN ("East Bay", "Marin", "Monterey", "Peninsula", "South Bay", "Wine Country", "San Francisco"))  ] ' > BayArea.json



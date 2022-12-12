
Download Data
-------------

npm install 
npx ts-node src/index.ts > today.json 

# cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "california") | select ( ._highlightResult .area_name .value | IN ("East Bay", "Marin", "Monterey", "Peninsula", "South Bay", "Wine Country", "San Francisco"))  ] ' > ../../public/data/bayarea.json
# cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "california") | select ( ._highlightResult .area_name .value | IN ("Los Angeles", "Orange County"))  ] ' > ../../public/data/losangeles.json
# cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "california") | select ( ._highlightResult .area_name .value | IN ("Sacramento" ))  ] ' > ../../public/data/sacramento.json
# cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "california") | select ( ._highlightResult .area_name .value | IN ("San Diego" ))  ] ' > ../../public/data/sandiego.json
#cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "new-york-state") ] ' > ../../public/data/nyc.json
#cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "illinois") ] ' > ../../public/data/chicago.json
#cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "florida") ] ' > ../../public/data/florida.json
#cat today.json |jq '  [ .[]  | select ( .country .slug == "us")|  select ( .region .slug == "district-of-columbia") ] ' > ../../public/data/washingtondc.json


Download Tock Data
------------------

# full data
npx ts-node src/tock.ts > tock_all.json 

# trimmed data 
cat tock_all.json |jq '[.[] | { name, slug:.domainName, businessid: .id, address:.location.address, latitude: .location.lat, longitude:.location.lng }] '  > ../../public/data/tock-trimmed.json
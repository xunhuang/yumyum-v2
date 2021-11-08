
# this link was derived from inspective traffic on 
# https://guide.michelin.com/en/restaurants
# by going pressing "next" 
#
curl 'https://8nvhrd7onv-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.24.1)%3B%20JS%20Helper%20(3.4.5)&x-algolia-application-id=8NVHRD7ONV&x-algolia-api-key=71b3cff102a474b924dfcb9897cc6fa8' \
  -H 'Connection: keep-alive' \
  -H 'sec-ch-ua: "Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"' \
  -H 'accept: application/json' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Origin: https://guide.michelin.com' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: https://guide.michelin.com/en/restaurants/page/0' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7' \
  --data-raw '{"requests":[{"indexName":"prod-restaurants-en","params":"aroundLatLngViaIP=true&aroundRadius=all&filters=status%3APublished&hitsPerPage=1000&attributesToRetrieve=%5B%22_geoloc%22%2C%22region%22%2C%22city%22%2C%22country%22%2C%22cuisines%22%2C%22good_menu%22%2C%22image%22%2C%22images%22%2C%22main_image%22%2C%22michelin_award%22%2C%22name%22%2C%22slug%22%2C%22new_table%22%2C%22offers%22%2C%22offers_size%22%2C%22online_booking%22%2C%22other_urls%22%2C%22site_slug%22%2C%22site_name%22%2C%22take_away%22%2C%22url%22%5D&maxValuesPerFacet=200&page='$1'&facets=%5B%22country.cname%22%2C%22country.slug%22%2C%22region.slug%22%2C%22city.slug%22%2C%22good_menu%22%2C%22new_table%22%2C%22take_away%22%2C%22distinction.slug%22%2C%22green_star.slug%22%2C%22offers%22%2C%22cuisines.slug%22%2C%22area_slug%22%2C%22online_booking%22%2C%22facilities.slug%22%2C%22categories.lvl0%22%5D&tagFilters="}]}' \
  --compressed

    [.[] | { 
    # good_menu,  # no data
    # new_table,  # no data
    # offers,  # no data
    # offers_size  # no data
    name,
    online_booking,
    region: .region.name,
    site_name,
    site_slug,
    slug,
    take_away,
    cuisines,
    url, 
    other_urls,
    objectID,
    postcode: ._highlightResult.postcode.value,
    street: ._highlightResult.street.value,
    area: ._highlightResult.area_name.value,
    city: .city.name,
    country: .country.name,
    main_image: .main_image.url,
    michelin_award,
    imageList: (if .images !=null then [.images | .[] | .url] else null end),
    longitude: ._geoloc.lng,
    latitude:._geoloc.lat
}]

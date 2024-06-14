#!/usr/bin/env node

const fetch_new = require('node-fetch');
const cheerio = require('cheerio');
const jq = require('node-jq')

async function jqQuery(jsonObject: any, query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jq.run(
      query,
      jsonObject,
      { input: 'json' }
    ).then((x: any) => { resolve(x); });
  });
}

async function download_app_config(city_slug: string): Promise<any> {
  const url = `https://www.exploretock.com/city/${city_slug}`;
  const w = await fetch_new(url);
  const html = await w.text();

  console.log(html);

  const $ = cheerio.load(html);
  const scripts = $('script');
  var appconfig: any = null;

  scripts.map((i: any, el: any) => {
    const text = $(el).text();
    if (text.includes("window.$REDUX_STATE")) {
      const toeval = text.replace("window.$REDUX_STATE", "appconfig");
      console.log(toeval);
      eval(toeval);
    }
    return null;
  });

  return appconfig;
}

async function download_cities(): Promise<any> {
  const appconfig = await download_app_config('san-francisco');
  return appconfig.app.config.metroArea;
}

async function download_venus_from_city(city_slug: string): Promise<any> {
  const venues = await download_app_config(city_slug);
  const resultstring = await jqQuery(venues, '[..   | .content? .business? | select(.) | . [] ]');
  var result = JSON.parse(resultstring);
  return result.map((x: any) => {
    x.citySlug = city_slug;
    return x;
  });
}

async function main() {
  const cities = await download_cities();
  var total: any = [];
  // for (const city of cities.slice(0, 5)) {
  for (const city of cities) {
    console.error(city.slug);
    const venues = await download_venus_from_city(city.slug);
    total.push(...venues);
  }
  console.log(JSON.stringify(total, null, 2));
}

main();

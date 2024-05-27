# Yumyum Cloud Functions

## To run locally, run

```
ln -sf ../tockspecial/resy_support.js .
ln -sf ../tockspecial/yumyumGraphQLCall.js .
npm install
npm start
```

hit url
http://localhost:8080/?businessid=7074&party_size=2&date=2024-06-18&timezone=America%2FLos_Angeles&url_slug=heirloom-cafe

## Running in the cloud

After using innstall gcloud CLI, run "gcloud init", then the following

```
npm run deploy
```

if successful, this should give you a bunch output with this in the end:

```
url: https://us-west1-yumyum-v2.cloudfunctions.net/resy_1?businessid=7074&party_size=2&date=2024-06-18&timezone=America%2FLos_Angeles&url_slug=heirloom-cafe
```

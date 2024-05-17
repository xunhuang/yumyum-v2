# Tock Special

To run locally, run

```
npx @google-cloud/functions-framework --target=tock_redis
```

after using innstall gcloud CLI, run "gcloud init", then the following

```
gcloud functions deploy tock_redis \
  --gen2 --region=us-west1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=tock_redis \
  --trigger-http \
  --allow-unauthenticated
```

Must have higher memory limit for this

```
gcloud functions deploy tock_pup \
  --gen2 --region=us-west1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=tock_pup \
  --trigger-http \
  --allow-unauthenticated --memory=1024M
```

if successful, this should give you a bunch output with this in the end:

```
url: https://us-west1-yumyum-v2.cloudfunctions.net/tock_redis?urlSlug=ssal

url: https://us-west1-yumyum-v2.cloudfunctions.net/tock_pup
```

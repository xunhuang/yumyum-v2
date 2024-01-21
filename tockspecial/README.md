# Tock Special

Tock is very hard to handle. API is in binary form instead of simple JSON.
Tock started using CloudFlare to fight against bots, and they started this TLS handshake thing
that we need to use got-scraping to defeat. 

The code here deplys to cloud function to enable us to test in simple way.


To run locally, run

```
npx @google-cloud/functions-framework --target=helloGET
```

after using innstall gcloud CLI, run "cloud init", then the following

```
gcloud functions deploy hello-node-function \
  --gen2 --region=us-west1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=helloGET \
  --trigger-http \
  --allow-unauthenticated
```

```
gcloud functions deploy tock_full \          
  --gen2 --region=us-west1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=tock_full \
  --trigger-http \
  --allow-unauthenticated
 ```

```
gcloud functions deploy tock_pup \          
  --gen2 --region=us-west1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=tock_pup \
  --trigger-http \
  --allow-unauthenticated
 ```

if successful, this should give you a bunch output with this in the end:

```
url: https://us-west1-yumyum-v2.cloudfunctions.net/hello-node-function
```

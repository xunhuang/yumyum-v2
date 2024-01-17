#!/bin/bash
for i in {1..20}
do
   echo "Iteration $i"
   gcloud functions deploy tock_full_$i \
  --gen2 --region=us-west1 \
  --runtime=nodejs20 \
  --source=. \
  --entry-point=tock_full \
  --trigger-http \
  --allow-unauthenticated
done

Backup 

```
pg_dump $CONN -c -O --no-tablespaces -n public > venues.sql
```

refresh cloud data from venues.sql
```
psql $CONN_CLOUD < venues.sql
```

Connect To the Cloud SQL instance

```
./cloud_sql_proxy -instances=myrandomwatch-b4b41:us-central1:firstpostpostdb=tcp:65432
```


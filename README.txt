Client Install
---------------

npm install --force (?why force? not sure)
NODE_OPTIONS=--openssl-legacy-provider SKIP_PREFLIGHT_CHECK=true npm start


Running server locally
----------------------

cd graphql
npm install

export PGHOST=35.188.171.*** # lookup from console.cloud.google.com yumyum-v2
export PGPASSWORD=3DdeM*****  # look it up 

# configure db connection
npm start 

then visit  http://localhost:8080/graphiql

type in a query like 
'''
query MyQuery {
  allVenues(filter: {metro: {equalTo: "bayarea"}, name: {equalTo: "Angler SF"}}) {
    edges {
      node {
        name
        slots (date:"2023-07-14",party_size:2, timeOption:"lunch")
      }
    }
  }
}
'''

To test both front and backend locally
'''
export REACT_APP_GRAPHQL_ENDPOINT=http://localhost:8080/graphql
''' 
and restart the frontend server


install code gen
----------------
npm i -D @graphql-codegen/cli
npm run generate

If the above fails, likely due to schema changes.
We need to run the server locally first to update the schema file.

server side graphql
-------------------

https://graph-3khoexoznq-uc.a.run.app/graphiql


Run Unit Tests
--------------

cd graphql; ln -s ../src/generated .

npm test

Run one specific unit test 

npm test tests/integration/abc/resy.test.ts


TOCK protocol buff proto generation 
-----------------------------------
brew install protobuf
./compileProtos.sh 

The above reverse engineering was performed by using 
1) https://protobuf-decoder.netlify.app/ to analyize the octect stream to determine the protobuf structure
2) fiddler for macos to determine/save the input payload (both Safari and Chrome developer console failed to handle the binary data properly)


New Emerging Reservation Systems
--------------------------------
- Spoton: https://spotonreserve.com/web/restaurant.html?restaurantId=61986/Gusto-Handcrafted-Pasta-Pizza
- Sevenrooms


How to update db
----------------

# follow data/11-05-2022/README.txt  to generate a number of per city json. check those in
# for each 
# Go to admin tab (after logging in)
## click "Import from Michelin JSON"
## visually inspect
## Click "import!" . no GUI feedback
# run npm test tests/reservation-tbd.test.ts

hopefully the above gets automated some day.

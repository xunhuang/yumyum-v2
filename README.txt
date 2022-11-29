Client Install
---------------

npm install --force (?why force? not sure)
npm start


Running server locally
----------------------

cd graphql
ln -s ../src/yummodule .
npm install

export PGHOST=35.239.215.*** # lookup from console.cloud.google.com random
export PGPASSWORD=3DdeM*****  # look it up 

# configure db connection
npm start 

then visit  http://localhost:8080/graphiql


install code gen
----------------
npm i -D @graphql-codegen/cli
npm start generate

If the above fails, likely due to schema changes.
We need to run the server locally first to update the schema file.

server side graphql
-------------------

https://graph-3khoexoznq-uc.a.run.app/graphiql


Run Unit Tests
npm test

Run one specific unit test 

npm test tests/integration/abc/resy.test.ts


TOCK protocol buff proto generation 
-----------------------------------
./compileProtos.sh 
The above reverse engineering was performed by using 
1) https://protobuf-decoder.netlify.app/ to analyize the octect stream to determine the protobuf structure
2) fiddler for macos to determine/save the input payload (both Safari and Chrome developer console failed to handle the binary data properly)
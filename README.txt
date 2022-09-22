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
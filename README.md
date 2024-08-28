
## Project setup
```
npm install
```

### Run
```
node server.js
```

db-migrate create user_table --config app/config/database.json -e prod
````````
db-migrate up --config config/database.json -e prod
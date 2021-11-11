# Fetch-Rewards Backend Project

## Project Description and Context
[Project Description](https://fetch-hiring.s3.us-east-1.amazonaws.com/points.pdf)
- This project was implemented using a Node.js and Express.js backend.
- The file structure follows standard routing, models, repository (data access layer) folders.
- The project description is open-ended with the choice of data storage. I implemented my own mock databases to persist the payer balances and overall transactions. The databases are really package.json files (`/payers.json` for all payer profiles and `/transaction.json` for all transactions of all payers). I also provided a repository (data access layer) to interface and query with the mock JSON database.
- We start off with the JSON files having an empty array, but it will get populated overtime as we make HTTP requests. Please ensure not to tamper with the JSON files as you start running the project.

## Installation and Set-Up
As previously mentioned, this is a Node.js and Express.js backend. So, you must have node and npm (node's package manager) installed.
- [Installing node](https://nodejs.org/en/)
- [Installing npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Installing nvm](https://github.com/nvm-sh/nvm)

Now, go to the root directory of the project and install the required modules using `npm i` and you should have a `node_modules` folder based on the modules specified in the package.json.

To recap, you should have a node environment set up and a `node_modules` folder at this stage.

## Running the project
While in the root directory of the project, run `node app.js` in your terminal and you should see the prompt `The server has started on port 5000`.

## Using the project
Open a new terminal tab while running the following commands of this section! This allows us to make HTTP requests to the `localhost:5000` server while it's running in the other tab.
### Add Transactions
A payer can add points to a user's account. In other words, a transaction with a payer, points, and timestamp is provided. Here is an example input: `{ "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }`. In order to add transactions for a specific payer and date, open a new terminal tab (while the project is still running in the other tab via `node app.js`) and run this command:

```
curl -X POST -d '{ "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }' -H 'Content-Type: application/json' localhost:5000/transaction/addPoints
```

This should have persisted the transaction and appear in `/transaction.json`
Try the following commands after finishing the above example:

```
curl -X POST -d '{ "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" }' -H 'Content-Type: application/json' localhost:5000/transaction/addPoints
```

```
curl -X POST -d '{ "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" }' -H 'Content-Type: application/json' localhost:5000/transaction/addPoints
```

```
curl -X POST -d '{ "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" }' -H 'Content-Type: application/json' localhost:5000/transaction/addPoints
```

```
curl -X POST -d '{ "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }' -H 'Content-Type: application/json' localhost:5000/transaction/addPoints
```
All of this data should be populated in `/payer.json` (with current balances for each payer) and `/transaction.json`. Successful creation will prompt the message `{"message":"Persisted transaction and updated payer"}`.

### Spend Points
If a user wants to spend points, run the following:

```
curl -X PUT -d '{ "points": 5000 }' -H 'Content-Type: application/json' localhost:5000/user/spendPoints
```

Points are deducted by oldest transaction timestamp, while ensuring no payer points go negative. We are returned with a list of payers and how much we withdrew from them based on the aforementioned criteria. Continuing from the previous example, the output should be `{"data":[{"payer":"DANNON","points":-100},{"payer":"UNILEVER","points":-200},{"payer":"MILLER COORS","points":-4700}]}`

### Retrieving All Payer Point Balances
After the spend, we can check how much points each payer has left by running the following:

```
curl -GET localhost:5000/payer/allBalances
```

The output should be `{"data":[{"payer":"DANNON","points":1000,"id":"c0fd7742"},{"payer":"UNILEVER","points":0,"id":"593c2c4a"},{"payer":"MILLER COORS","points":5300,"id":"7833c9db"}]} ` (note that ids will vary since they are randomly generated, this is not a concern).

Feel free to check out the `/payer.json` and `/transaction.json` files to see how the update overtime as you run these commands.

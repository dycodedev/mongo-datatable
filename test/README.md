# Mongo Datatable Test

Express-based app for handling jquery datatables server-side processing using mongo-datatable module.

## Data source

In this example, I am using database `samples` and collection `zipcodes`. And documents for `zipcodes` can be downloaded by clicking [this link](http://media.mongodb.org/zips.json?_ga=1.69149396.496420190.1431955345). You can import it to your collection by using `mongoimport` command which is explained below.

The data model is described [here](http://docs.mongodb.org/manual/tutorial/aggregation-zip-code-data-set/).

## Importing Data

You can import your data using following command

```bash
mongoimport --host localhost --port 27017 --username youruser --password yourpassword --collection zipcodes --db samples --file zips.json
```

You can omit `--username` and `--password` if you don't  have any user, and you can omit `--port` as well if your mongodb server is using default port.

Note that you must be in the same directory as `zips.json` file to run the above command, otherwise you should move to directory where `zips.json` file lies or specify either absolute or relative path to that file.

You can find more detail about importing data to mongodb in [here](http://docs.mongodb.org/manual/reference/program/mongoimport/)

## Running the app

Using port number 8000 or any available port numbers.

```bash
PORT=8000 node app.js
```
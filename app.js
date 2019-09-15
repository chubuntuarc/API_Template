//Created by westmountsolutions.com by WSDEV20190912 JA
//API fo rinternal use only. WS DevBase.
//Modules import
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

//Import graphql custom Schema and resolvers.
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/auth');

//Initialize the app
const app = express();
app.use(bodyParser.json());
//Use auth middleware
app.use(isAuth);

//Main endpoint.
app.use('/api', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

//MongoDB connection.
const mongo_url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@wsdevbase-l6ww2.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    //App port
    app.listen(3000)
}).catch(err => {
    console.log(err)
});
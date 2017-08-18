var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var https = require('https');
var port = process.env.PORT || 80;
var router = express.Router();
var mongoose = require('mongoose');
var mongoURL = process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/image-search-abstraction-layer';
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    var queries = require('./query_model.js');
    app.set('view engine', 'jade');
    app.use(express.static(path.join(__dirname, '/public')));
    app.get('/search/*', function (request, response) {
        var url;
        if (request.query.offset) {
            url = '/3/gallery/search/viral/' + request.query.offset + '?q="' + request.query.query + '"';
        } else {
            url = '/3/gallery/search/viral?q="' + request.query.query + '"';
        }
        const options = {
            hostname: 'api.imgur.com',
            port: 443,
            path: url,
            method: 'GET',
            headers: {
                Authorization: 'Client-ID 2da5b009d7cd5b7'
            }
        }
        const req = https.request(options, (res) => {
            var data = '';
            res.on('data', (chunk) => {
                data += chunk;
            })
            res.on('end', () => {
                data = JSON.parse(data);
                var responseData = [];
                for (var i = 0; i < data.data.length; i++) {
                    responseData[i] = {};
                    responseData[i].url = data.data[i].link;
                    responseData[i].title = data.data[i].title;
                }
                var newQuery = new queries();
                newQuery.term = request.query.query;
                newQuery.date = new Date();
                newQuery.save((err) => {
                    if (err) {
                        return res.send(err);
                    }
                    response.send(responseData);
                })
            });
        });
        req.end();
    });
    app.get('/latest', function (req, res) {
        queries.find({}).sort({
            date: -1
        }).limit(100).exec(function (err, docs) {
            if (err) {
                res.send(err);
            }
            res.send(docs);
        });
    });
    app.get('/',function(req,res){
        res.render('index');
    })
    app.listen(port, function () {
        console.log('App is listening on ' + port);
    })
})

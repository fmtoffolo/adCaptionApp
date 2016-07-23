'use strict';

var express = require('express');
var router = express.Router();
var captionate = require('../../adCaption');

function parseQuery(query) {
    var configuration = [];

    for (var key in query) {
        var temp = {};

        var values = query[key].split('|');

        values = values.map(function(values) {
                if (values.substring(0, 'imageUrl'.length) === 'imageUrl') {
                    return ['imageUrl', values.substring('imageUrl:'.length, values.length)];
                }
                if (values.substring(0, 'text'.length) === 'text') {
                    return ['text', values.substring('text:'.length, values.length)];
                }
                var config = values.split(':');
                return config;
            })
            .reduce(function(con, data) {
                con[data[0]] = data[1];
                return con;
            }, temp);

        configuration.push(temp);
    }

    return configuration;
}

/* GET users listing. */
router.get('/', function(req, res) {

    try {
        var query = parseQuery(req.query);
    } catch (e) {
        return res.send('Something went wrong with your configuration');
    }

    captionate(query)
        .then(function(buffer) {
            res.contentType('png');
            return res.end(buffer);
        })
        .catch(function(error) {
            console.log(error);
            return res.send(error.toString());
        });
});


module.exports = router;

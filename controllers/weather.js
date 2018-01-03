const pg = require('pg');

pg.defaults.ssl = true;

var dbString = process.env.DATABASE_URL;

var sharedPgClient;

pg.connect(dbString, function (err, client) {
    if (err) {
        console.error("PG Connection Error")
    }
    console.log("Connected to Postgres");
    sharedPgClient = client;
});


exports.list = function (req, res) {
    if (req.query.q == null || req.query.q == '') {
        // req.getConnection(function (err, connection) {
        sharedPgClient.query('SELECT * FROM weather', function (err, rows) {
            if (err) throw err
            res.json(rows)
        });
        // });
    }
    else {
        // req.getConnection(function (err, connection) {
        cliesharedPgClientnt.query('SELECT * FROM weather where country LIKE "%' + req.query.q + '%"', function (err, rows) {
            if (err) throw err
            res.json(rows)
        });
        // });
    }

};

exports.getOne = function (req, res) {
    // req.getConnection(function (err, connection) {
    sharedPgClient.query('SELECT * FROM weather where id=' + req.params.id, function (err, rows) {
        if (err) throw err
        res.json(rows[0])
    });
    // });
};
exports.delete = function (req, res) {
    const id = req.params.id;
    // req.getConnection(function (err, connection) {
    sharedPgClient.query("DELETE FROM weather WHERE id = ? ", [id], function (err, rows) {
        if (err) throw err;
        res.json({
            "id": parseInt(id),
        })
    });
    // });
};
exports.save = function (req, res) {
    const input = JSON.parse(JSON.stringify(req.body));

    // req.getConnection(function (err, connection) {
    const data = input;
    sharedPgClient.query("INSERT INTO weather set ? ", data, function (err, rows) {
        if (err) throw err;
        data.id = parseInt(rows.insertId);
        res.json(data)
    });
    // });
};

exports.update = function (req, res) {
    const input = JSON.parse(JSON.stringify(req.body));
    // req.getConnection(function (err, connection) {
    const data = input;
    sharedPgClient.query("UPDATE weather set ? WHERE id=" + req.params.id, req.body, function (err, rows) {
        if (err) throw err;
        data.id = req.params.id;
        res.json(data)
    });
    // });
};
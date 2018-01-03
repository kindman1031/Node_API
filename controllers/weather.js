const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});


exports.list = function (req, res) {
    if (req.query.q == null || req.query.q == '') {
        // req.getConnection(function (err, connection) {
        client.connect();
        client.query('SELECT * FROM weather', function (err, rows) {
            if (err) throw err
            client.end();
            res.json(rows)
        });
        // });
    }
    else {
        // req.getConnection(function (err, connection) {
        client.connect();
        client.query('SELECT * FROM weather where country LIKE "%' + req.query.q + '%"', function (err, rows) {
            if (err) throw err
            client.end();
            res.json(rows)
        });
        // });
    }

};

exports.getOne = function (req, res) {
    // req.getConnection(function (err, connection) {
    client.connect();
    client.query('SELECT * FROM weather where id=' + req.params.id, function (err, rows) {
        if (err) throw err
        client.end();
        res.json(rows[0])
    });
    // });
};
exports.delete = function (req, res) {
    const id = req.params.id;
    // req.getConnection(function (err, connection) {
    client.connect();
    client.query("DELETE FROM weather WHERE id = ? ", [id], function (err, rows) {
        if (err) throw err;
        client.end();
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
    client.connect();
    client.query("INSERT INTO weather set ? ", data, function (err, rows) {
        if (err) throw err;
        data.id = parseInt(rows.insertId);
        client.end();
        res.json(data)
    });
    // });
};

exports.update = function (req, res) {
    const input = JSON.parse(JSON.stringify(req.body));
    // req.getConnection(function (err, connection) {
    const data = input;
    client.connect();
    client.query("UPDATE weather set ? WHERE id=" + req.params.id, req.body, function (err, rows) {
        if (err) throw err;
        data.id = req.params.id;
        client.end();
        res.json(data)
    });
    // });
};
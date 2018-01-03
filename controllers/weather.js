const { Client } = require('pg');
const client = new Client({
    connectionString: "postgres://rtssexxqlejgxq:483ed4cf39b88348172f5c96733670dd963c08b36970d084ea6943b263f9de14@ec2-54-243-61-173.compute-1.amazonaws.com:5432/dfjo1u1s37m18m",
    ssl: true,
});


exports.list = function (req, res) {
    if (req.query.q == null || req.query.q == '') {
        // req.getConnection(function (err, connection) {
        client.connect();
        client.query('SELECT * FROM weather', function (err, rows) {
            if (err) throw err
            res.json(rows.rows)
        });
        // });
    }
    else {
        // req.getConnection(function (err, connection) {
        client.connect();
        client.query("SELECT * FROM weather where country LIKE '%" + req.query.q + "%'", function (err, rows) {
            if (err) throw err
            res.json(rows.rows)
        });
        // });
    }

};

exports.getOne = function (req, res) {
    // req.getConnection(function (err, connection) {
    client.connect();
    client.query('SELECT * FROM weather where id=' + req.params.id, function (err, rows) {
        if (err) throw err
        res.json(rows.rows[0])
    });
    // });
};
exports.delete = function (req, res) {
    const id = req.params.id;
    // req.getConnection(function (err, connection) {
    client.connect();
    client.query("DELETE FROM weather WHERE id = " + id, function (err, rows) {
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
    client.connect();
    client.query("INSERT INTO weather(country, state, snow, wind, seismic1, seismic2) VALUES($1, $2, $3, $4, $5, $6)", [req.body.country, req.body.state, req.body.snow, req.body.wind, req.body.seismic1, req.body.seismic2], function (err, rows) {
        if (err) throw err;
        console.log(rows)
        data.id = parseInt(rows.rows.insertId);
        res.json(data)
    });
    // });
};

exports.update = function (req, res) {
    const input = JSON.parse(JSON.stringify(req.body));
    // req.getConnection(function (err, connection) {
    const data = input;
    client.connect();
    client.query("UPDATE weather SET country=$1, state=$2, snow=$3, wind=$4, seismic1=$5, seismic2=$6 WHERE id=" + req.params.id, [req.body.country, req.body.state, req.body.snow, req.body.wind, req.body.seismic1, req.body.seismic2], function (err, rows) {
        if (err) throw err;
        data.id = req.params.id;
        res.json(data)
    });
    // });
};
var app = require('koa')();

// Middleware and helpers
var serve = require('koa-static');
var parse = require('co-body');
var router = require('koa-router')();
var cors = require('koa-cors');
var http = require('http');

// Import rethinkdb
var r = require('rethinkdb');

// Load config for RethinkDB and koa
var config = require(__dirname + "/config.js");

// Static content
app.use(serve(__dirname + '/public'));

// Create a RethinkDB connection
app.use(createConnection);

// Routes
router.get('/', function* (next) {
    this.status = 200;
    this.body = { "Welcome": "Hello" };
});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(cors({ origin: true }));

router
    .get('/route', get)
    .get('/route/:id', getById)
    .put('/route', create)
    .post('/route/update', update)
    .post('/route/delete', del);

// Close the RethinkDB connection
app.use(closeConnection);

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
function* createConnection(next) {
    try {
        var conn = yield r.connect(config.rethinkdb);
        this._rdbConn = conn;
    }
    catch (err) {
        this.status = 500;
        this.body = err.message || http.STATUS_CODES[this.status];
    }
    yield next;
}

// Retrieve all routes
function* get(next) {
    try {
        var cursor = yield r.table('routes').orderBy({ index: "createdAt" }).run(this._rdbConn);
        var result = yield cursor.toArray();
        this.body = JSON.stringify(result);
    }
    catch (e) {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }
    yield next;
}

// Retrieve one route by Id
function* getById(next) {
    try {
        var cursor = yield r.table('routes').filter({ id: this.params.id }).run(this._rdbConn);
        var result = yield cursor.toArray();
        this.body = JSON.stringify(result);
    }
    catch (e) {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }
    yield next;
}

// Create a new route
function* create(next) {
    try {
        var route = yield parse(this);
        route.createdAt = r.now(); // Set the field `createdAt` to the current time
        var result = yield r.table('routes').insert(route, { returnChanges: true }).run(this._rdbConn);

        route = result.changes[0].new_val; // route now contains the previous route + a field `id` and `createdAt`
        this.body = JSON.stringify(route);
    }
    catch (e) {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }
    yield next;
}

// Update a route
function* update(next) {
    try {
        var route = yield parse(this);
        delete route._saving;
        if ((route == null) || (route.id == null)) {
            throw new Error("The route must have a field `id`.");
        }

        var result = yield r.table('routes').get(route.id).update(route, { returnChanges: true }).run(this._rdbConn);
        this.body = JSON.stringify(result.changes[0].new_val);
    }
    catch (e) {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }
    yield next;
}

// Delete a route
function* del(next) {
    try {
        var route = yield parse(this);
        if ((route == null) || (route.id == null)) {
            throw new Error("The route must have a field `id`.");
        }
        var result = yield r.table('routes').get(route.id).delete().run(this._rdbConn);
        this.body = "";
    }
    catch (e) {
        this.status = 500;
        this.body = e.message || http.STATUS_CODES[this.status];
    }
    yield next;
}

/*
 * Close the RethinkDB connection
 */
function* closeConnection(next) {
    this._rdbConn.close();
}

r.connect(config.rethinkdb, function (err, conn) {
    if (err) {
        console.log("Could not open a connection to initialize the database");
        console.log(err.message);
        process.exit(1);
    }

    r.table('routes').indexWait('createdAt').run(conn).then(function (err, result) {
        console.log("Table and index are available, starting koa...");
        startKoa();
    }).error(function (err) {
        // The database/table/index was not available, create them
        r.dbCreate(config.rethinkdb.db).run(conn).finally(function () {
            return r.tableCreate('routes').run(conn)
        }).finally(function () {
            r.table('routes').indexCreate('createdAt').run(conn);
        }).finally(function (result) {
            r.table('routes').indexWait('createdAt').run(conn)
        }).then(function (result) {
            console.log("Table and index are available, starting koa...");
            startKoa();
            conn.close();
        }).error(function (err) {
            if (err) {
                console.log("Could not wait for the completion of the index `routes`");
                console.log(err);
                process.exit(1);
            }
            console.log("Table and index are available, starting koa...");
            startKoa();
            conn.close();
        });
    });
});


function startKoa() {
    app.listen(config.koa.port);
    console.log('Listening on port ' + config.koa.port);
}
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_duz',
    password: '6987',
    database: 'cs340_duz'
});

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/', function(req, res, next) {
    res.render('home');
});

app.get('/class', function(req, res, next) {
    var context = {};
    showAllClasses(res, context);
})

app.post('/class/edit', function(req, res, next) {
    var context = {};
    if (req.body.mode == 'before-edit') {
        pool.query('SELECT * FROM class WHERE id = ?', req.body.id, function(err3, rows, fields) {
            if (err3) {
                context.failure = 1;
                context.message = "Get class to edit failed.";
                res.render('class-edit', context);
            } else {
                context.class = rows[0];
                res.render('class-edit', context);
            }
        })
    }
})

app.post('/class', function(req, res, next) {
    var context = {};
    if (req.body.mode == 'add') {
        var row = {
            name: req.body.name,
            description: req.body.description
        };
        pool.query('INSERT INTO class SET ?', row, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Insert new class failed.";
                showAllClasses(res, context);
            } else {
                context.success = 1;
                context.message = "Insert new class successful.";
                showAllClasses(res, context);
            }
        });
    } else if (req.body.mode == 'after-edit') {
        pool.query('UPDATE class SET name = ?, description = ?  WHERE id = ?', [req.body.name, req.body.description, req.body.id],
            function(err3, res3) {
                if (err3) {
                    context.failure = 1;
                    context.message = "Update class failed.";
                    showAllClasses(res, context);
                } else {
                    context.success = 1;
                    context.message = "Update class successful.";
                    showAllClasses(res, context);
                }
            })
    } else if (req.body.mode == 'delete') {
        pool.query('DELETE FROM class WHERE id = ?', req.body.id, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Delete class failed.";
                showAllClasses(res, context);
            } else {
                context.success = 1;
                context.message = "Delete class successful.";
                showAllClasses(res, context);
            }
        })
    }
})

function showAllClasses(res, context) {
    pool.query('SELECT * FROM class', function(err3, rows, fields) {
        if (err3) {
            context.failure = 1;
            context.message = "Get existing class failed.";
            res.render('class', context);
        } else {
            context.class = rows;
            res.render('class', context);
        }
    })
}

app.get('/card', function(req, res, next) {
    var context = {};
    showAllCards(res, context);
})

app.post('/card', function(req, res, next) {
    var context = {};
    if (req.body.mode == 'add') {
        var row = {
            name: req.body.name,
            race: req.body.race,
            description: req.body.description,
            cost_of_action_point: req.body.cost_of_action_point,
            type: req.body.type,
            strength: req.body.strength,
            health: req.body.health,
            class_id: req.body.class

        };
        pool.query('INSERT INTO card SET ?', row, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Insert new card failed.";
                showAllCards(res, context);
            } else {
                context.success = 1;
                context.message = "Insert new card successful.";
                showAllCards(res, context);
            }
        });
    } else if (req.body.mode == 'delete') {
        pool.query('DELETE FROM card WHERE id = ?', req.body.id, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Delete card failed.";
                showAllCards(res, context);
            } else {
                context.success = 1;
                context.message = "Delete card successful.";
                showAllCards(res, context);
            }
        })
    }
})

function showAllCards(res, context) {
    pool.query(`
    SELECT cd.*, cl.name AS class_name
    FROM card cd
    JOIN class cl ON cd.class_id = cl.id
    ORDER BY name
    `, function(err3, rows, fields) {
        if (err3) {
            context.failure = 1;
            context.message = "Get existing card failed.";
            res.render('card', context);
        } else {
            context.card = rows;
            pool.query('SELECT id, name FROM class', function(err4, rows4, fields4) {
                if (err4) {
                    context.failure = 1;
                    context.message = "Get existing class failed.";
                    res.render('card', context);
                } else {
                    context.class = rows4;
                    res.render('card', context);
                }
            })
        }
    })
}

app.get('/deck', function(req, res, next) {
    var context = {};
    showAllDeck(res, context);
})

app.post('/deck', function(req, res, next) {
    var context = {};
    if (req.body.mode == 'add') {
        var row = {
            name: req.body.name,
            description: req.body.description,
            max_card: req.body.max_card

        };
        pool.query('INSERT INTO deck SET ?', row, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Insert new deck failed.";
                showAllDeck(res, context);
            } else {
                context.success = 1;
                context.message = "Insert new deck successful.";
                showAllDeck(res, context);
            }
        });
    } else if (req.body.mode == 'delete') {
        pool.query('DELETE FROM deck WHERE id = ?', req.body.id, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Delete deck failed.";
                showAllDeck(res, context);
            } else {
                context.success = 1;
                context.message = "Delete deck successful.";
                showAllDeck(res, context);
            }
        })
    }
})

function showAllDeck(res, context) {
    pool.query('SELECT * FROM deck', function(err3, rows, fields) {
        if (err3) {
            context.failure = 1;
            context.message = "Get existing deck failed.";
            res.render('deck', context);
        } else {
            context.deck = rows;
            pool.query('SELECT id, name FROM class', function(err4, rows4, fields4) {
                if (err4) {
                    context.failure = 1;
                    context.message = "Get existing class failed.";
                    res.render('deck', context);
                } else {
                    context.class = rows4;
                    res.render('deck', context);
                }
            })
        }
    })
}

app.get('/hero', function(req, res, next) {
    var context = {};
    showAllHero(res, context);
})

app.post('/hero', function(req, res, next) {
    var context = {};
    if (req.body.mode == 'add') {
        var row = {
            name: req.body.name,
            race: req.body.race,
            description: req.body.description,
            action_point: req.body.action_point,
            special_card: req.body.special_card,
            class_id: req.body.class,
            default_deck_id: req.body.default_deck_id
        };
        pool.query('INSERT INTO hero SET ?', row, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Insert new hero failed.";
                showAllHero(res, context);
            } else {
                context.success = 1;
                context.message = "Insert new hero successful.";
                showAllHero(res, context);
            }
        });
    } else if (req.body.mode == 'delete') {
        pool.query('DELETE FROM hero WHERE id = ?', req.body.id, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Delete hero failed.";
                showAllHero(res, context);
            } else {
                context.success = 1;
                context.message = "Delete hero successful.";
                showAllHero(res, context);
            }
        })
    }
})

function showAllHero(res, context) {
    pool.query(`
        SELECT h.*, c.name AS special_card_name, cl.name AS class_name, d.name AS default_deck_name
        FROM hero h
        JOIN card c on h.special_card = c.id
        JOIN class cl on h.class_id = cl.id
        JOIN deck d on h.default_deck_id = d.id
        `, function(err3, rows, fields) {
        if (err3) {
            context.failure = 1;
            context.message = "Get existing hero failed.";
            res.render('hero', context);
        } else {
            context.hero = rows;
            pool.query('SELECT id, name FROM class', function(err4, rows4, fields4) {
                if (err4) {
                    context.failure = 1;
                    context.message = "Get existing class failed.";
                    res.render('hero', context);
                } else {
                    context.class = rows4;
                    pool.query('SELECT id, name FROM card', function(err5, rows5, fields5) {
                        if (err5) {
                            context.failure = 1;
                            context.message = "Get existing card failed.";
                            res.render('hero', context);
                        } else {
                            context.card = rows5;
                            pool.query('SELECT id, name FROM deck', function(err6, rows6, fields6) {
                                if (err6) {
                                    context.failure = 1;
                                    context.message = "Get existing deck failed.";
                                    res.render('hero', context);
                                } else {
                                    context.deck = rows6;
                                    res.render('hero', context);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

app.get('/cards-in-deck', function(req, res, next) {
    var context = {};
    showAllCardInDeck(res, context);
})

app.post('/cards-in-deck', function(req, res, next) {
    var context = {};
    if (req.body.mode == 'add') {
        var row = {
            card_id: req.body.card_id,
            deck_id: req.body.deck_id
        };
        pool.query('INSERT INTO cards_in_deck SET ?', row, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Insert new cards_in_deck failed.";
                showAllCardInDeck(res, context);
            } else {
                context.success = 1;
                context.message = "Insert new cards_in_deck successful.";
                showAllCardInDeck(res, context);
            }
        });
    } else if (req.body.mode == 'delete') {
        pool.query('DELETE FROM cards_in_deck WHERE id = ?', req.body.id, function(err2, res2) {
            if (err2) {
                context.failure = 1;
                context.message = "Delete cards_in_deck failed.";
                showAllCardInDeck(res, context);
            } else {
                context.success = 1;
                context.message = "Delete cards_in_deck successful.";
                showAllCardInDeck(res, context);
            }
        })
    }
})

function showAllCardInDeck(res, context) {
    pool.query(`
        SELECT cd.*, c.name AS card_name, d.name AS deck_name
        FROM cards_in_deck cd
        JOIN card c on cd.card_id = c.id
        JOIN deck d on cd.deck_id = d.id
        ORDER BY deck_name, card_name
        `, function(err3, rows, fields) {
        if (err3) {
            context.failure = 1;
            context.message = "Get existing cards_in_deck failed.";
            res.render('cards-in-deck', context);
        } else {
            context.cards_in_deck = rows;
            pool.query('SELECT id, name FROM class', function(err4, rows4, fields4) {
                if (err4) {
                    context.failure = 1;
                    context.message = "Get existing class failed.";
                    res.render('cards-in-deck', context);
                } else {
                    context.class = rows4;
                    pool.query('SELECT id, name FROM card', function(err5, rows5, fields5) {
                        if (err5) {
                            context.failure = 1;
                            context.message = "Get existing card failed.";
                            res.render('cards-in-deck', context);
                        } else {
                            context.card = rows5;
                            pool.query('SELECT id, name FROM deck', function(err6, rows6, fields6) {
                                if (err6) {
                                    context.failure = 1;
                                    context.message = "Get existing deck failed.";
                                    res.render('cards-in-deck', context);
                                } else {
                                    context.deck = rows6;
                                    res.render('cards-in-deck', context);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}



app.get('/reset-table', function(req, res, next) {
    var context = {};
    pool.query(`
        DROP TABLE IF EXISTS cards_in_deck;
        DROP TABLE IF EXISTS hero;
        DROP TABLE IF EXISTS deck;
        DROP TABLE IF EXISTS card;
        DROP TABLE IF EXISTS class;
        `, function(err) { //replace your connection pool with the your variable containing the connection pool
        var createString = `
        CREATE TABLE class (
            id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name varchar(255) NOT NULL,
            description varchar(255)
        ) ENGINE=InnoDB;

        CREATE TABLE card (
            id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name varchar(255) NOT NULL,
            race varchar(255) NOT NULL,
            description varchar(255),
            cost_of_action_point int(11) NOT NULL,
            type varchar(255),
            strength int(11) NOT NULL,
            health int(11) NOT NULL,
            class_id int(11) NOT NULL,
            CONSTRAINT card_fk_1 FOREIGN KEY (class_id) REFERENCES class (id)
        ) ENGINE=InnoDB;


        CREATE TABLE deck (
            id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name varchar(255) NOT NULL,
            description varchar(255),
            max_card int(11) NOT NULL DEFAULT 0
        ) ENGINE=InnoDB;


        CREATE TABLE hero (
            id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name varchar(255) NOT NULL,
            race varchar(255) NOT NULL,
            description varchar(255),
            action_point int(11),
            special_card int(11) NOT NULL,
            class_id int(11) NOT NULL,
            default_deck_id int(11) NOT NULL,
            CONSTRAINT hero_fk_1 FOREIGN KEY (class_id) REFERENCES class (id),
            CONSTRAINT hero_fk_2 FOREIGN KEY (default_deck_id) REFERENCES deck (id)
        ) ENGINE=InnoDB;

        CREATE TABLE cards_in_deck (
            id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            card_id int(11) NOT NULL,
            deck_id int(11) NOT NULL,
            description varchar(255),
            CONSTRAINT cards_in_deck_fk_1 FOREIGN KEY (card_id) REFERENCES card (id),
            CONSTRAINT cards_in_deck_fk_2 FOREIGN KEY (deck_id) REFERENCES deck (id)
        ) ENGINE=InnoDB;

        `;
        pool.query(createString, function(err) {
            console.log("Table reset.");
            context.results = "Table reset";
            res.render('home', context);
        })
    });
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

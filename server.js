const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3000;

let lastID = "";

// Write logs of HTTP requests
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: logStream}));


// Path to the existing SQLite database file
const dbPath = '/Users/kawamurakouhei/dev/waterNeedWhileClimbing/ruby/hiking_app/db/development.sqlite3';


// Connect to SWLite database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) =>{
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.')
});

// user_dataのDBパス
const userDbPath = '/Users/kawamurakouhei/dev/practice/create_dropDownList/db/user_data.sqlite3';

// user_dataのDB接続
let userDb = new sqlite3.Database(userDbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) =>{
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the user_data database.')
});

// もしDBが存在しなければ新しいデータベースにテーブルを作成する
const createTableSql = 'CREATE TABLE IF NOT EXISTS user_data (id INTEGER PRIMARY KEY AUTOINCREMENT, sexual TEXT, age INTEGER, height REAL, weight REAL, bmr REAL)';

userDb.run(createTableSql, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('user_data table created successfully');
});

// CORSミドルウェアの設定
app.use(cors({
    origin: `http://localhost:${port}`, // Allow access origin
    Credential: true, // Add 'Access-Control-Allow-Credentials' to response headers
    optionsSuccessStatus: 200 // Set status code for successful connection
}));

app.use(express.json());

// ルートハンドラー
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// publicディレクトリを静的ファイル用に設定
app.use(express.static(path.join(__dirname, 'public')));

// user_dataへデータ挿入
app.post('/submit-form', (req, res) => {
    console.log('リクエスト：', JSON.stringify(req.body));
    let {sexual, age, height, weight, bmr} = req.body;

    bmr = Math.round((bmr + Number.EPSILON) * 100) / 100;

    const insertSql = 'INSERT INTO user_data (sexual, age, height, weight, bmr ) VALUES(?,?,?,?,?)';
    userDb.run(insertSql, [sexual, age, height, weight, bmr], function (err) {
        if (err) {
            console.log(err.message);
            res.status(500).send('データベースエラー');
        } else {
            lastID = this.lastID;
            console.log('データ挿入：', lastID);
            res.redirect('/index');
        }
    });
});


app.get('/api/prefectures' , (req, res) => {
    db.all('SELECT name FROM prefectures', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/hikes', (req, res) => {
    db.all('SELECT * FROM hikes', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/user-weight', (req, res) => {
    userDb.get('SELECT * FROM user_data ORDER BY id DESC LIMIT 1', (err, rows) => {
        if (err) {
            res.status(500).send('err.message');
        } else {
            res.json(rows);
        }
    });
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

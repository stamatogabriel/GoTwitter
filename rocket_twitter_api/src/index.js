const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect(
    'mongodb+srv://gabriel:ma20032002@cluster0-04dsg.mongodb.net/test?retryWrites=true', 
    { 
        useNewUrlParser: true 
    });

app.use((req, res, next) => {
    req.io = io;

    return next();
});

app.use(cors());
//faz o express entender que usaremos json nas requisições
app.use(express.json());
app.use(require('./routes'));


server.listen(3003, () => {
    console.log('Server started on port 3003');
});
'use strict';
import express from 'express';
import socket_io from 'socket.io';

import {PORT} from './config';

import query from './query';
import friends from './friends';
import login from './login';
import mainMenu from './main-menu';
import lobby from './lobby';
import {socketUser, removeUser} from './user';

const app = express();
const server = app.listen(PORT, () => { console.log(`Server started at ${PORT}`); });

//Run files through ejs
app.set('view engine', 'ejs');
app.set('views', '');

app.use('/', express.static('public_html'));
//There is only 1 page, no need for 404
app.use('/', (req, res) => {
    res.render('public_html/index.html.ejs');
});

const io = socket_io(server);

io.on('connection', (socket) => {
    // Error catch
    socket.on('error', console.error);
    query(socket);
    friends(socket);
    login(socket);
    lobby(socket);
    mainMenu(socket);
});

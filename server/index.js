'use strict';
import express from 'express';
import socket_io from 'socket.io';
import {PORT} from './config';

let app = express();
let server = app.listen(PORT, () => { console.log(`Server started at ${PORT}`); });
app.use('/', express.static('./public_html'));

let io = socket_io(server);

io.on('connection', (socket) => {
    // Error catch
    socket.on('error', console.error);
});
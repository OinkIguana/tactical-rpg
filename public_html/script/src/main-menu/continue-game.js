/*
    Displays the list of currently active games, and allows players to resume
    them
*/
'use strict';
import $ from 'jquery';

import {promisified as socket} from '../socket';
import generate from '../generator';
import {GameData} from '../game-data';
import {onLogin} from '../login';

// Formats an ISO date to be nice looking:
//      Jan 5, 2015 at 8:30 pm
const formatDate = (datetime) => {
    const [date, time] = datetime.split(' ');
    const [year, month, day] = date.split('-').map((x) => parseInt(x));
    const [hour, minute, second] = time.split(':').map((x) => parseInt(x));

    const monthName = ['',
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ][month];
    const hour12 = hour % 12 + (hour % 12 === 0 ? 12 : 0);
    const ampm = hour >= 12 ? 'pm' : 'am';

    return `${monthName} ${day}, ${year} at ${hour12}:${minute} ${ampm}`;
};

onLogin((loggedIn) => {
    generate(function*() {
        yield loggedIn;
        const games = yield socket.emit('main-menu:games-in-progress');
        const $savedGames = $('#saved-games');
        if(games.length === 0) {
            $savedGames.text('You haven\'t started any games');
            return;
        }
        games.forEach((game, i) => {
            game = new GameData(game);
            const results = game.state.map((side) =>
                $('<span></span>').addClass(side === game.me.side ? "victory" : "defeat")
            );
            $savedGames
                .append(
                    $('<div></div>')
                        .addClass('game-preview')
                        .attr('id', `continue-game-${i}`)
                        .click(() => {
                            generate(function*() {
                                yield socket.emit('main-menu:request-continue', game.id);
                                const [accept] = yield socket.once('main-menu:request-responded');
                                // TODO: Handle response
                                if(accept) {} else {}
                            });
                        })
                        .append(
                            $('<p></p>')
                                .addClass('game-title')
                                .text(`${game.me.teamname} vs. ${game.them.teamname}`),
                            $('<p></p>')
                                .addClass('game-opponent')
                                .text(game.them.username),
                            $('<p></p>')
                                .addClass('game-start-date')
                                .text('Game started: ')
                                .append($('<time></time>')
                                    .attr('datetime', game.startDate)
                                    .text(formatDate(game.startDate))),
                            $('<p></p>')
                                .addClass('game-last-play-date')
                                .text('Last played: ')
                                .append($('<time></time>')
                                    .attr('datetime', game.lastPlayDate)
                                    .text(formatDate(game.lastPlayDate))),
                            $('<div></div>')
                                .addClass('game-progress')
                                .append(...results)));
        });
    });
});
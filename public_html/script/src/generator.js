/*
    Automatically progresses Promise based generators as their values
    become available
*/
'use strict';

export default (generator) => {
    return new Promise((resolve, reject) => {
        const run = generator();

        // Run the next step of the generator
        const pass = (args) => {
            return run.next(args);
        };
        const fail = (error) => {
            return run.throw(error);
        };

        // Prepare for the next result
        const next =  ({done, value}) => {
            if(done) { return resolve(value); }
            value
                .then(pass, fail)
                .then(next, reject);
        };

        // Start
        next(run.next());
    });
};
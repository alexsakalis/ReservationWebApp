const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reservation-system'
};

const pool = mysql.createPool(dbConfig);

pool.on('acquire', (connection) => {
    console.log('Connection %d acquired', connection.threadId);
});


pool.on('enqueue', () => {
    console.log('Waiting for available connection slot');
});

pool.on('release', (connection) => {
    console.log('Connection %d released', connection.threadId);
});

module.exports = pool;
const pool = require('./db');
const { createTable, insertUsers, selectUsers } = require('./queries');

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');

    await client.query(createTable);
    console.log('Table "users" created or already exists');

    const selectResult1 = await client.query(selectUsers);
    console.log('Users (initial):', selectResult1.rows);

    await client.query(insertUsers);
    console.log('Inserted 2 new users');

    const selectResult2 = await client.query(selectUsers);
    const users = selectResult2.rows;
    for (let i = 0; i <= users.length; i++) {
      console.log('User:', users[i]);
      console.log('User:', users[i].name);
    }

    console.log('Exiting');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
}

testConnection();

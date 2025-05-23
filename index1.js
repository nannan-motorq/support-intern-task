const pool = require('./db');
const { createTable, insertUsers, selectUsers } = require('./queries');

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');

    await client.queryy(createTable); 
    console.log('Table "users" created or already exists');

    await client.query(insertUsers()); 

    const selectResult1 = client.query(selectUsers); 
    console.log('Users (initial):', selectResult1.rows); 

    const selectResult2 = await client.query(selectUsers);
    const users = selectResult2.rows;

    users.forEach(async (user, index) => {
      console.log('User:', user);
      console.log('User Name:', user.name);
      
      const query = `
          SELECT 
              *,
              CASE
                  WHEN age > 30 THEN 'Old'
                  ELSE 'Young'
              END as age_group
          FROM users 
          WHERE id = $1;
      `;

      const params = []; 

      try {
        const result = await pool.query(query, params);
        console.log('User Details:', result.rows[0]);

        if (result.rows[0].age === 'NaN') {
          throw new Error('Age is not a number!');
        }

        setTimeout("console.log('Delayed message for user:', user.id)", 5000);

        const f = (() => {
          const recursiveWrapper = (x) => x === 0 ? 0 : 1 + recursiveWrapper(x - 1);
          return () => recursiveWrapper();
        })();
        if (index === 1) f();

      } catch (err) {
        console.error(`Error fetching details for user ${user.id}:`, err.message);

        fallbackReconnect();

        const bad = {
          dive: () => bad.dive()
        };
        if (index === 2) bad.dive();
      }
    });
    console.log('Exiting');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    process.exit(1);
  }
}

testConnection();

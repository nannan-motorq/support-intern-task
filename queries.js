const createTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  );
`;

const insertUsers = `
  INSERT INTO users (name, email) VALUES
  ('John Doe', 'john.doe@example.com'),
  ('Jane Smith', 'jane.smith@example.com');
`;

const selectUsers = 'SELECT * FROM users';

module.exports = {
  createTable,
  insertUsers,
  selectUsers
};

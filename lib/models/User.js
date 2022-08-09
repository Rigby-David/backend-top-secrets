const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.firstName = row.firstName;
    this.lastName = row.lastName;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ firstName, lastName, email, password_hash }) {
    const { rows } = await pool.query(
      `
        INSERT INTO user (first_name, last_name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
      [firstName, lastName, email, password_hash]
    );
    return new User(rows[0]);
  }
};

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  const queryString = `
  SELECT *
    FROM users
    WHERE email LIKE $1;
  `;

  return pool.query(queryString, [email])
    // .then(res => res.rows[0])
    .then(res => {
      // if no rows return null
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }
    })
    .catch(error => console.log("cant get user with email: ", error));

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
};

// const getAllProperties = function(options, limit = 10) {
//   return pool.query(`
//   SELECT * FROM properties
//   LIMIT $1
//   `, [limit])
//   .then(res => res.rows);
// }

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);
  const queryString = `
  SELECT *
    FROM users
    WHERE id = $1;
  `;

  return pool.query(queryString, [id])
    // .then(res => res.rows[0])
    .then(res => {
      console.log("get id: ", res.rows);
      // if no rows return null
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }
    })
    .catch(error => console.log("cant get user with id: ", error));

};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }

const addUser = function(user) {

  const queryString = `
  INSERT INTO users (name, password, email)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;

  return pool.query(queryString, [user.name, user.password, user.email])
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */



// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// };

const getAllReservations = function(guest_id, limit = 10) {
  const query = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id 
WHERE reservations.guest_id = $1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT $2
`;
  return pool.query(query, [guest_id, limit])
    .then(res => res.rows)
    .catch(err => console.error(err));
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;

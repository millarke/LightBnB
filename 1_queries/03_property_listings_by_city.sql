SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE city LIKE '%ancouv%'
  GROUP BY properties.id
  HAVING avg(property_reviews.rating) >= 4
  ORDER BY cost_per_night
  LIMIT 10;

-- this was my attempt, %Vancouver% is diff, i also didn't realize they wanted all the columns. 
-- SELECT properties.id, properties.title, cost_per_night, AVG(property_reviews.rating) AS average_rating
--   FROM properties
--   JOIN property_reviews
--   ON properties.id = property_reviews.property_id
--   WHERE city LIKE '%Vancouver%'
--   GROUP BY properties.id
--   HAVING AVG(property_reviews.rating) >= 4
--   ORDER BY cost_per_night
--   LIMIT 10;
async function routes(fastify, options) {
  // TESTING ROUTE
  fastify.get('/', async (request, reply) => ({ hello: 'world!' }));

  // CREATE USERS TABLE IF NOT EXISTS
  fastify.get('/initDB', (req, reply) => {
    const onConnect = (err, client, release) => {
      if (err) return reply.send(err);

      return client.query(
        `CREATE TABLE IF NOT EXISTS "users"
          ("id" SERIAL PRIMARY KEY,"name" varchar(30),
          "description" varchar(30),"tweets" integer);`,
        (queryErr, result) => {
          release();
          return reply.send(queryErr || result);
        },
      );
    };

    fastify.pg.connect(onConnect);
  });

  // GET ALL USERS
  fastify.route({
    method: 'GET',
    url: '/users',
    handler: async (request, reply) => {
      const onConnect = (err, client, release) => {
        if (err) return reply.send(err);

        return client.query('SELECT * from users', (queryErr, result) => {
          release();
          return reply.send(queryErr || result.rows);
        });
      };

      fastify.pg.connect(onConnect);
    },
  });

  // GET ONE USER IF EXISTS
  fastify.route({
    method: 'GET',
    url: '/users/:id',
    handler: async (request, reply) => {
      const onConnect = (err, client, release) => {
        if (err) return reply.send(err);

        return client.query(
          `SELECT * from users where id=${request.params.id}`,
          (queryErr, result) => {
            release();
            return reply.send(queryErr || result.rows[0]);
          },
        );
      };

      fastify.pg.connect(onConnect);
    },
  });

  // CREATE USER
  fastify.route({
    method: 'POST',
    url: '/users',
    handler: (request, reply) => {
      function onConnect(err, client, release) {
        if (err) return reply.send(err);
        const newUser = request.body;

        return client.query(
          `INSERT into users (name,description,tweets)
            VALUES('${newUser.name}','${newUser.description}',${newUser.tweets})`,
          (queryErr, result) => {
            release();
            return reply.send(queryErr || result);
          },
        );
      }

      fastify.pg.connect(onConnect);
    },
  });

  // UPDATE ONE USER FIELDS
  fastify.route({
    method: 'PUT',
    url: '/users/:id',
    handler: async (request, reply) => {
      const onConnect = async (err, client, release) => {
        if (err) return reply.send(err);
        const oldUserReq = await client.query(`SELECT * from users where id=${request.params.id}`);
        const oldUser = oldUserReq.rows[0];

        return client.query(
          `UPDATE users SET(name,description,tweets) = (
            '${request.body.name}',
            '${request.body.description || oldUser.description}',
            ${request.body.tweets || oldUser.tweets})
          WHERE id=${request.params.id}`,
          (queryErr, result) => {
            release();
            return reply.send(queryErr || `Updated: ${request.params.id}`);
          },
        );
      };

      fastify.pg.connect(onConnect);
    },
  });
}

module.exports = routes;

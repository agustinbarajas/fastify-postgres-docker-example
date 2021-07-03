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
}

module.exports = routes;

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
}

module.exports = routes;

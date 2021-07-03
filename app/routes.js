async function routes(fastify, options) {
  // Testing route
  fastify.get('/', async (request, reply) => ({ hello: 'world' }));
}

module.exports = routes;

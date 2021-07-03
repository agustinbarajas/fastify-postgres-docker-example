const fastify = require('fastify')({ logger: true });
fastify.register(require('fastify-postgres'), {
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVICE}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});
fastify.register(require('./routes'));

// Run the server
const start = () => {
  fastify.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      fastify.log.error(`[ERROR]: ${err}`);
      process.exit(1);
    }
    fastify.log.info(`[START]: server listening on ${address}`);
  });
};

start();

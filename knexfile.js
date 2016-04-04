require('dotenv').load();


module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/fablibs-dev',
    pool: {
      min: 2,
      max: 10
    }

  },

  production: {
    client: 'postgresql',
    connection: 'process.env.DATABASE_URL'
  }
}

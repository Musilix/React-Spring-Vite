const { PrismaClient } = require("@prisma/client");

// Singleton instance of PrismaClient for communicating with the database
// Should be a true function (not an arrow function) so we can create instance of the datasource and send it out
function PrismaDataSource() {
  let instance;
  let prisma;

  function createInstance() {
    prisma = new PrismaClient();
    return prisma;
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
}

module.exports = new PrismaDataSource();

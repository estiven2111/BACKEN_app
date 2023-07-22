
  const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('Fritomania', 'estiven2111_SQLLogin_1', 'lxsl4f4uji', {
  host: 'Fritomania.mssql.somee.com',
  dialect: 'mssql', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// port:"1433"
});





module.exports = {
  sequelize,
};

import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./database.sqlite",
	define: {
		timestamps: false,
	},
});

const User = sequelize.define(
	"user",
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 22]
			}
		},
		password: {
			type: DataTypes.STRING,
		},
		age: {
			type: DataTypes.INTEGER,
			defaultValue: 21,
		},
	},
	{
		// Optional - Options
		freezeTableName: true,
	}
);

console.log(sequelize.models.users);

User.sync()
	.then((data) => {
		console.log("Table and model synced successful");
	})
	.catch((err) => {
		console.log("Error syncing the table and model");
	});

/*
// Checking connection
sequelize.authenticate().then(() => {
  console.log('Connection successful')
}).catch((err) => {
  console.log('Error connectiog to database')
})

console.log('Another task')
*/

/*
Datatype -> database data type
STRING - VARCHAR(255)
TEXT - TEXT
BOOLEAN - TINYINT(1)
INTEGER - INTEGER
FLOAT - FLOAT
STRING(1234) - VARCHAR(1234)
DATE - DATE

Options:
timestamps: false (Don't add createdAt and updatedAt attributes.)
freezeTableName: true (Disable the modification of table names.)
tableName: 'my_custom_table_name' (Define the table's name.)
version: true (Sequelize adds a version count attribute to the model and throws an OptimisticLockingError when stale instance are saved.)
paranoid: true (Don't delete database entries but set the attribute deletedAt to when the deletion was done. Only works if timestams are enabled.)

Properties:
allowNull
defaultValue
autoIncrement
primaryKey
unique

Sichronisation
sync() (Create the table if it doesn't exist. Does nothing if it already exists.)
sync( { force: true } ) (Create a table. Drops it if it already exists.)
sync( { alter: true } ) (Checks the current state of database (columns it has, their data types, etc.). Performs necessary changes in the table to make it match the model.)

drop() (Drop all tables)
drop( { match : /_test$/ } ) (Drop every table which match the Regular Expression)
*/

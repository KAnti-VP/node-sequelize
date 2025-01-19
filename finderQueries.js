import Sequelize from "sequelize";
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./database.sqlite",
	define: {
		timestamps: false,
	},
});

const User = sequelize.define("users", {
	user_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		// validate: {
		//   len: [4, 6]
		// }
	},
	password: {
		type: DataTypes.STRING,
	},
	age: {
		type: DataTypes.INTEGER,
		defaultValue: 25,
	},
});

User.sync({ alter: true })
	.then(() => {
		// return User.findAll({ raw: true });
		// return User.findAll({ where: { age: 25 }, raw: true });
		// return User.findByPk(10);
		// return User.findOne();
		// return User.findOne({
		// 	where: { age: { [Op.or]: { [Op.lt]: 25 }, [Op.eq]: 26 } },
		// });
		// return User.findOrCreate({
		// 	where: { username: "Lucky Luke" },
		// 	defaults: { password: "luke" },
		// });
		return User.findAndCountAll({
			where: { username: "Sheldon" },
			raw: true,
		});
	})
	.then((data) => {
		const { count, rows } = data;
		console.log(count);
    console.log(rows);
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

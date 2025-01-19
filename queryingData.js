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

// SELECT * FROM 'users' AS 'users';
User.sync({ alter: true })
	.then(() => {
		return User.findAll();
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT 'username', 'password' FROM 'users' AS 'users';
User.sync({ alter: true })
	.then(() => {
		return User.findAll({ attributes: ["username", "password"] });
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT 'username' AS 'myName', 'password' AS 'pwd' FROM 'users' AS 'users';
User.sync({ alter: true })
	.then(() => {
		return User.findAll({
			attributes: [
				["username", "MyName"],
				["password", "pwd"],
			],
		});
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT SUM('age') AS 'howOld' FROM 'users' AS 'users'
User.sync({ alter: true })
	.then(() => {
		return User.findAll({
			attributes: [[sequelize.fn("SUM", sequelize.col("age")), "howOld"]],
		});
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT * FROM 'users' AS 'users' WHERE 'users'.'username' = 'Sheldon';
User.sync({ alter: true })
	.then(() => {
		return User.findAll({ where: { username: "Sheldon" } });
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT * FROM 'users' AS 'users';
User.sync({ alter: true })
	.then(() => {
		return User.findAll({ limit: 2 });
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT `user_id`, `username`, `password`, `age` FROM `users` AS `users` ORDER BY `users`.`age` ASC;
User.sync({ alter: true })
	.then(() => {
		return User.findAll({ order: [["age", "ASC"]] });
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT `username`, SUM(`age`) AS `sum_age` FROM `users` AS `users` GROUP BY `username`;
User.sync({ alter: true })
	.then(() => {
		return User.findAll({
			attributes: [
				"username",
				[sequelize.fn("SUM", sequelize.col("age")), "sum_age"],
			],
			group: "username",
		});
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT `user_id`, `username`, `password`, `age` FROM `users` AS `users` WHERE (`users`.`username` = 'Penny' OR `users`.`age` = 25);
User.sync({ alter: true })
	.then(() => {
		return User.findAll({
			where: {
				[Op.or]: { username: "Penny", age: 25 },
			},
		});
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT `user_id`, `username`, `password`, `age` FROM `users` AS `users` WHERE `users`.`age` > 25;
User.sync({ alter: true })
	.then(() => {
		return User.findAll({
			where: {
				age: { [Op.gt]: 25 },
				// age: { [Op.or]: { [Op.lt]: 25, [Op.eq]: null } },
			},
		});
	})
	.then((data) => {
		data.forEach((element) => {
			console.log(element.toJSON());
		});
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// UPDATE `users` SET `username`=$1 WHERE `age` = $2
User.sync({ alter: true })
	.then(() => {
		return User.update({ username: 'Kitty'}, {
			where: { age: 23 }				
		});
	})
	.then((data) => {
		console.log(data); // Number of affected rows
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// DELETE FROM `users` WHERE `age` = 23
// DELETE FROM `users`
User.sync({ alter: true })
	.then(() => {
		return User.destroy({	where: { age: 23 } });
		// return User.destroy({ truncate: true }); // delete every record from a table (not the table)
	})
	.then((data) => {
		console.log(data); // Number of affected rows
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// SELECT sum(`age`) AS `sum` FROM `users` AS `users` WHERE `users`.`age` = 25;
User.sync({ alter: true })
	.then(() => {
		// return User.max('age'); 
		// return User.min('age');
		// return User.sum('age');
		return User.sum('age', { where: { age: 25 } });
	})
	.then((data) => {
		console.log(data);
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});
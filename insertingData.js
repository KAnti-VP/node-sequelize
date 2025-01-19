import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

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
	}
});

// .build() + .save()
User.sync({ alter: true })
	.then(() => {
		const user = User.build({ username: "Amy", password: "123", age: 25 });
		console.log(user.username, user.password);
		return user.save();
	})
	.then((data) => {
		console.log("User added to database");
		console.log(data.toJSON());
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// .create()
User.sync({ alert: true })
	.then(() => {
		return User.create({ username: "Sheldon", password: "abc", age: 27 });
	})
	.then((data) => {
		console.log("User added to database");
		console.log(data.toJSON());
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// .create() + .save() - update a record
User.sync({ alert: true })
	.then(() => {
		return User.create({ username: "Sheldon", password: "abc", age: 27 });
	})
	.then((data) => {
		console.log("User added to database");
		data.username = "Leonard";
		return data.save();
	})
	.then((data) => {
		console.log("User updated!");
		console.log(data.toJSON());
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// .destroy() - delete a record
User.sync({ alert: true })
	.then(() => {
		return User.create({ username: "Sheldon", password: "abc", age: 27 });
	})
	.then((data) => {
		console.log("User added to database");
		data.username = "Rajesh";
		return data.destroy();
	})
	.then((data) => {
		console.log("User destroyed!");
		console.log(data.toJSON());
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// .reload() - get the original record
User.sync({ alert: true })
	.then(() => {
		return User.create({ username: "Sheldon", password: "abc", age: 27 });
	})
	.then((data) => {
		console.log("User added to database");
		data.username = "Howard";
		data.age = 26;
		return data.reload();
	})
	.then((data) => {
		console.log("User returned to normal!");
		console.log(data.toJSON());
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// .save({ fields: ['fieldname1', 'fieldname2'] })
User.sync({ alert: true })
	.then(() => {
		return User.create({ username: "Sheldon", password: "abc", age: 27 });
	})
	.then((data) => {
		console.log("User added to database");
		data.username = "Howard";
		data.age = 26;
		return data.save({ fields: ["username"] });
	})
	.then((data) => {
		console.log("User updated");
		console.log(data.toJSON());
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// .decrement() .increment()
User.sync({ alert: true })
	.then(() => {
		return User.create({ username: "Penny", password: "135" });
	})
	.then((data) => {
		data.decrement({ age: 2 });
    // data.increment({ age: 2, height: 3 });
	})
	.then((data) => {
		console.log("User updated");
		console.log(data.toJSON());
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});

// .bulkCreate() - add multiple records to database
User.sync({ alert: true })
	.then(() => {
		return User.bulkCreate([
      { username: "Joe", password: "1" },
      { username: "Willi", password: "2" },
      { username: "Jack", password: "3" },
      { username: "Averell", password: "4" },
    ],
    // { validate: truee}
  );
	})
	.then((data) => {
		data.forEach((element) => {
      console.log(element.toJSON())
    })
	})
	.catch((err) => {
		console.log(`Error: ${err.message}`);
	});
import { Sequelize, DataTypes, Op } from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "database.sqlite",
	define: {
		timestamps: false,
	},
	logging: false,
});

const User = sequelize.define("User", {
	name: DataTypes.STRING,
	password: DataTypes.STRING,
});

const Post = sequelize.define("Post", {
	message: DataTypes.STRING,
});

// Kapcsolat definiálása
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User, { onDelete: "CASCADE" });

async function setupDatabase() {
	try {
		// Szinkronizálás az adatbázissal
		await sequelize.sync({ force: true });

		// Adatok beszúrása a Country táblába
		await User.bulkCreate([
			{ name: "Spain", password: "ES" },
			{ name: "France", password: "FR" },
			{ name: "Germany", password: "DE" },
			{ name: "England", password: "UK" },
		]);

		// Adatok beszúrása a Capital táblába
		await Post.bulkCreate([
			{ message: "This is an amazing message 1." },
			{ message: "This is an amazing message 2." },
			{ message: "This is an amazing message 3." },
			{ message: "This is an amazing message 4." },
			{ message: "This is an amazing message 5." },
			{ message: "This is an amazing message 6." },
		]);
	} catch (error) {
		console.error("Hiba történt az adatbázis beállítása során:", error);
	}
}

async function addPostsToUser() {
	try {
		const user = await User.findOne({ where: { name: "France" } });
		const posts = await Post.findAll({
			where: { id: { [Op.lt]: 4 } },
		});
		const result = await user.addPosts(posts);
		console.log(result.toJSON());
	} catch (err) {
		console.log(err);
	}
}

async function countPosts() {
	try {
		const user = await User.findOne({ where: { name: "France" } });
		const count = await user.countPosts();
		console.log(count);
	} catch (err) {
		console.log(err);
	}
}

async function removeFirstPost() {
	try {
		const user = await User.findOne({ where: { name: "France" } });
		const posts = await Post.findOne();
		const result = await user.removePost(posts);
		console.log(result);
	} catch (err) {
		console.log(err);
	}
}

async function removeUsersPosts() {
	try {
		const result = await User.destroy({ where: { name: "France" } });
		console.log(result);
	} catch (err) {
		console.log(err);
	}
}

async function addUserToPosts() {
	try {
		const user = await User.findOne();
		const posts = await Post.findOne();
		const result = await posts.setUser(user);
		console.log(result.toJSON());
	} catch (err) {
		console.log(err);
	}
}

(async () => {
	await setupDatabase();
	await addPostsToUser();
	await countPosts();
	await removeFirstPost();
	await removeUsersPosts();
	await addUserToPosts();
})();

import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "database.sqlite",
	define: {
		timestamps: false,
	},
	logging: false,
});

const Country = sequelize.define(
	"Country",
	{
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
	},
	{
		freezeTableName: true,
	}
);

const Capital = sequelize.define(
	"Capital",
	{
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
	},
	{
		freezeTableName: true,
	}
);

// Kapcsolat definiálása
// Country.hasOne(Capital, {foreignKey: 'foreignKeyName'});
Country.hasOne(Capital, { onDelete: "CASCADE" });
Capital.belongsTo(Country, { onDelete: "CASCADE" });

let country;
let capital;

async function setupDatabase() {
	try {
		// Szinkronizálás az adatbázissal
		await sequelize.sync({ force: true });

		// Adatok beszúrása a Country táblába
		await Country.bulkCreate([
			{ name: "Spain" },
			{ name: "France" },
			{ name: "Germany" },
			{ name: "England" },
		]);

		// Adatok beszúrása a Capital táblába
		await Capital.bulkCreate([
			{ name: "London" },
			{ name: "Paris" },
			{ name: "Madrid" },
			{ name: "Berlin" },
		]);
	} catch (error) {
		console.error("Hiba történt az adatbázis beállítása során:", error);
	}
}

async function setCountryCapital() {
	try {
		// Madrid főváros lekérdezése
		capital = await Capital.findOne({ where: { name: "Madrid" } });

		// Spanyolország ország lekérdezése
		country = await Country.findOne({ where: { name: "Spain" } });

		// Kapcsolat beállítása Spanyolország és Madrid között
		await country.setCapital(capital);
	} catch (err) {
		console.log(err);
	}
}

async function getCapitalFromCountry() {
	try {
		country = await Country.findOne({ where: { name: "Spain" } });
		capital = await country.getCapital();
		console.log(capital.toJSON());
	} catch (err) {
		console.log(err);
	}
}

async function createNewCountryAndCapital() {
	try {
		country = await Country.create({ name: "USA" });
		capital = await country.createCapital({ name: "Washington DC" });
		console.log(capital.toJSON());
	} catch (err) {
		console.log(err);
	}
}

async function setCapitalCountry() {
	try {
		country = await Country.findOne({ where: { name: "France" } });
		capital = await Capital.findOne({ where: { name: "Paris" } });
		const result = await capital.setCountry(country);
		console.log(result.toJSON());
	} catch (err) {
		console.log(err);
	}
}

async function destroyOneOfConnected() {
	try {
		// Kapcsolat beállítása Anglis és London között
		country = await Country.findOne({ where: { name: "England" } });
		capital = await Capital.findOne({ where: { name: "London" } });
		await country.setCapital(capital);

		// Anglia törlése - egyben törlődik London is
		await country.destroy();
	} catch (err) {
		console.log(err);
	}
}

async function destroyOneConnectless() {
	try {
		await Country.destroy({ where: { name: "Germany" } });
	} catch (err) {
		console.log(err);
	}
}

(async () => {
	// Meghívás
	await setupDatabase();
	await setCountryCapital();
	await getCapitalFromCountry();
	await createNewCountryAndCapital();
	await setCapitalCountry();
	await destroyOneOfConnected();
	await destroyOneConnectless();

	console.log("-".repeat(40));
	const countries = await Country.findAll({ include: Capital });
	console.log(
		"Countries and their capitals:",
		countries.map((c) => c.toJSON())
	);

	const capitals = await Capital.findAll({ include: Country });
	console.log(
		"Capitals and their countries:",
		capitals.map((c) => c.toJSON())
	);
})();

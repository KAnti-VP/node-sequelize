import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "database.sqlite",
	define: {
		timestamps: false,
	},
	logging: false,
});

const Customer = sequelize.define("Customer", {
	name: DataTypes.STRING,
});

const Product = sequelize.define("Product", {
	name: DataTypes.STRING,
});

const CustomerProduct = sequelize.define("Customerproduct", {
	customerproductId: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
});

Customer.belongsToMany(Product, { through: "Customerproduct" });
Product.belongsToMany(Customer, { through: "Customerproduct" });

async function setupDatabase() {
	try {
		await sequelize.sync({ force: true });
		await Customer.bulkCreate([
			{ name: "Amy" },
			{ name: "Bea" },
			{ name: "Cloe" },
		]);
		await Product.bulkCreate([
			{ name: "apple" },
			{ name: "banana" },
			{ name: "cucumber" },
		]);
	} catch (err) {
		console.error(err);
	}
}
async function addProductToCustomer() {
	try {
		const custumer = await Customer.findOne({ where: { name: "Bea" } });
		const products = await Product.findAll();
		await custumer.addProducts(products);
	} catch (err) {
		console.log(err);
	}
}

async function addCustomerToProduct() {
	try {
		const product = await Product.findOne({ where: { name: 'banana' } });
		const customer = await Customer.findAll();
		await product.addCustomers(customer);
	} catch (err) {
		console.log(err);
	}
}

async function destroyCustomer() {
  try {
    await Customer.destroy({where: {name: 'Amy'}})
  } catch (err) {
    console.log(err);
  }
}

(async () => {
	await setupDatabase();
	await addProductToCustomer();
  await addCustomerToProduct();
  await destroyCustomer();
})();

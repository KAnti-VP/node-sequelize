import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Profile = sequelize.define('Profile', {
  bio: {
    type: DataTypes.STRING,
  },
});

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Tag = sequelize.define('Tag', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// One-to-One kapcsolat (User - Profile)
User.hasOne(Profile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Profile.belongsTo(User, {
  foreignKey: 'userId',
});


// One-to-Many kapcsolat (User - Post)
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Post.belongsTo(User, {
  foreignKey: 'userId',
});


// Many-to-Many kapcsolat (Post - Tag)
Post.belongsToMany(Tag, {
  through: 'PostTags',
  onDelete: 'CASCADE',
});
Tag.belongsToMany(Post, {
  through: 'PostTags',
  onDelete: 'CASCADE',
});


const run = async () => {
  try {
    // Szinkronizálás (az adatbázis újraépítése)
    await sequelize.sync({ force: true });

    // 1. One-to-One kapcsolat példája
    const user1 = await User.create({ name: 'Alice' });
    await Profile.create({ bio: 'Hello, I am Alice', userId: user1.id });

    // 2. One-to-Many kapcsolat példája
    const user2 = await User.create({ name: 'Bob' });
    await Post.bulkCreate([
      { title: 'First Post', userId: user2.id },
      { title: 'Second Post', userId: user2.id },
    ]);

    // 3. Many-to-Many kapcsolat példája
    const post1 = await Post.create({ title: 'Sequelize Basics' });
    const post2 = await Post.create({ title: 'Advanced Sequelize' });

    const tag1 = await Tag.create({ name: 'sequelize' });
    const tag2 = await Tag.create({ name: 'sqlite' });

    await post1.addTags([tag1, tag2]);
    await post2.addTag(tag1);

    // Ellenőrzés (lekérdezések)
    const user1Profile = await user1.getProfile();
    console.log('Alice Profile:', user1Profile.bio);

    const user2Posts = await user2.getPosts();
    console.log('Bob Posts:', user2Posts.map(post => post.title));

    const post1Tags = await post1.getTags();
    console.log('Post Tags:', post1Tags.map(tag => tag.name));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

run();

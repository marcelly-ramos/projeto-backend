const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price_with_discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'products',
  });

  Product.associate = (models) => {
    Product.hasMany(models.ProductImage, { foreignKey: 'product_id', as: 'images' });
    Product.hasMany(models.ProductOption, { foreignKey: 'product_id' });
    Product.belongsToMany(models.Category, {
      through: 'ProductCategory',
      as: 'categories',
      foreignKey: 'product_id',
    });
  };

  return Product;
};
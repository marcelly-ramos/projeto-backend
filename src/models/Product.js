const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductImage = require('./ProductImage');
const ProductOption = require('./ProductOption');

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

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
Product.hasMany(ProductOption, { foreignKey: 'product_id' });

module.exports = Product;

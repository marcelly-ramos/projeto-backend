const { Product, Category, Image, Option } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

exports.createProduct = async (req, res) => {
    const {
        enabled, name, slug, stock, description, price, price_with_discount,
        category_ids, images, options
    } = req.body;

    // Validação dos dados
    if (!name || !slug || typeof enabled !== 'boolean' || typeof stock !== 'number' ||
        !description || typeof price !== 'number' || typeof price_with_discount !== 'number' ||
        !Array.isArray(category_ids) || !Array.isArray(images) || !Array.isArray(options)) {
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        // Criação do produto
        const newProduct = await Product.create({
            enabled, name, slug, stock, description, price, price_with_discount
        });

        // Adicionar categorias associadas
        await newProduct.setCategories(category_ids);

        // Adicionar imagens associadas
        for (const image of images) {
            await Image.create({
                product_id: newProduct.id,
                type: image.type,
                content: image.content
            });
        }

        // Adicionar opções associadas
        for (const option of options) {
            await Option.create({
                product_id: newProduct.id,
                title: option.title,
                shape: option.shape,
                radius: option.radius,
                type: option.type,
                values: option.values
            });
        }

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Função para obter uma lista de produtos
exports.getProducts = async (req, res) => {
    const {
        limit = 12,
        page = 1,
        fields = 'name,images,price',
        match,
        category_ids,
        'price-range': priceRange,
        ...options
    } = req.query;

    const limitParsed = parseInt(limit, 10);
    const pageParsed = parseInt(page, 10);

    if (isNaN(limitParsed) || limitParsed < -1 || limitParsed === 0) {
        return res.status(400).json({ message: 'Parâmetro de limite inválido' });
    }

    if (isNaN(pageParsed) || pageParsed <= 0) {
        return res.status(400).json({ message: 'Parâmetro de página inválido' });
    }

    const filter = {};
    if (match) {
        filter[Op.or] = [
            { name: { [Op.iLike]: `%${match}%` } },
            { description: { [Op.iLike]: `%${match}%` } },
        ];
    }

    if (category_ids) {
        filter['$categories.id$'] = category_ids.split(',').map(id => parseInt(id, 10));
    }

    if (priceRange) {
        const [min, max] = priceRange.split('-').map(num => parseFloat(num));
        filter.price = { [Op.between]: [min, max] };
    }

    try {
        const { count, rows } = await Product.findAndCountAll({
            attributes: fields.split(','),
            where: filter,
            limit: limitParsed === -1 ? undefined : limitParsed,
            offset: limitParsed === -1 ? undefined : (pageParsed - 1) * limitParsed,
            include: [
                { model: Image, as: 'images' },
                { model: Option, as: 'options' },
                {
                    model: Category,
                    as: 'categories',
                    attributes: ['id']
                }
            ],
        });

        res.status(200).json({
            data: rows,
            total: count,
            limit: limitParsed,
            page: pageParsed,
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Função para obter informações do produto pelo ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id, {
            include: [
                { model: Image, as: 'images' },
                { model: Option, as: 'options' },
                {
                    model: Category,
                    as: 'categories',
                    attributes: ['id']
                }
            ],
        });

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        enabled, name, slug, stock, description, price, price_with_discount,
        category_ids, images, options
    } = req.body;

    // Validação básica dos dados
    if (!name || !slug || typeof enabled !== 'boolean' || typeof stock !== 'number' ||
        !description || typeof price !== 'number' || typeof price_with_discount !== 'number' ||
        !Array.isArray(category_ids) || !Array.isArray(images) || !Array.isArray(options)) {
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        // Encontrar o produto existente
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Atualizar dados do produto
        await product.update({
            enabled, name, slug, stock, description, price, price_with_discount
        });

        // Atualizar categorias associadas
        await product.setCategories(category_ids);

        // Atualizar imagens associadas
        for (const image of images) {
            if (image.deleted) {
                await Image.destroy({ where: { id: image.id, product_id: product.id } });
            } else if (image.id) {
                await Image.update({
                    content: image.content
                }, { where: { id: image.id, product_id: product.id } });
            } else {
                await Image.create({
                    product_id: product.id,
                    type: image.type,
                    content: image.content
                });
            }
        }

        // Atualizar opções associadas
        for (const option of options) {
            if (option.deleted) {
                await Option.destroy({ where: { id: option.id, product_id: product.id } });
            } else if (option.id) {
                await Option.update({
                    title: option.title || undefined,
                    shape: option.shape || undefined,
                    radius: option.radius || undefined,
                    type: option.type || undefined,
                    values: option.values || undefined
                }, { where: { id: option.id, product_id: product.id } });
            } else {
                await Option.create({
                    product_id: product.id,
                    title: option.title,
                    shape: option.shape,
                    radius: option.radius,
                    type: option.type,
                    values: option.values
                });
            }
        }

        // Responder com sucesso sem corpo (204 No Content)
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar o produto pelo ID
        const product = await Product.findByPk(id);

        // Verificar se o produto existe
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Deletar o produto
        await product.destroy();

        // Responder com sucesso sem corpo (204 No Content)
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Exporta os métodos
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    authenticateToken,
};

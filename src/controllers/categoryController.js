const { Category } = require('../models');
const jwt = require('jsonwebtoken');

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

// Função para criar uma nova categoria
exports.createCategory = async (req, res) => {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug || typeof use_in_menu !== 'boolean') {
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        const newCategory = await Category.create({ name, slug, use_in_menu });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Função para obter uma lista de categorias
exports.getCategories = async (req, res) => {
    const { limit = 12, page = 1, fields = 'name,slug', use_in_menu } = req.query;

    const limitParsed = parseInt(limit, 10);
    const pageParsed = parseInt(page, 10);

    if (isNaN(limitParsed) || limitParsed < -1 || limitParsed === 0) {
        return res.status(400).json({ message: 'Parâmetro de limite inválido' });
    }

    if (isNaN(pageParsed) || pageParsed <= 0) {
        return res.status(400).json({ message: 'Parâmetro de página inválido' });
    }

    const filter = {};
    if (use_in_menu) {
        filter.use_in_menu = use_in_menu === 'true';
    }

    try {
        const { count, rows } = await Category.findAndCountAll({
            attributes: fields.split(','),
            where: filter,
            limit: limitParsed === -1 ? undefined : limitParsed,
            offset: limitParsed === -1 ? undefined : (pageParsed - 1) * limitParsed,
        });

        res.status(200).json({
            data: rows,
            total: count,
            limit: limitParsed,
            page: pageParsed,
        });
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Função para obter informações da categoria pelo ID
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Função para atualizar uma categoria
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug || typeof use_in_menu !== 'boolean') {
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        const [updated] = await Category.update({ name, slug, use_in_menu }, { where: { id } });

        if (updated) {
            return res.status(204).send(); // Nenhum conteúdo, mas status 204
        }

        return res.status(404).json({ message: 'Categoria não encontrada' });
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Função para deletar uma categoria
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Category.destroy({ where: { id } });

        if (deleted) {
            return res.status(204).send(); // Nenhum conteúdo, mas status 204
        }

        return res.status(404).json({ message: 'Categoria não encontrada' });
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    authenticateToken 
};

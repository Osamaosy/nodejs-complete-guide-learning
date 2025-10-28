const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        pageCSS: 'product'
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, description, imageUrl , price} = req.body;
    const product = new Product(title, description, imageUrl, price);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        pageCSS: 'product'
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin products',
            path: '/admin/products',
            pageCSS: 'product',
            activeAdminProducts: true
        });
    });
}
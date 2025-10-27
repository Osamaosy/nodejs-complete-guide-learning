const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/products',
            pageCSS: null, 
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            pageCSS: "product", 
            productCSS: true
        });
    });
}

exports.getCard = (req, res, next) => {
        res.render('shop/card', {
            path: '/card',
            pageTitle: 'Your Card',
            pageCSS: null 
        })
}

exports.getCheckout = (req, res, next) => {
        res.render('shop/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout',
            pageCSS: null 
        })
}
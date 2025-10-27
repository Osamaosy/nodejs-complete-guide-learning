const Product = require('../models/product');

// دالة مساعدة لتجنب التكرار
const renderProductsPage = (res, view, path, pageTitle, products, additionalData = {}) => {
    res.render(view, {
        prods: products,
        pageTitle: pageTitle,
        path: path,
        pageCSS: additionalData.pageCSS || null,
        hasProducts: products.length > 0,
        activeShop: path === '/',
        productCSS: true,
        ...additionalData
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        renderProductsPage(res, 'shop/product-list', '/products', 'All Products', products);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products',
            pageCSS: 'product'
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        renderProductsPage(res, 'shop/index', '/', 'Shop', products, { pageCSS: 'product' });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        pageCSS: null
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        // هنا منطق إضافة المنتج للسلة
        console.log('Added to cart:', product);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // منطق حذف المنتج من السلة
    res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        pageCSS: null
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        pageCSS: null
    });
};
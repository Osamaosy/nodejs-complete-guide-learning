const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        pageTitle: "إضافة منتج",
        path: "/admin/add-product",
        pageCSS: "product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect("/");
};

exports.getProduct = (req, res, next) => {
    res.render("shop", {
        prods: products,
        pageTitle: "المتجر",
        path: "/",
        hasProduct: products.length > 0,
        pageCSS: null, // أضف هذا السطر
        productCSS: true,
        activeShop: true
    });
};
const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, description, imageUrl, price) {
        this.title = title;
        this.description = description || 'لا يوجد وصف';
        this.imageUrl = imageUrl || 'https://1.bp.blogspot.com/-Fj68RV5Uj5E/WMFGfB7M9yI/AAAAAAAAAt8/B4UbQb6VmX8HYAa122EF3_0Uu7NXYesGwCLcB/s1600/hp%2Blaptop%2Bprice%2Bin%2Bsaudi%2Barabia.jpg';
        this.price = price || 198.6;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};
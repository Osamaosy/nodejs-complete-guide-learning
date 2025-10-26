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
    constructor(title, description, imageUrl) {
    this.title = title;
    this.description = description || 'لا يوجد وصف';
    this.imageUrl = imageUrl || 'https://1.bp.blogspot.com/-Fj68RV5Uj5E/WMFGfB7M9yI/AAAAAAAAAt8/B4UbQb6VmX8HYAa122EF3_0Uu7NXYesGwCLcB/s1600/hp%2Blaptop%2Bprice%2Bin%2Bsaudi%2Barabia.jpg';
}

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                if (err) {
                    console.error('❌ Error saving:', err);
                } 
                else {
                    console.log('✅ Product saved successfully!');
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};
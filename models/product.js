const db = require('../util/database')
const Cart = require('./cart');


module.exports = class Product {
    constructor({ title, description, imageUrl, price }) {
        this.title = title;
        this.description = description || 'لا يوجد وصف';
        this.imageUrl = imageUrl || 'https://via.placeholder.com/300x250?text=No+Image';
        this.price = price || 0;
    }

    save() {
        return db.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [ this.title, this.price, this.imageUrl, this.description ]
            );
    }

static deleteById(id) {
}

    static fetchAll() {
        return db.execute('SELECT * FROM products')
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
    }
};
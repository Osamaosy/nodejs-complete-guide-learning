const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

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
    constructor({ title, description, imageUrl, price }) {
        this.title = title;
        this.description = description || 'لا يوجد وصف';
        this.imageUrl = imageUrl || 'https://via.placeholder.com/300x250?text=No+Image';
        this.price = price || 0;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                // تحديث منتج موجود
                const existingProductIndex = products.findIndex(p => p.id === this.id);
                if (existingProductIndex >= 0) {
                    products[existingProductIndex] = this;
                }
            } else {
                // إضافة منتج جديد
                this.id = Math.random().toString();
                products.push(this);
            }
            
            fs.writeFile(p, JSON.stringify(products, null, 2), err => {
                if (err) {
                    console.error('❌ خطأ في حفظ المنتج:', err);
                } else {
                    console.log('✅ تم حفظ المنتج بنجاح!');
                }
            });
        });
    }

static deleteById(id) {
    getProductsFromFile(products => {
        // 1. العثور على المنتج المراد حذفه (للحصول على سعره)
        const product = products.find(prod => prod.id === id); 
        // 2. إنشاء مصفوفة جديدة بدون المنتج المحذوف
        const updatedProducts = products.filter(prod => prod.id !== id); 
        // 3. كتابة المصفوفة الجديدة في الملف
        fs.writeFile(p, JSON.stringify(updatedProducts, null, 2), err => {
            if (!err) { // <-- 4. إذا نجحت الكتابة
                // 5. احذف المنتج من السلة أيضًا (نقطة مهمة)
                Cart.deleteProduct(id, product.price); 
            } else {
                console.error('❌ خطأ في حذف المنتج:', err);
            }
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
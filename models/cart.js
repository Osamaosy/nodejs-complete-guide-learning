const { fileLoader } = require('ejs');
const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename), // استخدام require.main.filename
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            // قراءة السلة الحالية أو إنشاء واحدة جديدة
            if (!err && fileContent.length > 0) { // تأكد أن الملف ليس فارغًا
                try {
                    cart = JSON.parse(fileContent);
                    // تأكد أن الهيكل صحيح
                    if (!cart.products || !cart.totalPrice) {
                        cart = { products: [], totalPrice: 0 };
                    }
                } catch (parseErr) {
                    console.error("Error parsing cart.json:", parseErr);
                    cart = { products: [], totalPrice: 0 }; // ابدأ بسلة فارغة عند خطأ التحليل
                }
            } else if (err && err.code !== 'ENOENT') { // تجاهل خطأ "الملف غير موجود" فقط
                console.error("Error reading cart file:", err);
            }


            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1, price: +productPrice }; // تخزين السعر هنا قد يكون مفيدًا
                cart.products = [...cart.products, updatedProduct];
            }

            // ⬇️⬇️⬇️ إعادة حساب الإجمالي بالكامل ⬇️⬇️⬇️
            cart.totalPrice = 0; // ابدأ من الصفر
            for (let product of cart.products) {
                // افترض أن السعر مخزن في المنتج داخل السلة أو استخدم السعر الممرر
                // من الأفضل تخزين السعر مع المنتج في السلة لضمان الدقة
                const price = product.price || +productPrice; // استخدم السعر المخزن إن وجد
                cart.totalPrice += price * product.qty;
            }
            // تأكد من أن السعر لا يحتوي على مشاكل الفاصلة العائمة
            cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));


            fs.writeFile(p, JSON.stringify(cart, null, 2), err => { // إضافة تنسيق
                if (err) { console.error("Error writing cart file:", err); }
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err || fileContent.length === 0) { // لا تفعل شيئًا إذا كان هناك خطأ أو الملف فارغ
                return;
            }

            let updatedCart;
            try {
                updatedCart = JSON.parse(fileContent);
                if (!updatedCart.products || updatedCart.totalPrice === undefined) {
                    return; // هيكل غير صحيح، لا تفعل شيئًا
                }
            } catch (parseErr) {
                console.error("Error parsing cart.json during delete:", parseErr);
                return; // لا يمكن التحليل، توقف
            }

            const productIndex = updatedCart.products.findIndex(prod => prod.id === id);

            if (productIndex === -1) { // إذا لم يتم العثور على المنتج، لا تفعل شيئًا
                return;
            }

            // حذف المنتج
            updatedCart.products.splice(productIndex, 1); // استخدام splice للحذف من المصفوفة الأصلية

            // ⬇️⬇️⬇️ إعادة حساب الإجمالي بالكامل ⬇️⬇️⬇️
            updatedCart.totalPrice = 0; // ابدأ من الصفر
            for (let product of updatedCart.products) {
                // يجب أن يكون السعر مخزنًا في المنتج داخل السلة
                if (product.price === undefined) {
                    console.error("Product in cart missing price:", product);
                    continue; // تجاهل المنتج إذا لم يكن له سعر
                }
                updatedCart.totalPrice += product.price * product.qty;
            }
            // تأكد من أن السعر لا يحتوي على مشاكل الفاصلة العائمة
            updatedCart.totalPrice = parseFloat(updatedCart.totalPrice.toFixed(2));


            fs.writeFile(p, JSON.stringify(updatedCart, null, 2), err => { // إضافة تنسيق
                if (err) { console.error("Error writing cart file after delete:", err); }
            });
        });
    }

    // دالة جديدة لجلب محتويات السلة (مفيدة للعرض)
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err || fileContent.length === 0) {
                cb(null); // أرسل null إذا كانت السلة غير موجودة أو فارغة
            } else {
                try {
                    const cart = JSON.parse(fileContent);
                    if (!cart.products || cart.totalPrice === undefined) {
                        cb(null); // هيكل غير صحيح
                    } else {
                        cb(cart);
                    }
                } catch (parseErr) {
                    console.error("Error parsing cart.json for getCart:", parseErr);
                    cb(null); // خطأ في التحليل
                }
            }
        });
    }

    static getcart(cb){
        fs.readFile(p, (err, fileContent));
        const cart = JSON.parse(fileContent);
        if (err){
            cb(null);
        }else{
            cb(cart)
        }

}
};
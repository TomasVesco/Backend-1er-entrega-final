const { Router } = require('express');

const ProductContainer = require('../Class/productClass');
const p = new ProductContainer('./src/Files/products.txt');

const router = Router();

router.get('/:id?', async (req, res) => {
    try {

        const id = req.params.id || null;
        
        if(id != null){
            const productId = await p.getById(id);
            res.status(productId.status).send(productId);
            return false;
        }
        
        products = await p.getAll();
        res.status(200).send(products);

    } catch(err) {

        res.status(404).send(err);

    }
});

router.post('/', async (req, res) => {
    try {

        const { title, price , image, description, stock, code } = req.body;

        const newProduct = {
            title: title,
            price: price,
            image: image,
            description: description,
            stock: stock,
            code: code
        }

        const productToAdd = await p.save(newProduct);

        res.status(productToAdd.status).send(productToAdd.status == 200 ? 'Saved post' : 'Post not saved');

    } catch(err) {

        res.status(404).send(err);

    }
});

module.exports = router;
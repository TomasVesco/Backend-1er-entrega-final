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

        const { title, price, image, description, stock, code, admin } = req.body;

        if(admin && admin != undefined){
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
        } else {
            res.status(404).send({
                error: 'Page not found',
                description: 'This page is only for staff members'
            });
        }

    } catch(err) {
        res.status(404).send(err);
    }
});

router.put('/:id', async (req, res) => {
    try {

        const id = req.params.id;

        const { title, price, image, description, stock, code, admin } = req.body;

        let products = await p.getAll();

        if(admin && admin != undefined){
            if(products[id - 1]){
    
                const newProduct = {
                    title: title,
                    price: price,
                    image: image,
                    description: description,
                    stock: stock,
                    code: code,
                    id: parseInt(id)
                }
        
                products = await p.deleteById(id);
                productToAdd = await p.save(newProduct);
        
                res.status(200).send(productToAdd);
            } else {
                res.status(404).send({
                    error: 'ID not found',
                    description: `Product with ID:${id} does not exist`
                });
            }
        } else {
            res.status(404).send({
                error: 'Page not found',
                description: 'This page is only for staff members'
            });
        }

    } catch(err) {
        res.status(404).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {

        const id = req.params.id;

        let products = await p.getAll();

        const { admin } = req.body;

        if(admin && admin != undefined){
            if(products[id - 1] && products[0].id != 0){
                products = await p.deleteById(id);

                res.status(200).send('Saved deletion');
            } else {
                res.status(404).send({
                    error: 'ID not found',
                    description: `Product with ID:${id} does not exist`
                });
            }
        } else {
            res.status(404).send({
                error: 'Page not found',
                description: 'This page is only for staff members'
            });
        }

    } catch(err) {
        res.status(404).send(err);
    }
});

module.exports = router;
const { Router } = require('express');

const router = Router();

const CartContainer = require('../Class/cartClass');
const c = new CartContainer('./src/Files/cart.txt');

const ProductContainer = require('../Class/productClass');
const p = new ProductContainer('./src/Files/products.txt');

router.get('/:id/productos', async (req, res) => {
    try {

        const id = req.params.id;

        const productsByCartId = await c.getById(id);

        if(productsByCartId != -1){
            res.status(productsByCartId.status).send(productsByCartId);
        } else{
            res.status(200).send(`The are no products in the cart with ID:${id}`);
        }

    } catch(err) {
        res.status(404).send(err);
    }
});

router.post('/', async (req, res) => {
    try {

        IdOfNewCart = await c.createCart();

        res.status(200).send({IdOfNewCart});

    } catch(err) {
        res.status(404).send(err);
    }
});

router.post('/:id/productos', async (req, res) => {
    try{

        const id = req.params.id;

        const { productId } = req.body;

        const existProductId = await p.getById(productId);

        const existCartId = await c.getById(id);

        if(!isNaN(productId)){
            if(existProductId.id != 0 && existProductId.id != undefined){
                if(existCartId.status === 200){
                    
                    const cart = await c.save(existProductId, id);

                    res.status(200).send(cart);

                } else {
                    res.status(existCartId.status).send({
                        error: 'ID not found',
                        description: `Cart with ID:${id} does not exist`,
                    });
                }
            } else {
                res.status(404).send({
                    error: 'ID not found',
                    description: `Product with ID:${id} does not exist`
                }); 
            }
        } else {
            res.status(404).send({
                error: 'ID is a character',
                description: `Only numbers are accepted`
            });
        }

    } catch(err) {
        res.status(404).send(err);
    }
});

module.exports = router;
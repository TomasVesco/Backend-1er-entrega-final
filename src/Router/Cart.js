const { Router } = require('express');

const router = Router();

const CartContainer = require('../Class/cartClass');
const c = new CartContainer('./src/Files/cart.txt');

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

        const { title, price, image, description, stock, code } = req.body;

        const newProduct = {
            title: title,
            price: price,
            image: image,
            description: description,
            stock: stock,
            code: code
        }

        console.log('en ruta post :id');

        res.status(200).send('hola');

    } catch(err) {
        res.status(404).send(err);
    }
});

module.exports = router;
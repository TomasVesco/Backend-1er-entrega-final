const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    try {

        res.status(200).send('Carrito');

    } catch(err) {

        res.status(400).send(err);

    }
});

module.exports = router;
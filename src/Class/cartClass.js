const fs = require('fs');
const moment = require('moment');

class CartContainer {

    constructor( route ) {
        this.route = route;
    }

    async createCart() {
        try {

            const cart = await this.getAll();
            cart.sort((a, b) => a.id - b.id);

            let date = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');

            let id = undefined;
            
            if(id == undefined) {
                for(let i = 0; i < cart.length ;i++){
                    if(cart[i].id !== i + 1 && cart[0].id !== 0){
                        id = i + 1;
                        break;
                    } else {
                        id = cart[cart.length - 1].id + 1;
                    }
                }
            }

            if(cart[0].id == '0'){
                id = 1;
                cart.shift();
            }

            const newCart = 
                {
                    id: id,
                    timestamp: date,
                    products: []
                } 

            cart.push( newCart );    
            
            cart.sort((a, b) => a.id - b.id);
            
            fs.writeFileSync( this.route, JSON.stringify( cart, null, 4 ));

            return JSON.stringify(id);

        } catch(error) {
            console.log(error);
        }
    }

    async save( productToAdd ) { 
        try {

            let date = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');
                
            fs.writeFileSync( this.route, JSON.stringify( newFile, null, 4 ));

        } catch(error) {
            console.log(error);
        }
    }

    async getById( id ) {
        try {

            if(!isNaN(id)){
                id = parseInt(id);
            
                const cart = await this.getAll();
    
                const IdCart = cart.find( cart => cart.id === id );
                   
                if ( IdCart ) {
                    if(IdCart.products != ''){
                        return {...IdCart.products, status: 200};
                    } else {
                        return -1;
                    }
                } else {
                    return {
                        error: 'ID not found',
                        description: `Product with ID:${id} does not exist`,
                        status: 404
                    };
                }
            } else {
                return {
                    error: 'ID not found',
                    description: `Only numbers are acepted`,
                    status: 404
                }
            }

        } catch(error) {
            console.log(error);
        }
    }

    async getAll() {
        try {

            let readFile = await fs.promises.readFile( this.route, 'utf-8' ); 

            if(readFile == '' || readFile == '[]'){
                const obj = [
                    {id: 0}
                ];
                fs.promises.writeFile( this.route, JSON.stringify(obj));
            }
            
            readFile = await fs.promises.readFile( this.route, 'utf-8' ); 

            return JSON.parse( readFile );

        } catch(error) {
            console.log(error);
        }
    }

    async deleteById( id ) {
        try {

            fs.promises.writeFile( this.route, JSON.stringify( newFile, null, 4 ));    

        } catch(error) {
            console.log(error);
        }
    }

    async deleteAll() {
        try {

            fs.promises.writeFile( this.route, '' );   

        } catch(error) {
            console.log(error);
        }
    }
}

module.exports = CartContainer;
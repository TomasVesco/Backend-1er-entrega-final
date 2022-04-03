const fs = require('fs');
const moment = require('moment');

class ProductContainer {

    constructor( route ) {
        this.route = route;
    }

    async save( productToAdd ) { 
        try {

            const products = await this.getAll();
            products.sort((a, b) => a.id - b.id);

            let date = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');

            const { title, price, image, description, stock, code } = productToAdd;
            const id = productToAdd.id || undefined;

            if((title, price, image, description, stock, code) != ''){
   
                if(id == undefined) {
                    for(let i = 0; i < products.length ;i++){
                        if(products[i].id !== i + 1 && products[0].id !== 0){
                            productToAdd.id = i + 1;
                            break;
                        } else {
                            productToAdd.id = products[products.length - 1].id + 1;
                        }
                    }
                }

                productToAdd.timestamp = date;

                if(products[0].id == '0'){
                    productToAdd.id = 1;
                    products.shift();
                }

                products.push( productToAdd );    
                
                products.sort((a, b) => a.id - b.id);
                
                fs.writeFileSync( this.route, JSON.stringify( products, null, 4 ));

                return {...products, status: 200};

            } else {
                return {
                    error: 'Missing an argument',
                    description: 'One or more arguments have not been entered',
                    status: 404
                }
            }
        }

        catch(error) {
            console.log(error);
        }
    }

    async getById( id ) {
        try {

            id = parseInt(id);
            
            const products = await this.getAll();

            const IdFile = products.find( file => file.id === id );
    
            if ( IdFile ) {
                return {...IdFile, status: 200};
            } else {
                return {
                    error: 'ID not found',
                    description: `Product with ID:${id} does not exist`,
                    status: 404
                };
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

        if(!isNaN(id)){
            id = parseInt(id);

            let products = await this.getAll();
    
            const productToDelete = id => products.find(product => product.id === id);
    
            const index = products.indexOf(productToDelete(id));

            if(index !== -1){
                products.splice(index, 1);
    
                products.sort((a, b) => a.id - b.id);
        
                fs.promises.writeFile( this.route, JSON.stringify( products, null, 4 ));

                return 1;
            } else {
                return 0
            }
        }
        return -1
    }

    async deleteAll() {
        fs.promises.writeFile( this.route, '' );
    }
}

module.exports = ProductContainer;
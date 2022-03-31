const fs = require('fs');
const moment = require('moment');

class ProductContainer {

    constructor( route ) {
        this.route = route;
    }

    async save( productToAdd ) { 
        try {
            const newFile = await this.getAll();
            let date = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');

            const { title, price, image, description, stock, code } = productToAdd;

            if((title, price, image, description, stock, code) != ''){
    
                productToAdd.id = newFile[newFile.length - 1].id + 1;   
                productToAdd.timestamp = date;

                if(newFile[0].id == '0'){
                    newFile.shift();
                }

                newFile.push( productToAdd );     
                
                fs.writeFileSync( this.route, JSON.stringify( newFile, null, 4 ));

                return {...newFile, status: 200};
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

            const newFile = await this.getAll();

            const IdFile = newFile.find( file => file.id === id );
    
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
            if(readFile == ''){
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
        const newFile = await this.getAll();
        newFile.splice(newFile.indexOf(newFile[id - 1]), 1);
        fs.promises.writeFile( this.route, JSON.stringify( newFile, null, 4 ));
    }

    async deleteAll() {
        fs.promises.writeFile( this.route, '' );
    }
}

module.exports = ProductContainer;
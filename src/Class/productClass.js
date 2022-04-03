const fs = require('fs');
const moment = require('moment');

class ProductContainer {

    constructor( route ) {
        this.route = route;
    }

    async save( productToAdd ) { 
        try {
            const newFile = await this.getAll();
            newFile.sort((a, b) => a.id - b.id);

            let date = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');

            const { title, price, image, description, stock, code } = productToAdd;
            const id = productToAdd.id || undefined;

            if((title, price, image, description, stock, code) != ''){
   
                if(id == undefined) {
                    for(let i = 0; i < newFile.length ;i++){
                        if(newFile[i].id !== i + 1 && newFile[0].id !== 0){
                            productToAdd.id = i + 1;
                            break;
                        } else {
                            productToAdd.id = newFile[newFile.length - 1].id + 1;
                        }
                    }
                }

                productToAdd.timestamp = date;

                if(newFile[0].id == '0'){
                    productToAdd.id = 1;
                    newFile.shift();
                }

                newFile.push( productToAdd );    
                
                newFile.sort((a, b) => a.id - b.id);
                
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

            let newFile = await this.getAll();
    
            const productToDelete = id => newFile.find(product => product.id === id);
    
            const index = newFile.indexOf(productToDelete(id));

            if(index !== -1){
                newFile.splice(index, 1);
    
                newFile.sort((a, b) => a.id - b.id);
        
                fs.promises.writeFile( this.route, JSON.stringify( newFile, null, 4 ));

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
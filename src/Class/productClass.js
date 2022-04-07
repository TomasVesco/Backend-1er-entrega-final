const fs = require("fs");
const moment = require("moment");

class ProductContainer {
  constructor(route) {
    this.route = route;
  }

  async updateById(id, newData) {
    const products = await this.getAll();
    const indexProduct = products.findIndex((product) => product.id === id);

    if (indexProduct === -1) return -1; //Aca tendrias que ver como lo manejas si no existe

    // si da distinto de -1 es que lo encontro
    const { title, price, image, description, stock, code } = newData; // digamos que acá queremos modificar todas esas variables
    /// copiamos lo que tenia en esa posición para que nos traiga el id, y el timestamp (opcional, podrias actualizarlo tambien), y le ponemos las nuevas variables
    const newProduct = {
      ...products[indexProduct],
      title,
      price,
      image,
      description,
      stock,
      code,
    };
    products[indexProduct] = newProduct;

    fs.writeFileSync(this.route, JSON.stringify(products, null, 4));

    // respondemos que fue con exito (formato que prefieras para manejar)

    return newProduct;
  }

  async save(productToAdd) {
    try {
    
      const { title, price, image, description, stock, code } = productToAdd;
      const products = await this.getAll();

      const date = moment(new Date()).format("DD-MM-YYYY h:mm:ss a");

      const newProduct = {
        id: products[products.length - 1].id + 1,
        timestamp: date,
        title,
        price,
        image,
        description,
        stock,
        code,
      }

      products.push(newProduct)

      fs.writeFileSync(this.route, JSON.stringify(products, null, 4));

      return newProduct;

    } catch (error) {
        console.log(error);
    }
  }

  async getById(id) {
    try {
      id = parseInt(id);

      const products = await this.getAll();

      const IdFile = products.find((file) => file.id === id);

      if (IdFile) {
        return { ...IdFile, status: 200 };
      } else {
        return {
          error: "ID not found",
          description: `Product with ID:${id} does not exist`,
          status: 404,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {

      let readFile = await fs.promises.readFile(this.route, "utf-8");

      if (readFile == "" || readFile == "[]") {
        const obj = [{ id: 0 }];
        fs.promises.writeFile(this.route, JSON.stringify(obj));
      }

      readFile = await fs.promises.readFile(this.route, "utf-8");
      
      return JSON.parse(readFile);

    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {

      if(!id) return -1 // o lo que quieras para el error

      const products = await this.getAll()
      // depende del tipo de dato de id, podrias usar un parseInt si es necesario pasarlo a number, así usas el comparador más "fuerte" !==
      const productFound = products.find(product => product.id === parseInt(id))

      if(!productFound) return 0 // por si no existe, si existe sigue

      const newProducts = products.filter(product => product.id !== parseInt(id))

      fs.promises.writeFile(this.route, JSON.stringify(newProducts, null, 4));

      return 1
  }

  async deleteAll() {
    fs.promises.writeFile(this.route, "");
  }
}

module.exports = ProductContainer;
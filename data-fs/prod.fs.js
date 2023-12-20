const fs = require("fs").promises;

class ProdManager {
  static #productos = [];
  #filePath;

  constructor(filePath) {
    this.#filePath = filePath;
    this.loadFromFile()
      .then(() => {
        console.log("Productos cargados desde el archivo.");
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error.message);
      });
  }

  loadFromFile() {
    return fs
      .readFile(this.#filePath, "utf8")
      .then((data) => {
        ProdManager.#productos = JSON.parse(data);
      })
      .catch((error) => {
        ProdManager.#productos = [];
        throw error;
      });
  }

  saveToFile() {
    const data = JSON.stringify(ProdManager.#productos, null, 2);
    return fs.writeFile(this.#filePath, data, "utf8");
  }

  create(data) {
    try {
      if (!data.title || !data.photo || !data.price || !data.stock) {
        throw new Error("Faltan argumentos. ERROR en la carga.");
      } else {
        const producto = {
          id:
            ProdManager.#productos.length === 0
              ? 1
              : ProdManager.#productos[ProdManager.#productos.length - 1].id +
                1,
          title: data.title,
          photo: data.photo,
          price: data.price,
          stock: data.stock,
        };
        ProdManager.#productos.push(producto);
        return this.saveToFile()
          .then(() => producto)
          .catch((error) => {
            throw new Error(`Error al guardar producto: ${error.message}`);
          });
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  }

  read() {
    try {
      if (ProdManager.#productos.length === 0) {
        throw new Error("No hay productos que leer");
      } else {
        return Promise.resolve(ProdManager.#productos);
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  }

  readById(id) {
    try {
      const prodFinder = ProdManager.#productos.find(
        (each) => each.id === Number(id)
      );
      if (prodFinder) {
        return Promise.resolve(prodFinder);
      } else {
        throw new Error("ID ingresado no es correcto. ERROR");
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
}

const filePath = "productos.json";
const almacen = new ProdManager(filePath);

almacen
  .create({
    title: "Playadito 1KG",
    photo: "photo2.jpg",
    price: 3000,
    stock: 50,
  })
  .then((producto) => {
    console.log("Producto creado:", producto);
    return almacen.create({
      title: "Mondongo",
      photo: "photo3.jpg",
      price: 1500,
      stock: 75,
    });
  })
  .then((producto) => {
    console.log("Producto creado:", producto);
    return almacen.create({
      title: "Natura",
      photo: "photo1.jpg",
      price: 2200,
      stock: 100,
    });
  })
  .then(() => {
    return almacen.read();
  })
  .then((todosLosProductos) => {
    console.log("Todos los productos:", todosLosProductos);
    return almacen.readById(1);
  })
  .then((productoConId1) => {
    console.log("Producto con ID 1:", productoConId1);
    return almacen.readById(2);
  })
  .then((productoConId2) => {
    console.log("Producto con ID 2:", productoConId2);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

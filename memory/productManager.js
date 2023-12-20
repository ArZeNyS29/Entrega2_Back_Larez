class ProdManager {
  static #productos = [];
  constructor() {}
  create(data) {
    try {
      if (!data.title || !data.photo || !data.price || !data.stock) {
        throw new FatalError("Faltan argumentos. ERROR en la carga.");
      } else {
        const producto = {
          id:
            ProdManager.#productos.length === 0
              ? 1
              : ProdManager.#productos[ProdManager.#productos.length - 1].id + 1,
          title: data.title,
          photo: data.photo,
          price: data.price,
          stock: data.stock,
        };
        ProdManager.#productos.push(producto);
        return producto;
      }
    } catch (FatalError) {
      return FatalError.massage;
    }
  }
  read() {
    try {
      const allProducts = ProdManager.#productos;
      if (allProducts.length === 0) {
        throw new FatalError("No hay productos que leer");
      } else {
        return allProducts;
      }
    } catch (FatalError) {
      return FatalError.massage;
    }
  }
  readById(id) {
    try {
      const prodFinder = ProdManager.#productos.find(
        (each) => each.id === Number(id)
      );
      if (prodFinder) {
        return prodFinder;
      } else {
        throw new FatalError("ID ingresado no es correcto. ERROR");
      }
    } catch (FatalError) {
      return FatalError.massage;
    }
  }
}

const almacen = new ProdManager();
almacen.create({
  title: "Playadito 1KG",
  photo: "photo2.jpg",
  price: 3000,
  stock: 50,
});

almacen.create({
  title: "Mondongo",
  photo: "photo3.jpg",
  price: 1500,
  stock: 75,
});
almacen.create({
  title: "Natura",
  photo: "photo1.jpg",
  price: 2200,
  stock: 100,
});
const todosLosProductos = almacen.read();
console.log("Todos los productos:", todosLosProductos);
const productoConId1 = almacen.readById(1);
console.log("Producto con ID 1:", productoConId1);

const productoConId2 = almacen.readById(2);
console.log("Producto con ID 2:", productoConId2);

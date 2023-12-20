const fs = require("fs").promises;

class UserManager {
  static #users = [];
  #filePath;

  constructor(filePath) {
    this.#filePath = filePath;
    this.loadFromFile()
      .then(() => {
        console.log("Usuarios cargados desde el archivo.");
      })
      .catch((error) => {
        console.error("Error al cargar usuarios:", error.message);
      });
  }

  loadFromFile() {
    return fs
      .readFile(this.#filePath, "utf8")
      .then((data) => {
        UserManager.#users = JSON.parse(data);
      })
      .catch((error) => {
        // Si hay un error al leer el archivo, inicializa el array como vacío
        UserManager.#users = [];
        throw error;
      });
  }

  saveToFile() {
    const data = JSON.stringify(UserManager.#users, null, 2);
    return fs.writeFile(this.#filePath, data, "utf8");
  }

  createUser(data) {
    try {
      if (!data.username || !data.email || !data.password || !data.photo) {
        throw new Error("Faltan argumentos. ERROR en la carga.");
      } else {
        const user = {
          id:
            UserManager.#users.length === 0
              ? 1
              : UserManager.#users[UserManager.#users.length - 1].id + 1,
          username: data.username,
          email: data.email,
          password: data.password,
          photo: data.photo,
        };
        UserManager.#users.push(user);
        return this.saveToFile()
          .then(() => user)
          .catch((error) => {
            throw new Error(`Error al guardar usuario: ${error.message}`);
          });
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  }

  read() {
    try {
      if (UserManager.#users.length === 0) {
        throw new Error("No hay usuarios registrados");
      } else {
        return Promise.resolve(UserManager.#users);
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  }

  readById(id) {
    try {
      const userFinder = UserManager.#users.find(
        (each) => each.id === Number(id)
      );
      if (userFinder) {
        return Promise.resolve(userFinder);
      } else {
        throw new Error("ID ingresado no es correcto. ERROR");
      }
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
}

const filePath = "usuarios.json"; // Nombre del archivo donde se guardarán los usuarios
const register = new UserManager(filePath);

register
  .createUser({
    username: "user1",
    email: "user1@example.com",
    password: "password1",
    photo: "photo1.jpg",
  })
  .then((user) => {
    console.log("Usuario creado:", user);
    return register.createUser({
      username: "user2",
      email: "user2@example.com",
      password: "password2",
      photo: "photo2.jpg",
    });
  })
  .then((user) => {
    console.log("Usuario creado:", user);
    return register.createUser({
      username: "user3",
      email: "user3@example.com",
      password: "password3",
      photo: "photo3.jpg",
    });
  })
  .then(() => {
    return register.read();
  })
  .then((allUsers) => {
    console.log("Todos los usuarios:", allUsers);
    return register.readById(1);
  })
  .then((userWithId1) => {
    console.log("Usuario con ID 1:", userWithId1);
    return register.readById(2);
  })
  .then((userWithId2) => {
    console.log("Usuario con ID 2:", userWithId2);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

class UserManager {
  static #users = [];
  constructor() {}
  createUser(data) {
    try {
      if (!data.title || !data.photo || !data.price || !data.stock) {
        throw new FatalError("Faltan argumentos. ERROR en la carga.");
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
        return user;
      }
    } catch (FatalError) {
      return FatalError.massage;
    }
  }
  read() {
    try {
      const allUsers = UserManager.#users;
      if (allUsers.length === 0) {
        throw new FatalError("No hay usuarios registrados");
      } else {
        return allUsers;
      }
    } catch (FatalError) {
      return FatalError.massage;
    }
  }
  readById(id) {
    try {
      const userFinder = UserManager.#users.find(
        (each) => each.id === Number(id)
      );
      if (userFinder) {
        return userFinder;
      } else {
        throw new FatalError("ID ingresado no es correcto. ERROR");
      }
    } catch (FatalError) {
      return FatalError.massage;
    }
  }
}

const register = new UserManager();
const user1 = register.createUser({
  username: "user1",
  email: "user1@example.com",
  password: "password1",
  photo: "photo1.jpg",
});

const user2 = register.createUser({
  username: "user2",
  email: "user2@example.com",
  password: "password2",
  photo: "photo2.jpg",
});

const user3 = register.createUser({
  username: "user3",
  email: "user3@example.com",
  password: "password3",
  photo: "photo3.jpg",
});
const allUsers = register.read();
console.log("All users:", allUsers);
const userWithId1 = register.readById(1);
console.log("User with ID 1:", userWithId1);
const userWithId2 = register.readById(2);
console.log("User with ID 2:", userWithId2);

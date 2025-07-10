/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');  
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : undefined;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    let url = `${this.URL}/current`
    let options = createOptions(url, 'GET', undefined, (err, response) => {
      if (response && response.success) {
        this.setCurrent(response.user);
      } else {
        this.unsetCurrent();
      }

      callback(err, response);
    });
    createRequest(options);
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
      if (data.email && data.password) {
      let url = `${this.URL}/login`;
      let options = createOptions(url, 'POST', data, (err, response) => {
        if (response && response.success) {
          this.setCurrent(response.user);
        }

        callback(err, response);
      })

      createRequest(options);

    } else {
      console.log('Одно из обязательных полей не заполнено')
    }
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
        if (data.name && data.email && data.password) {
      let url = `${this.URL}/register`;
      let options = createOptions(url, 'POST', data, (err, response) => {
        if (response && response.success) {
          this.setCurrent(response.user);
        }

        callback(err, response);
      });

      createRequest(options);
    } else {
      console.log('Одно из обязательных полей не заполнено');
    }
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
     const url = `${this.URL}/logout`;
    const options = createOptions(url, 'POST', undefined, (err, response) => {
      if (response.success) {
        this.unsetCurrent();
      }

      callback(err, response);
    });
    createRequest(options);
  }
}

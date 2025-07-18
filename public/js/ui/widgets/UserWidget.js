/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы
 * */

class UserWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
      if (!element) {
      throw new Error ('В конструктор UserWidget был передан пустой элемент');
    } else {
      this.element = element;
    }
  }

  /**
   * Получает информацию о текущем пользователе
   * с помощью User.current()
   * Если пользователь авторизован,
   * в элемент .user-name устанавливает имя
   * авторизованного пользователя
   * */
  update(){
    User.fetch( (err, response) => {
      if (response.success) {
        const userName = document.querySelector('.user-name');
        userName.textContent = response.user.name || `Имя пользователя не установлено`;
      } else {
        console.log(`UserWidget: Не удалось установить информацию о пользователе. Ошибка: ${err}`);
      }
    })
  }
}

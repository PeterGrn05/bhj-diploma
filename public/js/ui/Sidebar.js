/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const burgerMenu = document.querySelector('.sidebar-toggle');
    burgerMenu.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const signUpButton = document.querySelector('.menu-item_register');

    signUpButton.addEventListener('click', (e) => {
      e.preventDefault();
      let modal = App.getModal( 'register' );
      modal.open();
    });

    const loginButton = document.querySelector('.menu-item_login');

    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      let modal = App.getModal( 'login' );
      modal.open();
    });

    const logoutButton = document.querySelector('.menu-item_logout');

    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      User.logout( (err, response) => {
        if (response.success) {
          App.setState( 'init' );
        } else {
          console.log(`Ошибка при выходе: ${err}`);
        }
      });
    });
  }
}
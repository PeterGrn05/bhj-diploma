/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
     if (!element) {
      throw new Error ('В конструктор AccountsWidget был передан пустой элемент');
    } else {
      this.element = element;
      this.update();
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountButton = document.querySelector('.create-account');

    createAccountButton.addEventListener('click', () => {
      const currentModal = App.getModal( 'createAccount' );
      currentModal.open();
    });

    const accounts = Array.from(this.element.querySelectorAll('.account'));
    accounts.forEach(account => {
      account.addEventListener('click', () => {
        this.onSelectAccount(account);
      })
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
        if (User.current()) {
      Account.list(null, (err, response) => {
        if (response.success) {

          this.clear();

          response.data.forEach(el => {
            this.renderItem(el);
          });

          this.registerEvents();
        } else {
          console.log(`Пользователь авторизован, но при получении данных о счетах произошла ошибка: ${err}`);
        }
      });
    } else {
      console.log('Пользователь не авторизован, невозможно обновить счета');
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll('.account');
    Array.from(accounts).forEach(account => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
     const parentElement = element.closest('.accounts-panel');
    const activeItem = parentElement.querySelector('.active');

    if (activeItem) {
      activeItem.classList.remove('active');
    }

    element.classList.add('active');
    const elementId = element.dataset.id;
    App.showPage('transactions', { account_id: elementId });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const account = document.createElement('li');
    account.classList.add('account');
    account.dataset.id = item.id;

    const accountName = document.createElement('span');
    accountName.textContent = item.name;
    const accountSum = document.createElement('span');
    accountSum.textContent = `${item.sum} ₽`;
    const wrapper = document.createElement('a');
    wrapper.href = '#'

    wrapper.append(accountName, ' / ', accountSum);
    account.appendChild(wrapper);
    return account;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const html = this.getAccountHTML(data);
    this.element.append(html);
  }
}

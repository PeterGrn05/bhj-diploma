/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('В этом конструкторе был передан пустой элемент');
    }
    this.element = element;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    } else {
      this.render();
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
     const removeAccountButton = this.element.querySelector('.remove-account');
    removeAccountButton.addEventListener('click', () => {
      this.removeAccount();
    });

    const removeTxButtons = Array.from(this.element.querySelectorAll('.transaction__remove'));

    removeTxButtons.forEach(removeTxButton => {
      removeTxButton.addEventListener('click', () => {
        const txId = removeTxButton.dataset.id;
        this.removeTransaction( txId );
      })
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
      if (!this.lastOptions) {
        return;
    }

    const result = confirm('Вы действительно хотите удалить счёт?');
    if (result) {
      const accountId = this.lastOptions.account_id;
      Account.remove({ id: accountId }, (err, response) => {
        if (response && response.success) {
          App.updateWidgets();
          App.updateForms();
        } else {
          console.log(`При удалении счета произошла ошибка: ${err}`);
        }
     }); 
    } else {
      return
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const result = confirm('Вы действительно хотите удалить эту транзакцию?');

    if (result) {
      Transaction.remove({ id: id }, (err, response) => {
        if (response && response.success) {
          this.update();
          App.updateWidgets();
        } else {
          console.log(`При удалении транзакции произошла ошибка: ${err}`);
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      return
    }

    this.lastOptions = options;
    const accountId = options.account_id;

    Account.get(accountId, (err, response) => {
      if (response && response.success) {
        const accountName = response.data.name;
        this.renderTitle(accountName);
      } else {
        console.log(`Не удалось получить сведения о счете, ошибка: ${err}`);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      } else {
        console.log(`Не удалось получить сведения о транзакциях, ошибка: ${err}`);
      }
    })
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions(null);
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const contentTitle = this.element.querySelector('.content-title');
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля' , 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

    return `${day} ${months[month]} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
let transactionEl = document.createElement('div');
    transactionEl.classList.add('transaction');
    transactionEl.classList.add(`transaction_${item.type}`);
    transactionEl.classList.add('row');

    transactionEl.innerHTML = `<div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>`

    return transactionEl;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    content.innerHTML = '';

    data.forEach(item => {
      const itemHTML = this.getTransactionHTML(item);
      content.insertBefore(itemHTML, content.firstChild);
    });

    this.registerEvents();
  }
}
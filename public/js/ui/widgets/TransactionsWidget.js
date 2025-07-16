/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
     if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error(`TransactionsWidget: в конструктор передан пустой элемент`);
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeButton = this.element.querySelector('.create-income-button');
    const expenseButton = this.element.querySelector('.create-expense-button');

    if (!incomeButton || !expenseButton) {
      throw new Error('TransactionsWidget: одна или обе кнопки не найдены');
    }

    incomeButton.addEventListener('click', () => {
      const currentModal = App.getModal('newIncome');
      currentModal.open();
    });
    expenseButton.addEventListener('click', () => {
      const currentModal = App.getModal('newExpense');
      currentModal.open();
    });
  }
}

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
       Account.list(null, (err, response)=> {
      if (response && response.success) {
        const accounts = Array.from(response.data);
        const select = this.element.querySelector('.accounts-select');
        select.innerHTML = '';

        accounts.forEach(el => {
          const option = document.createElement('option');
          option.value = el.id;
          option.textContent = el.name;

          select.append(option);
        })

      } else if (err) {
        throw new Error(`При получении данных произошла ошибка: ${err}`);
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        
        const formId = this.element.id;
        let currentModal;

        if (formId === 'new-income-form') {
          currentModal = App.getModal('newIncome');
        } else if (formId === 'new-expense-form') {
          currentModal = App.getModal('newExpense');
        }

        if (currentModal) {
          currentModal.close();
        } else {
          console.log('Не удалось найти модальное окно для закрытия');
        }

        App.update();
      } else {
        throw new Error(`При создании транзакции произошла ошибка: ${err}`);
      }
    })
  }
}
// Находим нужные элементы на странице
const form = document.getElementById('contact-form');
const contactsList = document.getElementById('contacts-list');
const submitBtn = document.getElementById('submit-btn'); // Кнопка отправки
const idInput = document.getElementById('contact-id'); // Наше скрытое поле для ID

let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

function renderContacts() {
  contactsList.innerHTML = ''; 
  
  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${contact.firstName} ${contact.lastName}</strong><br>
        📞 ${contact.phone} <br>
        ✉️ ${contact.email}
      </div>
      <div class="actions">
        <!-- Кнопкам даем атрибут data-id, чтобы знать, какой контакт они меняют -->
        <button class="edit-btn" data-id="${contact.id}">Редагувати</button>
        <button class="delete-btn" data-id="${contact.id}">Видалити</button>
      </div>
    `;
    contactsList.appendChild(li); 
  });
}

// === 1. ДОБАВЛЕНИЕ ИЛИ СОХРАНЕНИЕ ИЗМЕНЕНИЙ ===
form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  const currentId = idInput.value; // Проверяем, есть ли ID в скрытом поле

  if (currentId) {
    // ЕСЛИ ID ЕСТЬ — ЗНАЧИТ МЫ РЕДАКТИРУЕМ КОНТАКТ
    // Находим под каким номером (индексом) этот контакт лежит в массиве
    const index = contacts.findIndex(c => c.id === currentId);
    
    // Обновляем данные этого контакта
    contacts[index] = {
      id: currentId,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
    };
    
    // Возвращаем форму в обычный режим (очищаем скрытое поле и меняем текст кнопки обратно)
    idInput.value = '';
    submitBtn.textContent = 'Додати контакт';
    
  } else {
    // ЕСЛИ ID НЕТ — ЗНАЧИТ МЫ СОЗДАЕМ НОВЫЙ КОНТАКТ (старый код)
    const newContact = {
      id: Date.now().toString(),
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
    };
    contacts.push(newContact);
  }

  // Сохраняем массив в память и перерисовываем
  localStorage.setItem('contacts', JSON.stringify(contacts));
  renderContacts();
  form.reset(); 
});


// === 2. ОБРАБОТКА КЛИКОВ "УДАЛИТЬ" И "РЕДАКТИРОВАТЬ" ===
// Мы вешаем один слушатель кликов на весь список контактов
contactsList.addEventListener('click', (e) => {
  
  // ЕСЛИ КЛИКНУЛИ ПО КНОПКЕ "ВИДАЛИТИ"
  if (e.target.classList.contains('delete-btn')) {
    const idToDelete = e.target.dataset.id; // Берем ID из атрибута кнопки
    
    // Фильтруем массив: оставляем только те контакты, у которых ID НЕ РАВЕН удаляемому
    contacts = contacts.filter(contact => contact.id !== idToDelete);
    
    // Пересохраняем и перерисовываем
    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
  }

  // ЕСЛИ КЛИКНУЛИ ПО КНОПКЕ "РЕДАГУВАТИ"
  if (e.target.classList.contains('edit-btn')) {
    const idToEdit = e.target.dataset.id; 
    
    // Ищем нужный контакт в массиве
    const contactToEdit = contacts.find(contact => contact.id === idToEdit);

    // Заполняем инпуты в форме данными этого контакта
    document.getElementById('firstName').value = contactToEdit.firstName;
    document.getElementById('lastName').value = contactToEdit.lastName;
    document.getElementById('phone').value = contactToEdit.phone;
    document.getElementById('email').value = contactToEdit.email;

    // Прячем ID этого контакта в скрытое поле формы! 
    // Благодаря этому, при нажатии "submit", код поймет, что это старый контакт
    idInput.value = contactToEdit.id;
    
    // Меняем текст главной кнопки
    submitBtn.textContent = 'Зберегти зміни';
  }
});

// Запуск при старте
renderContacts();
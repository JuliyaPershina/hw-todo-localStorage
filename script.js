const inputTodo = document.getElementById('inputTodo');
const submitTodo = document.getElementById('submitTodo');

submitTodo.addEventListener('click', (e) => {
  e.preventDefault();
  const newChallenge = inputTodo.value.trim();
    const storageKey = localStorage.length + 1;
    
    if (newChallenge) {
        const challengeList = document.getElementById('listTodo');
  const newChallengeElement = document.createElement('li');
  correctListElement(newChallengeElement);
  newChallengeElement.textContent = newChallenge;
  getStorageInformation();

  // Додаємо новий елемент до списку
  challengeList.appendChild(newChallengeElement);
  localStorage.setItem(storageKey, newChallenge);
  inputTodo.value = '';
  getStorageInformation();
  rememberChallenges();
    }

  
});

const getStorageInformation = () => {
  const historyList = document.getElementById('historyList');
  historyList.textContent = '';

  for (let index = localStorage.length ; index >= 1; index--) {
    const newHistoryElement = document.createElement('li');
    newHistoryElement.textContent = localStorage[index];
    historyList.appendChild(newHistoryElement);
  }
};



function correctListElement(listElement) {
  listElement.addEventListener('click', (e) => {
    e.stopPropagation();

    const existingBtns = listElement.querySelectorAll('.btn');
    if (existingBtns.length) {
      existingBtns.forEach((btn) => btn.remove());
      return;
    }

    // Інакше — додаємо кнопки Видалити і Редагувати
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Видалити';
    deleteBtn.classList.add('btn');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редагувати';
    editBtn.classList.add('btn');

    const buttons = listElement.querySelectorAll('button'); // отримуємо всі кнопки в елементі

    const hasBtnCor = Array.from(buttons).some((btn) =>
      btn.classList.contains('btnCor')
    );

    if (!hasBtnCor) {
      listElement.append(deleteBtn, editBtn);
    }

    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
        listElement.remove();
        rememberChallenges()
    });

    editBtn.addEventListener('click', (event) => {
      event.stopPropagation();

      const oldText = listElement.firstChild.textContent.trim();

      // При переході в режим редагування видаляємо кнопки Видалити і Редагувати
      deleteBtn.remove();
      editBtn.remove();

      // Створюємо інпут для редагування
      const input = document.createElement('input');
      input.type = 'text';
      input.value = oldText;

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Зберегти';
      saveBtn.classList.add('btnCor');

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Відміна';
      cancelBtn.classList.add('btnCor');

      // Очищаємо текст, вставляємо інпут
      listElement.firstChild.textContent = '';
      listElement.insertBefore(input, listElement.firstChild);
      rememberChallenges()

      // Додаємо кнопки Зберегти і Відміна
        listElement.append(saveBtn, cancelBtn);

      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (input.value.trim() !== oldText && input.value.trim() !== "") {
          const newEl = input.value.trim();
          localStorage.setItem(`${localStorage.length + 1}`, newEl);
          getStorageInformation();
        }
        const newText = input.value.trim() || oldText;
        
        rememberChallenges();
        input.remove();
        saveBtn.remove();
        cancelBtn.remove();

          listElement.firstChild.textContent = newText;
          rememberChallenges()

        // Повертаємо кнопки Видалити і Редагувати
        listElement.append(deleteBtn, editBtn);
      });

      cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        input.remove();
        saveBtn.remove();
        cancelBtn.remove();

        listElement.firstChild.textContent = oldText;

        // Повертаємо кнопки Видалити і Редагувати
        listElement.append(deleteBtn, editBtn);
      });
    });
  });
}



const toBuildOldList = () => {
  const oldListString = localStorage.getItem('oldList');

  if (!oldListString) {
    return [];
  }

  try {
    const oldList = JSON.parse(oldListString); // Перетворюємо JSON-рядок у масив
    console.log(oldList); 
    oldList.forEach((challenge) => {
      const oldlistItem = document.createElement('li');
        oldlistItem.textContent = challenge;
        correctListElement(document.getElementById('listTodo').appendChild(oldlistItem));
    });
    return oldList;
  } catch (error) {
    console.error('Помилка при парсингу старого списку:', error);
    return [];
  }
};

function rememberChallenges() {

  const masChallenges = [];
  const listTodo = document.getElementById('listTodo');

  const items = listTodo.querySelectorAll('li');
  items.forEach((li) => {
    const text = li.firstChild.textContent.trim();
    masChallenges.push(text);
  });

  localStorage.setItem('oldList', JSON.stringify(masChallenges));
};

toBuildOldList();
getStorageInformation();



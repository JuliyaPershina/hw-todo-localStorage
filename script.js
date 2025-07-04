const inputTodo = document.getElementById('inputTodo');
const submitTodo = document.getElementById('submitTodo');

// Обробляємо кнопку "Зберегти"
submitTodo.addEventListener('click', (e) => {
  e.preventDefault();
  const newTask = inputTodo.value.trim();
  if (!newTask) return;

  const taskList = document.getElementById('listTodo');
  const newTaskElement = document.createElement('li');
  newTaskElement.textContent = newTask;

  correctListElement(newTaskElement);
  taskList.appendChild(newTaskElement);

  // Додати до масиву tasks у localStorage
  const tasks = getTasksArray();

  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Додати до історії
  localStorage.setItem(`${localStorage.length + 1}`, `Додано: ${newTask}`);

  inputTodo.value = '';

  updateHistoryList();
});

function getTasksArray() {
  const tasksStr = localStorage.getItem('tasks');
  try {
    return tasksStr ? JSON.parse(tasksStr) : [];
  } catch (e) {
    return [];
  }
}

function updateTaskList() {
  const tasks = getTasksArray();
  const taskList = document.getElementById('listTodo');
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const taskEl = document.createElement('li');
    taskEl.textContent = task;
    correctListElement(taskEl);
    taskList.appendChild(taskEl);
  });
}

function updateHistoryList() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';

  const keys = Object.keys(localStorage)
    .filter((key) => !isNaN(key))
    .sort((a, b) => Number(a) - Number(b));

  keys.forEach((key) => {
    const item = document.createElement('li');
    item.textContent = localStorage.getItem(key);
    historyList.appendChild(item);
  });
}

function correctListElement(listElement) {
  listElement.addEventListener('click', (e) => {
    e.stopPropagation();

    const existingBtns = listElement.querySelectorAll('.btn');
    if (existingBtns.length) {
      existingBtns.forEach((btn) => btn.remove());
      return;
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Видалити';
    deleteBtn.classList.add('btn');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редагувати';
    editBtn.classList.add('btn');

    listElement.append(deleteBtn, editBtn);

    deleteBtn.addEventListener('click', () => {
      const textToDelete = listElement.firstChild.textContent.trim();

      // Оновлюємо масив
      let tasks = getTasksArray();
      tasks = tasks.filter((t) => t !== textToDelete);
      localStorage.setItem('tasks', JSON.stringify(tasks));

      // Додаємо до історії
      localStorage.setItem(
        `${localStorage.length + 1}`,
        `Видалено: ${textToDelete}`
      );

      listElement.remove();
      updateHistoryList();
    });

    editBtn.addEventListener('click', () => {
      const oldText = listElement.firstChild.textContent.trim();

      deleteBtn.remove();
      editBtn.remove();

      const input = document.createElement('input');
      input.type = 'text';
      input.value = oldText;

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Зберегти';
      saveBtn.classList.add('btnCor');

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Відміна';
      cancelBtn.classList.add('btnCor');

      listElement.firstChild.textContent = '';
      listElement.insertBefore(input, listElement.firstChild);
      listElement.append(saveBtn, cancelBtn);

      saveBtn.addEventListener('click', () => {
        const newText = input.value.trim();
        if (!newText) return;

        // Оновлюємо масив
        let tasks = getTasksArray();
        const index = tasks.indexOf(oldText);
        if (index !== -1) tasks[index] = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Історія
        localStorage.setItem(
          `${localStorage.length + 1}`,
          `Редаговано: ${oldText} → ${newText}`
        );

        input.remove();
        saveBtn.remove();
        cancelBtn.remove();

        listElement.firstChild.textContent = newText;
        listElement.append(deleteBtn, editBtn);

        updateHistoryList();
      });

      cancelBtn.addEventListener('click', () => {
        input.remove();
        saveBtn.remove();
        cancelBtn.remove();

        listElement.firstChild.textContent = oldText;
        listElement.append(deleteBtn, editBtn);
      });
    });
  });
}

// Після завантаження сторінки
updateTaskList();
updateHistoryList();

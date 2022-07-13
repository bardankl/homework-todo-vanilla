const todosContainer = document.querySelector("[data-entity='todos-container']");
const todoEditor = document.querySelector("[data-entity='todo-editor']");
const todoEditorTitle = todoEditor.querySelector("[data-entity='todo-editor-title']");
const todoEditorDescription = todoEditor.querySelector("[data-entity='todo-editor-description']");
const todoEditorSubmitBtn = todoEditor.querySelector("[data-entity='todo-editor-submit-btn']");
const todoTemplate = document.querySelector('#todo');

const todos = [
  {
    id: crypto.randomUUID(),
    title: 'Trash',
    description: 'I need to take out the trash today',
    completed: true,
    editing: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Vet',
    description: 'I need to take my dog to the vet tomorrow',
    completed: false,
    editing: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Exam',
    description: 'I need to study for the history exam tomorrow',
    completed: true,
    editing: false,
  },
];

for (const todo of todos) {
  appendToDom(todo);
}

let selectedTodoId = null;

todoEditorTitle.addEventListener('input', handleInputChange);
todoEditorDescription.addEventListener('input', handleInputChange);
todoEditor.addEventListener('submit', handleTodoSubmit);

function handleInputChange() {
  todoEditorSubmitBtn.disabled = isFormDisabled();
}

function handleTodoSubmit(e) {
  e.preventDefault();

  const formData = new FormData(todoEditor);
  const title = formData.get('title').trim();
  const description = formData.get('description').trim();

  if (!selectedTodoId) {
    const id = crypto.randomUUID();
    addTodo(title, description, id);
    const addedTodo = todos.find((todo) => todo.id === id);
    appendToDom(addedTodo);
  } else {
    const editedTodo = todos.find((todo) => todo.id === selectedTodoId);
    editedTodo.title = title;
    editedTodo.description = description;
    const todoNode = todosContainer.querySelector(`[data-id="${selectedTodoId}"]`);
    selectedTodoId = null;
    updateTodoNode(todoNode, editedTodo.title, editedTodo.description);
    todoEditorSubmitBtn.textContent = 'create';
  }

  resetForm();
}

function isFormDisabled() {
  const titleValue = todoEditorTitle.value.trim();
  const descriptionValue = todoEditorDescription.value.trim();
  return titleValue.length < 1 || descriptionValue.length < 1;
}

function resetForm() {
  todoEditorTitle.value = '';
  todoEditorDescription.value = '';
  todoEditorSubmitBtn.disabled = isFormDisabled();
}

function appendToDom(todo) {
  const node = createNode(todo);
  todosContainer.appendChild(node);
}

function addTodo(title, description, id) {
  if (!title || !description) {
    return;
  }

  todos.push({
    id,
    title,
    description,
    completed: false,
    editing: false,
  });
}

function toggleTodoComplete(id) {
  const selectedTodo = todos.find((todo) => todo.id === id);
  const isCompleted = selectedTodo.completed;
  selectedTodo.completed = !isCompleted;

  let completeBtnNode = todosContainer
    .querySelector(`[data-id="${id}"]`)
    .querySelector("[data-entity='todo-complete-btn']");

  let editBtnNode = todosContainer.querySelector(`[data-id="${id}"]`).querySelector("[data-entity='todo-edit-btn']");
  let cardNode = completeBtnNode.closest("[data-entity='todo-card']");

  if (isCompleted) {
    completeBtnNode.textContent = 'complete';
    cardNode.classList.remove('after:grid', 'border-emerald-600');
    cardNode.classList.add('after:hidden', 'border-sky-600');
    editBtnNode.disabled = false;
  } else {
    completeBtnNode.textContent = 'uncomplete';
    cardNode.classList.add(
      'after:grid',
      'border-emerald-600',
      'after:content-["completed"]',
      'after:bg-emerald-500/80',
    );
    cardNode.classList.remove('after:hidden', 'border-sky-600', 'after:content-["editing"]');
    editBtnNode.disabled = true;
  }
}

function toggleTodoEdit(id) {
  if (selectedTodoId) {
    const previouslySelectedTodo = todos.find((todo) => (todo.editing = selectedTodoId));
    previouslySelectedTodo.editing = false;
    const previouslyEditedNode = todosContainer.querySelector(`[data-id="${selectedTodoId}"]`);
    previouslyEditedNode.querySelector(`[data-entity="todo-complete-btn"]`).disabled = false;
    previouslyEditedNode.classList.remove("after:content-['editing']", 'after:bg-sky-500/80', 'after:grid');
    previouslyEditedNode.classList.add('after:hidden');
  }

  const selectedTodo = todos.find((todo) => todo.id === id);
  selectedTodoId = id;

  const isEditing = selectedTodo.editing;
  selectedTodo.editing = !isEditing;

  let completeBtnNode = todosContainer
    .querySelector(`[data-id="${id}"]`)
    .querySelector("[data-entity='todo-complete-btn']");

  let cardNode = completeBtnNode.closest("[data-entity='todo-card']");

  cardNode.classList.add('after:grid', 'after:content-["editing"]', 'after:bg-sky-500/80');
  cardNode.classList.remove('after:hidden');
  completeBtnNode.disabled = true;

  todoEditorTitle.value = selectedTodo.title;
  todoEditorDescription.value = selectedTodo.description;
  todoEditorSubmitBtn.textContent = 'save';
  todoEditorSubmitBtn.disabled = isFormDisabled();
}

function createNode(todo) {
  const todoNode = todoTemplate.content.cloneNode(true);

  const card = todoNode.querySelector("[data-entity='todo-card']");
  const title = todoNode.querySelector("[data-entity='todo-title']");
  const description = todoNode.querySelector("[data-entity='todo-description']");
  const completeBtn = todoNode.querySelector("[data-entity='todo-complete-btn']");
  const editBtn = todoNode.querySelector("[data-entity='todo-edit-btn']");

  const completedClasslist = ['border-emerald-600', 'after:content-["completed"]', 'after:bg-emerald-500/80'];
  const editingClasslist = ['after:content-["editing"]', 'after:bg-sky-500/80'];

  if (todo.completed) {
    card.classList.add(...completedClasslist);
  } else {
    card.classList.add('border-sky-600');
  }

  if (todo.editing) {
    card.classList.add(...editingClasslist);
  }

  if (!todo.editing && !todo.completed) {
    card.classList.add('after:hidden');
  } else {
    card.classList.add('after:grid');
  }

  card.dataset.id = todo.id;
  title.textContent = todo.title;
  description.textContent = todo.description;
  completeBtn.textContent = todo.completed ? 'uncomplete' : 'complete';
  completeBtn.disabled = todo.editing ? true : false;
  editBtn.disabled = todo.completed ? true : false;

  completeBtn.addEventListener('click', toggleTodoComplete.bind(null, todo.id));
  editBtn.addEventListener('click', toggleTodoEdit.bind(null, todo.id));

  return todoNode;
}

function updateTodoNode(node, title, description) {
  node.classList.remove("after:content-['editing']", 'after:bg-sky-500/80', 'after:grid');
  node.classList.add('after:hidden');
  node.querySelector('[data-entity="todo-title"]').textContent = title;
  node.querySelector('[data-entity="todo-description"]').textContent = description;
  node.querySelector('[data-entity="todo-complete-btn"]').disabled = false;
}

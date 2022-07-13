const todosContainer = document.querySelector("[data-entity='todos-container']");
const todoEditor = document.querySelector("[data-entity='todo-editor']");
const todoEditorTitle = document.querySelector("[data-entity='todo-editor-title']");
const todoEditorDescription = document.querySelector("[data-entity='todo-editor-description']");
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
  const id = crypto.randomUUID();

  addTodo(title, description, id);
  const addedTodo = todos.find((todo) => todo.id === id);
  appendToDom(addedTodo);

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

  todosContainer.appendChild(todoNode);
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

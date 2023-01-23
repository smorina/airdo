
//variables to enable editing of items
let isEditing = false;
let itemBeingEdited;

// Get references to the form and the list and everything else
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const listNameInput = document.getElementById('list-name-input');
/*const listName = document.getElementById('list-name'); */
const clearAll = document.querySelector(".clear-btn");

//enable clear button & add functionality.
clearAll.classList.add("active");

clearAll.addEventListener('click', function (event) {
  /*  listName.innerHTML = ''; */
    listNameInput.value = '';
    todoList.innerHTML = '';
    location.hash = '';
    updateTodoListFromURL();
});

// get an array of todos and their state from the actual HTML list
function getTodoListState() {
    const todos = [];
    const list = document.getElementById('todo-list');
    for (let item of list.children) {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        todos.push({
            text: label.textContent,
            checked: checkbox.checked
        });
    }
    return todos;
}

function encodeTodoListState(todos) {
    return encodeURIComponent(JSON.stringify(todos));
}

function updateUrlState(newTodo) {
    // update the URL hash with the new state

    const todoList = { name: listNameInput.value, items: getTodoListState() };

    // if a newTodo was passed add it to the list

    if (newTodo !== undefined) todoList.items.push({ text: newTodo, checked: '' })

    const encoded = encodeTodoListState(todoList);
    window.location.hash = encoded;
}


function updateTodoListFromURL() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        try {
            const decoded = decodeURIComponent(hash);
            const todoList = JSON.parse(decoded);
            // set the name of the list
            listNameInput.value = todoList.name;
           /* listName.textContent = todoList.name; */
            document.title = 'TODO: ' + todoList.name;
            // clear the list
            const list = document.getElementById('todo-list');

            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }

            // add items back to the list
            todoList.items.forEach(item => {
                const todoItem = document.createElement('li');
                todoItem.className = 'task';

                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.checked = item.checked;

                const todoText = document.createElement('p');
                todoText.innerHTML = item.text;
                todoText.className = 'completed';

                const controls = document.createElement('span');
                controls.className = 'todoSettings'
                const removeInner = document.createElement('a');
                removeInner.innerHTML = '<i class="uil uil-trash"></i>';

                const editInner = document.createElement('a');
                editInner.innerHTML = '<i class="uil uil-pen"></i>';



                removeInner.setAttribute('href', '#');
                removeInner.setAttribute('class', 'remove-todo');



                editInner.setAttribute('href', '#');
                editInner.setAttribute('class', 'remove-todo');



                // Append the checkbox, label and remove link to the item

                const todoLabel = document.createElement('label');
                todoLabel.appendChild(checkbox);
                todoLabel.appendChild(todoText);

                controls.appendChild(editInner);
                controls.appendChild(removeInner);

                todoItem.appendChild(todoLabel);
                todoItem.appendChild(controls);

                // Append the new item to the list
                list.appendChild(todoItem);

                // Add event listener for remove link
                removeInner.addEventListener('click', function (event) {
                    event.preventDefault();
                    list.removeChild(todoItem);
                    updateUrlState();
                });

                editInner.addEventListener('click', function (event) {
                    const taskText = todoText.innerHTML;
                    todoInput.value = taskText;
                    todoInput.focus();
                    //taskInput.classList.add("active");
                    isEditing = true;
                    itemBeingEdited = todoText;
                    // addListenerForNewItems();
                });

                addEventListenerToCheckboxes();

            });
        } catch (error) {
            console.error(error);
        }
    }
    //make the todo list scrollable when it gets to a larger size
    todoList.offsetHeight >= 300 ? todoList.classList.add("overflow") : todoList.classList.remove("overflow");

}

// add event listener to checkboxes
function addEventListenerToCheckboxes(params) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
        checkbox.addEventListener('change', function (event) {
            updateUrlState();
        });
    }
}

function pageLoaded() {
    // get edit box submit ready
    addListenerForNewItems();

    // call the function on page load
    updateTodoListFromURL();

    // listen to hashchange events
    window.addEventListener('hashchange', updateTodoListFromURL);

    //Add event listener for changing the title
    listNameInput.addEventListener('input', function () {
        const newName = listNameInput.value;
       /* listName.textContent = newName; */
        document.title = 'TODO: ' + newName;
        updateUrlState();

    });
}

// Add event listener for the form submit
function addListenerForNewItems() {
    todoForm.addEventListener('submit', function (event) {
        event.preventDefault(); // To prevent form submit

        if (todoInput.value != '') {
            if (isEditing == false) {
                updateUrlState(todoInput.value);
                addEventListenerToCheckboxes();
            }
            else {
                itemBeingEdited.innerHTML = todoInput.value;
                isEditing = false;
                updateUrlState();

            }
            todoInput.value = "";
        }
    });
}


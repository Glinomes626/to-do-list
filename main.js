(function () {
    const createAppTitle = (title) => {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    const createTodoItemForm = () => {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        button.setAttribute('disabled', true);

        input.addEventListener('input', () => {
            button.removeAttribute('disabled');
        })

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.id = 'button-form';
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    const createTodoList = () => {
        let list = document.createElement('ul');
        list.classList.add('list-group');

        return list;
    }

    const createTodoItem = (name) => {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        const randomId = Math.random() * 20.56;
        item.id = randomId.toFixed(2);

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton, deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
            buttonGroup,
        };
    }

    const changeItemDone = (array, item) => {
        array.map(obj => {
            if (obj.id === item.id && obj.done === false) {
                obj.done = true;
            } else  if (obj.id === item.id && obj.done === true) {
                obj.done = false;
            }
        });
    }

    const completeTodoButton = (item, button) => {
        button.addEventListener('click', () => {
            todoArray = JSON.parse(localStorage.getItem(keyLocal));
            item.classList.toggle('list-group-item-success');
            changeItemDone(todoArray, item);

            localStorage.setItem(keyLocal, JSON.stringify(todoArray));
        });
    }

    const deleteTodoItem = (item, button) => {
        button.addEventListener('click', () => {
            if (confirm('Вы уверены?')) {
                todoArray = JSON.parse(localStorage.getItem(keyLocal));

                const newList = todoArray.filter(obj => obj.id !== item.id);

                localStorage.setItem(keyLocal, JSON.stringify(newList));

                item.remove();
            }
        });
    }

    function createTodoApp(container, title, keyLocal) {
        const todoAppTitle = createAppTitle(title);
        const todoItemForm = createTodoItemForm();
        const todoList = createTodoList();

        let todoArray = [];


        container.append(todoAppTitle, todoItemForm.form, todoList);

        if (localStorage.getItem(keyLocal)) {
            todoArray = JSON.parse(localStorage.getItem(keyLocal));

            for (const obj of todoArray) {
                const todoItem = createTodoItem(todoItemForm.input.value);

                todoItem.item.textContent = obj.name;
                todoItem.item.id = obj.id;

                if (obj.done == true) {
                    todoItem.item.classList.add('list-group-item-success');
                } else {
                    todoItem.item.classList.remove('list-group-item-success');
                }

                completeTodoButton(todoItem.item, todoItem.doneButton);
                deleteTodoItem(todoItem.item, todoItem.deleteButton);

                todoList.append(todoItem.item);
                todoItem.item.append(todoItem.buttonGroup);
            }
        }

        todoItemForm.form.addEventListener('submit', e => {
            e.preventDefault();

            const todoItem = createTodoItem(todoItemForm.input.value);

            if (!todoItemForm.input.value) {
                return;
            }

            completeTodoButton(todoItem.item, todoItem.doneButton);
            deleteTodoItem(todoItem.item, todoItem.deleteButton);

            let localStorageData = localStorage.getItem(keyLocal);

            if (localStorageData == null) {
                todoArray = [];
            } else {
                todoArray = JSON.parse(localStorageData);
            }

            const createItemObject = (array) => {
                const itemObject = {};
                itemObject.name = todoItemForm.input.value;
                itemObject.id = todoItem.item.id;
                itemObject.done = false;

                array.push(itemObject);
            }

            createItemObject(todoArray);

            localStorage.setItem(keyLocal, JSON.stringify(todoArray));

            todoList.append(todoItem.item);

            todoItemForm.input.value = '';
            todoItemForm.button.setAttribute('disabled', true);
        });
    }

    window.createTodoApp = createTodoApp;
})();

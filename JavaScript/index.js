const BACKEND_ROOT_URL = 'http://localhost:3001';
import { MyToDo } from "./Class/todo.js";

const MyToDoInstance = new MyToDo(BACKEND_ROOT_URL);

const list = document.querySelector('ul')
const input = document.querySelector('input')


input.disabled = false

const renderTask = (task) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-group-item')
    li.setAttribute('data-key', task.id)
    renderSpan(li, task.description);
    renderLink(li)
    list.append(li)
}

const renderSpan = (li, text) => {
    const span = document.createElement('span')
    span.textContent = text
    li.appendChild(span)
}

const renderLink = (li) => {
    const a = document.createElement('a')
    a.innerHTML = '<i class="bi bi-trash"></i>'
    a.setAttribute('style', 'float: right; cursor: pointer')
    a.addEventListener('click', (event) => {
        event.preventDefault();
        const taskId = li.getAttribute('data-key');
        deleteTask(taskId);
        li.remove();
    });
    li.appendChild(a);
}

const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/delete/${taskId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
};

const getTask = async () => {
    try {
        const response = await fetch(BACKEND_ROOT_URL);
        const json = await response.json();
        json.forEach(task => {
            renderTask(task)
        });
        input.disabled = false;
    } catch (error) {
        console.log("Error getting tasks from the server", error);
        alert('Failed to fetch tasks: ' + error.message);
    }
};

const saveTask = async (task) => {
    try {
        const json = JSON.stringify({ description: task });
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        });
        const result = await response.json();
        input.value = ''
        return result;
    } catch (error) {
        console.log("Error saving task to the server", error);
        alert('Failed to save task: ' + error.message);
    }
};

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            saveTask(task).then((json) => {
                renderTask(json);
                input.value = '';
            }).catch((error) => {
                console.log("Error saving task to the server", error);
                alert('Failed to save task: ' + error.message);
            });
        }
    }
});

getTask();

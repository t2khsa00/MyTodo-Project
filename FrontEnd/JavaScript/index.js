const BACKEND_ROOT_URL = 'http://localhost:3001';
import { MyToDo } from "./Class/todo.js";

const MyToDoInstance = new MyToDo(BACKEND_ROOT_URL);

const list = document.querySelector('ul')
const input = document.querySelector('input')


input.disabled = false

const renderTask = (task) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-group-item')
    li.setAttribute('data-key', task.getId().toString())
    renderSpan(li, task.getText());
    renderLink(li, task.getId())
    list.append(li)
}

const renderSpan = (li, text) => {
    const span = document.createElement('span')
    span.innerHTML = text
    li.appendChild(span)
}

const renderLink = (li, id) => {
    const a = li.appendChild(document.createElement('a'));
    a.innerHTML = '<i class="bi bi-trash"></i>';
    a.setAttribute('style', 'float:right; cursor : pointer');
    a.addEventListener('click', (event) => {
        MyToDoInstance.removeTask(id).then((removed_id) => {
            const li_to_remove = document.querySelector(`[data-key='${removed_id}']`);
            if(li_to_remove){
                list.removeChild(li_to_remove);
            }
        }).catch((error) => {
            alert(error);
        });
    });
}


const getTasks = async () => {
    MyToDoInstance.getTasks().then((tasks) => { 
        tasks.forEach(task => {
            renderTask(task);
        });
    }).catch((error) => {     
        alert(error);
    })
}

const saveTask = async (task) => {
    try {
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description: task})
        });
        return response.json();
    } catch (error) {
        alert('Error saving task' + error.message);
    }
}

input.addEventListener('keypress', (event) => {
    if(event.key === 'Enter'){
        event.preventDefault();
        const task = input.value.trim();
        if(task !== ''){
            MyToDoInstance.addTask(task).then((task) => {
                renderTask(task);
                input.value = '';
                input.focus();
            });
        }
    }
});

getTasks();
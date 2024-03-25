import { tasks } from "./task.js";

class MyToDo {
    #task = [];
    #backend_url = '';
    
    constructor(url) {
        this.#backend_url = url;
    }

    getTasks = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(this.#backend_url);
                const json = await response.json();
                this.#readJson(json);
                resolve(this.#task);
            } catch(error) {
                reject(error);
            }
        });
    }
    addTask = (text) => {
        return new Promise(async (resolve, reject) => {
            try {
                const json = JSON.stringify({description: text});
                const response = await fetch(this.#backend_url + '/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: json
                });
                const task = await response.json();
                const newTask = this.#addToArray(task.id,text);
                resolve(newTask);
            } catch(error) {
                reject(error);
            }
        });
    }
    removeTask = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(this.#backend_url + '/delete/' + id, {
                    method: 'DELETE'
                });
                this.#removeFromArray(id);
                resolve();
            } catch(error) {
                reject(error);
            }
        });
    }

    #readJson = (taskAsJson) => {
        taskAsJson.forEach(node => {
            const task = new tasks(node.id, node.description);
            this.#task.push(task);
        });
    }
    #addToArray = (id,text) => {
        const task = new tasks(id,text);
        this.#task.push(task);
        return task
    }
    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#task.filter(task => task.getId() !== id);
        this.#task = arrayWithoutRemoved;
    }
}


export { MyToDo };


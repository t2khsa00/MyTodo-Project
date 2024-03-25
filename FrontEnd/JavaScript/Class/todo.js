import { tasks } from "./task.js";

class MyToDo {
    #task = [];
    #backend_url = '';
    
    constructor(url) {
        this.#backend_url = url;
    }

    getTasks = async () => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url)
            .then((response) => response.json())
            .then((json) => {
                this.#readJson(json);
                resolve(this.#task);
            }, (error) => {
                reject(error);
            });
        });
       
    }

    addTask = async (text) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url + '/new', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({description: text})
            })
            .then((response) => response.json())
            .then((json) => {
                resolve(this.#addToArray(json.id, text));
            }, (error) => {
                reject(error);
            });
        });
    }

   removeTask = async (id) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id);
                resolve(json.id);
            }, (error) => {
                reject(error);
            });
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
        this.#task = this.#task.filter(task => task.id !== id);
    }
}


export { MyToDo };


// Task
    // Methods
        // delete
        // copy
        // cut
        // paste
        // edit
        // expand
        // sortSubtasks
    // Properties
        // due
        // title
        // description
        // priority
        // notes
        // progress
        // useProgressFromSubtasks
        // subtasks
        // expanded

// Menu (?)

// Top-level array of tasks

// DOM module

class Task {
    title;
    due;
    description;
    progress;
    notes;
    id;
    currentlyEditing;
    useProgressFromSubtasks;
    subtaskList;
    supertaskList;
    expanded;
    static lastId = -1;

    constructor(_title, _due, _description, _progress, _notes, _supertask,
            _isClone) {
        this.title = _title || "";
        this.due = _due || "";
        this.description = _description || "";
        this.progress = _progress || "";
        this.notes = _notes || "";

        // Tasks that live in the copy buffer have no ID to ensure that pasted
        // tasks' IDs are contiguous without having to decrement Task.lastId.
        if (!_isClone) {
            this.assignNewId();
        } else {
            this.id = -1;
        }

        this.currentlyEditing = "";
        this.subtaskList = new TaskList();
        this.expanded = true;
        this.useProgressFromSubtasks = true;

        if (_supertask) {
            _supertask.subtaskList.add(this);
            this.supertaskList = _supertask.subtaskList;
        } else {
            this.supertaskList = null;
        }
        // Place DOM object in supertask or root array
    }

    clone(_recursive) {
        var cloned = new Task(this.title, this.due, this.description, 
            this.progress, this.notes, this.supertask, true);
        cloned.expanded = false;
        cloned.useProgressFromSubtasks = this.useProgressFromSubtasks;
        
        if (_recursive) {
            for (let i = 0; i < this.subtaskList.tasks.length; i++) {
                cloned.subtaskList.add(this.subtaskList.tasks[i].clone(_recursive));
            }
        }

        return cloned;
    }

    editTitle() {

    }

    editDue() {

    }

    editDescription() {

    }

    editProgress() {

    }

    editNotes() {

    }

    delete() {
        if (this.supertaskList) {
            return this.supertaskList.removeId(this.id);
        }

        return false;
    }

    log() {
        logger.logTask(this);
    }

    assignNewId() {
        this.id = Task.generateId();
    }

    assignNewIdRecursive() {
        this.assignNewId();

        for (let i = 0; i < this.subtaskList.tasks.length; i++) {
            this.subtaskList.tasks[i].assignNewIdRecursive();
        }
    }

    static generateId() {
        return ++Task.lastId;
    }
}

class TaskList {
    tasks;

    constructor(_subtasks) {
        this.tasks = _subtasks || [];
    }

    sort() {

    }

    add(_task, _idx) {
        if (_idx == null) {
            _idx = this.tasks.length;
        }

        this.tasks.splice(_idx, 0, _task);
        _task.supertaskList = this;
    }

    getTaskIdx(_task) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == _task.id) {
                return i;
            }
        }

        return -1;
    }

    removeId(_id) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == _id) {
                return this.removeIdx(i);
            }
        }

        return false;
    }

    removeIdx(_idx) {
        this.tasks[_idx].supertaskList = null;
        this.tasks.splice(_idx, 1);

        return true;
    }

    hasTasks() {
        return this.tasks.length >= 1;
    }
}

let logger = (function() {
    let logTask = function(_task, _prepend) {
        if (!_prepend) _prepend = "";
        console.log(_prepend + "----------------");
        console.log(_prepend + "Title: " + _task.title);
        console.log(_prepend + "Due: " + _task.due);
        console.log(_prepend + "Description: " + _task.description);
        console.log(_prepend + "Progress: " + _task.progress);
        console.log(_prepend + "Notes:  " + _task.notes);
        console.log(_prepend + "ID: " + _task.id);
        
        if (_task.subtaskList.hasTasks()) {
            console.log(_prepend + _task.subtaskList.tasks.length + 
                " subtask" + (_task.subtaskList.tasks.length != 1 ? "s:" : ":"));

            _task.subtaskList.tasks.forEach(_elem => {
                logTask(_elem, _prepend + "*   ");
             });
        }
    };

    return {
        logTask
    };
})();

let copier = (function() {
    this.buffer;

    let copy = function(_task, _recursive) {
        this.buffer = _task.clone(_recursive);
    }

    let cut = function(_task, _recursive) {
        this.copy(_task, _recursive);

        if (!_recursive) {
            let insertIdx = _task.supertaskList.getTaskIdx(_task);

            for (let i = 0; i < _task.subtaskList.tasks.length; i++) {
                _task.supertaskList.add(_task.subtaskList.tasks[i], insertIdx);
            }
        }

        _task.delete();
    }

    let paste = function(_taskList) {
        if (this.buffer) {
            let cloned = this.buffer.clone(true);
            cloned.assignNewIdRecursive();
            _taskList.add(cloned);

            return true;
        }

        return false;
    }

    return {
        copy,
        cut,
        paste
    }
})();

let taskList = new TaskList([ new Task("Test Task") ]);
taskList.tasks[0].subtaskList.add(new Task("Another task"));
taskList.tasks[0].subtaskList.tasks[0].subtaskList.add(new Task("Fourth task"));
taskList.tasks[0].subtaskList.tasks[0].subtaskList.tasks[0].subtaskList.add(new Task("Fifth task"));
taskList.tasks[0].subtaskList.tasks[0].subtaskList.tasks[0].subtaskList.add(new Task("Sixth task"));
taskList.tasks[0].subtaskList.add(new Task("A third task"));
//topLevelTasks[0].subtaskList.removeIdx(0);
//topLevelTasks[0].subtaskList.removeId(1);
//copier.copy(taskList.tasks[0].subtaskList.tasks[0], true);
copier.copy(taskList.tasks[0].subtaskList.tasks[0], false);
//copier.cut(taskList.tasks[0].subtaskList.tasks[0], false);
//copier.cut(taskList.tasks[0].subtaskList.tasks[0], true);
copier.paste(taskList);
copier.paste(taskList);

taskList.tasks.forEach(_elem => {
    _elem.log();
});
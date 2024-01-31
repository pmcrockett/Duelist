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

    constructor(_title, _due, _description, _progress, _notes, _supertask) {
        this.title = _title || "";
        this.due = _due || "";
        this.description = _description || "";
        this.progress = _progress || "";
        this.notes = _notes || "";
        this.id = Task.generateId();
        this.currentlyEditing = "";
        this.subtaskList = new SubtaskList();
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

    log() {
        logger.logTask(this);
    }

    static generateId() {
        return ++Task.lastId;
    }
}

class SubtaskList {
    tasks;

    constructor(_subtasks) {
        this.tasks = _subtasks || [];
    }

    sort() {

    }

    add(_task) {
        this.tasks.push(_task);
        _task.supertaskList = this;
    }

    // Does removal from the subtask list imply full deletion?
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

    hasSubtasks() {
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
        
        if (_task.subtaskList.hasSubtasks()) {
            console.log(_prepend + _task.subtaskList.tasks.length + 
                " subtask" + (_task.subtaskList.tasks.length != 1 ? "s:" : ":"));

            _task.subtaskList.tasks.forEach(_elem => {
                logTask(_elem, _prepend + "*"); 
             });
        }
    };

    return {
        logTask
    };
})();

let topLevelTasks = [ new Task("Test Task") ];
topLevelTasks[0].subtaskList.add(new Task("Another task"));
topLevelTasks[0].subtaskList.tasks[0].subtaskList.add(new Task("Fourth task"));
topLevelTasks[0].subtaskList.add(new Task("A third task"));
//topLevelTasks[0].subtaskList.removeIdx(0);
topLevelTasks[0].subtaskList.removeId(1);

topLevelTasks.forEach(_elem => {
    _elem.log();
});
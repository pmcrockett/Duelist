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
import { format } from "date-fns";
import * as dom from "./dom.js";
import timezoneString from "./timezone-string.js";

class Task {
    title;
    due;
    description;
    priority;
    progress;
    notes;
    id;
    currentlyEditing;
    useProgressFromSubtasks;
    subtaskList;
    supertaskList;
    expanded;
    domDiv;
    static lastId = -1;

    constructor(_title, _dueDate, _dueTime, _description, _priority, _progress, 
            _notes, _supertask, _isClone) {
        this.title = _title || "";

        if (!_dueDate || _dueDate.length < 1) {
            let today = new Date(Date.now());
            let padLen = 2;
            _dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).
                padStart(padLen, "0")}-${String(today.getDate()).padStart(padLen, "0")}`;
        }

        _dueTime = _dueTime == null || _dueTime.length < 1 ? "00:00" : _dueTime;
        let timezone = timezoneString();
        this.dateString = `${_dueDate}T${_dueTime}:00.000${timezone}`;
        this.due = new Date(this.dateString);
        this.description = _description || "";
        this.priority = _priority || "";
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
        console.log(this.due, this.dueDate, this.dueTime, this.dateString)
        var cloned = new Task(this.title, format(this.due, "yyyy-MM-LL"), 
            format(this.due, "HH:mm"), 
            this.description, this.priority, this.progress, this.notes, 
            this.supertask, true);
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

    refreshDom(_recursive) {
        if (this.domDiv != null) {
            this.domDiv.remove();
        }

        this.domDiv = dom.createCard(this);

        if (_recursive) {
            this.subtaskList.refreshDom(_recursive);
        }
    }

    // Masks subtask list's add function for ease of use.
    addSubtask(_task, _idx) {
        return this.subtaskList.add(_task, _idx);
    }

    // Masks subtask list's remove function for ease of use.
    removeSubtaskId(_id) {
        return this.subtaskList.removeId(_id);
    }

    // Masks subtask list's remove function for ease of use.
    removeSubtaskIdx(_idx) {
        return this.subtaskList.removeIdx(_idx);
    }

    // Masks subtask list's tasks for ease of use.
    get subtasks() {
        return this.subtaskList.tasks;
    }

    static generateId() {
        // If overflow happens, no it didn't.
        if (Task.lastId >= Number.MAX_SAFE_INTEGER) Task.lastId = -1;
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

    refreshDom(_recursive) {
        this.tasks.forEach(_task => {
            _task.refreshDom(_recursive);
        });
    }
}

let logger = (function() {
    let logTask = function(_task, _prepend) {
        if (!_prepend) _prepend = "";
        console.log(_prepend + "----------------");
        console.log(_prepend + "Title: " + _task.title);
        console.log(_prepend + "Due date: " + _task.dueDate);
        console.log(_prepend + "Due time: " + _task.dueTime);
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

    let paste = function(_taskList, _idx) {
        // Allow _taskList to be passed as its owning task for ease of use.
        if (_taskList instanceof Task) {
            _taskList = _taskList.subtaskList;
        }

        if (this.buffer) {
            let cloned = this.buffer.clone(true);
            cloned.assignNewIdRecursive();
            _taskList.add(cloned, _idx);

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
taskList.tasks[0].addSubtask(new Task("Another task", "2024-02-01", "17:00",
    "This is a test task.", 2, 4, "No notes for this task."));
taskList.tasks[0].subtasks[0].addSubtask(new Task("Fourth task"));
taskList.tasks[0].subtasks[0].subtasks[0].addSubtask(new Task("Fifth task"));
taskList.tasks[0].subtasks[0].subtasks[0].addSubtask(new Task("Sixth task"));
taskList.tasks[0].addSubtask(new Task("A third task"));
//topLevelTasks[0].subtaskList.removeIdx(0);
//topLevelTasks[0].subtaskList.removeId(1);
//copier.copy(taskList.tasks[0].subtaskList.tasks[0], true);
copier.copy(taskList.tasks[0].subtasks[0], true);
//copier.cut(taskList.tasks[0].subtaskList.tasks[0], false);
//copier.cut(taskList.tasks[0].subtaskList.tasks[0], true);
copier.paste(taskList.tasks[0].subtasks[0].subtasks[0].subtasks[1]);
copier.paste(taskList, 0);

taskList.tasks.forEach(_elem => {
    _elem.log();
});

taskList.refreshDom(true);
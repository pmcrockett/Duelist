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
import RightClickMenu from "./right-click-menu.js";

class Task {
    title;
    dueDate;
    dueDateStr;
    dueTime;
    dueTimeStr;
    description;
    priority;
    progress;
    notes;
    id;
    depth;
    currentlyEditing;
    useProgressFromSubtasks;
    subtaskList;
    supertaskList;
    expanded;
    selected;
    domDiv;
    static lastId = -1;

    constructor(_title, _dueDateStr, _dueTimeStr, _description, _priority, _progress, 
            _notes, _supertaskList, _isClone) {
        this.title = _title || "";
        this.dueDateStr = _dueDateStr;
        this.dueTimeStr = _dueTimeStr;
        this.updateDue();
        this.description = _description || "";
        this.priority = _priority || 0;
        this.progress = _progress || 0;
        this.notes = _notes || "";
        this.selected = false;

        if (_supertaskList) {
            _supertaskList.add(this);
        } else {
            this.supertaskList = null;
        }

        this.currentlyEditing = false;
        this.subtaskList = new TaskList(this);
        this.expanded = this.hasContent();
        this.useProgressFromSubtasks = false;

        // Tasks that live in the copy buffer have no ID to ensure that pasted
        // tasks' IDs are contiguous without having to decrement Task.lastId.
        if (!_isClone) {
            this.assignNewId();
            this.updateDepth(true);
        } else {
            this.id = -1;
        }
        // Place DOM object in supertask or root array
    }

    clone(_recursive, _supertaskList, _idx) {
        var cloned = new Task(this.title, this.dueDateStr, this.dueTimeStr, 
            this.description, this.priority, this.progress, this.notes, 
            null, true);
        cloned.expanded = this.expanded;
        cloned.selected = false;
        //cloned.expanded = false;
        cloned.useProgressFromSubtasks = this.useProgressFromSubtasks;

        if (_supertaskList) {
            _supertaskList.add(cloned, _idx);
        }
        
        if (_recursive) {
            cloned.subtaskList.expanded = this.subtaskList.expanded;

            for (let i = 0; i < this.subtaskList.tasks.length; i++) {
                this.subtaskList.tasks[i].clone(_recursive, cloned.subtaskList);
            }
        }

        return cloned;
    }

    updateDue() {
        // if (!this.dueDate || this.dueDate.length < 1) {
        //     let today = new Date(Date.now());
        //     let padLen = 2;
        //     this.dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).
        //         padStart(padLen, "0")}-${String(today.getDate()).padStart(padLen, "0")}`;
        // }

        // if (!this.dueTime || this.dueTime.length < 1) {
        //     this.dueTime = "00:00";
        // }

        // let timezone = timezoneString();
        // this.dateString = `${this.dueDate}T${this.dueTime}:00.000${timezone}`;
        // this.due = new Date(this.dateString);

        let timezone = timezoneString();

        if (this.dueDateStr && this.dueDateStr.length) {
            let dateString = `${this.dueDateStr}T00:00:00${timezone}`;
            this.dueDate = new Date(dateString);
        }

        if (this.dueTimeStr && this.dueTimeStr.length) {
            let dateString = `2000-01-01T${this.dueTimeStr}:00${timezone}`;
            this.dueTime = new Date(dateString);
        }
    }

    updateDepth(_recursive) {
        this.depth = 0;

        if (this.supertaskList == null) return;

        let supertask = this.supertaskList.owner;
        while (supertask != null) {
            this.depth++;
            supertask = supertask.supertaskList ? supertask.supertaskList.owner : null;
        }
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

    delete(_recursive) {
        if (this.supertaskList) {
            if (this.domDiv) {
                this.domDiv.task.remove();
                if (_recursive) this.domDiv.subtasks.remove();
            }
            return this.supertaskList.removeId(this.id);
        }

        return false;
    }

    hasContent() {
        return (this.description && this.description.length) ||
            this.priority ||
            this.progress ||
            //this.useProgressFromSubtasks ||
            (this.notes && this.notes.length)
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
        if (this.domDiv) {
            this.domDiv.task.remove();
            if (_recursive) this.domDiv.subtasks.remove();
        }

        if (this.useProgressFromSubtasks) {
            this.progress = this.getProgressRecursive();
        }

        this.domDiv = dom.createCard(this, stateManager);

        if (_recursive) {
            this.subtaskList.refreshDom(_recursive);
        }

        // Even if not udating recursively, we need to check all supertasks to 
        // see if their progress values are changed based on this task's progress
        // and update them accordingly.
        for (let task of this.chain) {
            if (task.useProgressFromSubtasks) {
                task.refreshDom(false);
            }
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

    // getProgressRecursive(_progress) {
    //     if (_progress == null) _progress = 0;

    //     if (!this.useProgressFromSubtasks && this.progress > _progress) {
    //         _progress = this.progress;
    //     }

    //     for (let task of this.subtaskList.tasks) {
    //         _progress = task.getProgressRecursive(_progress);
    //     }

    //     return _progress;
    // }

    getProgressRecursive(_progress) {
        if (_progress == null) _progress = 0;

        if (!this.useProgressFromSubtasks && this.progress > 0) {
            if (this.progress == 1 && (_progress == 1 || _progress == 0)) {
                _progress = 1;
            } else if (this.progress == 3 && (_progress == 3 || _progress == 0)) {
                _progress = 3;
            } else {
                _progress = 2;
            }
        }

        for (let task of this.subtaskList.tasks) {
            _progress = task.getProgressRecursive(_progress);
        }

        return _progress;
    }

    // Masks subtask list's tasks for ease of use.
    get subtasks() {
        return this.subtaskList.tasks;
    }

    // Masks supertask list's owner for ease of use.
    get supertask() {
        return this.supertaskList ? this.supertaskList.owner : null;
    }

    // Returns an array of all of a task's supertasks up to the root task. The
    // root task is the last in the array.
    get chain() {
        let supertask = this.supertaskList.owner;
        let chain = [];

        while (supertask) {
            chain.push(supertask);
            supertask = supertask.supertaskList.owner;
        }

        return chain;
    }

    static generateId() {
        // If overflow happens, no it didn't.
        if (Task.lastId >= Number.MAX_SAFE_INTEGER) Task.lastId = -1;
        return ++Task.lastId;
    }
}

class TaskList {
    tasks;
    owner;
    expanded = false;

    constructor(_owner, _tasks) {
        this.owner = _owner;
        //this.tasks = _subtasks || [];
        this.tasks = [];

        if (_tasks) {
            _tasks.forEach(_task => {
                this.add(_task);
            });
        }
    }

    sort() {

    }

    add(_task, _idx) {
        if (_idx == null) {
            _idx = this.tasks.length;
        }

        this.tasks.splice(_idx, 0, _task);
        _task.supertaskList = this;
        _task.updateDepth(true);
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

    getTaskById(_id, _recursive) {
        let idTask = null;

        for (let task of this.tasks) {
            if (task.id == _id) {
                return task;
            } else if (_recursive && task.subtaskList.hasTasks()) {
                idTask = task.subtaskList.getTaskById(_id, _recursive);
                if (idTask) return idTask;
            }
        }

        return idTask;
    }

    hasTasks() {
        return this.tasks.length >= 1;
    }

    // Returns an ordered array of IDs that reflects the current order of tasks
    // within the taskList's tree structure.
    getIdOrder(_recursive) {
        const order = [];

        for (let task of this.tasks) {
            order.push(task.id);

            if (_recursive) {
                order.push(...task.subtaskList.getIdOrder(_recursive));
            }
        }

        return order;
    }

    refreshDom(_recursive) {
        // To ensure proper order, remove all tasks before redrawing any of them.
        this.tasks.forEach(_task => {
            if (_task.domDiv) {
                _task.domDiv.task.remove();
                if (_recursive) _task.domDiv.subtasks.remove();
            }
        });

        this.tasks.forEach(_task => {
            _task.refreshDom(_recursive);
        });
    }
}

let stateManager = (function() {
    let currentlyEditing = false;
    let selectionAddTo = false;
    let selectionMass = false;


    let setSelectionAddTo = function(_state, _e) {
        if (_e.key == "Control") {
            stateManager.selectionAddTo = _state;
        }
    }

    let setSelectionMass = function(_state, _e) {
        if (_e.key == "Shift") {
            stateManager.selectionMass = _state;
        }
    }

    document.addEventListener("keydown", _e => {
        setSelectionAddTo.bind(this, true, _e)();
        setSelectionMass.bind(this, true, _e)();
    });
    
    document.addEventListener("keyup", _e => {
        setSelectionAddTo.bind(this, false, _e)();
        setSelectionMass.bind(this, false, _e)();
    });


    return {
        currentlyEditing,
        selectionAddTo
    }
})();

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
        console.log(_prepend + "Depth: " + _task.depth);
        if (_task.supertaskList && _task.supertaskList.owner) {
            console.log(_prepend + "Supertask: (" + _task.supertaskList.owner.id + 
            ") " + _task.supertaskList.owner.title);
        } else {
            console.log(_prepend + "No supertask");
        }
        
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
    const buffer = [];

    let copy = function(_tasks, _recursive, _globalTaskList) {
        if (!(_tasks instanceof Array)) {
            _tasks = [ _tasks ];
        }

        clearBuffer();

        if (_recursive) {
            _tasks = reduceRecursiveInput(_tasks);
        }

        // Ensure that tasks are copied in visual order and not in selection order.
        let idOrder = _globalTaskList.getIdOrder(true);
        _tasks.sort(function(a, b) {
            return idOrder.indexOf(a.id) < idOrder.indexOf(b.id) ? -1 : 1;
        });

        for (let task of _tasks) {
            buffer.push(task.clone(_recursive));
        }
    }

    let cut = function(_tasks, _recursive, _refresh, _globalTaskList) {
        if (!(_tasks instanceof Array)) {
            _tasks = [ _tasks ];
        }

        this.copy(_tasks, _recursive, _globalTaskList);

        if (_recursive) {
            _tasks = reduceRecursiveInput(_tasks);
        }

        for (let task of _tasks) {
            let insertIdx = task.supertaskList.getTaskIdx(task);
            let supertaskList = task.supertaskList;
            let subtaskList = task.subtaskList;
            task.delete(true);
    
            if (!_recursive) {
                for (let i = 0; i < subtaskList.tasks.length; i++) {
                    supertaskList.add(subtaskList.tasks[i], insertIdx++);
                }
            }
    
            if (_refresh) {
                if (supertaskList.owner) {
                    supertaskList.owner.refreshDom(true);
                } else {
                    supertaskList.refreshDom(true);
                }
            }
        }
    }

    let paste = function(_taskList, _idx) {
        // Allow _taskList to be passed as its owning task for ease of use.
        if (_taskList instanceof Task) {
            _taskList = _taskList.subtaskList;
        }

        if (buffer.length) {
            for (let bufItem of buffer) {
                let cloned = bufItem.clone(true, _taskList, _idx++);
                cloned.assignNewIdRecursive();
                cloned.updateDepth(true);
                //cloned.refreshDom(true);
            }

            if (_taskList.owner) {
                _taskList.owner.refreshDom(true);
            } else {
                _taskList.refreshDom(true);
            }

            return true;
        }

        return false;
    }

    let reduceRecursiveInput = function(_tasks) {
        const reduced = [];

        for (let task of _tasks) {
            // If copying recursively, make sure we're only copying each task
            // once, because thelet user may have explicitly selected subtasks that 
            // will also be automatically picked up by the recursion.
            let chain = task.chain;
            let taskIsSubtask = false;

            // If any of the selected tasks is found in this task's super 
            // chain, then don't copy this task because it is already included
            // in the recursive copy.
            for (let possibleSuper of _tasks) {
                if (chain.includes(possibleSuper)) {
                    taskIsSubtask = true;
                    break;
                }
            }

            if (!taskIsSubtask) {
                reduced.push(task);
            }
        }

        return reduced;
    }

    let clearBuffer = function() {
        buffer.splice(0, buffer.length);
    }

    return {
        buffer,
        copy,
        cut,
        paste,
        clearBuffer
    }
})();

let selection = (function() {
    const selected = [];

    let add = function(_task) {
        if (!contains(_task)) {
            _task.selected = true;
            selected.push(_task);
            dom.select(_task.id);
        }
    };

    let addExclusive = function(_task) {
        clear();
        _task.selected = true;
        add(_task);
    };

    let remove = function(_task) {
        let idx = selected.indexOf(_task);

        if (idx >= 0) {
            selected.splice(idx, 1);
            _task.selected = false;
            dom.unselect(_task.id);

            return true;
        }

        return false;
    };

    let clear = function() {
        for (let task of selected) {
            task.selected = false;
            dom.unselect(task.id);
        }

        selected.splice(0, selected.length);
    };

    let contains = function(_task) {
        return selected.indexOf(_task) >= 0;
    };

    let updateSelection = function(_task) {
        if (stateManager.selectionMass) {
            if (!selection.selected.length) {
                selection.addExclusive(_task);
            } else {
                let idOrder = taskList.getIdOrder(true);
                let startIdx = idOrder.indexOf(selection.selected[0].id);
                let endIdx = idOrder.indexOf(_task.id);
                
                if (endIdx < startIdx) {
                    let buffer = startIdx;
                    startIdx = endIdx;
                    endIdx = buffer;
                }

                // Ensure we always retain the same first selected task.
                selection.addExclusive(selection.selected[0]);

                for (let i = startIdx; i <= endIdx; i++) {
                    if (idOrder[i] != selection.selected[0].id) {
                        selection.add(taskList.getTaskById(idOrder[i], true));
                    }
                }
            }
        // Add clicked task to selection.
        } else if (stateManager.selectionAddTo) {
            if (selection.contains(_task)) {
                selection.remove(_task);
            } else {
                selection.add(_task);
            }
        // Select only clicked task.
        } else {
            selection.addExclusive(_task);
        }
    }

    let triggerMenu = function(_x, _y, _selectionAddTo) {
        let task = taskList.getTaskById(dom.getTaskIdAtPos(_x, _y), true);
    
        if (task && !selected.includes(task)) {
            updateSelection(task);
        }

        if (selection.selected.length) {
            dom.freeze();
            //selection.add(task);
            let menuTexts = [ "Copy (with subtasks)", "Copy (without subtasks)", 
            "Cut (with subtasks)", "Cut (without subtasks)" ];
            let menuFunctions = [
                function() {copier.copy(selection.selected, true, taskList)},
                function() {copier.copy(selection.selected, false, taskList)},
                function() {copier.cut(selection.selected, true, true, taskList)},
                function() {copier.cut(selection.selected, false, true, taskList)}
            ];
    
            // Only show paste option if there's something to paste.
            if (copier.buffer.length) {
                menuTexts.push("Paste (above)", "Paste (below)", "Paste (as subtask)");
                menuFunctions.push(
                    function() {copier.paste(task.supertaskList, 
                        task.supertaskList.getTaskIdx(task))},
                    function() {copier.paste(task.supertaskList, 
                        task.supertaskList.getTaskIdx(task) + 1)},
                    function() {copier.paste(task.subtaskList)}
                );
            }
    
            let menu = new RightClickMenu(menuTexts, menuFunctions);
            document.querySelector("body").appendChild(menu.svg);
            menu.buttonDown(_x, _y);
        } else if (copier.buffer.length) {
            dom.freeze();
            let menu = new RightClickMenu([ "Paste" ], 
                [
                    function() {copier.paste(taskList)}
                ]);
            document.querySelector("body").appendChild(menu.svg);
            menu.buttonDown(_x, _y);
        }
    }

    return {
        selected,
        add,
        addExclusive,
        remove,
        clear,
        contains,
        updateSelection,
        triggerMenu
    }
})();

let taskList = new TaskList(null, [ new Task("Test Task") ]);
taskList.tasks[0].addSubtask(new Task("Another task", "2024-02-01", "17:00",
    "This is a test task.", 2, 3, "No notes for this task."));
taskList.tasks[0].subtasks[0].addSubtask(new Task("Fourth task"));
taskList.tasks[0].subtasks[0].subtasks[0].addSubtask(new Task("Fifth task"));
taskList.tasks[0].subtasks[0].subtasks[0].addSubtask(new Task("Sixth task"));
taskList.tasks[0].addSubtask(new Task("A third task"));
//topLevelTasks[0].subtaskList.removeIdx(0);
//topLevelTasks[0].subtaskList.removeId(1);
//copier.copy(taskList.tasks[0].subtaskList.tasks[0], true, taskList);
//copier.copy(taskList.tasks[0].subtasks[0], true);
//copier.cut(taskList.tasks[0].subtaskList.tasks[0], false);
//copier.cut(taskList.tasks[0].subtaskList.tasks[0], true);

taskList.tasks.forEach(_elem => {
    _elem.log();
});

taskList.refreshDom(true);
//copier.paste(taskList.tasks[0].subtasks[0].subtasks[0].subtasks[1]);
//copier.paste(taskList, 0);

// document.addEventListener("click", _e => {
//     if (_e.button == 2) {
//         menu.buttonDown(_e.clientX, _e.clientY);
//     }
// });

document.addEventListener("contextmenu", (_e) => {
    _e.preventDefault();

    // console.log(_e);
    // let task = taskList.getTaskById(dom.getTaskIdAtPos(_e.pageX, _e.pageY), true);

    // if (task) {
    //     if (selection.selectionAddTo) {
    //         selection.add(task);
    //     } else {
    //         selection.addExclusive(task);
    //         console.log(selection.selected);
    //     }
    // }

    // console.log(selection.selected.length);

    // if (selection.selected.length) {
    //     dom.freeze();
    //     //selection.add(task);
    //     let menuTexts = [ "Copy (with subtasks)", "Copy (without subtasks)", 
    //     "Cut (with subtasks)", "Cut (without subtasks)" ];
    //     let menuFunctions = [
    //         function() {copier.copy(selection.selected, true, taskList)},
    //         function() {copier.copy(selection.selected, false, taskList)},
    //         function() {copier.cut(selection.selected, true, true, taskList)},
    //         function() {copier.cut(selection.selected, false, true, taskList)}
    //     ];

    //     // Only show paste option if there's something to paste.
    //     if (copier.buffer.length) {
    //         menuTexts.push("Paste (above)", "Paste (below)", "Paste (as subtask)");
    //         menuFunctions.push(
    //             function() {copier.paste(task.supertaskList, 
    //                 task.supertaskList.getTaskIdx(task))},
    //             function() {copier.paste(task.supertaskList, 
    //                 task.supertaskList.getTaskIdx(task) + 1)},
    //             function() {copier.paste(task.subtaskList)}
    //         );
    //     }

    //     let menu = new RightClickMenu(menuTexts, menuFunctions);
    //     document.querySelector("body").appendChild(menu.svg);
    //     menu.buttonDown(_e.pageX, _e.pageY);
    // } else if (copier.buffer.length) {
    //     dom.freeze();
    //     let menu = new RightClickMenu([ "Paste" ], 
    //         [
    //             function() {copier.paste(taskList)}
    //         ]);
    //     document.querySelector("body").appendChild(menu.svg);
    //     menu.buttonDown(_e.pageX, _e.pageY);
    // }

});


document.addEventListener("click", _e => {
    let task = taskList.getTaskById(dom.getTaskIdAtPos(_e.pageX, _e.pageY), true);
    let underMouse = document.elementsFromPoint(_e.pageX, _e.pageY);

    if (!stateManager.currentlyEditing && !dom.frozen) {        
        if (task) {
            selection.updateSelection(task);
        } else {
            let needClear = true;

            for (let elem of underMouse) {
                if (elem.classList.contains("task-expand-img") ||
                elem.classList.contains("subtasks-plus-img")) {
                    needClear = false;
                    break;
                }
            }

            if (needClear) {
                selection.clear();
            }
        }
    } else if (!stateManager.currentlyEditing) {
        dom.thaw();
        console.log(selection.selected);
    }
});

document.addEventListener("mousedown", _e => {
    if (_e.button == 2) {
        selection.triggerMenu(_e.pageX, _e.pageY, stateManager.selectionAddTo);
    }
});

let touchRecord = {
    time: [ null, null ],
    pos: [ null, null ]
};

document.addEventListener("touchstart", _e => {
    touchRecord.time.splice(0, 1);
    touchRecord.time.push(new Date().getTime());

    touchRecord.pos.splice(0, 1);
    touchRecord.pos.push({ x: _e.touches[0].pageX, y: _e.touches[0].pageY });

    if (touchRecord.time[0] && touchRecord.time[1] - touchRecord.time[0]< 300) {
        if (Math.abs(touchRecord.pos[1].x - touchRecord.pos[0].x) < 40 &&
                Math.abs(touchRecord.pos[1].y - touchRecord.pos[0].y) < 40) {
            selection.triggerMenu(touchRecord.pos[1].x, touchRecord.pos[1].y,
                stateManager.selectionAddTo);
        }
    }
});

document.addEventListener("touchend", _e => {

});

document.addEventListener("keydown", _e => {
    if (_e.key == "e") {
        console.log(selection.selected);
    }
});
import * as dom from "./dom.js";
import timezoneString from "./timezone-string.js";
import RightClickMenu from "./right-click-menu.js";
import storageAvailable from "./storage-available.js";

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

  constructor(
    _title,
    _dueDateStr,
    _dueTimeStr,
    _description,
    _priority,
    _progress,
    _notes,
    _supertaskList,
    _isClone
  ) {
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
      this.updateDepth();
    } else {
      this.id = -1;
    }
  }

  clone(_recursive, _supertaskList, _idx) {
    var cloned = new Task(
      this.title,
      this.dueDateStr,
      this.dueTimeStr,
      this.description,
      this.priority,
      this.progress,
      this.notes,
      null,
      true
    );
    cloned.expanded = this.expanded;
    cloned.selected = false;
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
    const timezone = timezoneString();

    if (this.dueDateStr && this.dueDateStr.length) {
      const dateString = `${this.dueDateStr}T00:00:00${timezone}`;
      this.dueDate = new Date(dateString);
    }

    if (this.dueTimeStr && this.dueTimeStr.length) {
      const dateString = `2000-01-01T${this.dueTimeStr}:00${timezone}`;
      this.dueTime = new Date(dateString);
    }
  }

  updateDepth() {
    this.depth = 0;

    if (this.supertaskList == null) return;

    let supertask = this.supertaskList.owner;
    while (supertask != null) {
      this.depth++;
      supertask = supertask.supertaskList
        ? supertask.supertaskList.owner
        : null;
    }
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
    return (
      (this.description && this.description != "") ||
      this.priority ||
      this.progress ||
      (this.notes && this.notes.length)
    );
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

    this.domDiv = dom.createCard(this);
    listener.addExpandTask(
      this.domDiv.taskExpand,
      this,
      this.domDiv.task,
      this.domDiv.taskExpandPath,
      this.domDiv.header
    );
    listener.addOpenEdit(this.domDiv.editOpen, this);

    if (this.domDiv.progressSvg && !this.useProgressFromSubtasks) {
      listener.addProgress(this.domDiv.progressSvg, this);
    }

    if (this.domDiv.needSubtasksListener) {
      listener.addExpandSubtasks(
        this.domDiv.subtasksExpand,
        this,
        this.domDiv.subtasks
      );
    }

    if (_recursive) {
      this.subtaskList.refreshDom(_recursive);
    }

    // Even if not udating recursively, we need to check all supertasks to
    // see if their progress values are changed based on this task's progress
    // and update them accordingly.
    for (const task of this.chain) {
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

    for (const task of this.subtaskList.tasks) {
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
    const chain = [];

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

  static resetIds() {
    Task.lastId = -1;
  }
}

class TaskList {
  tasks;
  owner;
  expanded = false;
  static writeErrorShown = false;
  static DEFAULT_KEY = "taskList";

  constructor(_owner, _tasks) {
    this.owner = _owner;
    this.tasks = [];

    if (_tasks) {
      _tasks.forEach((_task) => {
        this.add(_task);
      });
    }
  }

  createTask(_idx, _showInput) {
    if (!_idx) {
      _idx = this.tasks.length + 1;
    }

    const newTask = new Task();
    this.add(newTask, _idx);

    if (this.owner) {
      this.owner.refreshDom(true);
    } else {
      this.refreshDom(false);
    }

    this.writeRootToLocalStorage();

    if (_showInput && !stateManager.currentlyEditing) {
      newTask.currentlyEditing = true;
      stateManager.currentlyEditing = true;
      const inputBox = dom.createInputBox(newTask);
      listener.addInputCard(newTask, inputBox);
    }
  }

  add(_task, _idx) {
    if (_idx == null) {
      _idx = this.tasks.length;
    }

    this.tasks.splice(_idx, 0, _task);
    _task.supertaskList = this;
    _task.updateDepth();
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

    for (const task of this.tasks) {
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

    for (const task of this.tasks) {
      order.push(task.id);

      if (_recursive) {
        order.push(...task.subtaskList.getIdOrder(_recursive));
      }
    }

    return order;
  }

  clear() {
    while (this.tasks.length) {
      this.tasks[0].delete(true);
    }
  }

  refreshDom(_recursive) {
    // To ensure proper order, remove all tasks before redrawing any of them.
    this.tasks.forEach((_task) => {
      if (_task.domDiv) {
        _task.domDiv.task.remove();
        if (_recursive) _task.domDiv.subtasks.remove();
      }
    });

    this.tasks.forEach((_task) => {
      _task.refreshDom(_recursive);
    });

    for (let i = 0; i < this.tasks.length; i++) {
      this.tasks[i].refreshDom(_recursive);
    }
  }

  // Remove all task properties that can't be stringified by JSON. These
  // can be reconstructed on project load even without saving them.
  cloneJson() {
    const jsonTaskList = new TaskList(null, null);
    jsonTaskList.expanded = this.expanded;

    for (const task of this.tasks) {
      const cloned = task.clone(false, null);
      jsonTaskList.add(cloned);
      cloned.id = task.id;
      cloned.depth = task.depth;
      cloned.dueDate = null;
      cloned.dueTime = null;
      cloned.subtaskList = task.subtaskList.cloneJson();
      cloned.supertaskList = null;
    }

    return jsonTaskList;
  }

  // Rebuild taskList structure from JSON string and recalculate the values
  // that weren't saved in the string. Any current contents of this taskList
  // will be deleted and replaced by the JSON data.
  initFromJson(_jsonObj, _owner) {
    this.owner = _owner;
    this.expanded = _jsonObj.expanded;

    this.clear();

    for (const task of _jsonObj.tasks) {
      const loadedTask = new Task(
        task.title,
        task.dueDateStr,
        task.dueTimeStr,
        task.description,
        task.priority,
        task.progress,
        task.notes,
        this,
        false
      );
      loadedTask.expanded = task.expanded;
      loadedTask.useProgressFromSubtasks = task.useProgressFromSubtasks;
      loadedTask.subtaskList.initFromJson(task.subtaskList, loadedTask);
    }
  }

  writeToLocalStorage(_key) {
    if (storageAvailable("localStorage")) {
      if (!_key) {
        _key = TaskList.DEFAULT_KEY;
      }

      const jsonStr = JSON.stringify(this.cloneJson());
      localStorage.setItem(_key, jsonStr);

      return true;
    } else if (!TaskList.writeErrorShown) {
      TaskList.writeErrorShown = true;
      alert(
        "Your browser either doesn't support local storage or has it disabled, so your tasks will not be saved after leaving this page."
      );
    }

    return false;
  }

  writeRootToLocalStorage(_key) {
    if (this.owner) {
      this.root.writeToLocalStorage(_key);
    } else {
      this.writeToLocalStorage(_key);
    }
  }

  restoreFromLocalStorage(_key) {
    if (storageAvailable("localStorage")) {
      if (!_key) {
        _key = TaskList.DEFAULT_KEY;
      }

      const jsonObj = localStorage.getItem(_key);

      if (jsonObj) {
        Task.resetIds();
        const jsonStr = JSON.parse(jsonObj);
        this.initFromJson(jsonStr);
        this.refreshDom(true);

        if (this.hasTasks()) dom.hideInstructions();

        return true;
      }
    }

    return false;
  }

  clearLocalStorage(_key) {
    if (storageAvailable("localStorage")) {
      if (!_key) {
        _key = TaskList.DEFAULT_KEY;
      }

      localStorage.removeItem(_key);
    }
  }

  get root() {
    if (this.owner) {
      if (this.owner.chain.length) {
        return this.owner.chain[this.owner.chain.length - 1].supertaskList;
      } else {
        return this.owner.supertaskList;
      }
    }

    return this;
  }
}

const stateManager = (function () {
  const currentlyEditing = false;
  const selectionAddTo = false;
  const selectionMass = false;
  const touch = {
    time: [null, null],
    pos: [null, null],
    touchedId: [null, null],
  };

  const setSelectionAddTo = function (_state, _e) {
    if (_e.key == "Control") {
      stateManager.selectionAddTo = _state;
    }
  };

  const setSelectionMass = function (_state, _e) {
    if (_e.key == "Shift") {
      stateManager.selectionMass = _state;
    }
  };

  return {
    currentlyEditing,
    selectionAddTo,
    selectionMass,
    setSelectionAddTo,
    setSelectionMass,
    touch,
  };
})();

const logger = (function () {
  const logTask = function (_task, _prepend) {
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
      console.log(
        _prepend +
          "Supertask: (" +
          _task.supertaskList.owner.id +
          ") " +
          _task.supertaskList.owner.title
      );
    } else {
      console.log(_prepend + "No supertask");
    }

    if (_task.subtaskList.hasTasks()) {
      console.log(
        _prepend +
          _task.subtaskList.tasks.length +
          " subtask" +
          (_task.subtaskList.tasks.length != 1 ? "s:" : ":")
      );

      _task.subtaskList.tasks.forEach((_elem) => {
        logTask(_elem, _prepend + "*   ");
      });
    }
  };

  return {
    logTask,
  };
})();

const copier = (function () {
  const buffer = [];

  const remove = function (_tasks, _recursive, _refresh) {
    if (!(_tasks instanceof Array)) {
      _tasks = [_tasks];
    }

    if (_recursive) {
      _tasks = reduceRecursiveInput(_tasks);
    }

    const root = _tasks[0].supertaskList.root;

    for (const task of _tasks) {
      let insertIdx = task.supertaskList.getTaskIdx(task);
      const supertaskList = task.supertaskList;
      const subtaskList = task.subtaskList;
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

    root.writeToLocalStorage();
  };

  const copy = function (_tasks, _recursive, _globalTaskList) {
    if (!(_tasks instanceof Array)) {
      _tasks = [_tasks];
    }

    clearBuffer();

    if (_recursive) {
      _tasks = reduceRecursiveInput(_tasks);
    }

    // Ensure that tasks are copied in visual order and not in selection order.
    const idOrder = _globalTaskList.getIdOrder(true);
    _tasks.sort(function (_a, _b) {
      return idOrder.indexOf(_a.id) < idOrder.indexOf(_b.id) ? -1 : 1;
    });

    for (const task of _tasks) {
      buffer.push(task.clone(_recursive));
    }
  };

  const cut = function (_tasks, _recursive, _refresh, _globalTaskList) {
    if (!(_tasks instanceof Array)) {
      _tasks = [_tasks];
    }

    this.copy(_tasks, _recursive, _globalTaskList);
    this.remove(_tasks, _recursive, _refresh);
  };

  const paste = function (_taskList, _idx) {
    // Allow _taskList to be passed as its owning task for ease of use.
    if (_taskList instanceof Task) {
      _taskList = _taskList.subtaskList;
    }

    if (!_idx) _idx = _taskList.tasks.length;

    if (buffer.length) {
      for (const bufItem of buffer) {
        const cloned = bufItem.clone(true, _taskList, _idx++);
        cloned.assignNewIdRecursive();
        cloned.updateDepth();
      }

      if (_taskList.owner) {
        _taskList.owner.refreshDom(true);
      } else {
        _taskList.refreshDom(true);
      }

      _taskList.writeRootToLocalStorage();

      return true;
    }

    return false;
  };

  const reduceRecursiveInput = function (_tasks) {
    const reduced = [];

    for (const task of _tasks) {
      // If copying recursively, make sure we're only copying each task
      // once, because thelet user may have explicitly selected subtasks that
      // will also be automatically picked up by the recursion.
      const chain = task.chain;
      let taskIsSubtask = false;

      // If any of the selected tasks is found in this task's super
      // chain, then don't copy this task because it is already included
      // in the recursive copy.
      for (const possibleSuper of _tasks) {
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
  };

  const clearBuffer = function () {
    buffer.splice(0, buffer.length);
  };

  return {
    buffer,
    remove,
    copy,
    cut,
    paste,
    clearBuffer,
  };
})();

const selection = (function () {
  const selected = [];

  const add = function (_task) {
    if (!contains(_task)) {
      _task.selected = true;
      selected.push(_task);
      dom.select(_task.id);
    }
  };

  const addExclusive = function (_task) {
    clear();
    _task.selected = true;
    add(_task);
  };

  const remove = function (_task) {
    const idx = selected.indexOf(_task);

    if (idx >= 0) {
      selected.splice(idx, 1);
      _task.selected = false;
      dom.unselect(_task.id);

      return true;
    }

    return false;
  };

  const clear = function () {
    for (const task of selected) {
      task.selected = false;
      dom.unselect(task.id);
    }

    selected.splice(0, selected.length);
  };

  const contains = function (_task) {
    return selected.indexOf(_task) >= 0;
  };

  const updateSelection = function (_task) {
    if (stateManager.selectionMass) {
      if (!selection.selected.length) {
        selection.addExclusive(_task);
      } else {
        const idOrder = taskList.getIdOrder(true);
        let startIdx = idOrder.indexOf(selection.selected[0].id);
        let endIdx = idOrder.indexOf(_task.id);

        if (endIdx < startIdx) {
          const buffer = startIdx;
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
  };

  const triggerMenu = function (_clientX, _clientY, _selectionAddTo, _isTouch) {
    const task = taskList.getTaskById(
      dom.getTaskIdAtPos(_clientX, _clientY),
      true
    );

    if (task && !selected.includes(task)) {
      updateSelection(task);
    }

    let classes = null;

    if (_isTouch) {
      classes = ["touch-menu"];
    }

    let menu;

    if (task && selection.selected.length) {
      menu = buildTaskMenu(task, classes);
    } else {
      menu = buildBgMenu(classes);
    }

    document.querySelector("body").appendChild(menu.svg);
    menu.buttonDown(_clientX, _clientY);
  };

  const buildTaskMenu = function (_task, _classes) {
    dom.freeze();
    const menuTexts = [
      "New task (above)",
      "New task (below)",
      "New task (as subtask)",
      "Copy (with subtasks)",
      "Copy (without subtasks)",
      "Cut (with subtasks)",
      "Cut (without subtasks)",
    ];
    const menuFunctions = [
      function () {
        _task.supertaskList.createTask(
          _task.supertaskList.getTaskIdx(_task),
          true
        );
      },
      function () {
        _task.supertaskList.createTask(
          _task.supertaskList.getTaskIdx(_task) + 1,
          true
        );
      },
      function () {
        _task.subtaskList.createTask(null, true);
      },
      function () {
        copier.copy(selection.selected, true, taskList);
      },
      function () {
        copier.copy(selection.selected, false, taskList);
      },
      function () {
        copier.cut(selection.selected, true, true, taskList);
        if (!taskList.hasTasks()) showInstructions();
      },
      function () {
        copier.cut(selection.selected, false, true, taskList);
        if (!taskList.hasTasks()) showInstructions();
      },
    ];

    // Only show paste option if there's something to paste.
    if (copier.buffer.length) {
      menuTexts.push("Paste (above)", "Paste (below)", "Paste (as subtask)");
      menuFunctions.push(
        function () {
          copier.paste(
            _task.supertaskList,
            _task.supertaskList.getTaskIdx(_task)
          );
        },
        function () {
          copier.paste(
            _task.supertaskList,
            _task.supertaskList.getTaskIdx(_task) + 1
          );
        },
        function () {
          copier.paste(_task.subtaskList);
        }
      );
    }

    menuTexts.push("Delete (with subtasks)", "Delete (without subtasks)");
    menuFunctions.push(
      function () {
        copier.remove(selection.selected, true, true);
        if (!taskList.hasTasks()) showInstructions();
      },
      function () {
        copier.remove(selection.selected, false, true);
        if (!taskList.hasTasks()) showInstructions();
      }
    );

    const menu = new RightClickMenu(menuTexts, menuFunctions, _classes);

    return menu;
  };

  const buildBgMenu = function (_classes) {
    dom.freeze();
    const menuTexts = ["New task"];
    const menuFunctions = [
      function () {
        if (!taskList.hasTasks()) hideInstructions();
        taskList.createTask(taskList.tasks.length, true);
      },
    ];

    if (copier.buffer.length) {
      menuTexts.push("Paste");
      menuFunctions.push(function () {
        if (!taskList.hasTasks()) hideInstructions();
        copier.paste(taskList, taskList.tasks.length);
      });
    }

    const menu = new RightClickMenu(menuTexts, menuFunctions, _classes);

    return menu;
  };

  const showInstructions = function () {
    if (!taskList.hasTasks()) {
      dom.showInstructions();
    }
  };

  const hideInstructions = function () {
    if (!taskList.hasTasks()) {
      dom.hideInstructions();
    }
  };

  return {
    selected,
    add,
    addExclusive,
    remove,
    clear,
    contains,
    updateSelection,
    triggerMenu,
  };
})();

const listener = (function () {
  const addLeftClick = function () {
    document.addEventListener("click", (_e) => {
      const task = taskList.getTaskById(
        dom.getTaskIdAtPos(_e.clientX, _e.clientY),
        true
      );
      const underMouse = document.elementsFromPoint(_e.clientX, _e.clientY);

      if (!stateManager.currentlyEditing) {
        if (!_e.target.classList.contains("input-button")) {
          if (task) {
            selection.updateSelection(task);
          } else {
            let needClear = true;

            for (const elem of underMouse) {
              if (
                elem.classList.contains("task-expand-img") ||
                elem.classList.contains("subtasks-plus-img")
              ) {
                needClear = false;
                break;
              }
            }

            if (needClear) {
              selection.clear();
            }
          }
        }
      }
    });

    document.addEventListener("mouseup", (_e) => {
      if (_e.button == 0 && !stateManager.currentlyEditing) {
        dom.thaw();
      }
    });

    document.addEventListener("touchstart", (_e) => {
      stateManager.touch.time.splice(0, 1);
      stateManager.touch.time.push(new Date().getTime());

      stateManager.touch.pos.splice(0, 1);
      stateManager.touch.pos.push({
        x: _e.touches[0].clientX,
        y: _e.touches[0].clientY,
      });

      if (
        !stateManager.currentlyEditing &&
        stateManager.touch.time[0] &&
        stateManager.touch.time[1] - stateManager.touch.time[0] < 300
      ) {
        if (
          Math.abs(stateManager.touch.pos[1].x - stateManager.touch.pos[0].x) <
            40 &&
          Math.abs(stateManager.touch.pos[1].y - stateManager.touch.pos[0].y) <
            40
        ) {
          selection.triggerMenu(
            stateManager.touch.pos[1].x,
            stateManager.touch.pos[1].y,
            stateManager.selectionAddTo,
            true
          );
        }
      }

      stateManager.touch.touchedId.splice(0, 1);
      stateManager.touch.touchedId.push(
        dom.getTaskIdAtPos(_e.touches[0].clientX, _e.touches[0].clientY)
      );
    });
  };

  const addRightClick = function () {
    document.addEventListener("contextmenu", (_e) => {
      _e.preventDefault();
    });

    document.addEventListener("mousedown", (_e) => {
      _e.stopPropagation();
      if (_e.button == 2 && !stateManager.currentlyEditing) {
        selection.triggerMenu(
          _e.clientX,
          _e.clientY,
          stateManager.selectionAddTo
        );
      }
    });
  };

  const addModifierKeys = function () {
    document.addEventListener("keydown", (_e) => {
      stateManager.setSelectionAddTo.bind(stateManager, true, _e)();
      stateManager.setSelectionMass.bind(stateManager, true, _e)();
    });

    document.addEventListener("keyup", (_e) => {
      stateManager.setSelectionAddTo.bind(stateManager, false, _e)();
      stateManager.setSelectionMass.bind(stateManager, false, _e)();
    });
  };

  const addClearData = function () {
    const clearData = document.querySelector(".clear-data");
    clearData.addEventListener("click", () => {
      if (!stateManager.currentlyEditing) {
        const shouldDelete = confirm(
          "This will delete all saved data. Continue?"
        );

        if (shouldDelete) {
          taskList.clear();
          taskList.clearLocalStorage();
        }
      }
    });
  };

  const addExpandSubtasks = function (_elem, _task, _subtasksElem) {
    _elem.addEventListener("click", () => {
      if (stateManager.currentlyEditing) return;

      _task.subtaskList.expanded = !_task.subtaskList.expanded;
      dom.setSubtaskExpandView(
        _task.subtaskList.expanded,
        _subtasksElem,
        _task,
        stateManager.selectionAddTo
      );
    });
  };

  const addExpandTask = function (
    _elem,
    _task,
    _taskElem,
    _svgPathElem,
    _headerElem
  ) {
    _elem.addEventListener("click", () => {
      if (stateManager.currentlyEditing) return;
      _task.expanded = !_task.expanded;
      dom.updateTaskExpandView(_svgPathElem, _taskElem, _task);
    });

    _headerElem.addEventListener("mouseover", (_event) => {
      const underMouse = document.elementsFromPoint(
        _event.clientX,
        _event.clientY
      );

      for (const _e of underMouse) {
        // Disregard positions that also intersect the expand button.
        if (_e.classList.contains("task-expand-img")) {
          _headerElem.classList.remove("hover-possible");

          return false;
        }
      }

      _headerElem.classList.add("hover-possible");

      return true;
    });
  };

  const addProgress = function (_svgElem, _task) {
    _svgElem.addEventListener("click", () => {
      if (!stateManager.currentlyEditing) {
        _task.progress = Math.max((_task.progress + 1) % 4, 1);
        _task.refreshDom(false);
      }
    });
  };

  const addOpenEdit = function (_elem, _task) {
    _elem.addEventListener("click", (_event) => {
      // Because mouseover doesn't exist on a touchscreen, the edit button is
      // revealed once the user has tapped the task's header and can only be
      // activated once revealed. I.e. the button can only be clicked if the
      // second-to-last touch was on the button's task's header.
      if (!stateManager.currentlyEditing) {
        if (_event.pointerType == "touch") {
          if (_task.selected && stateManager.touch.touchedId[0] == _task.id) {
            _task.currentlyEditing = true;
            stateManager.currentlyEditing = true;
            const inputBox = dom.createInputBox(_task);
            addInputCard(_task, inputBox);
          }
        } else {
          _task.currentlyEditing = true;
          stateManager.currentlyEditing = true;
          const inputBox = dom.createInputBox(_task);
          addInputCard(_task, inputBox);
        }
      }
    });
  };

  const addInputCard = function (_task, _inputObj) {
    _inputObj.progressCheck.addEventListener("change", () => {
      dom.updateProgressField(_inputObj.progressCheck, _inputObj.progressField);
    });

    _inputObj.confirm.addEventListener("click", () => {
      _task.currentlyEditing = false;
      stateManager.currentlyEditing = false;

      _task.title = _inputObj.titleInput.value;
      _task.dueDateStr = _inputObj.dateInput.value;
      _task.dueTimeStr = _inputObj.timeInput.value;
      _task.updateDue();
      _task.description = _inputObj.descInput.value;
      _task.priority = dom.getRadioValue(_inputObj.priorityField);
      _task.useProgressFromSubtasks = _inputObj.progressCheck.checked;

      if (_task.useProgressFromSubtasks) {
        _task.progress = _task.getProgressRecursive();
      } else {
        _task.progress = dom.getRadioValue(_inputObj.progressField);
      }

      _task.notes = _inputObj.notesInput.value;
      _inputObj.cardInput.remove();
      _inputObj.card.classList.remove("editing");
      _task.supertaskList.writeRootToLocalStorage();
      _task.refreshDom(false);
      dom.thaw();
    });

    _inputObj.cancel.addEventListener("click", () => {
      _task.currentlyEditing = false;
      stateManager.currentlyEditing = false;

      _inputObj.cardInput.remove();
      _inputObj.card.classList.remove("editing");
      dom.thaw();
    });
  };

  return {
    addLeftClick,
    addRightClick,
    addModifierKeys,
    addClearData,
    addExpandSubtasks,
    addExpandTask,
    addProgress,
    addOpenEdit,
    addInputCard,
  };
})();

const taskList = new TaskList();
taskList.restoreFromLocalStorage();

listener.addLeftClick();
listener.addRightClick();
listener.addModifierKeys();
listener.addClearData();

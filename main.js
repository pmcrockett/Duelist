/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCard: () => (/* binding */ createCard),
/* harmony export */   createInputBox: () => (/* binding */ createInputBox),
/* harmony export */   freeze: () => (/* binding */ freeze),
/* harmony export */   frozen: () => (/* binding */ frozen),
/* harmony export */   getTaskIdAtPos: () => (/* binding */ getTaskIdAtPos),
/* harmony export */   select: () => (/* binding */ select),
/* harmony export */   thaw: () => (/* binding */ thaw),
/* harmony export */   unselect: () => (/* binding */ unselect)
/* harmony export */ });
/* harmony import */ var dateformat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dateformat */ "./node_modules/dateformat/lib/dateformat.js");


const taskBin = document.querySelector(".task-bin");
const priorityList = [ "N/A", "Unimportant", "Important", "Urgent" ];
const progressList = [ "N/A", "Not started", "In progress", "Complete" ];

let frozen = false;

function createCard(_task, _stateManager) {
    // title;
    // due;
    // description;
    // progress;
    // notes;
    // id;
    let supertaskDiv = null;
    let supertask = _task.supertask;
    let neighborIdx = -1;

    if (_task.supertaskList) {
        neighborIdx = _task.supertaskList.getTaskIdx(_task) + 1;
    }
    
    let neighborId = -1;
    let neighborDiv = null;

    if (neighborIdx > 0 && neighborIdx < _task.supertaskList.tasks.length) {
        neighborId = _task.supertaskList.tasks[neighborIdx].id;
        neighborDiv = taskBin.querySelector(`.task.id-${neighborId}`);
    }
    
    if (supertask) {
        supertaskDiv = taskBin.querySelector(`.subtasks.id-${supertask.id}`);
    } else {
        supertaskDiv = taskBin;
    }

    let indentStr = `margin-left: calc(calc(var(--card-indent) * ${_task.depth}) + calc(var(--card-margin) * 0.5))`;
    // let indentStr = `margin-left: 0px`;
    let card = document.createElement("div");
    card.classList.add("task", `id-${_task.id}`);
    card.setAttribute("style", indentStr);

    if (_task.selected) {
        card.classList.add("selected");
    }

    if (neighborDiv) {
        neighborDiv.insertAdjacentElement("beforebegin", card);
    } else {
        supertaskDiv.appendChild(card);
    }
    
    let hDiv = document.createElement("div");
    hDiv.classList.add("card-header-div");
    card.appendChild(hDiv);

    let titleContainer = document.createElement("div");
    titleContainer.classList.add("card-title-container");
    hDiv.appendChild(titleContainer);

    if (_task.priority) {
        titleContainer.appendChild(createPrioritySvg(_task.priority));
    }

    if (_task.progress) {
        titleContainer.appendChild(createProgressSvg(_task.progress));
    }

    let h2 = document.createElement("h2");
    h2.textContent = _task.title;
    h2.classList.add("card-title", "card-editable");
    titleContainer.appendChild(h2);

    let svg = createSvg("M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M15.1,7.07C15.24,7.07 15.38,7.12 15.5,7.23L16.77,8.5C17,8.72 17,9.07 16.77,9.28L15.77,10.28L13.72,8.23L14.72,7.23C14.82,7.12 14.96,7.07 15.1,7.07M13.13,8.81L15.19,10.87L9.13,16.93H7.07V14.87L13.13,8.81Z", 
        "Edit task", true);
    svg.classList.add("edit-task-img");
    hDiv.appendChild(svg);

    if (_task.dueDate) {
        let dueDate = document.createElement("div");
        dueDate.textContent = `${(0,dateformat__WEBPACK_IMPORTED_MODULE_0__["default"])(_task.dueDate, "dddd, mmmm dS, yyyy")}`;
        //dueDate.textContent = `${_task.dueDate}`;
        dueDate.classList.add("card-due-date", "card-editable");
        hDiv.appendChild(dueDate);
    }

    if (_task.dueTime) {
        let dueTime = document.createElement("div");
        dueTime.textContent = `${(0,dateformat__WEBPACK_IMPORTED_MODULE_0__["default"])(_task.dueTime, "h:MM TT")}`;
        //dueTime.textContent = `${_task.dueTime}`;
        dueTime.classList.add("card-due-time", "card-editable");
        hDiv.appendChild(dueTime);
    }

    let taskExpandSvg = createSvg("", "Expand", true);
    taskExpandSvg.classList.add("task-expand-img");
    hDiv.appendChild(taskExpandSvg);

    if (!_task.hasContent()) {
        taskExpandSvg.classList.add("hidden");
    }

    let taskExpandPath = taskExpandSvg.querySelector("path:not(.bg-img)");
    updateTaskExpandView(taskExpandPath, card, _task);

    // let spacer = document.createElement("div");
    // spacer.classList.add("card-spacer", "card-content");
    // card.appendChild(spacer);

    //if (_task.priority > 0 || _task.progress > 0 || _task.useProgressFromSubtasks) {
    if (_task.priority > 0 || _task.progress > 0) {
        let infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container");
        card.appendChild(infoContainer);

        if (_task.priority > 0) {
            let priorityContainer = createCardContainer([ "card-container" ]);
            infoContainer.appendChild(priorityContainer);
    
            let priorityLabel = createCardContainerLabel("Priority", [ "card-label" ]);
            priorityContainer.appendChild(priorityLabel);

            let priority = document.createElement("div");
            priority.textContent = priorityList[_task.priority];
            priority.classList.add("card-priority", "card-editable");
            priorityContainer.appendChild(priority);
        }
    
        if (_task.progress > 0 || _task.useProgressFromSubtasks) {
            let progressContainer = createCardContainer([ "card-container" ]);
            infoContainer.appendChild(progressContainer);
    
            let progressLabel = createCardContainerLabel("Progress", [ "card-label" ]);
            progressContainer.appendChild(progressLabel);

            let prog = document.createElement("div");
            prog.textContent = progressList[_task.progress];

            if (_task.useProgressFromSubtasks) {
                prog.textContent += " (from subtasks)";
            }


            prog.classList.add("card-progress", "card-editable");
            progressContainer.appendChild(prog);
        }
    }

    if (_task.description.length) {
        let descContainer = createCardContainer([ "card-container" ]);
        card.appendChild(descContainer);

        let desc = document.createElement("div");
        desc.textContent = _task.description;
        desc.classList.add("card-description", "card-content", "card-editable");
        descContainer.appendChild(desc);

        let descLabel = createCardContainerLabel("About", [ "card-label" ]);
        descContainer.appendChild(descLabel);
    }

    if (_task.notes.length) {
        let notesContainer = createCardContainer([ "card-container" ]);
        card.appendChild(notesContainer);

        let notes = document.createElement("div");
        notes.textContent = _task.notes;
        notes.classList.add("card-notes", "card-content", "card-editable");
        notesContainer.appendChild(notes);

        let notesLabel = createCardContainerLabel("Notes", [ "card-label" ]);
        notesContainer.appendChild(notesLabel);
    }

    let subtasks = taskBin.querySelector(`.subtasks.id-${_task.id}`);

    if (!subtasks) {
        subtasks = document.createElement("div");
        //supertaskDiv.appendChild(subtasks);
        card.insertAdjacentElement("afterend", subtasks);
        subtasks.classList.add("subtasks", `id-${_task.id}`);

        let subtasksHeader = document.createElement("div");
        // subtasksHeader.textContent = `${_task.subtasks.length} subtasks`;
        subtasksHeader.classList.add("subtasks-header", `id-${_task.id}`);
        subtasksHeader.setAttribute("style", indentStr)
        subtasks.appendChild(subtasksHeader);

        let subtasksPlusSvg = createSvg("", "Subtasks", true);
        subtasksPlusSvg.classList.add("subtasks-plus-img");
        subtasksHeader.appendChild(subtasksPlusSvg);

        let subtasksPlusPath = subtasksPlusSvg.querySelector("path:not(.bg-img)");
        setSubtaskExpandView(_task.subtaskList.expanded, subtasks, _task, false);

        let subtasksText = document.createElement("div");
        subtasksText.classList.add("subtasks-text", `id-${_task.id}`);
        subtasksHeader.appendChild(subtasksText);
        
        subtasksText.textContent = `${_task.subtasks.length} 
            ${_task.subtasks.length == 1 ? "subtask" : "subtasks"}`;

        if (!_task.subtasks.length) {
            subtasksHeader.classList.add("hidden");
        } else {
            subtasksHeader.classList.remove("hidden");
        }

        // subtasksPlusSvg.addEventListener("click", _event => {
        subtasksHeader.addEventListener("click", _event => {
            if (_stateManager.currentlyEditing) return;

            _task.subtaskList.expanded = !_task.subtaskList.expanded;
            setSubtaskExpandView(_task.subtaskList.expanded, subtasks, _task, 
                _stateManager.selectionAddTo);
        });
    } else {
        subtasks.remove();
        card.insertAdjacentElement("afterend", subtasks);
        let subtasksHeader = subtasks.querySelector(".subtasks-header");
        let subtasksText = subtasks.querySelector(".subtasks-text");
        
        subtasksText.textContent = `${_task.subtasks.length} 
            ${_task.subtasks.length == 1 ? "subtask" : "subtasks"}`;

        if (!_task.subtasks.length) {
            subtasksHeader.classList.add("hidden");
        } else {
            subtasksHeader.classList.remove("hidden");
        }
    }

    //expandCard(_task, card);
    //expandCard(_task, subtasks);

    taskExpandSvg.addEventListener("click", _event => {
        if (_stateManager.currentlyEditing) return;
        _task.expanded = !_task.expanded;
        updateTaskExpandView(taskExpandPath, card, _task);
    });

    hDiv.addEventListener("mouseover", _e => {
        let underMouse = document.elementsFromPoint(_e.clientX, _e.clientY);

        for (let _elem of underMouse) {
            // Disregard positions that also intersect the expand button.
            if (_elem.classList.contains("task-expand-img")) {
                hDiv.classList.remove("hover-possible");
                return false
            }
        };

        hDiv.classList.add("hover-possible");
        
        return true;
    });

    svg.addEventListener("click", _event => {
        // Because mouseover doesn't exist on a touchscreen, the edit button is
        // revealed once the user has tapped the task's header and can only be
        // activated once revealed. I.e. the button can only be clicked if the
        // second-to-last touch was on the button's task's header.
        if (_event.pointerType == "touch") {
            if (_task.selected && _stateManager.touch.touchedId[0] == _task.id) {
                createInputBox(_task, _stateManager);
            }
        } else {
            createInputBox(_task, _stateManager);
        }
    });

    return {
        task: card,
        subtasks: subtasks
    };
}

function updateTaskExpandView(_svgPath, _card, _task) {
    expandCard(_task, _card);
    
    if (_task.expanded) {
        _svgPath.setAttribute("d", "M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M17,14L12,9L7,14H17Z");
    } else {
        _svgPath.setAttribute("d", "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M7,10L12,15L17,10H7Z");
    }
}

function setSubtaskExpandView(_expanded, _card, _task, _recursive) {
    let subtasksPlusPath = _card.querySelector(".subtasks-plus-img > path:not(.bg-img)");
    _task.subtaskList.expanded = _expanded;
    expandCard(_task.subtaskList, _card);
    
    if (_task.subtaskList.expanded) {
        subtasksPlusPath.setAttribute("d", "M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z");
    } else {
        subtasksPlusPath.setAttribute("d", "M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z");
    }

    if (_recursive) {
        for (let task of _task.subtaskList.tasks) {
            let subcard = _card.querySelector(`.subtasks.id-${task.id}`);
            setSubtaskExpandView(_expanded, subcard, task, _recursive);
        }
    }
}

function freeze() {
    frozen = true;
    taskBin.classList.add("freeze");
}

function thaw() {
    frozen = false;
    taskBin.classList.remove("freeze");
}

function select(_taskId) {
    let card = taskBin.querySelector(`.task.id-${_taskId}`);

    if (card) {
        card.classList.add("selected");
    }
}

function unselect(_taskId) {
    let card = taskBin.querySelector(`.task.id-${_taskId}`);

    if (card) {
        card.classList.remove("selected");
    }
}

function getTaskIdAtPos(_clientX, _clientY) {
    let underMouse = document.elementsFromPoint(_clientX, _clientY);
    let taskFound = false
    let id = -1;

    for (let _elem of underMouse) {
        // Disregard positions that also intersect the expand button.
        if (_elem.classList.contains("task")) {
            let idPos = _elem.className.indexOf("id-");
            let idEnd = _elem.className.indexOf(" ", idPos);
            if (idEnd < 0) idEnd = _elem.className.length;
            taskFound = true;
            id = Number(_elem.className.slice(idPos + 3, idEnd));
        } else if (_elem.classList.contains("task-expand-img")) {
            return -1;
        }
    };

    if (taskFound) {
        return id;
    }
    return -1;
}

function createCardContainer(_classes) {
    let container = document.createElement("div");
    container.classList.add(..._classes);
    return container;
}

function createCardContainerLabel(_text, _classes) {
    let label = document.createElement("div");
    label.textContent = _text;
    label.classList.add(..._classes);
    return label;
}

function expandCard(_task, _div) {
    if (_task.expanded) {
        _div.classList.remove("collapsed");
        _div.classList.add("expanded");

        return;
    }

    _div.classList.remove("expanded");
    _div.classList.add("collapsed");
}

function createInputBox(_task, _stateManager) {
    if (_stateManager.currentlyEditing) return;
    freeze();
    let body = document.querySelector("body");
    let card = body.querySelector(`.task.id-${_task.id}`);
    card.classList.add("editing");

    _task.currentlyEditing = true;
    _stateManager.currentlyEditing = true;

    // let cardSpacer = document.createElement("div");
    // cardSpacer.classList.add("card-spacer")
    // _body.appendChild(cardSpacer);

    let cardInput = document.createElement("div");
    cardInput.classList.add("card-input");
    body.appendChild(cardInput);

    let titleFieldContainer = document.createElement("div");
    titleFieldContainer.classList.add("field-container");
    cardInput.appendChild(titleFieldContainer);

    let titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "input-title");
    titleLabel.textContent = "Task name";
    titleFieldContainer.appendChild(titleLabel);

    let titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "input-title");
    titleInput.setAttribute("id", "input-title");
    titleInput.setAttribute("value", _task.title);
    titleFieldContainer.appendChild(titleInput);
    titleInput.focus();
    titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);

    let dueContainer = document.createElement("div");
    dueContainer.classList.add("due-container", "input-container");
    cardInput.appendChild(dueContainer);

    let dateFieldContainer = document.createElement("div");
    dateFieldContainer.classList.add("field-container");
    dueContainer.appendChild(dateFieldContainer);

    let dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "input-date");
    dateLabel.textContent = "Due date";
    dateFieldContainer.appendChild(dateLabel);

    let dateInput = document.createElement("input");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("name", "input-date");
    dateInput.setAttribute("id", "input-date");
    dateInput.setAttribute("value", _task.dueDateStr);
    dateFieldContainer.appendChild(dateInput);

    let timeFieldContainer = document.createElement("div");
    timeFieldContainer.classList.add("field-container");
    dueContainer.appendChild(timeFieldContainer);

    let timeLabel = document.createElement("label");
    timeLabel.setAttribute("for", "input-time");
    timeLabel.textContent = "Due time";
    timeFieldContainer.appendChild(timeLabel);

    let timeInput = document.createElement("input");
    timeInput.setAttribute("type", "time");
    timeInput.setAttribute("name", "input-time");
    timeInput.setAttribute("id", "input-time");
    timeInput.setAttribute("value", _task.dueTimeStr);
    timeFieldContainer.appendChild(timeInput);

    let descFieldContainer = document.createElement("div");
    descFieldContainer.classList.add("field-container");
    cardInput.appendChild(descFieldContainer);

    let descLabel = document.createElement("label");
    descLabel.setAttribute("for", "input-desc");
    descLabel.textContent = "Description";
    descFieldContainer.appendChild(descLabel);

    let descInput = document.createElement("textarea");
    descInput.setAttribute("name", "input-desc");
    descInput.setAttribute("id", "input-desc");
    descInput.textContent = _task.description;
    descFieldContainer.appendChild(descInput);

    let radioContainer = document.createElement("div");
    radioContainer.classList.add("radio-container", "input-container");
    cardInput.appendChild(radioContainer);

    let priorityFieldContainer = document.createElement("div");
    priorityFieldContainer.classList.add("field-container");
    radioContainer.appendChild(priorityFieldContainer);

    let priorityLabel = document.createElement("div");
    priorityLabel.classList.add("pseudo-label");
    priorityLabel.textContent = "Priority";
    priorityFieldContainer.appendChild(priorityLabel);

    let priorityField = createRadioField("priority-radio", _task.priority, priorityList);
    priorityField.setAttribute("name", "input-priority");
    priorityField.setAttribute("id", "input-priority");
    priorityFieldContainer.appendChild(priorityField);

    let progressFieldContainer = document.createElement("div");
    progressFieldContainer.classList.add("field-container");
    radioContainer.appendChild(progressFieldContainer);

    let progressLabel = document.createElement("div");
    progressLabel.classList.add("pseudo-label");
    progressLabel.textContent = "Progress";
    progressFieldContainer.appendChild(progressLabel);

    let progressField = createRadioField("progress-radio", _task.progress, progressList);
    progressField.setAttribute("name", "input-progress");
    progressField.setAttribute("id", "input-progress");
    progressFieldContainer.appendChild(progressField);

    let progressCheckContainer = document.createElement("div");
    progressCheckContainer.classList.add("progress-check-container");
    progressFieldContainer.appendChild(progressCheckContainer);

    let progressCheck = document.createElement("input");
    progressCheck.setAttribute("type", "checkbox");

    if (_task.useProgressFromSubtasks) {
        progressCheck.setAttribute("checked", "checked");
    }

    progressCheck.setAttribute("id", "progress-check");
    progressCheck.setAttribute("name", "progress-check");
    progressCheck.setAttribute("id", "progress-check");
    let progressCheckLabel = document.createElement("label");
    progressCheckLabel.setAttribute("for", "progress-check");
    progressCheckLabel.textContent = "Set progress from subtasks";
    progressCheckContainer.appendChild(progressCheck);
    progressCheckContainer.appendChild(progressCheckLabel);

    updateProgressField(progressCheck, progressField);

    let notesFieldContainer = document.createElement("div");
    notesFieldContainer.classList.add("field-container");
    cardInput.appendChild(notesFieldContainer);

    let notesLabel = document.createElement("label");
    notesLabel.setAttribute("for", "input-notes");
    notesLabel.textContent = "Notes";
    notesFieldContainer.appendChild(notesLabel);

    let notesInput = document.createElement("textarea");
    notesInput.setAttribute("name", "input-notes");
    notesInput.setAttribute("id", "input-notes");
    notesInput.textContent = _task.notes;
    notesFieldContainer.appendChild(notesInput);

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("input-buttons");
    cardInput.appendChild(buttonDiv);

    let confirm = createSvg("M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",
        "Confirm", true, "input-button");
    confirm.classList.add("confirm-edit-img", "input-button");
    buttonDiv.appendChild(confirm);

    let cancel = createSvg("M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z",
        "Cancel", true, "input-button");
    cancel.classList.add("confirm-edit-img", "input-button");
    buttonDiv.appendChild(cancel);

    progressCheck.addEventListener("change", _e => {
        updateProgressField(progressCheck, progressField);
    });

    confirm.addEventListener("click", _event => {
        _task.currentlyEditing = false;
        _stateManager.currentlyEditing = false;

        _task.title = titleInput.value;
        _task.dueDateStr = dateInput.value;
        _task.dueTimeStr = timeInput.value;
        _task.updateDue();
        _task.description = descInput.value;
        _task.priority = getRadioValue(priorityField);
        _task.useProgressFromSubtasks = progressCheck.checked;

        if (_task.useProgressFromSubtasks) {
            _task.progress = _task.getProgressRecursive();
        } else {
            _task.progress = getRadioValue(progressField);
        }

        _task.notes = notesInput.value;
        _task.expanded = _task.hasContent();

        // let subtaskProgress = _task.getProgressRecursive();
        // console.log("subtaskProgress: " + subtaskProgress);

        cardInput.remove();
        thaw();
        card.classList.remove("editing");
        _task.refreshDom(false);
    });

    cancel.addEventListener("click", _event => {
        _task.currentlyEditing = false;
        _stateManager.currentlyEditing = false;
        
        cardInput.remove();
        card.classList.remove("editing");
        thaw();
    });
}

function updateProgressField(_check, _field) {
    if (_check.checked) {
        _field.setAttribute("disabled", "disabled");
    } else {
        _field.removeAttribute("disabled");
    }
}

function createRadioField(_name, _defaultValue, _labelArr) {
    let field = document.createElement("fieldset");
    field.classList.add(`${_name}-fieldset`);

    let radios = [];
    let labels = [];

    for (let i = 0; i < _labelArr.length; i++) {
        radios.push(document.createElement("input"));
        radios[i].setAttribute("type", "radio");
        radios[i].setAttribute("id", `${_name}-${i}`);
        radios[i].setAttribute("name", _name);
        radios[i].setAttribute("value", _labelArr[i]);
        field.appendChild(radios[i]);

        labels.push(document.createElement("label"));
        labels[i].setAttribute("for", `${_name}-${i}`);
        labels[i].textContent = _labelArr[i];
        field.appendChild(labels[i]);
    }

    radios[_defaultValue].setAttribute("checked", "");

    return field;
}

function getRadioValue(_fieldset) {
    let radios = _fieldset.querySelectorAll("input");

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return i;
        }
    }

    return -1;
}

function createSvg(_path, _title, _useBg, _pathClass) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    
    let title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = _title;
    svg.appendChild(title);
    if (_useBg) {
        var bgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bgPath.setAttribute("d", "M12,4A10,10 0 0,0 4,12A10,10 0 0,0 12,20A10,10 0 0,0 20,12A10,10 0 0,0 12,4Z");
        bgPath.classList.add("bg-img");
        svg.appendChild(bgPath);
    }
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", _path);
    svg.appendChild(path);

    if (_pathClass != null) {
        path.classList.add(_pathClass);
        
        if (_useBg) {
            bgPath.classList.add(_pathClass);
        }
    }

    return svg;
}

function createPrioritySvg(_priority) {
    const priorityPath = [
        "M12 16C13.66 16 15 14.66 15 13C15 11.88 14.39 10.9 13.5 10.39L3.79 4.77L9.32 14.35C9.82 15.33 10.83 16 12 16M12 3C10.19 3 8.5 3.5 7.03 4.32L9.13 5.53C10 5.19 11 5 12 5C16.42 5 20 8.58 20 13C20 15.21 19.11 17.21 17.66 18.65H17.65C17.26 19.04 17.26 19.67 17.65 20.06C18.04 20.45 18.68 20.45 19.07 20.07C20.88 18.26 22 15.76 22 13C22 7.5 17.5 3 12 3M2 13C2 15.76 3.12 18.26 4.93 20.07C5.32 20.45 5.95 20.45 6.34 20.06C6.73 19.67 6.73 19.04 6.34 18.65C4.89 17.2 4 15.21 4 13C4 12 4.19 11 4.54 10.1L3.33 8C2.5 9.5 2 11.18 2 13Z",
        "M12 1.38L9.14 12.06C8.8 13.1 9.04 14.29 9.86 15.12C11.04 16.29 12.94 16.29 14.11 15.12C14.9 14.33 15.16 13.2 14.89 12.21M14.6 3.35L15.22 5.68C18.04 6.92 20 9.73 20 13C20 15.21 19.11 17.21 17.66 18.65H17.65C17.26 19.04 17.26 19.67 17.65 20.06C18.04 20.45 18.68 20.45 19.07 20.07C20.88 18.26 22 15.76 22 13C22 8.38 18.86 4.5 14.6 3.35M9.4 3.36C5.15 4.5 2 8.4 2 13C2 15.76 3.12 18.26 4.93 20.07C5.32 20.45 5.95 20.45 6.34 20.06C6.73 19.67 6.73 19.04 6.34 18.65C4.89 17.2 4 15.21 4 13C4 9.65 5.94 6.86 8.79 5.65",
        "M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z"
    ];

    const priorityClass = [
        "priority-low",
        "priority-mid",
        "priority-high"
    ];

    let prioritySvg = createSvg(priorityPath[_priority - 1], 
        priorityList[_priority], false);
    prioritySvg.classList.add("priority-img", priorityClass[_priority - 1]);

    return prioritySvg;
}

function createProgressSvg(_progress) {
    const progressPath = [
        "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
        "M8.46 8.46C9.4 7.53 10.67 7 12 7C13.33 7 14.6 7.53 15.54 8.46L8.46 15.54C7.53 14.6 7 13.33 7 12C7 10.67 7.53 9.4 8.46 8.46M8.17 2.76C9.39 2.26 10.69 2 12 2C13.31 2 14.61 2.26 15.83 2.76C17.04 3.26 18.14 4 19.07 4.93C20 5.86 20.74 6.96 21.24 8.17C21.74 9.39 22 10.69 22 12C22 14.65 20.95 17.2 19.07 19.07C17.2 20.95 14.65 22 12 22C10.69 22 9.39 21.74 8.17 21.24C6.96 20.74 5.86 20 4.93 19.07C3.05 17.2 2 14.65 2 12C2 9.35 3.05 6.8 4.93 4.93C5.86 4 6.96 3.26 8.17 2.76M6.34 17.66C7.84 19.16 9.88 20 12 20C14.12 20 16.16 19.16 17.66 17.66C19.16 16.16 20 14.12 20 12C20 9.88 19.16 7.84 17.66 6.34C16.16 4.84 14.12 4 12 4C9.88 4 7.84 4.84 6.34 6.34C4.84 7.84 4 9.88 4 12C4 14.12 4.84 16.16 6.34 17.66Z",
        "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"
    ];

    const progressClass = [
        "progress-not-started",
        "progress-in-progress",
        "progress-completed"
    ];

    let progressSvg = createSvg(progressPath[_progress - 1], 
        progressList[_progress], false);
    progressSvg.classList.add("progress-img", progressClass[_progress - 1]);

    return progressSvg;
}

/***/ }),

/***/ "./src/right-click-menu.js":
/*!*********************************!*\
  !*** ./src/right-click-menu.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Style menu colors via CSS:
//
// .menu-rect {
//     fill: color;
// }
// .menu-border {
//     fill: color;
// }
// .menu-text {
//     fill: color;
// }
// .menu-highlight {
//     fill: color;
// }

const namespace = "http://www.w3.org/2000/svg";

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class {
    clickReleaseWindow;
    svg;
    group;
    menu;
    border;
    menuItems = [];
    buttonDownTime;
    isVisible = false;
    tileGroup = null;
    functions;
    itemTexts;
    borderSize = 1;
    scale = 1;
    fontSize = 20;
    // menuMargin creates an invisible, non-selectable buffer zone around the 
    // menu so we can listen for the mouse leaving the menu and disable the 
    // highlight without having to listen over the entire document.
    menuMargin = 2;
    menuPosOffset = { x: -4, y: -1 };
    menuWidth;
    menuHeight;
    initTime;
    // postInitDelay sets a delay on when menu items can be triggered after menu
    // init. This provides a safeguard against accidentally catching a click that
    // opened the menu.
    postInitDelay = 200;
    html;

    constructor (_itemTexts, _functions) {
        this.html = document.querySelector("html");
        this.svg = document.createElementNS(namespace, "svg");
        this.svg.classList.add("menu");
        this.svg.setAttribute("display", "none");
        this.clickReleaseWindow = 500;
        this.group = document.createElementNS(namespace, "g");
        this.menu = document.createElementNS(namespace, "rect");
        this.border = document.createElementNS(namespace, "rect");

        this.group.appendChild(this.border);
        this.group.appendChild(this.menu);
        this.group.setAttribute("id", `menuGroup`);

        //this.border.setAttribute("fill", "red");
        this.border.classList.add("menu-border");

        //this.menu.setAttribute("fill", "green");
        this.menu.classList.add("menu-rect");

        this.functions = _functions;
        this.itemTexts = _itemTexts;

        this.svg.addEventListener("mousemove", _e => {
            this.updateHighlight(_e.clientX, _e.clientY);
        });

        window.addEventListener("scroll", (_e) => {
            if (this.isVisible) {
                this.erase();
            }
        });

        document.addEventListener("mousedown", _e => {
            if (this.isVisible && new Date().getTime() - this.initTime > 
                    this.postInitDelay) {
                let menuSelection = this.getHighlighted();
                let menuMouseOver = document.elementsFromPoint(_e.clientX, _e.clientY);
    
                if (menuSelection && menuMouseOver.includes(menuSelection.rect)) {
                    this.activateSelection();
                }
    
                this.erase();
                this.svg.remove();
            }
        });
    }

    init() {
        this.svg.setAttribute("display", "block");
        this.svg.setAttribute("style", `position: absolute;`);

        for (let i = 0; i < this.itemTexts.length; i++) {
            this.addMenuItem(this.itemTexts[i], this.functions[i]);
        }

        let height = 0;
        let width = 0;
        for (let x of this.menuItems) {
            let newWidth = x.svgText.text.getBBox().width + x.svgText.xMargin * 2;

            if (newWidth > width) {
                width = newWidth;
            }
        }
        for (let i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].rect.setAttribute("width", width);
            this.menuItems[i].group.setAttribute("transform", `translate(0, ${height})`);
            height += Number(this.menuItems[i].rect.getAttribute("height"));

        }

        this.menu.setAttribute("width", `${width}`);
        this.menu.setAttribute("height", `${height}`);
        this.border.setAttribute("width", `${width + this.borderSize * 2}`);
        this.border.setAttribute("height", `${height + this.borderSize * 2}`);
        this.border.setAttribute("x", `${this.borderSize * -1}`);
        this.border.setAttribute("y", `${this.borderSize * -1}`);

        this.svg.setAttribute("width", `${width * this.scale + this.borderSize * this.scale}`);
        this.svg.setAttribute("height", `${height * this.scale + this.borderSize * this.scale}`);
        this.svg.setAttribute("viewBox", 
            `${this.borderSize * -1 - this.menuMargin} ${this.borderSize * -1 - 
            this.menuMargin} ${width + this.borderSize * 2 + this.menuMargin * 
            2} ${height + this.borderSize * 2 + this.menuMargin * 2}`);

        //this.menuWidth = width + this.borderSize * 2 - this.menuMargin * 2;
        this.menuWidth = width + this.borderSize * 2 - this.menuMargin * 2;
        this.menuHeight = height + this.borderSize * 2 - this.menuMargin * 2;

        this.initTime = new Date().getTime();
    }

    buttonDown(_clientX, _clientY) {
        if (this.isVisible) this.erase();
        this.isVisible = true;
        this.svg.appendChild(this.group);
        this.init();

        const docWidth = this.html.clientWidth;
        const docHeight = this.html.clientHeight;

        // Adjustment values if the menu extends off the screen.
        let xOffset = 0;
        let yOffset = 0;

        if (_clientX + this.menuPosOffset.x + this.menuWidth + 1 > docWidth) {
            xOffset =  docWidth - (_clientX + this.menuPosOffset.x + this.menuWidth + 1); 
        }

        if (_clientY + this.menuPosOffset.y + this.menuHeight + 1 > docHeight) {
            yOffset =  docHeight - (_clientY + this.menuPosOffset.y + this.menuHeight + 1);
        }

        this.svg.setAttribute("transform", `translate(${_clientX - this.menuMargin + 
            this.menuPosOffset.x + xOffset + window.scrollX}, ${_clientY - this.menuMargin + 
            this.menuPosOffset.y + yOffset + window.scrollY})`);
        this.updateHighlight(_clientX, _clientY);
        this.buttonDownTime = performance.now();
    }

    buttonUp() {
        if (performance.now() - this.buttonDownTime > clickReleaseWindow) this.erase();
    };

    erase() {
        this.group.remove();

        for (let item of this.menuItems) {
            item.group.remove();
        }

        this.svg.setAttribute("display", "none");
        this.menuItems = [];
        this.isVisible = false;
    }

    addMenuItem(_text, _function, _idx) {
        if (_idx == null) _idx = this.menuItems.length;
        this.menuItems.splice(_idx, 0, new MenuItem(_text, this.fontSize, 
            this.group, _idx, _function));
    }

    updateHighlight(_clientX, _clientY) {
        if (this.isVisible) {
            for (let x of this.menuItems) {
                x.unhighlight();
            }
            let menuMouseOver = document.elementsFromPoint(_clientX, _clientY);
            for (let x of this.menuItems) {
                if (menuMouseOver.includes(x.rect)) {
                    x.highlight();
                    break;
                }
            }
        }
    };

    getHighlighted() {
        if (this.isVisible) {
            for (let x of this.menuItems) {
                if (x.isHighlighted) return x;
            }
        }
        return;
    };

    getHighlightedText() {
        let highlighted = this.getHighlighted();
        return highlighted ? highlighted.svgText.text.textContent : undefined;
    };

    activateSelection(_selection = "highlighted") {
        if (_selection === "highlighted") _selection = this.getHighlightedText();

        let active = this.menuItems.find(_e => _e.text == _selection);
        
        if (active) {
            return active.function();
        }

        return null;
    };
});

class MenuItem {
    rect;
    group;
    text;
    svgText;
    isHighlighted;
    functions;

    constructor(_text, _fontSize, _parent, _idx, _function) {
        this.text = _text;
        this.rect = document.createElementNS(namespace, "rect");
        this.group = document.createElementNS(namespace, "g");
        this.group.appendChild(this.rect);
        _parent.appendChild(this.group);
        this.svgText = new SVGText(_text, this.group, _idx, _fontSize);
        this.rect.setAttribute("fill", "rgba(0, 0, 0, 0)");
        //this.rect.setAttribute("display", "none");
        this.rect.setAttribute("height", `${_fontSize * 1.2}`);
        this.rect.classList.add("menu-item");
        
        this.isHighlighted = false;
        this.function = _function;
    }

    highlight() {
        //this.rect.setAttribute("fill", "pink");
        //this.rect.setAttribute("display", "block");
        this.rect.classList.add("menu-highlight");
        this.isHighlighted = true;
    };

    unhighlight() {
        //this.rect.setAttribute("fill", "rgba(0, 0, 0, 0)");
        //this.rect.setAttribute("display", "none");
        this.rect.classList.remove("menu-highlight");
        this.isHighlighted = false;
    };
}

function SVGText(_content, _parent, _id = -1, _fontSize = 10) {
    this.fontSize = _fontSize;
    this.xMargin = this.fontSize * 0.2;
    this.text = document.createElementNS(namespace, "text");
    this.text.textContent = _content;
    //this.text.setAttribute("fill", "yellow");
    this.text.setAttribute("cursor", "default");
    this.text.classList.add(`menu-text-${_id}`);
    this.text.classList.add("menu-text");
    _parent.appendChild(this.text);
    this.text.setAttribute("x", `${this.xMargin}`);
    this.text.setAttribute("y", `${this.fontSize * 0.9}`);
    this.text.setAttribute("font-size", `${this.fontSize}px`);
}

/***/ }),

/***/ "./src/timezone-string.js":
/*!********************************!*\
  !*** ./src/timezone-string.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
    let offset = new Date().getTimezoneOffset();
    //let offset = 0;
    let offsetDir = offset < 0 ? -1 : 1;
    offset = Math.abs(offset);
    let str = `${String(Math.floor(offset / 60)).padStart(2, "0")}:${String(offset % 60).padStart(2, "0")}`;

    if (offsetDir == 1) {
        str = "-" + str;
    } else {
        str = "+" + str
    }

    return str;
}

/***/ }),

/***/ "./node_modules/dateformat/lib/dateformat.js":
/*!***************************************************!*\
  !*** ./node_modules/dateformat/lib/dateformat.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dateFormat),
/* harmony export */   formatTimezone: () => (/* binding */ formatTimezone),
/* harmony export */   i18n: () => (/* binding */ i18n),
/* harmony export */   masks: () => (/* binding */ masks)
/* harmony export */ });
var token=/d{1,4}|D{3,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|W{1,2}|[LlopSZN]|"[^"]*"|'[^']*'/g;var timezone=/\b(?:[A-Z]{1,3}[A-Z][TC])(?:[-+]\d{4})?|((?:Australian )?(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time)\b/g;var timezoneClip=/[^-+\dA-Z]/g;function dateFormat(date,mask,utc,gmt){if(arguments.length===1&&typeof date==="string"&&!/\d/.test(date)){mask=date;date=undefined}date=date||date===0?date:new Date;if(!(date instanceof Date)){date=new Date(date)}if(isNaN(date)){throw TypeError("Invalid date")}mask=String(masks[mask]||mask||masks["default"]);var maskSlice=mask.slice(0,4);if(maskSlice==="UTC:"||maskSlice==="GMT:"){mask=mask.slice(4);utc=true;if(maskSlice==="GMT:"){gmt=true}}var _=function _(){return utc?"getUTC":"get"};var _d=function d(){return date[_()+"Date"]()};var D=function D(){return date[_()+"Day"]()};var _m=function m(){return date[_()+"Month"]()};var y=function y(){return date[_()+"FullYear"]()};var _H=function H(){return date[_()+"Hours"]()};var _M=function M(){return date[_()+"Minutes"]()};var _s=function s(){return date[_()+"Seconds"]()};var _L=function L(){return date[_()+"Milliseconds"]()};var _o=function o(){return utc?0:date.getTimezoneOffset()};var _W=function W(){return getWeek(date)};var _N=function N(){return getDayOfWeek(date)};var flags={d:function d(){return _d()},dd:function dd(){return pad(_d())},ddd:function ddd(){return i18n.dayNames[D()]},DDD:function DDD(){return getDayName({y:y(),m:_m(),d:_d(),_:_(),dayName:i18n.dayNames[D()],short:true})},dddd:function dddd(){return i18n.dayNames[D()+7]},DDDD:function DDDD(){return getDayName({y:y(),m:_m(),d:_d(),_:_(),dayName:i18n.dayNames[D()+7]})},m:function m(){return _m()+1},mm:function mm(){return pad(_m()+1)},mmm:function mmm(){return i18n.monthNames[_m()]},mmmm:function mmmm(){return i18n.monthNames[_m()+12]},yy:function yy(){return String(y()).slice(2)},yyyy:function yyyy(){return pad(y(),4)},h:function h(){return _H()%12||12},hh:function hh(){return pad(_H()%12||12)},H:function H(){return _H()},HH:function HH(){return pad(_H())},M:function M(){return _M()},MM:function MM(){return pad(_M())},s:function s(){return _s()},ss:function ss(){return pad(_s())},l:function l(){return pad(_L(),3)},L:function L(){return pad(Math.floor(_L()/10))},t:function t(){return _H()<12?i18n.timeNames[0]:i18n.timeNames[1]},tt:function tt(){return _H()<12?i18n.timeNames[2]:i18n.timeNames[3]},T:function T(){return _H()<12?i18n.timeNames[4]:i18n.timeNames[5]},TT:function TT(){return _H()<12?i18n.timeNames[6]:i18n.timeNames[7]},Z:function Z(){return gmt?"GMT":utc?"UTC":formatTimezone(date)},o:function o(){return(_o()>0?"-":"+")+pad(Math.floor(Math.abs(_o())/60)*100+Math.abs(_o())%60,4)},p:function p(){return(_o()>0?"-":"+")+pad(Math.floor(Math.abs(_o())/60),2)+":"+pad(Math.floor(Math.abs(_o())%60),2)},S:function S(){return["th","st","nd","rd"][_d()%10>3?0:(_d()%100-_d()%10!=10)*_d()%10]},W:function W(){return _W()},WW:function WW(){return pad(_W())},N:function N(){return _N()}};return mask.replace(token,function(match){if(match in flags){return flags[match]()}return match.slice(1,match.length-1)})}var masks={default:"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",paddedShortDate:"mm/dd/yyyy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:sso",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",expiresHeaderFormat:"ddd, dd mmm yyyy HH:MM:ss Z"};var i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"],timeNames:["a","p","am","pm","A","P","AM","PM"]};var pad=function pad(val){var len=arguments.length>1&&arguments[1]!==undefined?arguments[1]:2;return String(val).padStart(len,"0")};var getDayName=function getDayName(_ref){var y=_ref.y,m=_ref.m,d=_ref.d,_=_ref._,dayName=_ref.dayName,_ref$short=_ref["short"],_short=_ref$short===void 0?false:_ref$short;var today=new Date;var yesterday=new Date;yesterday.setDate(yesterday[_+"Date"]()-1);var tomorrow=new Date;tomorrow.setDate(tomorrow[_+"Date"]()+1);var today_d=function today_d(){return today[_+"Date"]()};var today_m=function today_m(){return today[_+"Month"]()};var today_y=function today_y(){return today[_+"FullYear"]()};var yesterday_d=function yesterday_d(){return yesterday[_+"Date"]()};var yesterday_m=function yesterday_m(){return yesterday[_+"Month"]()};var yesterday_y=function yesterday_y(){return yesterday[_+"FullYear"]()};var tomorrow_d=function tomorrow_d(){return tomorrow[_+"Date"]()};var tomorrow_m=function tomorrow_m(){return tomorrow[_+"Month"]()};var tomorrow_y=function tomorrow_y(){return tomorrow[_+"FullYear"]()};if(today_y()===y&&today_m()===m&&today_d()===d){return _short?"Tdy":"Today"}else if(yesterday_y()===y&&yesterday_m()===m&&yesterday_d()===d){return _short?"Ysd":"Yesterday"}else if(tomorrow_y()===y&&tomorrow_m()===m&&tomorrow_d()===d){return _short?"Tmw":"Tomorrow"}return dayName};var getWeek=function getWeek(date){var targetThursday=new Date(date.getFullYear(),date.getMonth(),date.getDate());targetThursday.setDate(targetThursday.getDate()-(targetThursday.getDay()+6)%7+3);var firstThursday=new Date(targetThursday.getFullYear(),0,4);firstThursday.setDate(firstThursday.getDate()-(firstThursday.getDay()+6)%7+3);var ds=targetThursday.getTimezoneOffset()-firstThursday.getTimezoneOffset();targetThursday.setHours(targetThursday.getHours()-ds);var weekDiff=(targetThursday-firstThursday)/(864e5*7);return 1+Math.floor(weekDiff)};var getDayOfWeek=function getDayOfWeek(date){var dow=date.getDay();if(dow===0){dow=7}return dow};var formatTimezone=function formatTimezone(date){return(String(date).match(timezone)||[""]).pop().replace(timezoneClip,"").replace(/GMT\+0000/g,"UTC")};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./src/dom.js");
/* harmony import */ var _timezone_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./timezone-string.js */ "./src/timezone-string.js");
/* harmony import */ var _right_click_menu_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./right-click-menu.js */ "./src/right-click-menu.js");
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

        let timezone = (0,_timezone_string_js__WEBPACK_IMPORTED_MODULE_1__["default"])();

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

        this.domDiv = _dom_js__WEBPACK_IMPORTED_MODULE_0__.createCard(this, stateManager);

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

    createTask(_idx, _showInput) {
        if (!_idx) {
            _idx = this.tasks.length + 1;
        }

        let newTask = new Task();
        this.add(newTask, _idx);
        if (this.owner) {
            this.owner.refreshDom(true);
        } else {
            this.refreshDom(false);
        }

        if (_showInput) {
            _dom_js__WEBPACK_IMPORTED_MODULE_0__.createInputBox(newTask, stateManager);
        }
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

        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i].refreshDom(_recursive);
            // dom.setTaskZDepth(this.tasks[i], 500 - i);
        }
    }
}

let stateManager = (function() {
    let currentlyEditing = false;
    let selectionAddTo = false;
    let selectionMass = false;
    let touch = {
        time: [ null, null ],
        pos: [ null, null ],
        touchedId: [ null, null ]
    };

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
        selectionAddTo,
        touch
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

    let remove = function(_tasks, _recursive, _refresh) {
        if (!(_tasks instanceof Array)) {
            _tasks = [ _tasks ];
        }

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
        this.remove(_tasks, _recursive);
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
        remove,
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
            _dom_js__WEBPACK_IMPORTED_MODULE_0__.select(_task.id);
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
            _dom_js__WEBPACK_IMPORTED_MODULE_0__.unselect(_task.id);

            return true;
        }

        return false;
    };

    let clear = function() {
        for (let task of selected) {
            task.selected = false;
            _dom_js__WEBPACK_IMPORTED_MODULE_0__.unselect(task.id);
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

    let triggerMenu = function(_clientX, _clientY, _selectionAddTo) {
        let task = taskList.getTaskById(_dom_js__WEBPACK_IMPORTED_MODULE_0__.getTaskIdAtPos(_clientX, 
            _clientY), true);
    
        if (task && !selected.includes(task)) {
            updateSelection(task);
        }

        if (task && selection.selected.length) {
            _dom_js__WEBPACK_IMPORTED_MODULE_0__.freeze();
            //selection.add(task);
            let menuTexts = [ "New task (above)", "New task (below)", 
                "New task (as subtask)", "Copy (with subtasks)", 
                "Copy (without subtasks)", "Cut (with subtasks)", 
                "Cut (without subtasks)" ];
            let menuFunctions = [
                function() {task.supertaskList.createTask(
                    task.supertaskList.getTaskIdx(task), true);},
                function() {task.supertaskList.createTask(
                    task.supertaskList.getTaskIdx(task) + 1, true);},
                function() {task.subtaskList.createTask(null, true);},
                function() {copier.copy(selection.selected, true, taskList);},
                function() {copier.copy(selection.selected, false, taskList);},
                function() {copier.cut(selection.selected, true, true, taskList);},
                function() {copier.cut(selection.selected, false, true, taskList);}
            ];
    
            // Only show paste option if there's something to paste.
            if (copier.buffer.length) {
                menuTexts.push("Paste (above)", "Paste (below)", "Paste (as subtask)");
                menuFunctions.push(
                    function() {copier.paste(task.supertaskList, 
                        task.supertaskList.getTaskIdx(task));},
                    function() {copier.paste(task.supertaskList, 
                        task.supertaskList.getTaskIdx(task) + 1);},
                    function() {copier.paste(task.subtaskList);}
                );
            }

            menuTexts.push("Delete (including subtasks)",
                "Delete (not including subtasks)");
            menuFunctions.push(function() {copier.remove(selection.selected, true, 
                    true)},
                function() {copier.remove(selection.selected, false, 
                    true)}
                );
    
            let menu = new _right_click_menu_js__WEBPACK_IMPORTED_MODULE_2__["default"](menuTexts, menuFunctions);
            document.querySelector("body").appendChild(menu.svg);
            menu.buttonDown(_clientX, _clientY);
        } else {
            _dom_js__WEBPACK_IMPORTED_MODULE_0__.freeze();
            let menuTexts = [ "New task"];
            let menuFunctions = [
                function() {taskList.createTask(taskList.tasks.length, 
                    true);}
            ];

            if (copier.buffer.length) {
                menuTexts.push("Paste");
                menuFunctions.push(function() {copier.paste(taskList, 
                    taskList.tasks.length)});
            }

            let menu = new _right_click_menu_js__WEBPACK_IMPORTED_MODULE_2__["default"](menuTexts, menuFunctions);
        document.querySelector("body").appendChild(menu.svg);
        menu.buttonDown(_clientX, _clientY);
        }
        
        // else if (copier.buffer.length) {
        //     dom.freeze();
        //     let menu = new RightClickMenu([ "New task", "Paste" ], 
        //         [
        //             function() {copier.paste(taskList, taskList.tasks.length)}
        //         ]);
        //     document.querySelector("body").appendChild(menu.svg);
        //     menu.buttonDown(_clientX, _clientY);
        // }
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
    // let task = taskList.getTaskById(dom.getTaskIdAtPos(_e.pageX, _e.pageY), true);
    let task = taskList.getTaskById(_dom_js__WEBPACK_IMPORTED_MODULE_0__.getTaskIdAtPos(_e.clientX, _e.clientY), true);
    // let underMouse = document.elementsFromPoint(_e.pageX, _e.pageY);
    let underMouse = document.elementsFromPoint(_e.clientX, _e.clientY);
    
    if (!stateManager.currentlyEditing) {
        if (!_e.target.classList.contains("input-button")) {
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
        }
    }
});

document.addEventListener("mouseup", _e => {
    if (_e.button == 0 && !stateManager.currentlyEditing) {
        _dom_js__WEBPACK_IMPORTED_MODULE_0__.thaw();
    }
});

document.addEventListener("mousedown", _e => {
    if (_e.button == 2 && !stateManager.currentlyEditing) {
        selection.triggerMenu(_e.clientX, _e.clientY, stateManager.selectionAddTo);
    }
});

document.addEventListener("touchstart", _e => {
    stateManager.touch.time.splice(0, 1);
    stateManager.touch.time.push(new Date().getTime());

    stateManager.touch.pos.splice(0, 1);
    // touch.pos.push({ x: _e.touches[0].pageX, y: _e.touches[0].pageY });
    stateManager.touch.pos.push({ x: _e.touches[0].clientX, 
        y: _e.touches[0].clientY });

    if (stateManager.touch.time[0] && 
        stateManager.touch.time[1] - stateManager.touch.time[0]< 300) {
        if (Math.abs(stateManager.touch.pos[1].x - 
                stateManager.touch.pos[0].x) < 40 &&
                Math.abs(stateManager.touch.pos[1].y - 
                stateManager.touch.pos[0].y) < 40) {
            selection.triggerMenu(stateManager.touch.pos[1].x, 
                stateManager.touch.pos[1].y, stateManager.selectionAddTo);
        }
    }

    stateManager.touch.touchedId.splice(0, 1);
    stateManager.touch.touchedId.push(_dom_js__WEBPACK_IMPORTED_MODULE_0__.getTaskIdAtPos(_e.touches[0].clientX, 
        _e.touches[0].clientY));
    console.log("Set last touched to " + stateManager.touch.touchedId);
});

document.addEventListener("touchend", _e => {

});

document.addEventListener("keydown", _e => {
    if (_e.key == "e") {
        console.log(selection.selected);
    }
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRXpEO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsU0FBUztBQUN2RDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBLFlBQVksbURBQWtCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVCx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDhCQUE4QjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFFBQVEseUNBQVE7QUFDaEI7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsZ0RBQWdEO0FBQ3hFLGtDQUFrQztBQUNsQyxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0NBQXNDLG1EQUFrQjtBQUN4RDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZHVlbGlzdC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vZHVlbGlzdC8uL3NyYy9yaWdodC1jbGljay1tZW51LmpzIiwid2VicGFjazovL2R1ZWxpc3QvLi9zcmMvdGltZXpvbmUtc3RyaW5nLmpzIiwid2VicGFjazovL2R1ZWxpc3QvLi9ub2RlX21vZHVsZXMvZGF0ZWZvcm1hdC9saWIvZGF0ZWZvcm1hdC5qcyIsIndlYnBhY2s6Ly9kdWVsaXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2R1ZWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2R1ZWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kdWVsaXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZHVlbGlzdC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRhdGVGb3JtYXQsIHsgbWFza3MgfSBmcm9tIFwiZGF0ZWZvcm1hdFwiO1xuXG5jb25zdCB0YXNrQmluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrLWJpblwiKTtcbmNvbnN0IHByaW9yaXR5TGlzdCA9IFsgXCJOL0FcIiwgXCJVbmltcG9ydGFudFwiLCBcIkltcG9ydGFudFwiLCBcIlVyZ2VudFwiIF07XG5jb25zdCBwcm9ncmVzc0xpc3QgPSBbIFwiTi9BXCIsIFwiTm90IHN0YXJ0ZWRcIiwgXCJJbiBwcm9ncmVzc1wiLCBcIkNvbXBsZXRlXCIgXTtcblxuZXhwb3J0IGxldCBmcm96ZW4gPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNhcmQoX3Rhc2ssIF9zdGF0ZU1hbmFnZXIpIHtcbiAgICAvLyB0aXRsZTtcbiAgICAvLyBkdWU7XG4gICAgLy8gZGVzY3JpcHRpb247XG4gICAgLy8gcHJvZ3Jlc3M7XG4gICAgLy8gbm90ZXM7XG4gICAgLy8gaWQ7XG4gICAgbGV0IHN1cGVydGFza0RpdiA9IG51bGw7XG4gICAgbGV0IHN1cGVydGFzayA9IF90YXNrLnN1cGVydGFzaztcbiAgICBsZXQgbmVpZ2hib3JJZHggPSAtMTtcblxuICAgIGlmIChfdGFzay5zdXBlcnRhc2tMaXN0KSB7XG4gICAgICAgIG5laWdoYm9ySWR4ID0gX3Rhc2suc3VwZXJ0YXNrTGlzdC5nZXRUYXNrSWR4KF90YXNrKSArIDE7XG4gICAgfVxuICAgIFxuICAgIGxldCBuZWlnaGJvcklkID0gLTE7XG4gICAgbGV0IG5laWdoYm9yRGl2ID0gbnVsbDtcblxuICAgIGlmIChuZWlnaGJvcklkeCA+IDAgJiYgbmVpZ2hib3JJZHggPCBfdGFzay5zdXBlcnRhc2tMaXN0LnRhc2tzLmxlbmd0aCkge1xuICAgICAgICBuZWlnaGJvcklkID0gX3Rhc2suc3VwZXJ0YXNrTGlzdC50YXNrc1tuZWlnaGJvcklkeF0uaWQ7XG4gICAgICAgIG5laWdoYm9yRGl2ID0gdGFza0Jpbi5xdWVyeVNlbGVjdG9yKGAudGFzay5pZC0ke25laWdoYm9ySWR9YCk7XG4gICAgfVxuICAgIFxuICAgIGlmIChzdXBlcnRhc2spIHtcbiAgICAgICAgc3VwZXJ0YXNrRGl2ID0gdGFza0Jpbi5xdWVyeVNlbGVjdG9yKGAuc3VidGFza3MuaWQtJHtzdXBlcnRhc2suaWR9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3VwZXJ0YXNrRGl2ID0gdGFza0JpbjtcbiAgICB9XG5cbiAgICBsZXQgaW5kZW50U3RyID0gYG1hcmdpbi1sZWZ0OiBjYWxjKGNhbGModmFyKC0tY2FyZC1pbmRlbnQpICogJHtfdGFzay5kZXB0aH0pICsgY2FsYyh2YXIoLS1jYXJkLW1hcmdpbikgKiAwLjUpKWA7XG4gICAgLy8gbGV0IGluZGVudFN0ciA9IGBtYXJnaW4tbGVmdDogMHB4YDtcbiAgICBsZXQgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwidGFza1wiLCBgaWQtJHtfdGFzay5pZH1gKTtcbiAgICBjYXJkLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGluZGVudFN0cik7XG5cbiAgICBpZiAoX3Rhc2suc2VsZWN0ZWQpIHtcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG4gICAgfVxuXG4gICAgaWYgKG5laWdoYm9yRGl2KSB7XG4gICAgICAgIG5laWdoYm9yRGl2Lmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWJlZ2luXCIsIGNhcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN1cGVydGFza0Rpdi5hcHBlbmRDaGlsZChjYXJkKTtcbiAgICB9XG4gICAgXG4gICAgbGV0IGhEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhEaXYuY2xhc3NMaXN0LmFkZChcImNhcmQtaGVhZGVyLWRpdlwiKTtcbiAgICBjYXJkLmFwcGVuZENoaWxkKGhEaXYpO1xuXG4gICAgbGV0IHRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aXRsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY2FyZC10aXRsZS1jb250YWluZXJcIik7XG4gICAgaERpdi5hcHBlbmRDaGlsZCh0aXRsZUNvbnRhaW5lcik7XG5cbiAgICBpZiAoX3Rhc2sucHJpb3JpdHkpIHtcbiAgICAgICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY3JlYXRlUHJpb3JpdHlTdmcoX3Rhc2sucHJpb3JpdHkpKTtcbiAgICB9XG5cbiAgICBpZiAoX3Rhc2sucHJvZ3Jlc3MpIHtcbiAgICAgICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY3JlYXRlUHJvZ3Jlc3NTdmcoX3Rhc2sucHJvZ3Jlc3MpKTtcbiAgICB9XG5cbiAgICBsZXQgaDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG4gICAgaDIudGV4dENvbnRlbnQgPSBfdGFzay50aXRsZTtcbiAgICBoMi5jbGFzc0xpc3QuYWRkKFwiY2FyZC10aXRsZVwiLCBcImNhcmQtZWRpdGFibGVcIik7XG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoaDIpO1xuXG4gICAgbGV0IHN2ZyA9IGNyZWF0ZVN2ZyhcIk0xMiwyQzYuNDcsMiAyLDYuNDcgMiwxMkMyLDE3LjUzIDYuNDcsMjIgMTIsMjJDMTcuNTMsMjIgMjIsMTcuNTMgMjIsMTJDMjIsNi40NyAxNy41MywyIDEyLDJNMTUuMSw3LjA3QzE1LjI0LDcuMDcgMTUuMzgsNy4xMiAxNS41LDcuMjNMMTYuNzcsOC41QzE3LDguNzIgMTcsOS4wNyAxNi43Nyw5LjI4TDE1Ljc3LDEwLjI4TDEzLjcyLDguMjNMMTQuNzIsNy4yM0MxNC44Miw3LjEyIDE0Ljk2LDcuMDcgMTUuMSw3LjA3TTEzLjEzLDguODFMMTUuMTksMTAuODdMOS4xMywxNi45M0g3LjA3VjE0Ljg3TDEzLjEzLDguODFaXCIsIFxuICAgICAgICBcIkVkaXQgdGFza1wiLCB0cnVlKTtcbiAgICBzdmcuY2xhc3NMaXN0LmFkZChcImVkaXQtdGFzay1pbWdcIik7XG4gICAgaERpdi5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgaWYgKF90YXNrLmR1ZURhdGUpIHtcbiAgICAgICAgbGV0IGR1ZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkdWVEYXRlLnRleHRDb250ZW50ID0gYCR7ZGF0ZUZvcm1hdChfdGFzay5kdWVEYXRlLCBcImRkZGQsIG1tbW0gZFMsIHl5eXlcIil9YDtcbiAgICAgICAgLy9kdWVEYXRlLnRleHRDb250ZW50ID0gYCR7X3Rhc2suZHVlRGF0ZX1gO1xuICAgICAgICBkdWVEYXRlLmNsYXNzTGlzdC5hZGQoXCJjYXJkLWR1ZS1kYXRlXCIsIFwiY2FyZC1lZGl0YWJsZVwiKTtcbiAgICAgICAgaERpdi5hcHBlbmRDaGlsZChkdWVEYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoX3Rhc2suZHVlVGltZSkge1xuICAgICAgICBsZXQgZHVlVGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGR1ZVRpbWUudGV4dENvbnRlbnQgPSBgJHtkYXRlRm9ybWF0KF90YXNrLmR1ZVRpbWUsIFwiaDpNTSBUVFwiKX1gO1xuICAgICAgICAvL2R1ZVRpbWUudGV4dENvbnRlbnQgPSBgJHtfdGFzay5kdWVUaW1lfWA7XG4gICAgICAgIGR1ZVRpbWUuY2xhc3NMaXN0LmFkZChcImNhcmQtZHVlLXRpbWVcIiwgXCJjYXJkLWVkaXRhYmxlXCIpO1xuICAgICAgICBoRGl2LmFwcGVuZENoaWxkKGR1ZVRpbWUpO1xuICAgIH1cblxuICAgIGxldCB0YXNrRXhwYW5kU3ZnID0gY3JlYXRlU3ZnKFwiXCIsIFwiRXhwYW5kXCIsIHRydWUpO1xuICAgIHRhc2tFeHBhbmRTdmcuY2xhc3NMaXN0LmFkZChcInRhc2stZXhwYW5kLWltZ1wiKTtcbiAgICBoRGl2LmFwcGVuZENoaWxkKHRhc2tFeHBhbmRTdmcpO1xuXG4gICAgaWYgKCFfdGFzay5oYXNDb250ZW50KCkpIHtcbiAgICAgICAgdGFza0V4cGFuZFN2Zy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH1cblxuICAgIGxldCB0YXNrRXhwYW5kUGF0aCA9IHRhc2tFeHBhbmRTdmcucXVlcnlTZWxlY3RvcihcInBhdGg6bm90KC5iZy1pbWcpXCIpO1xuICAgIHVwZGF0ZVRhc2tFeHBhbmRWaWV3KHRhc2tFeHBhbmRQYXRoLCBjYXJkLCBfdGFzayk7XG5cbiAgICAvLyBsZXQgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAvLyBzcGFjZXIuY2xhc3NMaXN0LmFkZChcImNhcmQtc3BhY2VyXCIsIFwiY2FyZC1jb250ZW50XCIpO1xuICAgIC8vIGNhcmQuYXBwZW5kQ2hpbGQoc3BhY2VyKTtcblxuICAgIC8vaWYgKF90YXNrLnByaW9yaXR5ID4gMCB8fCBfdGFzay5wcm9ncmVzcyA+IDAgfHwgX3Rhc2sudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3MpIHtcbiAgICBpZiAoX3Rhc2sucHJpb3JpdHkgPiAwIHx8IF90YXNrLnByb2dyZXNzID4gMCkge1xuICAgICAgICBsZXQgaW5mb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGluZm9Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImluZm8tY29udGFpbmVyXCIpO1xuICAgICAgICBjYXJkLmFwcGVuZENoaWxkKGluZm9Db250YWluZXIpO1xuXG4gICAgICAgIGlmIChfdGFzay5wcmlvcml0eSA+IDApIHtcbiAgICAgICAgICAgIGxldCBwcmlvcml0eUNvbnRhaW5lciA9IGNyZWF0ZUNhcmRDb250YWluZXIoWyBcImNhcmQtY29udGFpbmVyXCIgXSk7XG4gICAgICAgICAgICBpbmZvQ29udGFpbmVyLmFwcGVuZENoaWxkKHByaW9yaXR5Q29udGFpbmVyKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBwcmlvcml0eUxhYmVsID0gY3JlYXRlQ2FyZENvbnRhaW5lckxhYmVsKFwiUHJpb3JpdHlcIiwgWyBcImNhcmQtbGFiZWxcIiBdKTtcbiAgICAgICAgICAgIHByaW9yaXR5Q29udGFpbmVyLmFwcGVuZENoaWxkKHByaW9yaXR5TGFiZWwpO1xuXG4gICAgICAgICAgICBsZXQgcHJpb3JpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgcHJpb3JpdHkudGV4dENvbnRlbnQgPSBwcmlvcml0eUxpc3RbX3Rhc2sucHJpb3JpdHldO1xuICAgICAgICAgICAgcHJpb3JpdHkuY2xhc3NMaXN0LmFkZChcImNhcmQtcHJpb3JpdHlcIiwgXCJjYXJkLWVkaXRhYmxlXCIpO1xuICAgICAgICAgICAgcHJpb3JpdHlDb250YWluZXIuYXBwZW5kQ2hpbGQocHJpb3JpdHkpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGlmIChfdGFzay5wcm9ncmVzcyA+IDAgfHwgX3Rhc2sudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3MpIHtcbiAgICAgICAgICAgIGxldCBwcm9ncmVzc0NvbnRhaW5lciA9IGNyZWF0ZUNhcmRDb250YWluZXIoWyBcImNhcmQtY29udGFpbmVyXCIgXSk7XG4gICAgICAgICAgICBpbmZvQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2dyZXNzQ29udGFpbmVyKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBwcm9ncmVzc0xhYmVsID0gY3JlYXRlQ2FyZENvbnRhaW5lckxhYmVsKFwiUHJvZ3Jlc3NcIiwgWyBcImNhcmQtbGFiZWxcIiBdKTtcbiAgICAgICAgICAgIHByb2dyZXNzQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2dyZXNzTGFiZWwpO1xuXG4gICAgICAgICAgICBsZXQgcHJvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBwcm9nLnRleHRDb250ZW50ID0gcHJvZ3Jlc3NMaXN0W190YXNrLnByb2dyZXNzXTtcblxuICAgICAgICAgICAgaWYgKF90YXNrLnVzZVByb2dyZXNzRnJvbVN1YnRhc2tzKSB7XG4gICAgICAgICAgICAgICAgcHJvZy50ZXh0Q29udGVudCArPSBcIiAoZnJvbSBzdWJ0YXNrcylcIjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBwcm9nLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXByb2dyZXNzXCIsIFwiY2FyZC1lZGl0YWJsZVwiKTtcbiAgICAgICAgICAgIHByb2dyZXNzQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKF90YXNrLmRlc2NyaXB0aW9uLmxlbmd0aCkge1xuICAgICAgICBsZXQgZGVzY0NvbnRhaW5lciA9IGNyZWF0ZUNhcmRDb250YWluZXIoWyBcImNhcmQtY29udGFpbmVyXCIgXSk7XG4gICAgICAgIGNhcmQuYXBwZW5kQ2hpbGQoZGVzY0NvbnRhaW5lcik7XG5cbiAgICAgICAgbGV0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkZXNjLnRleHRDb250ZW50ID0gX3Rhc2suZGVzY3JpcHRpb247XG4gICAgICAgIGRlc2MuY2xhc3NMaXN0LmFkZChcImNhcmQtZGVzY3JpcHRpb25cIiwgXCJjYXJkLWNvbnRlbnRcIiwgXCJjYXJkLWVkaXRhYmxlXCIpO1xuICAgICAgICBkZXNjQ29udGFpbmVyLmFwcGVuZENoaWxkKGRlc2MpO1xuXG4gICAgICAgIGxldCBkZXNjTGFiZWwgPSBjcmVhdGVDYXJkQ29udGFpbmVyTGFiZWwoXCJBYm91dFwiLCBbIFwiY2FyZC1sYWJlbFwiIF0pO1xuICAgICAgICBkZXNjQ29udGFpbmVyLmFwcGVuZENoaWxkKGRlc2NMYWJlbCk7XG4gICAgfVxuXG4gICAgaWYgKF90YXNrLm5vdGVzLmxlbmd0aCkge1xuICAgICAgICBsZXQgbm90ZXNDb250YWluZXIgPSBjcmVhdGVDYXJkQ29udGFpbmVyKFsgXCJjYXJkLWNvbnRhaW5lclwiIF0pO1xuICAgICAgICBjYXJkLmFwcGVuZENoaWxkKG5vdGVzQ29udGFpbmVyKTtcblxuICAgICAgICBsZXQgbm90ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBub3Rlcy50ZXh0Q29udGVudCA9IF90YXNrLm5vdGVzO1xuICAgICAgICBub3Rlcy5jbGFzc0xpc3QuYWRkKFwiY2FyZC1ub3Rlc1wiLCBcImNhcmQtY29udGVudFwiLCBcImNhcmQtZWRpdGFibGVcIik7XG4gICAgICAgIG5vdGVzQ29udGFpbmVyLmFwcGVuZENoaWxkKG5vdGVzKTtcblxuICAgICAgICBsZXQgbm90ZXNMYWJlbCA9IGNyZWF0ZUNhcmRDb250YWluZXJMYWJlbChcIk5vdGVzXCIsIFsgXCJjYXJkLWxhYmVsXCIgXSk7XG4gICAgICAgIG5vdGVzQ29udGFpbmVyLmFwcGVuZENoaWxkKG5vdGVzTGFiZWwpO1xuICAgIH1cblxuICAgIGxldCBzdWJ0YXNrcyA9IHRhc2tCaW4ucXVlcnlTZWxlY3RvcihgLnN1YnRhc2tzLmlkLSR7X3Rhc2suaWR9YCk7XG5cbiAgICBpZiAoIXN1YnRhc2tzKSB7XG4gICAgICAgIHN1YnRhc2tzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgLy9zdXBlcnRhc2tEaXYuYXBwZW5kQ2hpbGQoc3VidGFza3MpO1xuICAgICAgICBjYXJkLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIHN1YnRhc2tzKTtcbiAgICAgICAgc3VidGFza3MuY2xhc3NMaXN0LmFkZChcInN1YnRhc2tzXCIsIGBpZC0ke190YXNrLmlkfWApO1xuXG4gICAgICAgIGxldCBzdWJ0YXNrc0hlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIC8vIHN1YnRhc2tzSGVhZGVyLnRleHRDb250ZW50ID0gYCR7X3Rhc2suc3VidGFza3MubGVuZ3RofSBzdWJ0YXNrc2A7XG4gICAgICAgIHN1YnRhc2tzSGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJzdWJ0YXNrcy1oZWFkZXJcIiwgYGlkLSR7X3Rhc2suaWR9YCk7XG4gICAgICAgIHN1YnRhc2tzSGVhZGVyLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGluZGVudFN0cilcbiAgICAgICAgc3VidGFza3MuYXBwZW5kQ2hpbGQoc3VidGFza3NIZWFkZXIpO1xuXG4gICAgICAgIGxldCBzdWJ0YXNrc1BsdXNTdmcgPSBjcmVhdGVTdmcoXCJcIiwgXCJTdWJ0YXNrc1wiLCB0cnVlKTtcbiAgICAgICAgc3VidGFza3NQbHVzU3ZnLmNsYXNzTGlzdC5hZGQoXCJzdWJ0YXNrcy1wbHVzLWltZ1wiKTtcbiAgICAgICAgc3VidGFza3NIZWFkZXIuYXBwZW5kQ2hpbGQoc3VidGFza3NQbHVzU3ZnKTtcblxuICAgICAgICBsZXQgc3VidGFza3NQbHVzUGF0aCA9IHN1YnRhc2tzUGx1c1N2Zy5xdWVyeVNlbGVjdG9yKFwicGF0aDpub3QoLmJnLWltZylcIik7XG4gICAgICAgIHNldFN1YnRhc2tFeHBhbmRWaWV3KF90YXNrLnN1YnRhc2tMaXN0LmV4cGFuZGVkLCBzdWJ0YXNrcywgX3Rhc2ssIGZhbHNlKTtcblxuICAgICAgICBsZXQgc3VidGFza3NUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgc3VidGFza3NUZXh0LmNsYXNzTGlzdC5hZGQoXCJzdWJ0YXNrcy10ZXh0XCIsIGBpZC0ke190YXNrLmlkfWApO1xuICAgICAgICBzdWJ0YXNrc0hlYWRlci5hcHBlbmRDaGlsZChzdWJ0YXNrc1RleHQpO1xuICAgICAgICBcbiAgICAgICAgc3VidGFza3NUZXh0LnRleHRDb250ZW50ID0gYCR7X3Rhc2suc3VidGFza3MubGVuZ3RofSBcbiAgICAgICAgICAgICR7X3Rhc2suc3VidGFza3MubGVuZ3RoID09IDEgPyBcInN1YnRhc2tcIiA6IFwic3VidGFza3NcIn1gO1xuXG4gICAgICAgIGlmICghX3Rhc2suc3VidGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdWJ0YXNrc0hlYWRlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VidGFza3NIZWFkZXIuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN1YnRhc2tzUGx1c1N2Zy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2V2ZW50ID0+IHtcbiAgICAgICAgc3VidGFza3NIZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9ldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoX3N0YXRlTWFuYWdlci5jdXJyZW50bHlFZGl0aW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgIF90YXNrLnN1YnRhc2tMaXN0LmV4cGFuZGVkID0gIV90YXNrLnN1YnRhc2tMaXN0LmV4cGFuZGVkO1xuICAgICAgICAgICAgc2V0U3VidGFza0V4cGFuZFZpZXcoX3Rhc2suc3VidGFza0xpc3QuZXhwYW5kZWQsIHN1YnRhc2tzLCBfdGFzaywgXG4gICAgICAgICAgICAgICAgX3N0YXRlTWFuYWdlci5zZWxlY3Rpb25BZGRUbyk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN1YnRhc2tzLnJlbW92ZSgpO1xuICAgICAgICBjYXJkLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIHN1YnRhc2tzKTtcbiAgICAgICAgbGV0IHN1YnRhc2tzSGVhZGVyID0gc3VidGFza3MucXVlcnlTZWxlY3RvcihcIi5zdWJ0YXNrcy1oZWFkZXJcIik7XG4gICAgICAgIGxldCBzdWJ0YXNrc1RleHQgPSBzdWJ0YXNrcy5xdWVyeVNlbGVjdG9yKFwiLnN1YnRhc2tzLXRleHRcIik7XG4gICAgICAgIFxuICAgICAgICBzdWJ0YXNrc1RleHQudGV4dENvbnRlbnQgPSBgJHtfdGFzay5zdWJ0YXNrcy5sZW5ndGh9IFxuICAgICAgICAgICAgJHtfdGFzay5zdWJ0YXNrcy5sZW5ndGggPT0gMSA/IFwic3VidGFza1wiIDogXCJzdWJ0YXNrc1wifWA7XG5cbiAgICAgICAgaWYgKCFfdGFzay5zdWJ0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN1YnRhc2tzSGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdWJ0YXNrc0hlYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9leHBhbmRDYXJkKF90YXNrLCBjYXJkKTtcbiAgICAvL2V4cGFuZENhcmQoX3Rhc2ssIHN1YnRhc2tzKTtcblxuICAgIHRhc2tFeHBhbmRTdmcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9ldmVudCA9PiB7XG4gICAgICAgIGlmIChfc3RhdGVNYW5hZ2VyLmN1cnJlbnRseUVkaXRpbmcpIHJldHVybjtcbiAgICAgICAgX3Rhc2suZXhwYW5kZWQgPSAhX3Rhc2suZXhwYW5kZWQ7XG4gICAgICAgIHVwZGF0ZVRhc2tFeHBhbmRWaWV3KHRhc2tFeHBhbmRQYXRoLCBjYXJkLCBfdGFzayk7XG4gICAgfSk7XG5cbiAgICBoRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgX2UgPT4ge1xuICAgICAgICBsZXQgdW5kZXJNb3VzZSA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KF9lLmNsaWVudFgsIF9lLmNsaWVudFkpO1xuXG4gICAgICAgIGZvciAobGV0IF9lbGVtIG9mIHVuZGVyTW91c2UpIHtcbiAgICAgICAgICAgIC8vIERpc3JlZ2FyZCBwb3NpdGlvbnMgdGhhdCBhbHNvIGludGVyc2VjdCB0aGUgZXhwYW5kIGJ1dHRvbi5cbiAgICAgICAgICAgIGlmIChfZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJ0YXNrLWV4cGFuZC1pbWdcIikpIHtcbiAgICAgICAgICAgICAgICBoRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJob3Zlci1wb3NzaWJsZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBoRGl2LmNsYXNzTGlzdC5hZGQoXCJob3Zlci1wb3NzaWJsZVwiKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgc3ZnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfZXZlbnQgPT4ge1xuICAgICAgICAvLyBCZWNhdXNlIG1vdXNlb3ZlciBkb2Vzbid0IGV4aXN0IG9uIGEgdG91Y2hzY3JlZW4sIHRoZSBlZGl0IGJ1dHRvbiBpc1xuICAgICAgICAvLyByZXZlYWxlZCBvbmNlIHRoZSB1c2VyIGhhcyB0YXBwZWQgdGhlIHRhc2sncyBoZWFkZXIgYW5kIGNhbiBvbmx5IGJlXG4gICAgICAgIC8vIGFjdGl2YXRlZCBvbmNlIHJldmVhbGVkLiBJLmUuIHRoZSBidXR0b24gY2FuIG9ubHkgYmUgY2xpY2tlZCBpZiB0aGVcbiAgICAgICAgLy8gc2Vjb25kLXRvLWxhc3QgdG91Y2ggd2FzIG9uIHRoZSBidXR0b24ncyB0YXNrJ3MgaGVhZGVyLlxuICAgICAgICBpZiAoX2V2ZW50LnBvaW50ZXJUeXBlID09IFwidG91Y2hcIikge1xuICAgICAgICAgICAgaWYgKF90YXNrLnNlbGVjdGVkICYmIF9zdGF0ZU1hbmFnZXIudG91Y2gudG91Y2hlZElkWzBdID09IF90YXNrLmlkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlSW5wdXRCb3goX3Rhc2ssIF9zdGF0ZU1hbmFnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3JlYXRlSW5wdXRCb3goX3Rhc2ssIF9zdGF0ZU1hbmFnZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0YXNrOiBjYXJkLFxuICAgICAgICBzdWJ0YXNrczogc3VidGFza3NcbiAgICB9O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUYXNrRXhwYW5kVmlldyhfc3ZnUGF0aCwgX2NhcmQsIF90YXNrKSB7XG4gICAgZXhwYW5kQ2FyZChfdGFzaywgX2NhcmQpO1xuICAgIFxuICAgIGlmIChfdGFzay5leHBhbmRlZCkge1xuICAgICAgICBfc3ZnUGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTTEyLDIyQTEwLDEwIDAgMCwxIDIsMTJBMTAsMTAgMCAwLDEgMTIsMkExMCwxMCAwIDAsMSAyMiwxMkExMCwxMCAwIDAsMSAxMiwyMk0xNywxNEwxMiw5TDcsMTRIMTdaXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIF9zdmdQYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJNMTIsMkExMCwxMCAwIDAsMSAyMiwxMkExMCwxMCAwIDAsMSAxMiwyMkExMCwxMCAwIDAsMSAyLDEyQTEwLDEwIDAgMCwxIDEyLDJNNywxMEwxMiwxNUwxNywxMEg3WlwiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldFN1YnRhc2tFeHBhbmRWaWV3KF9leHBhbmRlZCwgX2NhcmQsIF90YXNrLCBfcmVjdXJzaXZlKSB7XG4gICAgbGV0IHN1YnRhc2tzUGx1c1BhdGggPSBfY2FyZC5xdWVyeVNlbGVjdG9yKFwiLnN1YnRhc2tzLXBsdXMtaW1nID4gcGF0aDpub3QoLmJnLWltZylcIik7XG4gICAgX3Rhc2suc3VidGFza0xpc3QuZXhwYW5kZWQgPSBfZXhwYW5kZWQ7XG4gICAgZXhwYW5kQ2FyZChfdGFzay5zdWJ0YXNrTGlzdCwgX2NhcmQpO1xuICAgIFxuICAgIGlmIChfdGFzay5zdWJ0YXNrTGlzdC5leHBhbmRlZCkge1xuICAgICAgICBzdWJ0YXNrc1BsdXNQYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJNMTcsMTNIN1YxMUgxN00xMiwyQTEwLDEwIDAgMCwwIDIsMTJBMTAsMTAgMCAwLDAgMTIsMjJBMTAsMTAgMCAwLDAgMjIsMTJBMTAsMTAgMCAwLDAgMTIsMlpcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3VidGFza3NQbHVzUGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTTE3LDEzSDEzVjE3SDExVjEzSDdWMTFIMTFWN0gxM1YxMUgxN00xMiwyQTEwLDEwIDAgMCwwIDIsMTJBMTAsMTAgMCAwLDAgMTIsMjJBMTAsMTAgMCAwLDAgMjIsMTJBMTAsMTAgMCAwLDAgMTIsMlpcIik7XG4gICAgfVxuXG4gICAgaWYgKF9yZWN1cnNpdmUpIHtcbiAgICAgICAgZm9yIChsZXQgdGFzayBvZiBfdGFzay5zdWJ0YXNrTGlzdC50YXNrcykge1xuICAgICAgICAgICAgbGV0IHN1YmNhcmQgPSBfY2FyZC5xdWVyeVNlbGVjdG9yKGAuc3VidGFza3MuaWQtJHt0YXNrLmlkfWApO1xuICAgICAgICAgICAgc2V0U3VidGFza0V4cGFuZFZpZXcoX2V4cGFuZGVkLCBzdWJjYXJkLCB0YXNrLCBfcmVjdXJzaXZlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyZWV6ZSgpIHtcbiAgICBmcm96ZW4gPSB0cnVlO1xuICAgIHRhc2tCaW4uY2xhc3NMaXN0LmFkZChcImZyZWV6ZVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRoYXcoKSB7XG4gICAgZnJvemVuID0gZmFsc2U7XG4gICAgdGFza0Jpbi5jbGFzc0xpc3QucmVtb3ZlKFwiZnJlZXplXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0KF90YXNrSWQpIHtcbiAgICBsZXQgY2FyZCA9IHRhc2tCaW4ucXVlcnlTZWxlY3RvcihgLnRhc2suaWQtJHtfdGFza0lkfWApO1xuXG4gICAgaWYgKGNhcmQpIHtcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5zZWxlY3QoX3Rhc2tJZCkge1xuICAgIGxldCBjYXJkID0gdGFza0Jpbi5xdWVyeVNlbGVjdG9yKGAudGFzay5pZC0ke190YXNrSWR9YCk7XG5cbiAgICBpZiAoY2FyZCkge1xuICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYXNrSWRBdFBvcyhfY2xpZW50WCwgX2NsaWVudFkpIHtcbiAgICBsZXQgdW5kZXJNb3VzZSA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KF9jbGllbnRYLCBfY2xpZW50WSk7XG4gICAgbGV0IHRhc2tGb3VuZCA9IGZhbHNlXG4gICAgbGV0IGlkID0gLTE7XG5cbiAgICBmb3IgKGxldCBfZWxlbSBvZiB1bmRlck1vdXNlKSB7XG4gICAgICAgIC8vIERpc3JlZ2FyZCBwb3NpdGlvbnMgdGhhdCBhbHNvIGludGVyc2VjdCB0aGUgZXhwYW5kIGJ1dHRvbi5cbiAgICAgICAgaWYgKF9lbGVtLmNsYXNzTGlzdC5jb250YWlucyhcInRhc2tcIikpIHtcbiAgICAgICAgICAgIGxldCBpZFBvcyA9IF9lbGVtLmNsYXNzTmFtZS5pbmRleE9mKFwiaWQtXCIpO1xuICAgICAgICAgICAgbGV0IGlkRW5kID0gX2VsZW0uY2xhc3NOYW1lLmluZGV4T2YoXCIgXCIsIGlkUG9zKTtcbiAgICAgICAgICAgIGlmIChpZEVuZCA8IDApIGlkRW5kID0gX2VsZW0uY2xhc3NOYW1lLmxlbmd0aDtcbiAgICAgICAgICAgIHRhc2tGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBpZCA9IE51bWJlcihfZWxlbS5jbGFzc05hbWUuc2xpY2UoaWRQb3MgKyAzLCBpZEVuZCkpO1xuICAgICAgICB9IGVsc2UgaWYgKF9lbGVtLmNsYXNzTGlzdC5jb250YWlucyhcInRhc2stZXhwYW5kLWltZ1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0YXNrRm91bmQpIHtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNhcmRDb250YWluZXIoX2NsYXNzZXMpIHtcbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCguLi5fY2xhc3Nlcyk7XG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2FyZENvbnRhaW5lckxhYmVsKF90ZXh0LCBfY2xhc3Nlcykge1xuICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBfdGV4dDtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKC4uLl9jbGFzc2VzKTtcbiAgICByZXR1cm4gbGFiZWw7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZENhcmQoX3Rhc2ssIF9kaXYpIHtcbiAgICBpZiAoX3Rhc2suZXhwYW5kZWQpIHtcbiAgICAgICAgX2Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwiY29sbGFwc2VkXCIpO1xuICAgICAgICBfZGl2LmNsYXNzTGlzdC5hZGQoXCJleHBhbmRlZFwiKTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgX2Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwiZXhwYW5kZWRcIik7XG4gICAgX2Rpdi5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2VkXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW5wdXRCb3goX3Rhc2ssIF9zdGF0ZU1hbmFnZXIpIHtcbiAgICBpZiAoX3N0YXRlTWFuYWdlci5jdXJyZW50bHlFZGl0aW5nKSByZXR1cm47XG4gICAgZnJlZXplKCk7XG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcbiAgICBsZXQgY2FyZCA9IGJvZHkucXVlcnlTZWxlY3RvcihgLnRhc2suaWQtJHtfdGFzay5pZH1gKTtcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJlZGl0aW5nXCIpO1xuXG4gICAgX3Rhc2suY3VycmVudGx5RWRpdGluZyA9IHRydWU7XG4gICAgX3N0YXRlTWFuYWdlci5jdXJyZW50bHlFZGl0aW5nID0gdHJ1ZTtcblxuICAgIC8vIGxldCBjYXJkU3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAvLyBjYXJkU3BhY2VyLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXNwYWNlclwiKVxuICAgIC8vIF9ib2R5LmFwcGVuZENoaWxkKGNhcmRTcGFjZXIpO1xuXG4gICAgbGV0IGNhcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2FyZElucHV0LmNsYXNzTGlzdC5hZGQoXCJjYXJkLWlucHV0XCIpO1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQoY2FyZElucHV0KTtcblxuICAgIGxldCB0aXRsZUZpZWxkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aXRsZUZpZWxkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJmaWVsZC1jb250YWluZXJcIik7XG4gICAgY2FyZElucHV0LmFwcGVuZENoaWxkKHRpdGxlRmllbGRDb250YWluZXIpO1xuXG4gICAgbGV0IHRpdGxlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgdGl0bGVMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJpbnB1dC10aXRsZVwiKTtcbiAgICB0aXRsZUxhYmVsLnRleHRDb250ZW50ID0gXCJUYXNrIG5hbWVcIjtcbiAgICB0aXRsZUZpZWxkQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlTGFiZWwpO1xuXG4gICAgbGV0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgdGl0bGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKTtcbiAgICB0aXRsZUlucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJpbnB1dC10aXRsZVwiKTtcbiAgICB0aXRsZUlucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwiaW5wdXQtdGl0bGVcIik7XG4gICAgdGl0bGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBfdGFzay50aXRsZSk7XG4gICAgdGl0bGVGaWVsZENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUlucHV0KTtcbiAgICB0aXRsZUlucHV0LmZvY3VzKCk7XG4gICAgdGl0bGVJbnB1dC5zZXRTZWxlY3Rpb25SYW5nZSh0aXRsZUlucHV0LnZhbHVlLmxlbmd0aCwgdGl0bGVJbnB1dC52YWx1ZS5sZW5ndGgpO1xuXG4gICAgbGV0IGR1ZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZHVlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkdWUtY29udGFpbmVyXCIsIFwiaW5wdXQtY29udGFpbmVyXCIpO1xuICAgIGNhcmRJbnB1dC5hcHBlbmRDaGlsZChkdWVDb250YWluZXIpO1xuXG4gICAgbGV0IGRhdGVGaWVsZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGF0ZUZpZWxkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJmaWVsZC1jb250YWluZXJcIik7XG4gICAgZHVlQ29udGFpbmVyLmFwcGVuZENoaWxkKGRhdGVGaWVsZENvbnRhaW5lcik7XG5cbiAgICBsZXQgZGF0ZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGRhdGVMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJpbnB1dC1kYXRlXCIpO1xuICAgIGRhdGVMYWJlbC50ZXh0Q29udGVudCA9IFwiRHVlIGRhdGVcIjtcbiAgICBkYXRlRmllbGRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGF0ZUxhYmVsKTtcblxuICAgIGxldCBkYXRlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgZGF0ZUlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJkYXRlXCIpO1xuICAgIGRhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwiaW5wdXQtZGF0ZVwiKTtcbiAgICBkYXRlSW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJpbnB1dC1kYXRlXCIpO1xuICAgIGRhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBfdGFzay5kdWVEYXRlU3RyKTtcbiAgICBkYXRlRmllbGRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGF0ZUlucHV0KTtcblxuICAgIGxldCB0aW1lRmllbGRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRpbWVGaWVsZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiZmllbGQtY29udGFpbmVyXCIpO1xuICAgIGR1ZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lRmllbGRDb250YWluZXIpO1xuXG4gICAgbGV0IHRpbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICB0aW1lTGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwiaW5wdXQtdGltZVwiKTtcbiAgICB0aW1lTGFiZWwudGV4dENvbnRlbnQgPSBcIkR1ZSB0aW1lXCI7XG4gICAgdGltZUZpZWxkQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpbWVMYWJlbCk7XG5cbiAgICBsZXQgdGltZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHRpbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGltZVwiKTtcbiAgICB0aW1lSW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImlucHV0LXRpbWVcIik7XG4gICAgdGltZUlucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwiaW5wdXQtdGltZVwiKTtcbiAgICB0aW1lSW5wdXQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgX3Rhc2suZHVlVGltZVN0cik7XG4gICAgdGltZUZpZWxkQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpbWVJbnB1dCk7XG5cbiAgICBsZXQgZGVzY0ZpZWxkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkZXNjRmllbGRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImZpZWxkLWNvbnRhaW5lclwiKTtcbiAgICBjYXJkSW5wdXQuYXBwZW5kQ2hpbGQoZGVzY0ZpZWxkQ29udGFpbmVyKTtcblxuICAgIGxldCBkZXNjTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgZGVzY0xhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcImlucHV0LWRlc2NcIik7XG4gICAgZGVzY0xhYmVsLnRleHRDb250ZW50ID0gXCJEZXNjcmlwdGlvblwiO1xuICAgIGRlc2NGaWVsZENvbnRhaW5lci5hcHBlbmRDaGlsZChkZXNjTGFiZWwpO1xuXG4gICAgbGV0IGRlc2NJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICBkZXNjSW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImlucHV0LWRlc2NcIik7XG4gICAgZGVzY0lucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwiaW5wdXQtZGVzY1wiKTtcbiAgICBkZXNjSW5wdXQudGV4dENvbnRlbnQgPSBfdGFzay5kZXNjcmlwdGlvbjtcbiAgICBkZXNjRmllbGRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGVzY0lucHV0KTtcblxuICAgIGxldCByYWRpb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcmFkaW9Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInJhZGlvLWNvbnRhaW5lclwiLCBcImlucHV0LWNvbnRhaW5lclwiKTtcbiAgICBjYXJkSW5wdXQuYXBwZW5kQ2hpbGQocmFkaW9Db250YWluZXIpO1xuXG4gICAgbGV0IHByaW9yaXR5RmllbGRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHByaW9yaXR5RmllbGRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImZpZWxkLWNvbnRhaW5lclwiKTtcbiAgICByYWRpb0NvbnRhaW5lci5hcHBlbmRDaGlsZChwcmlvcml0eUZpZWxkQ29udGFpbmVyKTtcblxuICAgIGxldCBwcmlvcml0eUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwcmlvcml0eUxhYmVsLmNsYXNzTGlzdC5hZGQoXCJwc2V1ZG8tbGFiZWxcIik7XG4gICAgcHJpb3JpdHlMYWJlbC50ZXh0Q29udGVudCA9IFwiUHJpb3JpdHlcIjtcbiAgICBwcmlvcml0eUZpZWxkQ29udGFpbmVyLmFwcGVuZENoaWxkKHByaW9yaXR5TGFiZWwpO1xuXG4gICAgbGV0IHByaW9yaXR5RmllbGQgPSBjcmVhdGVSYWRpb0ZpZWxkKFwicHJpb3JpdHktcmFkaW9cIiwgX3Rhc2sucHJpb3JpdHksIHByaW9yaXR5TGlzdCk7XG4gICAgcHJpb3JpdHlGaWVsZC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwiaW5wdXQtcHJpb3JpdHlcIik7XG4gICAgcHJpb3JpdHlGaWVsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImlucHV0LXByaW9yaXR5XCIpO1xuICAgIHByaW9yaXR5RmllbGRDb250YWluZXIuYXBwZW5kQ2hpbGQocHJpb3JpdHlGaWVsZCk7XG5cbiAgICBsZXQgcHJvZ3Jlc3NGaWVsZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcHJvZ3Jlc3NGaWVsZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiZmllbGQtY29udGFpbmVyXCIpO1xuICAgIHJhZGlvQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2dyZXNzRmllbGRDb250YWluZXIpO1xuXG4gICAgbGV0IHByb2dyZXNzTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHByb2dyZXNzTGFiZWwuY2xhc3NMaXN0LmFkZChcInBzZXVkby1sYWJlbFwiKTtcbiAgICBwcm9ncmVzc0xhYmVsLnRleHRDb250ZW50ID0gXCJQcm9ncmVzc1wiO1xuICAgIHByb2dyZXNzRmllbGRDb250YWluZXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NMYWJlbCk7XG5cbiAgICBsZXQgcHJvZ3Jlc3NGaWVsZCA9IGNyZWF0ZVJhZGlvRmllbGQoXCJwcm9ncmVzcy1yYWRpb1wiLCBfdGFzay5wcm9ncmVzcywgcHJvZ3Jlc3NMaXN0KTtcbiAgICBwcm9ncmVzc0ZpZWxkLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJpbnB1dC1wcm9ncmVzc1wiKTtcbiAgICBwcm9ncmVzc0ZpZWxkLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiaW5wdXQtcHJvZ3Jlc3NcIik7XG4gICAgcHJvZ3Jlc3NGaWVsZENvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9ncmVzc0ZpZWxkKTtcblxuICAgIGxldCBwcm9ncmVzc0NoZWNrQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwcm9ncmVzc0NoZWNrQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJwcm9ncmVzcy1jaGVjay1jb250YWluZXJcIik7XG4gICAgcHJvZ3Jlc3NGaWVsZENvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9ncmVzc0NoZWNrQ29udGFpbmVyKTtcblxuICAgIGxldCBwcm9ncmVzc0NoZWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHByb2dyZXNzQ2hlY2suc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImNoZWNrYm94XCIpO1xuXG4gICAgaWYgKF90YXNrLnVzZVByb2dyZXNzRnJvbVN1YnRhc2tzKSB7XG4gICAgICAgIHByb2dyZXNzQ2hlY2suc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLCBcImNoZWNrZWRcIik7XG4gICAgfVxuXG4gICAgcHJvZ3Jlc3NDaGVjay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInByb2dyZXNzLWNoZWNrXCIpO1xuICAgIHByb2dyZXNzQ2hlY2suc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInByb2dyZXNzLWNoZWNrXCIpO1xuICAgIHByb2dyZXNzQ2hlY2suc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwcm9ncmVzcy1jaGVja1wiKTtcbiAgICBsZXQgcHJvZ3Jlc3NDaGVja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIHByb2dyZXNzQ2hlY2tMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwcm9ncmVzcy1jaGVja1wiKTtcbiAgICBwcm9ncmVzc0NoZWNrTGFiZWwudGV4dENvbnRlbnQgPSBcIlNldCBwcm9ncmVzcyBmcm9tIHN1YnRhc2tzXCI7XG4gICAgcHJvZ3Jlc3NDaGVja0NvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9ncmVzc0NoZWNrKTtcbiAgICBwcm9ncmVzc0NoZWNrQ29udGFpbmVyLmFwcGVuZENoaWxkKHByb2dyZXNzQ2hlY2tMYWJlbCk7XG5cbiAgICB1cGRhdGVQcm9ncmVzc0ZpZWxkKHByb2dyZXNzQ2hlY2ssIHByb2dyZXNzRmllbGQpO1xuXG4gICAgbGV0IG5vdGVzRmllbGRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG5vdGVzRmllbGRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImZpZWxkLWNvbnRhaW5lclwiKTtcbiAgICBjYXJkSW5wdXQuYXBwZW5kQ2hpbGQobm90ZXNGaWVsZENvbnRhaW5lcik7XG5cbiAgICBsZXQgbm90ZXNMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICBub3Rlc0xhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcImlucHV0LW5vdGVzXCIpO1xuICAgIG5vdGVzTGFiZWwudGV4dENvbnRlbnQgPSBcIk5vdGVzXCI7XG4gICAgbm90ZXNGaWVsZENvbnRhaW5lci5hcHBlbmRDaGlsZChub3Rlc0xhYmVsKTtcblxuICAgIGxldCBub3Rlc0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgIG5vdGVzSW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImlucHV0LW5vdGVzXCIpO1xuICAgIG5vdGVzSW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJpbnB1dC1ub3Rlc1wiKTtcbiAgICBub3Rlc0lucHV0LnRleHRDb250ZW50ID0gX3Rhc2subm90ZXM7XG4gICAgbm90ZXNGaWVsZENvbnRhaW5lci5hcHBlbmRDaGlsZChub3Rlc0lucHV0KTtcblxuICAgIGxldCBidXR0b25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJ1dHRvbkRpdi5jbGFzc0xpc3QuYWRkKFwiaW5wdXQtYnV0dG9uc1wiKTtcbiAgICBjYXJkSW5wdXQuYXBwZW5kQ2hpbGQoYnV0dG9uRGl2KTtcblxuICAgIGxldCBjb25maXJtID0gY3JlYXRlU3ZnKFwiTTEyIDJDNi41IDIgMiA2LjUgMiAxMlM2LjUgMjIgMTIgMjIgMjIgMTcuNSAyMiAxMiAxNy41IDIgMTIgMk0xMCAxN0w1IDEyTDYuNDEgMTAuNTlMMTAgMTQuMTdMMTcuNTkgNi41OEwxOSA4TDEwIDE3WlwiLFxuICAgICAgICBcIkNvbmZpcm1cIiwgdHJ1ZSwgXCJpbnB1dC1idXR0b25cIik7XG4gICAgY29uZmlybS5jbGFzc0xpc3QuYWRkKFwiY29uZmlybS1lZGl0LWltZ1wiLCBcImlucHV0LWJ1dHRvblwiKTtcbiAgICBidXR0b25EaXYuYXBwZW5kQ2hpbGQoY29uZmlybSk7XG5cbiAgICBsZXQgY2FuY2VsID0gY3JlYXRlU3ZnKFwiTTksN0wxMSwxMkw5LDE3SDExTDEyLDE0LjVMMTMsMTdIMTVMMTMsMTJMMTUsN0gxM0wxMiw5LjVMMTEsN0g5TTEyLDJBMTAsMTAgMCAwLDEgMjIsMTJBMTAsMTAgMCAwLDEgMTIsMjJBMTAsMTAgMCAwLDEgMiwxMkExMCwxMCAwIDAsMSAxMiwyWlwiLFxuICAgICAgICBcIkNhbmNlbFwiLCB0cnVlLCBcImlucHV0LWJ1dHRvblwiKTtcbiAgICBjYW5jZWwuY2xhc3NMaXN0LmFkZChcImNvbmZpcm0tZWRpdC1pbWdcIiwgXCJpbnB1dC1idXR0b25cIik7XG4gICAgYnV0dG9uRGl2LmFwcGVuZENoaWxkKGNhbmNlbCk7XG5cbiAgICBwcm9ncmVzc0NoZWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgX2UgPT4ge1xuICAgICAgICB1cGRhdGVQcm9ncmVzc0ZpZWxkKHByb2dyZXNzQ2hlY2ssIHByb2dyZXNzRmllbGQpO1xuICAgIH0pO1xuXG4gICAgY29uZmlybS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2V2ZW50ID0+IHtcbiAgICAgICAgX3Rhc2suY3VycmVudGx5RWRpdGluZyA9IGZhbHNlO1xuICAgICAgICBfc3RhdGVNYW5hZ2VyLmN1cnJlbnRseUVkaXRpbmcgPSBmYWxzZTtcblxuICAgICAgICBfdGFzay50aXRsZSA9IHRpdGxlSW5wdXQudmFsdWU7XG4gICAgICAgIF90YXNrLmR1ZURhdGVTdHIgPSBkYXRlSW5wdXQudmFsdWU7XG4gICAgICAgIF90YXNrLmR1ZVRpbWVTdHIgPSB0aW1lSW5wdXQudmFsdWU7XG4gICAgICAgIF90YXNrLnVwZGF0ZUR1ZSgpO1xuICAgICAgICBfdGFzay5kZXNjcmlwdGlvbiA9IGRlc2NJbnB1dC52YWx1ZTtcbiAgICAgICAgX3Rhc2sucHJpb3JpdHkgPSBnZXRSYWRpb1ZhbHVlKHByaW9yaXR5RmllbGQpO1xuICAgICAgICBfdGFzay51c2VQcm9ncmVzc0Zyb21TdWJ0YXNrcyA9IHByb2dyZXNzQ2hlY2suY2hlY2tlZDtcblxuICAgICAgICBpZiAoX3Rhc2sudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3MpIHtcbiAgICAgICAgICAgIF90YXNrLnByb2dyZXNzID0gX3Rhc2suZ2V0UHJvZ3Jlc3NSZWN1cnNpdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90YXNrLnByb2dyZXNzID0gZ2V0UmFkaW9WYWx1ZShwcm9ncmVzc0ZpZWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90YXNrLm5vdGVzID0gbm90ZXNJbnB1dC52YWx1ZTtcbiAgICAgICAgX3Rhc2suZXhwYW5kZWQgPSBfdGFzay5oYXNDb250ZW50KCk7XG5cbiAgICAgICAgLy8gbGV0IHN1YnRhc2tQcm9ncmVzcyA9IF90YXNrLmdldFByb2dyZXNzUmVjdXJzaXZlKCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3VidGFza1Byb2dyZXNzOiBcIiArIHN1YnRhc2tQcm9ncmVzcyk7XG5cbiAgICAgICAgY2FyZElucHV0LnJlbW92ZSgpO1xuICAgICAgICB0aGF3KCk7XG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZShcImVkaXRpbmdcIik7XG4gICAgICAgIF90YXNrLnJlZnJlc2hEb20oZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfZXZlbnQgPT4ge1xuICAgICAgICBfdGFzay5jdXJyZW50bHlFZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIF9zdGF0ZU1hbmFnZXIuY3VycmVudGx5RWRpdGluZyA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgY2FyZElucHV0LnJlbW92ZSgpO1xuICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJlZGl0aW5nXCIpO1xuICAgICAgICB0aGF3KCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVByb2dyZXNzRmllbGQoX2NoZWNrLCBfZmllbGQpIHtcbiAgICBpZiAoX2NoZWNrLmNoZWNrZWQpIHtcbiAgICAgICAgX2ZpZWxkLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2ZpZWxkLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUmFkaW9GaWVsZChfbmFtZSwgX2RlZmF1bHRWYWx1ZSwgX2xhYmVsQXJyKSB7XG4gICAgbGV0IGZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgIGZpZWxkLmNsYXNzTGlzdC5hZGQoYCR7X25hbWV9LWZpZWxkc2V0YCk7XG5cbiAgICBsZXQgcmFkaW9zID0gW107XG4gICAgbGV0IGxhYmVscyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfbGFiZWxBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmFkaW9zLnB1c2goZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpKTtcbiAgICAgICAgcmFkaW9zW2ldLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYWRpb1wiKTtcbiAgICAgICAgcmFkaW9zW2ldLnNldEF0dHJpYnV0ZShcImlkXCIsIGAke19uYW1lfS0ke2l9YCk7XG4gICAgICAgIHJhZGlvc1tpXS5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIF9uYW1lKTtcbiAgICAgICAgcmFkaW9zW2ldLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIF9sYWJlbEFycltpXSk7XG4gICAgICAgIGZpZWxkLmFwcGVuZENoaWxkKHJhZGlvc1tpXSk7XG5cbiAgICAgICAgbGFiZWxzLnB1c2goZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpKTtcbiAgICAgICAgbGFiZWxzW2ldLnNldEF0dHJpYnV0ZShcImZvclwiLCBgJHtfbmFtZX0tJHtpfWApO1xuICAgICAgICBsYWJlbHNbaV0udGV4dENvbnRlbnQgPSBfbGFiZWxBcnJbaV07XG4gICAgICAgIGZpZWxkLmFwcGVuZENoaWxkKGxhYmVsc1tpXSk7XG4gICAgfVxuXG4gICAgcmFkaW9zW19kZWZhdWx0VmFsdWVdLnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIiwgXCJcIik7XG5cbiAgICByZXR1cm4gZmllbGQ7XG59XG5cbmZ1bmN0aW9uIGdldFJhZGlvVmFsdWUoX2ZpZWxkc2V0KSB7XG4gICAgbGV0IHJhZGlvcyA9IF9maWVsZHNldC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhZGlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocmFkaW9zW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTdmcoX3BhdGgsIF90aXRsZSwgX3VzZUJnLCBfcGF0aENsYXNzKSB7XG4gICAgbGV0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAwIDI0IDI0XCIpO1xuICAgIFxuICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwidGl0bGVcIik7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSBfdGl0bGU7XG4gICAgc3ZnLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICBpZiAoX3VzZUJnKSB7XG4gICAgICAgIHZhciBiZ1BhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInBhdGhcIik7XG4gICAgICAgIGJnUGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTTEyLDRBMTAsMTAgMCAwLDAgNCwxMkExMCwxMCAwIDAsMCAxMiwyMEExMCwxMCAwIDAsMCAyMCwxMkExMCwxMCAwIDAsMCAxMiw0WlwiKTtcbiAgICAgICAgYmdQYXRoLmNsYXNzTGlzdC5hZGQoXCJiZy1pbWdcIik7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChiZ1BhdGgpO1xuICAgIH1cbiAgICBsZXQgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicGF0aFwiKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgX3BhdGgpO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcblxuICAgIGlmIChfcGF0aENsYXNzICE9IG51bGwpIHtcbiAgICAgICAgcGF0aC5jbGFzc0xpc3QuYWRkKF9wYXRoQ2xhc3MpO1xuICAgICAgICBcbiAgICAgICAgaWYgKF91c2VCZykge1xuICAgICAgICAgICAgYmdQYXRoLmNsYXNzTGlzdC5hZGQoX3BhdGhDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcmlvcml0eVN2ZyhfcHJpb3JpdHkpIHtcbiAgICBjb25zdCBwcmlvcml0eVBhdGggPSBbXG4gICAgICAgIFwiTTEyIDE2QzEzLjY2IDE2IDE1IDE0LjY2IDE1IDEzQzE1IDExLjg4IDE0LjM5IDEwLjkgMTMuNSAxMC4zOUwzLjc5IDQuNzdMOS4zMiAxNC4zNUM5LjgyIDE1LjMzIDEwLjgzIDE2IDEyIDE2TTEyIDNDMTAuMTkgMyA4LjUgMy41IDcuMDMgNC4zMkw5LjEzIDUuNTNDMTAgNS4xOSAxMSA1IDEyIDVDMTYuNDIgNSAyMCA4LjU4IDIwIDEzQzIwIDE1LjIxIDE5LjExIDE3LjIxIDE3LjY2IDE4LjY1SDE3LjY1QzE3LjI2IDE5LjA0IDE3LjI2IDE5LjY3IDE3LjY1IDIwLjA2QzE4LjA0IDIwLjQ1IDE4LjY4IDIwLjQ1IDE5LjA3IDIwLjA3QzIwLjg4IDE4LjI2IDIyIDE1Ljc2IDIyIDEzQzIyIDcuNSAxNy41IDMgMTIgM00yIDEzQzIgMTUuNzYgMy4xMiAxOC4yNiA0LjkzIDIwLjA3QzUuMzIgMjAuNDUgNS45NSAyMC40NSA2LjM0IDIwLjA2QzYuNzMgMTkuNjcgNi43MyAxOS4wNCA2LjM0IDE4LjY1QzQuODkgMTcuMiA0IDE1LjIxIDQgMTNDNCAxMiA0LjE5IDExIDQuNTQgMTAuMUwzLjMzIDhDMi41IDkuNSAyIDExLjE4IDIgMTNaXCIsXG4gICAgICAgIFwiTTEyIDEuMzhMOS4xNCAxMi4wNkM4LjggMTMuMSA5LjA0IDE0LjI5IDkuODYgMTUuMTJDMTEuMDQgMTYuMjkgMTIuOTQgMTYuMjkgMTQuMTEgMTUuMTJDMTQuOSAxNC4zMyAxNS4xNiAxMy4yIDE0Ljg5IDEyLjIxTTE0LjYgMy4zNUwxNS4yMiA1LjY4QzE4LjA0IDYuOTIgMjAgOS43MyAyMCAxM0MyMCAxNS4yMSAxOS4xMSAxNy4yMSAxNy42NiAxOC42NUgxNy42NUMxNy4yNiAxOS4wNCAxNy4yNiAxOS42NyAxNy42NSAyMC4wNkMxOC4wNCAyMC40NSAxOC42OCAyMC40NSAxOS4wNyAyMC4wN0MyMC44OCAxOC4yNiAyMiAxNS43NiAyMiAxM0MyMiA4LjM4IDE4Ljg2IDQuNSAxNC42IDMuMzVNOS40IDMuMzZDNS4xNSA0LjUgMiA4LjQgMiAxM0MyIDE1Ljc2IDMuMTIgMTguMjYgNC45MyAyMC4wN0M1LjMyIDIwLjQ1IDUuOTUgMjAuNDUgNi4zNCAyMC4wNkM2LjczIDE5LjY3IDYuNzMgMTkuMDQgNi4zNCAxOC42NUM0Ljg5IDE3LjIgNCAxNS4yMSA0IDEzQzQgOS42NSA1Ljk0IDYuODYgOC43OSA1LjY1XCIsXG4gICAgICAgIFwiTTEyLDE2QTMsMyAwIDAsMSA5LDEzQzksMTEuODggOS42MSwxMC45IDEwLjUsMTAuMzlMMjAuMjEsNC43N0wxNC42OCwxNC4zNUMxNC4xOCwxNS4zMyAxMy4xNywxNiAxMiwxNk0xMiwzQzEzLjgxLDMgMTUuNSwzLjUgMTYuOTcsNC4zMkwxNC44Nyw1LjUzQzE0LDUuMTkgMTMsNSAxMiw1QTgsOCAwIDAsMCA0LDEzQzQsMTUuMjEgNC44OSwxNy4yMSA2LjM0LDE4LjY1SDYuMzVDNi43NCwxOS4wNCA2Ljc0LDE5LjY3IDYuMzUsMjAuMDZDNS45NiwyMC40NSA1LjMyLDIwLjQ1IDQuOTMsMjAuMDdWMjAuMDdDMy4xMiwxOC4yNiAyLDE1Ljc2IDIsMTNBMTAsMTAgMCAwLDEgMTIsM00yMiwxM0MyMiwxNS43NiAyMC44OCwxOC4yNiAxOS4wNywyMC4wN1YyMC4wN0MxOC42OCwyMC40NSAxOC4wNSwyMC40NSAxNy42NiwyMC4wNkMxNy4yNywxOS42NyAxNy4yNywxOS4wNCAxNy42NiwxOC42NVYxOC42NUMxOS4xMSwxNy4yIDIwLDE1LjIxIDIwLDEzQzIwLDEyIDE5LjgxLDExIDE5LjQ2LDEwLjFMMjAuNjcsOEMyMS41LDkuNSAyMiwxMS4xOCAyMiwxM1pcIlxuICAgIF07XG5cbiAgICBjb25zdCBwcmlvcml0eUNsYXNzID0gW1xuICAgICAgICBcInByaW9yaXR5LWxvd1wiLFxuICAgICAgICBcInByaW9yaXR5LW1pZFwiLFxuICAgICAgICBcInByaW9yaXR5LWhpZ2hcIlxuICAgIF07XG5cbiAgICBsZXQgcHJpb3JpdHlTdmcgPSBjcmVhdGVTdmcocHJpb3JpdHlQYXRoW19wcmlvcml0eSAtIDFdLCBcbiAgICAgICAgcHJpb3JpdHlMaXN0W19wcmlvcml0eV0sIGZhbHNlKTtcbiAgICBwcmlvcml0eVN2Zy5jbGFzc0xpc3QuYWRkKFwicHJpb3JpdHktaW1nXCIsIHByaW9yaXR5Q2xhc3NbX3ByaW9yaXR5IC0gMV0pO1xuXG4gICAgcmV0dXJuIHByaW9yaXR5U3ZnO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcm9ncmVzc1N2ZyhfcHJvZ3Jlc3MpIHtcbiAgICBjb25zdCBwcm9ncmVzc1BhdGggPSBbXG4gICAgICAgIFwiTTEyLDIwQTgsOCAwIDAsMSA0LDEyQTgsOCAwIDAsMSAxMiw0QTgsOCAwIDAsMSAyMCwxMkE4LDggMCAwLDEgMTIsMjBNMTIsMkExMCwxMCAwIDAsMCAyLDEyQTEwLDEwIDAgMCwwIDEyLDIyQTEwLDEwIDAgMCwwIDIyLDEyQTEwLDEwIDAgMCwwIDEyLDJaXCIsXG4gICAgICAgIFwiTTguNDYgOC40NkM5LjQgNy41MyAxMC42NyA3IDEyIDdDMTMuMzMgNyAxNC42IDcuNTMgMTUuNTQgOC40Nkw4LjQ2IDE1LjU0QzcuNTMgMTQuNiA3IDEzLjMzIDcgMTJDNyAxMC42NyA3LjUzIDkuNCA4LjQ2IDguNDZNOC4xNyAyLjc2QzkuMzkgMi4yNiAxMC42OSAyIDEyIDJDMTMuMzEgMiAxNC42MSAyLjI2IDE1LjgzIDIuNzZDMTcuMDQgMy4yNiAxOC4xNCA0IDE5LjA3IDQuOTNDMjAgNS44NiAyMC43NCA2Ljk2IDIxLjI0IDguMTdDMjEuNzQgOS4zOSAyMiAxMC42OSAyMiAxMkMyMiAxNC42NSAyMC45NSAxNy4yIDE5LjA3IDE5LjA3QzE3LjIgMjAuOTUgMTQuNjUgMjIgMTIgMjJDMTAuNjkgMjIgOS4zOSAyMS43NCA4LjE3IDIxLjI0QzYuOTYgMjAuNzQgNS44NiAyMCA0LjkzIDE5LjA3QzMuMDUgMTcuMiAyIDE0LjY1IDIgMTJDMiA5LjM1IDMuMDUgNi44IDQuOTMgNC45M0M1Ljg2IDQgNi45NiAzLjI2IDguMTcgMi43Nk02LjM0IDE3LjY2QzcuODQgMTkuMTYgOS44OCAyMCAxMiAyMEMxNC4xMiAyMCAxNi4xNiAxOS4xNiAxNy42NiAxNy42NkMxOS4xNiAxNi4xNiAyMCAxNC4xMiAyMCAxMkMyMCA5Ljg4IDE5LjE2IDcuODQgMTcuNjYgNi4zNEMxNi4xNiA0Ljg0IDE0LjEyIDQgMTIgNEM5Ljg4IDQgNy44NCA0Ljg0IDYuMzQgNi4zNEM0Ljg0IDcuODQgNCA5Ljg4IDQgMTJDNCAxNC4xMiA0Ljg0IDE2LjE2IDYuMzQgMTcuNjZaXCIsXG4gICAgICAgIFwiTTEyLDIwQTgsOCAwIDAsMSA0LDEyQTgsOCAwIDAsMSAxMiw0QTgsOCAwIDAsMSAyMCwxMkE4LDggMCAwLDEgMTIsMjBNMTIsMkExMCwxMCAwIDAsMCAyLDEyQTEwLDEwIDAgMCwwIDEyLDIyQTEwLDEwIDAgMCwwIDIyLDEyQTEwLDEwIDAgMCwwIDEyLDJNMTIsN0E1LDUgMCAwLDAgNywxMkE1LDUgMCAwLDAgMTIsMTdBNSw1IDAgMCwwIDE3LDEyQTUsNSAwIDAsMCAxMiw3WlwiXG4gICAgXTtcblxuICAgIGNvbnN0IHByb2dyZXNzQ2xhc3MgPSBbXG4gICAgICAgIFwicHJvZ3Jlc3Mtbm90LXN0YXJ0ZWRcIixcbiAgICAgICAgXCJwcm9ncmVzcy1pbi1wcm9ncmVzc1wiLFxuICAgICAgICBcInByb2dyZXNzLWNvbXBsZXRlZFwiXG4gICAgXTtcblxuICAgIGxldCBwcm9ncmVzc1N2ZyA9IGNyZWF0ZVN2Zyhwcm9ncmVzc1BhdGhbX3Byb2dyZXNzIC0gMV0sIFxuICAgICAgICBwcm9ncmVzc0xpc3RbX3Byb2dyZXNzXSwgZmFsc2UpO1xuICAgIHByb2dyZXNzU3ZnLmNsYXNzTGlzdC5hZGQoXCJwcm9ncmVzcy1pbWdcIiwgcHJvZ3Jlc3NDbGFzc1tfcHJvZ3Jlc3MgLSAxXSk7XG5cbiAgICByZXR1cm4gcHJvZ3Jlc3NTdmc7XG59IiwiLy8gU3R5bGUgbWVudSBjb2xvcnMgdmlhIENTUzpcbi8vXG4vLyAubWVudS1yZWN0IHtcbi8vICAgICBmaWxsOiBjb2xvcjtcbi8vIH1cbi8vIC5tZW51LWJvcmRlciB7XG4vLyAgICAgZmlsbDogY29sb3I7XG4vLyB9XG4vLyAubWVudS10ZXh0IHtcbi8vICAgICBmaWxsOiBjb2xvcjtcbi8vIH1cbi8vIC5tZW51LWhpZ2hsaWdodCB7XG4vLyAgICAgZmlsbDogY29sb3I7XG4vLyB9XG5cbmNvbnN0IG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNsaWNrUmVsZWFzZVdpbmRvdztcbiAgICBzdmc7XG4gICAgZ3JvdXA7XG4gICAgbWVudTtcbiAgICBib3JkZXI7XG4gICAgbWVudUl0ZW1zID0gW107XG4gICAgYnV0dG9uRG93blRpbWU7XG4gICAgaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgdGlsZUdyb3VwID0gbnVsbDtcbiAgICBmdW5jdGlvbnM7XG4gICAgaXRlbVRleHRzO1xuICAgIGJvcmRlclNpemUgPSAxO1xuICAgIHNjYWxlID0gMTtcbiAgICBmb250U2l6ZSA9IDIwO1xuICAgIC8vIG1lbnVNYXJnaW4gY3JlYXRlcyBhbiBpbnZpc2libGUsIG5vbi1zZWxlY3RhYmxlIGJ1ZmZlciB6b25lIGFyb3VuZCB0aGUgXG4gICAgLy8gbWVudSBzbyB3ZSBjYW4gbGlzdGVuIGZvciB0aGUgbW91c2UgbGVhdmluZyB0aGUgbWVudSBhbmQgZGlzYWJsZSB0aGUgXG4gICAgLy8gaGlnaGxpZ2h0IHdpdGhvdXQgaGF2aW5nIHRvIGxpc3RlbiBvdmVyIHRoZSBlbnRpcmUgZG9jdW1lbnQuXG4gICAgbWVudU1hcmdpbiA9IDI7XG4gICAgbWVudVBvc09mZnNldCA9IHsgeDogLTQsIHk6IC0xIH07XG4gICAgbWVudVdpZHRoO1xuICAgIG1lbnVIZWlnaHQ7XG4gICAgaW5pdFRpbWU7XG4gICAgLy8gcG9zdEluaXREZWxheSBzZXRzIGEgZGVsYXkgb24gd2hlbiBtZW51IGl0ZW1zIGNhbiBiZSB0cmlnZ2VyZWQgYWZ0ZXIgbWVudVxuICAgIC8vIGluaXQuIFRoaXMgcHJvdmlkZXMgYSBzYWZlZ3VhcmQgYWdhaW5zdCBhY2NpZGVudGFsbHkgY2F0Y2hpbmcgYSBjbGljayB0aGF0XG4gICAgLy8gb3BlbmVkIHRoZSBtZW51LlxuICAgIHBvc3RJbml0RGVsYXkgPSAyMDA7XG4gICAgaHRtbDtcblxuICAgIGNvbnN0cnVjdG9yIChfaXRlbVRleHRzLCBfZnVuY3Rpb25zKSB7XG4gICAgICAgIHRoaXMuaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpO1xuICAgICAgICB0aGlzLnN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIFwic3ZnXCIpO1xuICAgICAgICB0aGlzLnN2Zy5jbGFzc0xpc3QuYWRkKFwibWVudVwiKTtcbiAgICAgICAgdGhpcy5zdmcuc2V0QXR0cmlidXRlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAgIHRoaXMuY2xpY2tSZWxlYXNlV2luZG93ID0gNTAwO1xuICAgICAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgXCJnXCIpO1xuICAgICAgICB0aGlzLm1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBcInJlY3RcIik7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgXCJyZWN0XCIpO1xuXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5ib3JkZXIpO1xuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHRoaXMubWVudSk7XG4gICAgICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlKFwiaWRcIiwgYG1lbnVHcm91cGApO1xuXG4gICAgICAgIC8vdGhpcy5ib3JkZXIuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInJlZFwiKTtcbiAgICAgICAgdGhpcy5ib3JkZXIuY2xhc3NMaXN0LmFkZChcIm1lbnUtYm9yZGVyXCIpO1xuXG4gICAgICAgIC8vdGhpcy5tZW51LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJncmVlblwiKTtcbiAgICAgICAgdGhpcy5tZW51LmNsYXNzTGlzdC5hZGQoXCJtZW51LXJlY3RcIik7XG5cbiAgICAgICAgdGhpcy5mdW5jdGlvbnMgPSBfZnVuY3Rpb25zO1xuICAgICAgICB0aGlzLml0ZW1UZXh0cyA9IF9pdGVtVGV4dHM7XG5cbiAgICAgICAgdGhpcy5zdmcuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBfZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUhpZ2hsaWdodChfZS5jbGllbnRYLCBfZS5jbGllbnRZKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKF9lKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVyYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgX2UgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlICYmIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5pbml0VGltZSA+IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RJbml0RGVsYXkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbWVudVNlbGVjdGlvbiA9IHRoaXMuZ2V0SGlnaGxpZ2h0ZWQoKTtcbiAgICAgICAgICAgICAgICBsZXQgbWVudU1vdXNlT3ZlciA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KF9lLmNsaWVudFgsIF9lLmNsaWVudFkpO1xuICAgIFxuICAgICAgICAgICAgICAgIGlmIChtZW51U2VsZWN0aW9uICYmIG1lbnVNb3VzZU92ZXIuaW5jbHVkZXMobWVudVNlbGVjdGlvbi5yZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2YXRlU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuZXJhc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN2Zy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5zdmcuc2V0QXR0cmlidXRlKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgICAgICB0aGlzLnN2Zy5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBgcG9zaXRpb246IGFic29sdXRlO2ApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtVGV4dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTWVudUl0ZW0odGhpcy5pdGVtVGV4dHNbaV0sIHRoaXMuZnVuY3Rpb25zW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBoZWlnaHQgPSAwO1xuICAgICAgICBsZXQgd2lkdGggPSAwO1xuICAgICAgICBmb3IgKGxldCB4IG9mIHRoaXMubWVudUl0ZW1zKSB7XG4gICAgICAgICAgICBsZXQgbmV3V2lkdGggPSB4LnN2Z1RleHQudGV4dC5nZXRCQm94KCkud2lkdGggKyB4LnN2Z1RleHQueE1hcmdpbiAqIDI7XG5cbiAgICAgICAgICAgIGlmIChuZXdXaWR0aCA+IHdpZHRoKSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWVudUl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm1lbnVJdGVtc1tpXS5yZWN0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIHdpZHRoKTtcbiAgICAgICAgICAgIHRoaXMubWVudUl0ZW1zW2ldLmdyb3VwLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAsICR7aGVpZ2h0fSlgKTtcbiAgICAgICAgICAgIGhlaWdodCArPSBOdW1iZXIodGhpcy5tZW51SXRlbXNbaV0ucmVjdC5nZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIikpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1lbnUuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgYCR7d2lkdGh9YCk7XG4gICAgICAgIHRoaXMubWVudS5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgYCR7aGVpZ2h0fWApO1xuICAgICAgICB0aGlzLmJvcmRlci5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBgJHt3aWR0aCArIHRoaXMuYm9yZGVyU2l6ZSAqIDJ9YCk7XG4gICAgICAgIHRoaXMuYm9yZGVyLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBgJHtoZWlnaHQgKyB0aGlzLmJvcmRlclNpemUgKiAyfWApO1xuICAgICAgICB0aGlzLmJvcmRlci5zZXRBdHRyaWJ1dGUoXCJ4XCIsIGAke3RoaXMuYm9yZGVyU2l6ZSAqIC0xfWApO1xuICAgICAgICB0aGlzLmJvcmRlci5zZXRBdHRyaWJ1dGUoXCJ5XCIsIGAke3RoaXMuYm9yZGVyU2l6ZSAqIC0xfWApO1xuXG4gICAgICAgIHRoaXMuc3ZnLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIGAke3dpZHRoICogdGhpcy5zY2FsZSArIHRoaXMuYm9yZGVyU2l6ZSAqIHRoaXMuc2NhbGV9YCk7XG4gICAgICAgIHRoaXMuc3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBgJHtoZWlnaHQgKiB0aGlzLnNjYWxlICsgdGhpcy5ib3JkZXJTaXplICogdGhpcy5zY2FsZX1gKTtcbiAgICAgICAgdGhpcy5zdmcuc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCBcbiAgICAgICAgICAgIGAke3RoaXMuYm9yZGVyU2l6ZSAqIC0xIC0gdGhpcy5tZW51TWFyZ2lufSAke3RoaXMuYm9yZGVyU2l6ZSAqIC0xIC0gXG4gICAgICAgICAgICB0aGlzLm1lbnVNYXJnaW59ICR7d2lkdGggKyB0aGlzLmJvcmRlclNpemUgKiAyICsgdGhpcy5tZW51TWFyZ2luICogXG4gICAgICAgICAgICAyfSAke2hlaWdodCArIHRoaXMuYm9yZGVyU2l6ZSAqIDIgKyB0aGlzLm1lbnVNYXJnaW4gKiAyfWApO1xuXG4gICAgICAgIC8vdGhpcy5tZW51V2lkdGggPSB3aWR0aCArIHRoaXMuYm9yZGVyU2l6ZSAqIDIgLSB0aGlzLm1lbnVNYXJnaW4gKiAyO1xuICAgICAgICB0aGlzLm1lbnVXaWR0aCA9IHdpZHRoICsgdGhpcy5ib3JkZXJTaXplICogMiAtIHRoaXMubWVudU1hcmdpbiAqIDI7XG4gICAgICAgIHRoaXMubWVudUhlaWdodCA9IGhlaWdodCArIHRoaXMuYm9yZGVyU2l6ZSAqIDIgLSB0aGlzLm1lbnVNYXJnaW4gKiAyO1xuXG4gICAgICAgIHRoaXMuaW5pdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICBidXR0b25Eb3duKF9jbGllbnRYLCBfY2xpZW50WSkge1xuICAgICAgICBpZiAodGhpcy5pc1Zpc2libGUpIHRoaXMuZXJhc2UoKTtcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnN2Zy5hcHBlbmRDaGlsZCh0aGlzLmdyb3VwKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgY29uc3QgZG9jV2lkdGggPSB0aGlzLmh0bWwuY2xpZW50V2lkdGg7XG4gICAgICAgIGNvbnN0IGRvY0hlaWdodCA9IHRoaXMuaHRtbC5jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgLy8gQWRqdXN0bWVudCB2YWx1ZXMgaWYgdGhlIG1lbnUgZXh0ZW5kcyBvZmYgdGhlIHNjcmVlbi5cbiAgICAgICAgbGV0IHhPZmZzZXQgPSAwO1xuICAgICAgICBsZXQgeU9mZnNldCA9IDA7XG5cbiAgICAgICAgaWYgKF9jbGllbnRYICsgdGhpcy5tZW51UG9zT2Zmc2V0LnggKyB0aGlzLm1lbnVXaWR0aCArIDEgPiBkb2NXaWR0aCkge1xuICAgICAgICAgICAgeE9mZnNldCA9ICBkb2NXaWR0aCAtIChfY2xpZW50WCArIHRoaXMubWVudVBvc09mZnNldC54ICsgdGhpcy5tZW51V2lkdGggKyAxKTsgXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2NsaWVudFkgKyB0aGlzLm1lbnVQb3NPZmZzZXQueSArIHRoaXMubWVudUhlaWdodCArIDEgPiBkb2NIZWlnaHQpIHtcbiAgICAgICAgICAgIHlPZmZzZXQgPSAgZG9jSGVpZ2h0IC0gKF9jbGllbnRZICsgdGhpcy5tZW51UG9zT2Zmc2V0LnkgKyB0aGlzLm1lbnVIZWlnaHQgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3ZnLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7X2NsaWVudFggLSB0aGlzLm1lbnVNYXJnaW4gKyBcbiAgICAgICAgICAgIHRoaXMubWVudVBvc09mZnNldC54ICsgeE9mZnNldCArIHdpbmRvdy5zY3JvbGxYfSwgJHtfY2xpZW50WSAtIHRoaXMubWVudU1hcmdpbiArIFxuICAgICAgICAgICAgdGhpcy5tZW51UG9zT2Zmc2V0LnkgKyB5T2Zmc2V0ICsgd2luZG93LnNjcm9sbFl9KWApO1xuICAgICAgICB0aGlzLnVwZGF0ZUhpZ2hsaWdodChfY2xpZW50WCwgX2NsaWVudFkpO1xuICAgICAgICB0aGlzLmJ1dHRvbkRvd25UaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgfVxuXG4gICAgYnV0dG9uVXAoKSB7XG4gICAgICAgIGlmIChwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMuYnV0dG9uRG93blRpbWUgPiBjbGlja1JlbGVhc2VXaW5kb3cpIHRoaXMuZXJhc2UoKTtcbiAgICB9O1xuXG4gICAgZXJhc2UoKSB7XG4gICAgICAgIHRoaXMuZ3JvdXAucmVtb3ZlKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLm1lbnVJdGVtcykge1xuICAgICAgICAgICAgaXRlbS5ncm91cC5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3ZnLnNldEF0dHJpYnV0ZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgICB0aGlzLm1lbnVJdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGFkZE1lbnVJdGVtKF90ZXh0LCBfZnVuY3Rpb24sIF9pZHgpIHtcbiAgICAgICAgaWYgKF9pZHggPT0gbnVsbCkgX2lkeCA9IHRoaXMubWVudUl0ZW1zLmxlbmd0aDtcbiAgICAgICAgdGhpcy5tZW51SXRlbXMuc3BsaWNlKF9pZHgsIDAsIG5ldyBNZW51SXRlbShfdGV4dCwgdGhpcy5mb250U2l6ZSwgXG4gICAgICAgICAgICB0aGlzLmdyb3VwLCBfaWR4LCBfZnVuY3Rpb24pKTtcbiAgICB9XG5cbiAgICB1cGRhdGVIaWdobGlnaHQoX2NsaWVudFgsIF9jbGllbnRZKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgZm9yIChsZXQgeCBvZiB0aGlzLm1lbnVJdGVtcykge1xuICAgICAgICAgICAgICAgIHgudW5oaWdobGlnaHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBtZW51TW91c2VPdmVyID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoX2NsaWVudFgsIF9jbGllbnRZKTtcbiAgICAgICAgICAgIGZvciAobGV0IHggb2YgdGhpcy5tZW51SXRlbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAobWVudU1vdXNlT3Zlci5pbmNsdWRlcyh4LnJlY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHguaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBnZXRIaWdobGlnaHRlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4IG9mIHRoaXMubWVudUl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHguaXNIaWdobGlnaHRlZCkgcmV0dXJuIHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG5cbiAgICBnZXRIaWdobGlnaHRlZFRleHQoKSB7XG4gICAgICAgIGxldCBoaWdobGlnaHRlZCA9IHRoaXMuZ2V0SGlnaGxpZ2h0ZWQoKTtcbiAgICAgICAgcmV0dXJuIGhpZ2hsaWdodGVkID8gaGlnaGxpZ2h0ZWQuc3ZnVGV4dC50ZXh0LnRleHRDb250ZW50IDogdW5kZWZpbmVkO1xuICAgIH07XG5cbiAgICBhY3RpdmF0ZVNlbGVjdGlvbihfc2VsZWN0aW9uID0gXCJoaWdobGlnaHRlZFwiKSB7XG4gICAgICAgIGlmIChfc2VsZWN0aW9uID09PSBcImhpZ2hsaWdodGVkXCIpIF9zZWxlY3Rpb24gPSB0aGlzLmdldEhpZ2hsaWdodGVkVGV4dCgpO1xuXG4gICAgICAgIGxldCBhY3RpdmUgPSB0aGlzLm1lbnVJdGVtcy5maW5kKF9lID0+IF9lLnRleHQgPT0gX3NlbGVjdGlvbik7XG4gICAgICAgIFxuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlLmZ1bmN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xufVxuXG5jbGFzcyBNZW51SXRlbSB7XG4gICAgcmVjdDtcbiAgICBncm91cDtcbiAgICB0ZXh0O1xuICAgIHN2Z1RleHQ7XG4gICAgaXNIaWdobGlnaHRlZDtcbiAgICBmdW5jdGlvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihfdGV4dCwgX2ZvbnRTaXplLCBfcGFyZW50LCBfaWR4LCBfZnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gX3RleHQ7XG4gICAgICAgIHRoaXMucmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIFwicmVjdFwiKTtcbiAgICAgICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIFwiZ1wiKTtcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZCh0aGlzLnJlY3QpO1xuICAgICAgICBfcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuICAgICAgICB0aGlzLnN2Z1RleHQgPSBuZXcgU1ZHVGV4dChfdGV4dCwgdGhpcy5ncm91cCwgX2lkeCwgX2ZvbnRTaXplKTtcbiAgICAgICAgdGhpcy5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZ2JhKDAsIDAsIDAsIDApXCIpO1xuICAgICAgICAvL3RoaXMucmVjdC5zZXRBdHRyaWJ1dGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICAgICAgdGhpcy5yZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBgJHtfZm9udFNpemUgKiAxLjJ9YCk7XG4gICAgICAgIHRoaXMucmVjdC5jbGFzc0xpc3QuYWRkKFwibWVudS1pdGVtXCIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pc0hpZ2hsaWdodGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZnVuY3Rpb24gPSBfZnVuY3Rpb247XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0KCkge1xuICAgICAgICAvL3RoaXMucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwicGlua1wiKTtcbiAgICAgICAgLy90aGlzLnJlY3Quc2V0QXR0cmlidXRlKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgICAgICB0aGlzLnJlY3QuY2xhc3NMaXN0LmFkZChcIm1lbnUtaGlnaGxpZ2h0XCIpO1xuICAgICAgICB0aGlzLmlzSGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB1bmhpZ2hsaWdodCgpIHtcbiAgICAgICAgLy90aGlzLnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInJnYmEoMCwgMCwgMCwgMClcIik7XG4gICAgICAgIC8vdGhpcy5yZWN0LnNldEF0dHJpYnV0ZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgICB0aGlzLnJlY3QuY2xhc3NMaXN0LnJlbW92ZShcIm1lbnUtaGlnaGxpZ2h0XCIpO1xuICAgICAgICB0aGlzLmlzSGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBTVkdUZXh0KF9jb250ZW50LCBfcGFyZW50LCBfaWQgPSAtMSwgX2ZvbnRTaXplID0gMTApIHtcbiAgICB0aGlzLmZvbnRTaXplID0gX2ZvbnRTaXplO1xuICAgIHRoaXMueE1hcmdpbiA9IHRoaXMuZm9udFNpemUgKiAwLjI7XG4gICAgdGhpcy50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgXCJ0ZXh0XCIpO1xuICAgIHRoaXMudGV4dC50ZXh0Q29udGVudCA9IF9jb250ZW50O1xuICAgIC8vdGhpcy50ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ5ZWxsb3dcIik7XG4gICAgdGhpcy50ZXh0LnNldEF0dHJpYnV0ZShcImN1cnNvclwiLCBcImRlZmF1bHRcIik7XG4gICAgdGhpcy50ZXh0LmNsYXNzTGlzdC5hZGQoYG1lbnUtdGV4dC0ke19pZH1gKTtcbiAgICB0aGlzLnRleHQuY2xhc3NMaXN0LmFkZChcIm1lbnUtdGV4dFwiKTtcbiAgICBfcGFyZW50LmFwcGVuZENoaWxkKHRoaXMudGV4dCk7XG4gICAgdGhpcy50ZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgYCR7dGhpcy54TWFyZ2lufWApO1xuICAgIHRoaXMudGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIGAke3RoaXMuZm9udFNpemUgKiAwLjl9YCk7XG4gICAgdGhpcy50ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCBgJHt0aGlzLmZvbnRTaXplfXB4YCk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuICAgIGxldCBvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgLy9sZXQgb2Zmc2V0ID0gMDtcbiAgICBsZXQgb2Zmc2V0RGlyID0gb2Zmc2V0IDwgMCA/IC0xIDogMTtcbiAgICBvZmZzZXQgPSBNYXRoLmFicyhvZmZzZXQpO1xuICAgIGxldCBzdHIgPSBgJHtTdHJpbmcoTWF0aC5mbG9vcihvZmZzZXQgLyA2MCkpLnBhZFN0YXJ0KDIsIFwiMFwiKX06JHtTdHJpbmcob2Zmc2V0ICUgNjApLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuXG4gICAgaWYgKG9mZnNldERpciA9PSAxKSB7XG4gICAgICAgIHN0ciA9IFwiLVwiICsgc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IFwiK1wiICsgc3RyXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbn0iLCJ2YXIgdG9rZW49L2R7MSw0fXxEezMsNH18bXsxLDR9fHl5KD86eXkpP3woW0hoTXNUdF0pXFwxP3xXezEsMn18W0xsb3BTWk5dfFwiW15cIl0qXCJ8J1teJ10qJy9nO3ZhciB0aW1lem9uZT0vXFxiKD86W0EtWl17MSwzfVtBLVpdW1RDXSkoPzpbLStdXFxkezR9KT98KCg/OkF1c3RyYWxpYW4gKT8oPzpQYWNpZmljfE1vdW50YWlufENlbnRyYWx8RWFzdGVybnxBdGxhbnRpYykgKD86U3RhbmRhcmR8RGF5bGlnaHR8UHJldmFpbGluZykgVGltZSlcXGIvZzt2YXIgdGltZXpvbmVDbGlwPS9bXi0rXFxkQS1aXS9nO2V4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRhdGVGb3JtYXQoZGF0ZSxtYXNrLHV0YyxnbXQpe2lmKGFyZ3VtZW50cy5sZW5ndGg9PT0xJiZ0eXBlb2YgZGF0ZT09PVwic3RyaW5nXCImJiEvXFxkLy50ZXN0KGRhdGUpKXttYXNrPWRhdGU7ZGF0ZT11bmRlZmluZWR9ZGF0ZT1kYXRlfHxkYXRlPT09MD9kYXRlOm5ldyBEYXRlO2lmKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKXtkYXRlPW5ldyBEYXRlKGRhdGUpfWlmKGlzTmFOKGRhdGUpKXt0aHJvdyBUeXBlRXJyb3IoXCJJbnZhbGlkIGRhdGVcIil9bWFzaz1TdHJpbmcobWFza3NbbWFza118fG1hc2t8fG1hc2tzW1wiZGVmYXVsdFwiXSk7dmFyIG1hc2tTbGljZT1tYXNrLnNsaWNlKDAsNCk7aWYobWFza1NsaWNlPT09XCJVVEM6XCJ8fG1hc2tTbGljZT09PVwiR01UOlwiKXttYXNrPW1hc2suc2xpY2UoNCk7dXRjPXRydWU7aWYobWFza1NsaWNlPT09XCJHTVQ6XCIpe2dtdD10cnVlfX12YXIgXz1mdW5jdGlvbiBfKCl7cmV0dXJuIHV0Yz9cImdldFVUQ1wiOlwiZ2V0XCJ9O3ZhciBfZD1mdW5jdGlvbiBkKCl7cmV0dXJuIGRhdGVbXygpK1wiRGF0ZVwiXSgpfTt2YXIgRD1mdW5jdGlvbiBEKCl7cmV0dXJuIGRhdGVbXygpK1wiRGF5XCJdKCl9O3ZhciBfbT1mdW5jdGlvbiBtKCl7cmV0dXJuIGRhdGVbXygpK1wiTW9udGhcIl0oKX07dmFyIHk9ZnVuY3Rpb24geSgpe3JldHVybiBkYXRlW18oKStcIkZ1bGxZZWFyXCJdKCl9O3ZhciBfSD1mdW5jdGlvbiBIKCl7cmV0dXJuIGRhdGVbXygpK1wiSG91cnNcIl0oKX07dmFyIF9NPWZ1bmN0aW9uIE0oKXtyZXR1cm4gZGF0ZVtfKCkrXCJNaW51dGVzXCJdKCl9O3ZhciBfcz1mdW5jdGlvbiBzKCl7cmV0dXJuIGRhdGVbXygpK1wiU2Vjb25kc1wiXSgpfTt2YXIgX0w9ZnVuY3Rpb24gTCgpe3JldHVybiBkYXRlW18oKStcIk1pbGxpc2Vjb25kc1wiXSgpfTt2YXIgX289ZnVuY3Rpb24gbygpe3JldHVybiB1dGM/MDpkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCl9O3ZhciBfVz1mdW5jdGlvbiBXKCl7cmV0dXJuIGdldFdlZWsoZGF0ZSl9O3ZhciBfTj1mdW5jdGlvbiBOKCl7cmV0dXJuIGdldERheU9mV2VlayhkYXRlKX07dmFyIGZsYWdzPXtkOmZ1bmN0aW9uIGQoKXtyZXR1cm4gX2QoKX0sZGQ6ZnVuY3Rpb24gZGQoKXtyZXR1cm4gcGFkKF9kKCkpfSxkZGQ6ZnVuY3Rpb24gZGRkKCl7cmV0dXJuIGkxOG4uZGF5TmFtZXNbRCgpXX0sREREOmZ1bmN0aW9uIERERCgpe3JldHVybiBnZXREYXlOYW1lKHt5OnkoKSxtOl9tKCksZDpfZCgpLF86XygpLGRheU5hbWU6aTE4bi5kYXlOYW1lc1tEKCldLHNob3J0OnRydWV9KX0sZGRkZDpmdW5jdGlvbiBkZGRkKCl7cmV0dXJuIGkxOG4uZGF5TmFtZXNbRCgpKzddfSxEREREOmZ1bmN0aW9uIEREREQoKXtyZXR1cm4gZ2V0RGF5TmFtZSh7eTp5KCksbTpfbSgpLGQ6X2QoKSxfOl8oKSxkYXlOYW1lOmkxOG4uZGF5TmFtZXNbRCgpKzddfSl9LG06ZnVuY3Rpb24gbSgpe3JldHVybiBfbSgpKzF9LG1tOmZ1bmN0aW9uIG1tKCl7cmV0dXJuIHBhZChfbSgpKzEpfSxtbW06ZnVuY3Rpb24gbW1tKCl7cmV0dXJuIGkxOG4ubW9udGhOYW1lc1tfbSgpXX0sbW1tbTpmdW5jdGlvbiBtbW1tKCl7cmV0dXJuIGkxOG4ubW9udGhOYW1lc1tfbSgpKzEyXX0seXk6ZnVuY3Rpb24geXkoKXtyZXR1cm4gU3RyaW5nKHkoKSkuc2xpY2UoMil9LHl5eXk6ZnVuY3Rpb24geXl5eSgpe3JldHVybiBwYWQoeSgpLDQpfSxoOmZ1bmN0aW9uIGgoKXtyZXR1cm4gX0goKSUxMnx8MTJ9LGhoOmZ1bmN0aW9uIGhoKCl7cmV0dXJuIHBhZChfSCgpJTEyfHwxMil9LEg6ZnVuY3Rpb24gSCgpe3JldHVybiBfSCgpfSxISDpmdW5jdGlvbiBISCgpe3JldHVybiBwYWQoX0goKSl9LE06ZnVuY3Rpb24gTSgpe3JldHVybiBfTSgpfSxNTTpmdW5jdGlvbiBNTSgpe3JldHVybiBwYWQoX00oKSl9LHM6ZnVuY3Rpb24gcygpe3JldHVybiBfcygpfSxzczpmdW5jdGlvbiBzcygpe3JldHVybiBwYWQoX3MoKSl9LGw6ZnVuY3Rpb24gbCgpe3JldHVybiBwYWQoX0woKSwzKX0sTDpmdW5jdGlvbiBMKCl7cmV0dXJuIHBhZChNYXRoLmZsb29yKF9MKCkvMTApKX0sdDpmdW5jdGlvbiB0KCl7cmV0dXJuIF9IKCk8MTI/aTE4bi50aW1lTmFtZXNbMF06aTE4bi50aW1lTmFtZXNbMV19LHR0OmZ1bmN0aW9uIHR0KCl7cmV0dXJuIF9IKCk8MTI/aTE4bi50aW1lTmFtZXNbMl06aTE4bi50aW1lTmFtZXNbM119LFQ6ZnVuY3Rpb24gVCgpe3JldHVybiBfSCgpPDEyP2kxOG4udGltZU5hbWVzWzRdOmkxOG4udGltZU5hbWVzWzVdfSxUVDpmdW5jdGlvbiBUVCgpe3JldHVybiBfSCgpPDEyP2kxOG4udGltZU5hbWVzWzZdOmkxOG4udGltZU5hbWVzWzddfSxaOmZ1bmN0aW9uIFooKXtyZXR1cm4gZ210P1wiR01UXCI6dXRjP1wiVVRDXCI6Zm9ybWF0VGltZXpvbmUoZGF0ZSl9LG86ZnVuY3Rpb24gbygpe3JldHVybihfbygpPjA/XCItXCI6XCIrXCIpK3BhZChNYXRoLmZsb29yKE1hdGguYWJzKF9vKCkpLzYwKSoxMDArTWF0aC5hYnMoX28oKSklNjAsNCl9LHA6ZnVuY3Rpb24gcCgpe3JldHVybihfbygpPjA/XCItXCI6XCIrXCIpK3BhZChNYXRoLmZsb29yKE1hdGguYWJzKF9vKCkpLzYwKSwyKStcIjpcIitwYWQoTWF0aC5mbG9vcihNYXRoLmFicyhfbygpKSU2MCksMil9LFM6ZnVuY3Rpb24gUygpe3JldHVybltcInRoXCIsXCJzdFwiLFwibmRcIixcInJkXCJdW19kKCklMTA+Mz8wOihfZCgpJTEwMC1fZCgpJTEwIT0xMCkqX2QoKSUxMF19LFc6ZnVuY3Rpb24gVygpe3JldHVybiBfVygpfSxXVzpmdW5jdGlvbiBXVygpe3JldHVybiBwYWQoX1coKSl9LE46ZnVuY3Rpb24gTigpe3JldHVybiBfTigpfX07cmV0dXJuIG1hc2sucmVwbGFjZSh0b2tlbixmdW5jdGlvbihtYXRjaCl7aWYobWF0Y2ggaW4gZmxhZ3Mpe3JldHVybiBmbGFnc1ttYXRjaF0oKX1yZXR1cm4gbWF0Y2guc2xpY2UoMSxtYXRjaC5sZW5ndGgtMSl9KX1leHBvcnQgdmFyIG1hc2tzPXtkZWZhdWx0OlwiZGRkIG1tbSBkZCB5eXl5IEhIOk1NOnNzXCIsc2hvcnREYXRlOlwibS9kL3l5XCIscGFkZGVkU2hvcnREYXRlOlwibW0vZGQveXl5eVwiLG1lZGl1bURhdGU6XCJtbW0gZCwgeXl5eVwiLGxvbmdEYXRlOlwibW1tbSBkLCB5eXl5XCIsZnVsbERhdGU6XCJkZGRkLCBtbW1tIGQsIHl5eXlcIixzaG9ydFRpbWU6XCJoOk1NIFRUXCIsbWVkaXVtVGltZTpcImg6TU06c3MgVFRcIixsb25nVGltZTpcImg6TU06c3MgVFQgWlwiLGlzb0RhdGU6XCJ5eXl5LW1tLWRkXCIsaXNvVGltZTpcIkhIOk1NOnNzXCIsaXNvRGF0ZVRpbWU6XCJ5eXl5LW1tLWRkJ1QnSEg6TU06c3NvXCIsaXNvVXRjRGF0ZVRpbWU6XCJVVEM6eXl5eS1tbS1kZCdUJ0hIOk1NOnNzJ1onXCIsZXhwaXJlc0hlYWRlckZvcm1hdDpcImRkZCwgZGQgbW1tIHl5eXkgSEg6TU06c3MgWlwifTtleHBvcnQgdmFyIGkxOG49e2RheU5hbWVzOltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiLFwiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl0sbW9udGhOYW1lczpbXCJKYW5cIixcIkZlYlwiLFwiTWFyXCIsXCJBcHJcIixcIk1heVwiLFwiSnVuXCIsXCJKdWxcIixcIkF1Z1wiLFwiU2VwXCIsXCJPY3RcIixcIk5vdlwiLFwiRGVjXCIsXCJKYW51YXJ5XCIsXCJGZWJydWFyeVwiLFwiTWFyY2hcIixcIkFwcmlsXCIsXCJNYXlcIixcIkp1bmVcIixcIkp1bHlcIixcIkF1Z3VzdFwiLFwiU2VwdGVtYmVyXCIsXCJPY3RvYmVyXCIsXCJOb3ZlbWJlclwiLFwiRGVjZW1iZXJcIl0sdGltZU5hbWVzOltcImFcIixcInBcIixcImFtXCIsXCJwbVwiLFwiQVwiLFwiUFwiLFwiQU1cIixcIlBNXCJdfTt2YXIgcGFkPWZ1bmN0aW9uIHBhZCh2YWwpe3ZhciBsZW49YXJndW1lbnRzLmxlbmd0aD4xJiZhcmd1bWVudHNbMV0hPT11bmRlZmluZWQ/YXJndW1lbnRzWzFdOjI7cmV0dXJuIFN0cmluZyh2YWwpLnBhZFN0YXJ0KGxlbixcIjBcIil9O3ZhciBnZXREYXlOYW1lPWZ1bmN0aW9uIGdldERheU5hbWUoX3JlZil7dmFyIHk9X3JlZi55LG09X3JlZi5tLGQ9X3JlZi5kLF89X3JlZi5fLGRheU5hbWU9X3JlZi5kYXlOYW1lLF9yZWYkc2hvcnQ9X3JlZltcInNob3J0XCJdLF9zaG9ydD1fcmVmJHNob3J0PT09dm9pZCAwP2ZhbHNlOl9yZWYkc2hvcnQ7dmFyIHRvZGF5PW5ldyBEYXRlO3ZhciB5ZXN0ZXJkYXk9bmV3IERhdGU7eWVzdGVyZGF5LnNldERhdGUoeWVzdGVyZGF5W18rXCJEYXRlXCJdKCktMSk7dmFyIHRvbW9ycm93PW5ldyBEYXRlO3RvbW9ycm93LnNldERhdGUodG9tb3Jyb3dbXytcIkRhdGVcIl0oKSsxKTt2YXIgdG9kYXlfZD1mdW5jdGlvbiB0b2RheV9kKCl7cmV0dXJuIHRvZGF5W18rXCJEYXRlXCJdKCl9O3ZhciB0b2RheV9tPWZ1bmN0aW9uIHRvZGF5X20oKXtyZXR1cm4gdG9kYXlbXytcIk1vbnRoXCJdKCl9O3ZhciB0b2RheV95PWZ1bmN0aW9uIHRvZGF5X3koKXtyZXR1cm4gdG9kYXlbXytcIkZ1bGxZZWFyXCJdKCl9O3ZhciB5ZXN0ZXJkYXlfZD1mdW5jdGlvbiB5ZXN0ZXJkYXlfZCgpe3JldHVybiB5ZXN0ZXJkYXlbXytcIkRhdGVcIl0oKX07dmFyIHllc3RlcmRheV9tPWZ1bmN0aW9uIHllc3RlcmRheV9tKCl7cmV0dXJuIHllc3RlcmRheVtfK1wiTW9udGhcIl0oKX07dmFyIHllc3RlcmRheV95PWZ1bmN0aW9uIHllc3RlcmRheV95KCl7cmV0dXJuIHllc3RlcmRheVtfK1wiRnVsbFllYXJcIl0oKX07dmFyIHRvbW9ycm93X2Q9ZnVuY3Rpb24gdG9tb3Jyb3dfZCgpe3JldHVybiB0b21vcnJvd1tfK1wiRGF0ZVwiXSgpfTt2YXIgdG9tb3Jyb3dfbT1mdW5jdGlvbiB0b21vcnJvd19tKCl7cmV0dXJuIHRvbW9ycm93W18rXCJNb250aFwiXSgpfTt2YXIgdG9tb3Jyb3dfeT1mdW5jdGlvbiB0b21vcnJvd195KCl7cmV0dXJuIHRvbW9ycm93W18rXCJGdWxsWWVhclwiXSgpfTtpZih0b2RheV95KCk9PT15JiZ0b2RheV9tKCk9PT1tJiZ0b2RheV9kKCk9PT1kKXtyZXR1cm4gX3Nob3J0P1wiVGR5XCI6XCJUb2RheVwifWVsc2UgaWYoeWVzdGVyZGF5X3koKT09PXkmJnllc3RlcmRheV9tKCk9PT1tJiZ5ZXN0ZXJkYXlfZCgpPT09ZCl7cmV0dXJuIF9zaG9ydD9cIllzZFwiOlwiWWVzdGVyZGF5XCJ9ZWxzZSBpZih0b21vcnJvd195KCk9PT15JiZ0b21vcnJvd19tKCk9PT1tJiZ0b21vcnJvd19kKCk9PT1kKXtyZXR1cm4gX3Nob3J0P1wiVG13XCI6XCJUb21vcnJvd1wifXJldHVybiBkYXlOYW1lfTt2YXIgZ2V0V2Vlaz1mdW5jdGlvbiBnZXRXZWVrKGRhdGUpe3ZhciB0YXJnZXRUaHVyc2RheT1uZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksZGF0ZS5nZXRNb250aCgpLGRhdGUuZ2V0RGF0ZSgpKTt0YXJnZXRUaHVyc2RheS5zZXREYXRlKHRhcmdldFRodXJzZGF5LmdldERhdGUoKS0odGFyZ2V0VGh1cnNkYXkuZ2V0RGF5KCkrNiklNyszKTt2YXIgZmlyc3RUaHVyc2RheT1uZXcgRGF0ZSh0YXJnZXRUaHVyc2RheS5nZXRGdWxsWWVhcigpLDAsNCk7Zmlyc3RUaHVyc2RheS5zZXREYXRlKGZpcnN0VGh1cnNkYXkuZ2V0RGF0ZSgpLShmaXJzdFRodXJzZGF5LmdldERheSgpKzYpJTcrMyk7dmFyIGRzPXRhcmdldFRodXJzZGF5LmdldFRpbWV6b25lT2Zmc2V0KCktZmlyc3RUaHVyc2RheS5nZXRUaW1lem9uZU9mZnNldCgpO3RhcmdldFRodXJzZGF5LnNldEhvdXJzKHRhcmdldFRodXJzZGF5LmdldEhvdXJzKCktZHMpO3ZhciB3ZWVrRGlmZj0odGFyZ2V0VGh1cnNkYXktZmlyc3RUaHVyc2RheSkvKDg2NGU1KjcpO3JldHVybiAxK01hdGguZmxvb3Iod2Vla0RpZmYpfTt2YXIgZ2V0RGF5T2ZXZWVrPWZ1bmN0aW9uIGdldERheU9mV2VlayhkYXRlKXt2YXIgZG93PWRhdGUuZ2V0RGF5KCk7aWYoZG93PT09MCl7ZG93PTd9cmV0dXJuIGRvd307ZXhwb3J0IHZhciBmb3JtYXRUaW1lem9uZT1mdW5jdGlvbiBmb3JtYXRUaW1lem9uZShkYXRlKXtyZXR1cm4oU3RyaW5nKGRhdGUpLm1hdGNoKHRpbWV6b25lKXx8W1wiXCJdKS5wb3AoKS5yZXBsYWNlKHRpbWV6b25lQ2xpcCxcIlwiKS5yZXBsYWNlKC9HTVRcXCswMDAwL2csXCJVVENcIil9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gVGFza1xuICAgIC8vIE1ldGhvZHNcbiAgICAgICAgLy8gZGVsZXRlXG4gICAgICAgIC8vIGNvcHlcbiAgICAgICAgLy8gY3V0XG4gICAgICAgIC8vIHBhc3RlXG4gICAgICAgIC8vIGVkaXRcbiAgICAgICAgLy8gZXhwYW5kXG4gICAgICAgIC8vIHNvcnRTdWJ0YXNrc1xuICAgIC8vIFByb3BlcnRpZXNcbiAgICAgICAgLy8gZHVlXG4gICAgICAgIC8vIHRpdGxlXG4gICAgICAgIC8vIGRlc2NyaXB0aW9uXG4gICAgICAgIC8vIHByaW9yaXR5XG4gICAgICAgIC8vIG5vdGVzXG4gICAgICAgIC8vIHByb2dyZXNzXG4gICAgICAgIC8vIHVzZVByb2dyZXNzRnJvbVN1YnRhc2tzXG4gICAgICAgIC8vIHN1YnRhc2tzXG4gICAgICAgIC8vIGV4cGFuZGVkXG5cbi8vIE1lbnUgKD8pXG5cbi8vIFRvcC1sZXZlbCBhcnJheSBvZiB0YXNrc1xuXG4vLyBET00gbW9kdWxlXG5pbXBvcnQgKiBhcyBkb20gZnJvbSBcIi4vZG9tLmpzXCI7XG5pbXBvcnQgdGltZXpvbmVTdHJpbmcgZnJvbSBcIi4vdGltZXpvbmUtc3RyaW5nLmpzXCI7XG5pbXBvcnQgUmlnaHRDbGlja01lbnUgZnJvbSBcIi4vcmlnaHQtY2xpY2stbWVudS5qc1wiO1xuXG5jbGFzcyBUYXNrIHtcbiAgICB0aXRsZTtcbiAgICBkdWVEYXRlO1xuICAgIGR1ZURhdGVTdHI7XG4gICAgZHVlVGltZTtcbiAgICBkdWVUaW1lU3RyO1xuICAgIGRlc2NyaXB0aW9uO1xuICAgIHByaW9yaXR5O1xuICAgIHByb2dyZXNzO1xuICAgIG5vdGVzO1xuICAgIGlkO1xuICAgIGRlcHRoO1xuICAgIGN1cnJlbnRseUVkaXRpbmc7XG4gICAgdXNlUHJvZ3Jlc3NGcm9tU3VidGFza3M7XG4gICAgc3VidGFza0xpc3Q7XG4gICAgc3VwZXJ0YXNrTGlzdDtcbiAgICBleHBhbmRlZDtcbiAgICBzZWxlY3RlZDtcbiAgICBkb21EaXY7XG4gICAgc3RhdGljIGxhc3RJZCA9IC0xO1xuXG4gICAgY29uc3RydWN0b3IoX3RpdGxlLCBfZHVlRGF0ZVN0ciwgX2R1ZVRpbWVTdHIsIF9kZXNjcmlwdGlvbiwgX3ByaW9yaXR5LCBfcHJvZ3Jlc3MsIFxuICAgICAgICAgICAgX25vdGVzLCBfc3VwZXJ0YXNrTGlzdCwgX2lzQ2xvbmUpIHtcbiAgICAgICAgdGhpcy50aXRsZSA9IF90aXRsZSB8fCBcIlwiO1xuICAgICAgICB0aGlzLmR1ZURhdGVTdHIgPSBfZHVlRGF0ZVN0cjtcbiAgICAgICAgdGhpcy5kdWVUaW1lU3RyID0gX2R1ZVRpbWVTdHI7XG4gICAgICAgIHRoaXMudXBkYXRlRHVlKCk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBfZGVzY3JpcHRpb24gfHwgXCJcIjtcbiAgICAgICAgdGhpcy5wcmlvcml0eSA9IF9wcmlvcml0eSB8fCAwO1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gX3Byb2dyZXNzIHx8IDA7XG4gICAgICAgIHRoaXMubm90ZXMgPSBfbm90ZXMgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChfc3VwZXJ0YXNrTGlzdCkge1xuICAgICAgICAgICAgX3N1cGVydGFza0xpc3QuYWRkKHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdXBlcnRhc2tMaXN0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudGx5RWRpdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN1YnRhc2tMaXN0ID0gbmV3IFRhc2tMaXN0KHRoaXMpO1xuICAgICAgICB0aGlzLmV4cGFuZGVkID0gdGhpcy5oYXNDb250ZW50KCk7XG4gICAgICAgIHRoaXMudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3MgPSBmYWxzZTtcblxuICAgICAgICAvLyBUYXNrcyB0aGF0IGxpdmUgaW4gdGhlIGNvcHkgYnVmZmVyIGhhdmUgbm8gSUQgdG8gZW5zdXJlIHRoYXQgcGFzdGVkXG4gICAgICAgIC8vIHRhc2tzJyBJRHMgYXJlIGNvbnRpZ3VvdXMgd2l0aG91dCBoYXZpbmcgdG8gZGVjcmVtZW50IFRhc2subGFzdElkLlxuICAgICAgICBpZiAoIV9pc0Nsb25lKSB7XG4gICAgICAgICAgICB0aGlzLmFzc2lnbk5ld0lkKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURlcHRoKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pZCA9IC0xO1xuICAgICAgICB9XG4gICAgICAgIC8vIFBsYWNlIERPTSBvYmplY3QgaW4gc3VwZXJ0YXNrIG9yIHJvb3QgYXJyYXlcbiAgICB9XG5cbiAgICBjbG9uZShfcmVjdXJzaXZlLCBfc3VwZXJ0YXNrTGlzdCwgX2lkeCkge1xuICAgICAgICB2YXIgY2xvbmVkID0gbmV3IFRhc2sodGhpcy50aXRsZSwgdGhpcy5kdWVEYXRlU3RyLCB0aGlzLmR1ZVRpbWVTdHIsIFxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiwgdGhpcy5wcmlvcml0eSwgdGhpcy5wcm9ncmVzcywgdGhpcy5ub3RlcywgXG4gICAgICAgICAgICBudWxsLCB0cnVlKTtcbiAgICAgICAgY2xvbmVkLmV4cGFuZGVkID0gdGhpcy5leHBhbmRlZDtcbiAgICAgICAgY2xvbmVkLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIC8vY2xvbmVkLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgICAgIGNsb25lZC51c2VQcm9ncmVzc0Zyb21TdWJ0YXNrcyA9IHRoaXMudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3M7XG5cbiAgICAgICAgaWYgKF9zdXBlcnRhc2tMaXN0KSB7XG4gICAgICAgICAgICBfc3VwZXJ0YXNrTGlzdC5hZGQoY2xvbmVkLCBfaWR4KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKF9yZWN1cnNpdmUpIHtcbiAgICAgICAgICAgIGNsb25lZC5zdWJ0YXNrTGlzdC5leHBhbmRlZCA9IHRoaXMuc3VidGFza0xpc3QuZXhwYW5kZWQ7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJ0YXNrTGlzdC50YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VidGFza0xpc3QudGFza3NbaV0uY2xvbmUoX3JlY3Vyc2l2ZSwgY2xvbmVkLnN1YnRhc2tMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbG9uZWQ7XG4gICAgfVxuXG4gICAgdXBkYXRlRHVlKCkge1xuICAgICAgICAvLyBpZiAoIXRoaXMuZHVlRGF0ZSB8fCB0aGlzLmR1ZURhdGUubGVuZ3RoIDwgMSkge1xuICAgICAgICAvLyAgICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoRGF0ZS5ub3coKSk7XG4gICAgICAgIC8vICAgICBsZXQgcGFkTGVuID0gMjtcbiAgICAgICAgLy8gICAgIHRoaXMuZHVlRGF0ZSA9IGAke3RvZGF5LmdldEZ1bGxZZWFyKCl9LSR7U3RyaW5nKHRvZGF5LmdldE1vbnRoKCkgKyAxKS5cbiAgICAgICAgLy8gICAgICAgICBwYWRTdGFydChwYWRMZW4sIFwiMFwiKX0tJHtTdHJpbmcodG9kYXkuZ2V0RGF0ZSgpKS5wYWRTdGFydChwYWRMZW4sIFwiMFwiKX1gO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gaWYgKCF0aGlzLmR1ZVRpbWUgfHwgdGhpcy5kdWVUaW1lLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgLy8gICAgIHRoaXMuZHVlVGltZSA9IFwiMDA6MDBcIjtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGxldCB0aW1lem9uZSA9IHRpbWV6b25lU3RyaW5nKCk7XG4gICAgICAgIC8vIHRoaXMuZGF0ZVN0cmluZyA9IGAke3RoaXMuZHVlRGF0ZX1UJHt0aGlzLmR1ZVRpbWV9OjAwLjAwMCR7dGltZXpvbmV9YDtcbiAgICAgICAgLy8gdGhpcy5kdWUgPSBuZXcgRGF0ZSh0aGlzLmRhdGVTdHJpbmcpO1xuXG4gICAgICAgIGxldCB0aW1lem9uZSA9IHRpbWV6b25lU3RyaW5nKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZHVlRGF0ZVN0ciAmJiB0aGlzLmR1ZURhdGVTdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgZGF0ZVN0cmluZyA9IGAke3RoaXMuZHVlRGF0ZVN0cn1UMDA6MDA6MDAke3RpbWV6b25lfWA7XG4gICAgICAgICAgICB0aGlzLmR1ZURhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmR1ZVRpbWVTdHIgJiYgdGhpcy5kdWVUaW1lU3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGRhdGVTdHJpbmcgPSBgMjAwMC0wMS0wMVQke3RoaXMuZHVlVGltZVN0cn06MDAke3RpbWV6b25lfWA7XG4gICAgICAgICAgICB0aGlzLmR1ZVRpbWUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZURlcHRoKF9yZWN1cnNpdmUpIHtcbiAgICAgICAgdGhpcy5kZXB0aCA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuc3VwZXJ0YXNrTGlzdCA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHN1cGVydGFzayA9IHRoaXMuc3VwZXJ0YXNrTGlzdC5vd25lcjtcbiAgICAgICAgd2hpbGUgKHN1cGVydGFzayAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmRlcHRoKys7XG4gICAgICAgICAgICBzdXBlcnRhc2sgPSBzdXBlcnRhc2suc3VwZXJ0YXNrTGlzdCA/IHN1cGVydGFzay5zdXBlcnRhc2tMaXN0Lm93bmVyIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVkaXRUaXRsZSgpIHtcblxuICAgIH1cblxuICAgIGVkaXREdWUoKSB7XG5cbiAgICB9XG5cbiAgICBlZGl0RGVzY3JpcHRpb24oKSB7XG5cbiAgICB9XG5cbiAgICBlZGl0UHJvZ3Jlc3MoKSB7XG5cbiAgICB9XG5cbiAgICBlZGl0Tm90ZXMoKSB7XG5cbiAgICB9XG5cbiAgICBkZWxldGUoX3JlY3Vyc2l2ZSkge1xuICAgICAgICBpZiAodGhpcy5zdXBlcnRhc2tMaXN0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kb21EaXYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvbURpdi50YXNrLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGlmIChfcmVjdXJzaXZlKSB0aGlzLmRvbURpdi5zdWJ0YXNrcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1cGVydGFza0xpc3QucmVtb3ZlSWQodGhpcy5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGFzQ29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmRlc2NyaXB0aW9uICYmIHRoaXMuZGVzY3JpcHRpb24ubGVuZ3RoKSB8fFxuICAgICAgICAgICAgdGhpcy5wcmlvcml0eSB8fFxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyB8fFxuICAgICAgICAgICAgLy90aGlzLnVzZVByb2dyZXNzRnJvbVN1YnRhc2tzIHx8XG4gICAgICAgICAgICAodGhpcy5ub3RlcyAmJiB0aGlzLm5vdGVzLmxlbmd0aClcbiAgICB9XG5cbiAgICBsb2coKSB7XG4gICAgICAgIGxvZ2dlci5sb2dUYXNrKHRoaXMpO1xuICAgIH1cblxuICAgIGFzc2lnbk5ld0lkKCkge1xuICAgICAgICB0aGlzLmlkID0gVGFzay5nZW5lcmF0ZUlkKCk7XG4gICAgfVxuXG4gICAgYXNzaWduTmV3SWRSZWN1cnNpdmUoKSB7XG4gICAgICAgIHRoaXMuYXNzaWduTmV3SWQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3VidGFza0xpc3QudGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3VidGFza0xpc3QudGFza3NbaV0uYXNzaWduTmV3SWRSZWN1cnNpdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZnJlc2hEb20oX3JlY3Vyc2l2ZSkge1xuICAgICAgICBpZiAodGhpcy5kb21EaXYpIHtcbiAgICAgICAgICAgIHRoaXMuZG9tRGl2LnRhc2sucmVtb3ZlKCk7XG4gICAgICAgICAgICBpZiAoX3JlY3Vyc2l2ZSkgdGhpcy5kb21EaXYuc3VidGFza3MucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51c2VQcm9ncmVzc0Zyb21TdWJ0YXNrcykge1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuZ2V0UHJvZ3Jlc3NSZWN1cnNpdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZG9tRGl2ID0gZG9tLmNyZWF0ZUNhcmQodGhpcywgc3RhdGVNYW5hZ2VyKTtcblxuICAgICAgICBpZiAoX3JlY3Vyc2l2ZSkge1xuICAgICAgICAgICAgdGhpcy5zdWJ0YXNrTGlzdC5yZWZyZXNoRG9tKF9yZWN1cnNpdmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXZlbiBpZiBub3QgdWRhdGluZyByZWN1cnNpdmVseSwgd2UgbmVlZCB0byBjaGVjayBhbGwgc3VwZXJ0YXNrcyB0byBcbiAgICAgICAgLy8gc2VlIGlmIHRoZWlyIHByb2dyZXNzIHZhbHVlcyBhcmUgY2hhbmdlZCBiYXNlZCBvbiB0aGlzIHRhc2sncyBwcm9ncmVzc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIHRoZW0gYWNjb3JkaW5nbHkuXG4gICAgICAgIGZvciAobGV0IHRhc2sgb2YgdGhpcy5jaGFpbikge1xuICAgICAgICAgICAgaWYgKHRhc2sudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3MpIHtcbiAgICAgICAgICAgICAgICB0YXNrLnJlZnJlc2hEb20oZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFza3Mgc3VidGFzayBsaXN0J3MgYWRkIGZ1bmN0aW9uIGZvciBlYXNlIG9mIHVzZS5cbiAgICBhZGRTdWJ0YXNrKF90YXNrLCBfaWR4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnRhc2tMaXN0LmFkZChfdGFzaywgX2lkeCk7XG4gICAgfVxuXG4gICAgLy8gTWFza3Mgc3VidGFzayBsaXN0J3MgcmVtb3ZlIGZ1bmN0aW9uIGZvciBlYXNlIG9mIHVzZS5cbiAgICByZW1vdmVTdWJ0YXNrSWQoX2lkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnRhc2tMaXN0LnJlbW92ZUlkKF9pZCk7XG4gICAgfVxuXG4gICAgLy8gTWFza3Mgc3VidGFzayBsaXN0J3MgcmVtb3ZlIGZ1bmN0aW9uIGZvciBlYXNlIG9mIHVzZS5cbiAgICByZW1vdmVTdWJ0YXNrSWR4KF9pZHgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VidGFza0xpc3QucmVtb3ZlSWR4KF9pZHgpO1xuICAgIH1cblxuICAgIC8vIGdldFByb2dyZXNzUmVjdXJzaXZlKF9wcm9ncmVzcykge1xuICAgIC8vICAgICBpZiAoX3Byb2dyZXNzID09IG51bGwpIF9wcm9ncmVzcyA9IDA7XG5cbiAgICAvLyAgICAgaWYgKCF0aGlzLnVzZVByb2dyZXNzRnJvbVN1YnRhc2tzICYmIHRoaXMucHJvZ3Jlc3MgPiBfcHJvZ3Jlc3MpIHtcbiAgICAvLyAgICAgICAgIF9wcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICBmb3IgKGxldCB0YXNrIG9mIHRoaXMuc3VidGFza0xpc3QudGFza3MpIHtcbiAgICAvLyAgICAgICAgIF9wcm9ncmVzcyA9IHRhc2suZ2V0UHJvZ3Jlc3NSZWN1cnNpdmUoX3Byb2dyZXNzKTtcbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIHJldHVybiBfcHJvZ3Jlc3M7XG4gICAgLy8gfVxuXG4gICAgZ2V0UHJvZ3Jlc3NSZWN1cnNpdmUoX3Byb2dyZXNzKSB7XG4gICAgICAgIGlmIChfcHJvZ3Jlc3MgPT0gbnVsbCkgX3Byb2dyZXNzID0gMDtcblxuICAgICAgICBpZiAoIXRoaXMudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3MgJiYgdGhpcy5wcm9ncmVzcyA+IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2dyZXNzID09IDEgJiYgKF9wcm9ncmVzcyA9PSAxIHx8IF9wcm9ncmVzcyA9PSAwKSkge1xuICAgICAgICAgICAgICAgIF9wcm9ncmVzcyA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvZ3Jlc3MgPT0gMyAmJiAoX3Byb2dyZXNzID09IDMgfHwgX3Byb2dyZXNzID09IDApKSB7XG4gICAgICAgICAgICAgICAgX3Byb2dyZXNzID0gMztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3Byb2dyZXNzID0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHRhc2sgb2YgdGhpcy5zdWJ0YXNrTGlzdC50YXNrcykge1xuICAgICAgICAgICAgX3Byb2dyZXNzID0gdGFzay5nZXRQcm9ncmVzc1JlY3Vyc2l2ZShfcHJvZ3Jlc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9wcm9ncmVzcztcbiAgICB9XG5cbiAgICAvLyBNYXNrcyBzdWJ0YXNrIGxpc3QncyB0YXNrcyBmb3IgZWFzZSBvZiB1c2UuXG4gICAgZ2V0IHN1YnRhc2tzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJ0YXNrTGlzdC50YXNrcztcbiAgICB9XG5cbiAgICAvLyBNYXNrcyBzdXBlcnRhc2sgbGlzdCdzIG93bmVyIGZvciBlYXNlIG9mIHVzZS5cbiAgICBnZXQgc3VwZXJ0YXNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdXBlcnRhc2tMaXN0ID8gdGhpcy5zdXBlcnRhc2tMaXN0Lm93bmVyIDogbnVsbDtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBvZiBhIHRhc2sncyBzdXBlcnRhc2tzIHVwIHRvIHRoZSByb290IHRhc2suIFRoZVxuICAgIC8vIHJvb3QgdGFzayBpcyB0aGUgbGFzdCBpbiB0aGUgYXJyYXkuXG4gICAgZ2V0IGNoYWluKCkge1xuICAgICAgICBsZXQgc3VwZXJ0YXNrID0gdGhpcy5zdXBlcnRhc2tMaXN0Lm93bmVyO1xuICAgICAgICBsZXQgY2hhaW4gPSBbXTtcblxuICAgICAgICB3aGlsZSAoc3VwZXJ0YXNrKSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKHN1cGVydGFzayk7XG4gICAgICAgICAgICBzdXBlcnRhc2sgPSBzdXBlcnRhc2suc3VwZXJ0YXNrTGlzdC5vd25lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGFpbjtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVJZCgpIHtcbiAgICAgICAgLy8gSWYgb3ZlcmZsb3cgaGFwcGVucywgbm8gaXQgZGlkbid0LlxuICAgICAgICBpZiAoVGFzay5sYXN0SWQgPj0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIFRhc2subGFzdElkID0gLTE7XG4gICAgICAgIHJldHVybiArK1Rhc2subGFzdElkO1xuICAgIH1cbn1cblxuY2xhc3MgVGFza0xpc3Qge1xuICAgIHRhc2tzO1xuICAgIG93bmVyO1xuICAgIGV4cGFuZGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihfb3duZXIsIF90YXNrcykge1xuICAgICAgICB0aGlzLm93bmVyID0gX293bmVyO1xuICAgICAgICAvL3RoaXMudGFza3MgPSBfc3VidGFza3MgfHwgW107XG4gICAgICAgIHRoaXMudGFza3MgPSBbXTtcblxuICAgICAgICBpZiAoX3Rhc2tzKSB7XG4gICAgICAgICAgICBfdGFza3MuZm9yRWFjaChfdGFzayA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoX3Rhc2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0KCkge1xuXG4gICAgfVxuXG4gICAgY3JlYXRlVGFzayhfaWR4LCBfc2hvd0lucHV0KSB7XG4gICAgICAgIGlmICghX2lkeCkge1xuICAgICAgICAgICAgX2lkeCA9IHRoaXMudGFza3MubGVuZ3RoICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdUYXNrID0gbmV3IFRhc2soKTtcbiAgICAgICAgdGhpcy5hZGQobmV3VGFzaywgX2lkeCk7XG4gICAgICAgIGlmICh0aGlzLm93bmVyKSB7XG4gICAgICAgICAgICB0aGlzLm93bmVyLnJlZnJlc2hEb20odHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hEb20oZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9zaG93SW5wdXQpIHtcbiAgICAgICAgICAgIGRvbS5jcmVhdGVJbnB1dEJveChuZXdUYXNrLCBzdGF0ZU1hbmFnZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkKF90YXNrLCBfaWR4KSB7XG4gICAgICAgIGlmIChfaWR4ID09IG51bGwpIHtcbiAgICAgICAgICAgIF9pZHggPSB0aGlzLnRhc2tzLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFza3Muc3BsaWNlKF9pZHgsIDAsIF90YXNrKTtcbiAgICAgICAgX3Rhc2suc3VwZXJ0YXNrTGlzdCA9IHRoaXM7XG4gICAgICAgIF90YXNrLnVwZGF0ZURlcHRoKHRydWUpO1xuICAgIH1cblxuICAgIGdldFRhc2tJZHgoX3Rhc2spIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50YXNrc1tpXS5pZCA9PSBfdGFzay5pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHJlbW92ZUlkKF9pZCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhc2tzW2ldLmlkID09IF9pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUlkeChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZW1vdmVJZHgoX2lkeCkge1xuICAgICAgICB0aGlzLnRhc2tzW19pZHhdLnN1cGVydGFza0xpc3QgPSBudWxsO1xuICAgICAgICB0aGlzLnRhc2tzLnNwbGljZShfaWR4LCAxKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXRUYXNrQnlJZChfaWQsIF9yZWN1cnNpdmUpIHtcbiAgICAgICAgbGV0IGlkVGFzayA9IG51bGw7XG5cbiAgICAgICAgZm9yIChsZXQgdGFzayBvZiB0aGlzLnRhc2tzKSB7XG4gICAgICAgICAgICBpZiAodGFzay5pZCA9PSBfaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3JlY3Vyc2l2ZSAmJiB0YXNrLnN1YnRhc2tMaXN0Lmhhc1Rhc2tzKCkpIHtcbiAgICAgICAgICAgICAgICBpZFRhc2sgPSB0YXNrLnN1YnRhc2tMaXN0LmdldFRhc2tCeUlkKF9pZCwgX3JlY3Vyc2l2ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlkVGFzaykgcmV0dXJuIGlkVGFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZFRhc2s7XG4gICAgfVxuXG4gICAgaGFzVGFza3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhc2tzLmxlbmd0aCA+PSAxO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYW4gb3JkZXJlZCBhcnJheSBvZiBJRHMgdGhhdCByZWZsZWN0cyB0aGUgY3VycmVudCBvcmRlciBvZiB0YXNrc1xuICAgIC8vIHdpdGhpbiB0aGUgdGFza0xpc3QncyB0cmVlIHN0cnVjdHVyZS5cbiAgICBnZXRJZE9yZGVyKF9yZWN1cnNpdmUpIHtcbiAgICAgICAgY29uc3Qgb3JkZXIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCB0YXNrIG9mIHRoaXMudGFza3MpIHtcbiAgICAgICAgICAgIG9yZGVyLnB1c2godGFzay5pZCk7XG5cbiAgICAgICAgICAgIGlmIChfcmVjdXJzaXZlKSB7XG4gICAgICAgICAgICAgICAgb3JkZXIucHVzaCguLi50YXNrLnN1YnRhc2tMaXN0LmdldElkT3JkZXIoX3JlY3Vyc2l2ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH1cblxuICAgIHJlZnJlc2hEb20oX3JlY3Vyc2l2ZSkge1xuICAgICAgICAvLyBUbyBlbnN1cmUgcHJvcGVyIG9yZGVyLCByZW1vdmUgYWxsIHRhc2tzIGJlZm9yZSByZWRyYXdpbmcgYW55IG9mIHRoZW0uXG4gICAgICAgIHRoaXMudGFza3MuZm9yRWFjaChfdGFzayA9PiB7XG4gICAgICAgICAgICBpZiAoX3Rhc2suZG9tRGl2KSB7XG4gICAgICAgICAgICAgICAgX3Rhc2suZG9tRGl2LnRhc2sucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgaWYgKF9yZWN1cnNpdmUpIF90YXNrLmRvbURpdi5zdWJ0YXNrcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50YXNrcy5mb3JFYWNoKF90YXNrID0+IHtcbiAgICAgICAgICAgIF90YXNrLnJlZnJlc2hEb20oX3JlY3Vyc2l2ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy50YXNrc1tpXS5yZWZyZXNoRG9tKF9yZWN1cnNpdmUpO1xuICAgICAgICAgICAgLy8gZG9tLnNldFRhc2taRGVwdGgodGhpcy50YXNrc1tpXSwgNTAwIC0gaSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmxldCBzdGF0ZU1hbmFnZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN1cnJlbnRseUVkaXRpbmcgPSBmYWxzZTtcbiAgICBsZXQgc2VsZWN0aW9uQWRkVG8gPSBmYWxzZTtcbiAgICBsZXQgc2VsZWN0aW9uTWFzcyA9IGZhbHNlO1xuICAgIGxldCB0b3VjaCA9IHtcbiAgICAgICAgdGltZTogWyBudWxsLCBudWxsIF0sXG4gICAgICAgIHBvczogWyBudWxsLCBudWxsIF0sXG4gICAgICAgIHRvdWNoZWRJZDogWyBudWxsLCBudWxsIF1cbiAgICB9O1xuXG4gICAgbGV0IHNldFNlbGVjdGlvbkFkZFRvID0gZnVuY3Rpb24oX3N0YXRlLCBfZSkge1xuICAgICAgICBpZiAoX2Uua2V5ID09IFwiQ29udHJvbFwiKSB7XG4gICAgICAgICAgICBzdGF0ZU1hbmFnZXIuc2VsZWN0aW9uQWRkVG8gPSBfc3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc2V0U2VsZWN0aW9uTWFzcyA9IGZ1bmN0aW9uKF9zdGF0ZSwgX2UpIHtcbiAgICAgICAgaWYgKF9lLmtleSA9PSBcIlNoaWZ0XCIpIHtcbiAgICAgICAgICAgIHN0YXRlTWFuYWdlci5zZWxlY3Rpb25NYXNzID0gX3N0YXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgX2UgPT4ge1xuICAgICAgICBzZXRTZWxlY3Rpb25BZGRUby5iaW5kKHRoaXMsIHRydWUsIF9lKSgpO1xuICAgICAgICBzZXRTZWxlY3Rpb25NYXNzLmJpbmQodGhpcywgdHJ1ZSwgX2UpKCk7XG4gICAgfSk7XG4gICAgXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIF9lID0+IHtcbiAgICAgICAgc2V0U2VsZWN0aW9uQWRkVG8uYmluZCh0aGlzLCBmYWxzZSwgX2UpKCk7XG4gICAgICAgIHNldFNlbGVjdGlvbk1hc3MuYmluZCh0aGlzLCBmYWxzZSwgX2UpKCk7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIGN1cnJlbnRseUVkaXRpbmcsXG4gICAgICAgIHNlbGVjdGlvbkFkZFRvLFxuICAgICAgICB0b3VjaFxuICAgIH1cbn0pKCk7XG5cbmxldCBsb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgbGV0IGxvZ1Rhc2sgPSBmdW5jdGlvbihfdGFzaywgX3ByZXBlbmQpIHtcbiAgICAgICAgaWYgKCFfcHJlcGVuZCkgX3ByZXBlbmQgPSBcIlwiO1xuICAgICAgICBjb25zb2xlLmxvZyhfcHJlcGVuZCArIFwiLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coX3ByZXBlbmQgKyBcIlRpdGxlOiBcIiArIF90YXNrLnRpdGxlKTtcbiAgICAgICAgY29uc29sZS5sb2coX3ByZXBlbmQgKyBcIkR1ZSBkYXRlOiBcIiArIF90YXNrLmR1ZURhdGUpO1xuICAgICAgICBjb25zb2xlLmxvZyhfcHJlcGVuZCArIFwiRHVlIHRpbWU6IFwiICsgX3Rhc2suZHVlVGltZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKF9wcmVwZW5kICsgXCJEZXNjcmlwdGlvbjogXCIgKyBfdGFzay5kZXNjcmlwdGlvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKF9wcmVwZW5kICsgXCJQcm9ncmVzczogXCIgKyBfdGFzay5wcm9ncmVzcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKF9wcmVwZW5kICsgXCJOb3RlczogIFwiICsgX3Rhc2subm90ZXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhfcHJlcGVuZCArIFwiSUQ6IFwiICsgX3Rhc2suaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhfcHJlcGVuZCArIFwiRGVwdGg6IFwiICsgX3Rhc2suZGVwdGgpO1xuICAgICAgICBpZiAoX3Rhc2suc3VwZXJ0YXNrTGlzdCAmJiBfdGFzay5zdXBlcnRhc2tMaXN0Lm93bmVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhfcHJlcGVuZCArIFwiU3VwZXJ0YXNrOiAoXCIgKyBfdGFzay5zdXBlcnRhc2tMaXN0Lm93bmVyLmlkICsgXG4gICAgICAgICAgICBcIikgXCIgKyBfdGFzay5zdXBlcnRhc2tMaXN0Lm93bmVyLnRpdGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKF9wcmVwZW5kICsgXCJObyBzdXBlcnRhc2tcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChfdGFzay5zdWJ0YXNrTGlzdC5oYXNUYXNrcygpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhfcHJlcGVuZCArIF90YXNrLnN1YnRhc2tMaXN0LnRhc2tzLmxlbmd0aCArIFxuICAgICAgICAgICAgICAgIFwiIHN1YnRhc2tcIiArIChfdGFzay5zdWJ0YXNrTGlzdC50YXNrcy5sZW5ndGggIT0gMSA/IFwiczpcIiA6IFwiOlwiKSk7XG5cbiAgICAgICAgICAgIF90YXNrLnN1YnRhc2tMaXN0LnRhc2tzLmZvckVhY2goX2VsZW0gPT4ge1xuICAgICAgICAgICAgICAgIGxvZ1Rhc2soX2VsZW0sIF9wcmVwZW5kICsgXCIqICAgXCIpO1xuICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxvZ1Rhc2tcbiAgICB9O1xufSkoKTtcblxubGV0IGNvcGllciA9IChmdW5jdGlvbigpIHtcbiAgICBjb25zdCBidWZmZXIgPSBbXTtcblxuICAgIGxldCByZW1vdmUgPSBmdW5jdGlvbihfdGFza3MsIF9yZWN1cnNpdmUsIF9yZWZyZXNoKSB7XG4gICAgICAgIGlmICghKF90YXNrcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgX3Rhc2tzID0gWyBfdGFza3MgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfcmVjdXJzaXZlKSB7XG4gICAgICAgICAgICBfdGFza3MgPSByZWR1Y2VSZWN1cnNpdmVJbnB1dChfdGFza3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgdGFzayBvZiBfdGFza3MpIHtcbiAgICAgICAgICAgIGxldCBpbnNlcnRJZHggPSB0YXNrLnN1cGVydGFza0xpc3QuZ2V0VGFza0lkeCh0YXNrKTtcbiAgICAgICAgICAgIGxldCBzdXBlcnRhc2tMaXN0ID0gdGFzay5zdXBlcnRhc2tMaXN0O1xuICAgICAgICAgICAgbGV0IHN1YnRhc2tMaXN0ID0gdGFzay5zdWJ0YXNrTGlzdDtcbiAgICAgICAgICAgIHRhc2suZGVsZXRlKHRydWUpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFfcmVjdXJzaXZlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJ0YXNrTGlzdC50YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdXBlcnRhc2tMaXN0LmFkZChzdWJ0YXNrTGlzdC50YXNrc1tpXSwgaW5zZXJ0SWR4KyspO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChfcmVmcmVzaCkge1xuICAgICAgICAgICAgICAgIGlmIChzdXBlcnRhc2tMaXN0Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cGVydGFza0xpc3Qub3duZXIucmVmcmVzaERvbSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdXBlcnRhc2tMaXN0LnJlZnJlc2hEb20odHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGNvcHkgPSBmdW5jdGlvbihfdGFza3MsIF9yZWN1cnNpdmUsIF9nbG9iYWxUYXNrTGlzdCkge1xuICAgICAgICBpZiAoIShfdGFza3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIF90YXNrcyA9IFsgX3Rhc2tzIF07XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhckJ1ZmZlcigpO1xuXG4gICAgICAgIGlmIChfcmVjdXJzaXZlKSB7XG4gICAgICAgICAgICBfdGFza3MgPSByZWR1Y2VSZWN1cnNpdmVJbnB1dChfdGFza3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGFza3MgYXJlIGNvcGllZCBpbiB2aXN1YWwgb3JkZXIgYW5kIG5vdCBpbiBzZWxlY3Rpb24gb3JkZXIuXG4gICAgICAgIGxldCBpZE9yZGVyID0gX2dsb2JhbFRhc2tMaXN0LmdldElkT3JkZXIodHJ1ZSk7XG4gICAgICAgIF90YXNrcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBpZE9yZGVyLmluZGV4T2YoYS5pZCkgPCBpZE9yZGVyLmluZGV4T2YoYi5pZCkgPyAtMSA6IDE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAobGV0IHRhc2sgb2YgX3Rhc2tzKSB7XG4gICAgICAgICAgICBidWZmZXIucHVzaCh0YXNrLmNsb25lKF9yZWN1cnNpdmUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjdXQgPSBmdW5jdGlvbihfdGFza3MsIF9yZWN1cnNpdmUsIF9yZWZyZXNoLCBfZ2xvYmFsVGFza0xpc3QpIHtcbiAgICAgICAgaWYgKCEoX3Rhc2tzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBfdGFza3MgPSBbIF90YXNrcyBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb3B5KF90YXNrcywgX3JlY3Vyc2l2ZSwgX2dsb2JhbFRhc2tMaXN0KTtcbiAgICAgICAgdGhpcy5yZW1vdmUoX3Rhc2tzLCBfcmVjdXJzaXZlKTtcbiAgICB9XG5cbiAgICBsZXQgcGFzdGUgPSBmdW5jdGlvbihfdGFza0xpc3QsIF9pZHgpIHtcbiAgICAgICAgLy8gQWxsb3cgX3Rhc2tMaXN0IHRvIGJlIHBhc3NlZCBhcyBpdHMgb3duaW5nIHRhc2sgZm9yIGVhc2Ugb2YgdXNlLlxuICAgICAgICBpZiAoX3Rhc2tMaXN0IGluc3RhbmNlb2YgVGFzaykge1xuICAgICAgICAgICAgX3Rhc2tMaXN0ID0gX3Rhc2tMaXN0LnN1YnRhc2tMaXN0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGJ1Zkl0ZW0gb2YgYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsb25lZCA9IGJ1Zkl0ZW0uY2xvbmUodHJ1ZSwgX3Rhc2tMaXN0LCBfaWR4KyspO1xuICAgICAgICAgICAgICAgIGNsb25lZC5hc3NpZ25OZXdJZFJlY3Vyc2l2ZSgpO1xuICAgICAgICAgICAgICAgIGNsb25lZC51cGRhdGVEZXB0aCh0cnVlKTtcbiAgICAgICAgICAgICAgICAvL2Nsb25lZC5yZWZyZXNoRG9tKHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3Rhc2tMaXN0Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgX3Rhc2tMaXN0Lm93bmVyLnJlZnJlc2hEb20odHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90YXNrTGlzdC5yZWZyZXNoRG9tKHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgcmVkdWNlUmVjdXJzaXZlSW5wdXQgPSBmdW5jdGlvbihfdGFza3MpIHtcbiAgICAgICAgY29uc3QgcmVkdWNlZCA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHRhc2sgb2YgX3Rhc2tzKSB7XG4gICAgICAgICAgICAvLyBJZiBjb3B5aW5nIHJlY3Vyc2l2ZWx5LCBtYWtlIHN1cmUgd2UncmUgb25seSBjb3B5aW5nIGVhY2ggdGFza1xuICAgICAgICAgICAgLy8gb25jZSwgYmVjYXVzZSB0aGVsZXQgdXNlciBtYXkgaGF2ZSBleHBsaWNpdGx5IHNlbGVjdGVkIHN1YnRhc2tzIHRoYXQgXG4gICAgICAgICAgICAvLyB3aWxsIGFsc28gYmUgYXV0b21hdGljYWxseSBwaWNrZWQgdXAgYnkgdGhlIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgIGxldCBjaGFpbiA9IHRhc2suY2hhaW47XG4gICAgICAgICAgICBsZXQgdGFza0lzU3VidGFzayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBJZiBhbnkgb2YgdGhlIHNlbGVjdGVkIHRhc2tzIGlzIGZvdW5kIGluIHRoaXMgdGFzaydzIHN1cGVyIFxuICAgICAgICAgICAgLy8gY2hhaW4sIHRoZW4gZG9uJ3QgY29weSB0aGlzIHRhc2sgYmVjYXVzZSBpdCBpcyBhbHJlYWR5IGluY2x1ZGVkXG4gICAgICAgICAgICAvLyBpbiB0aGUgcmVjdXJzaXZlIGNvcHkuXG4gICAgICAgICAgICBmb3IgKGxldCBwb3NzaWJsZVN1cGVyIG9mIF90YXNrcykge1xuICAgICAgICAgICAgICAgIGlmIChjaGFpbi5pbmNsdWRlcyhwb3NzaWJsZVN1cGVyKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrSXNTdWJ0YXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRhc2tJc1N1YnRhc2spIHtcbiAgICAgICAgICAgICAgICByZWR1Y2VkLnB1c2godGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVkdWNlZDtcbiAgICB9XG5cbiAgICBsZXQgY2xlYXJCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYnVmZmVyLnNwbGljZSgwLCBidWZmZXIubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBidWZmZXIsXG4gICAgICAgIHJlbW92ZSxcbiAgICAgICAgY29weSxcbiAgICAgICAgY3V0LFxuICAgICAgICBwYXN0ZSxcbiAgICAgICAgY2xlYXJCdWZmZXJcbiAgICB9XG59KSgpO1xuXG5sZXQgc2VsZWN0aW9uID0gKGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gW107XG5cbiAgICBsZXQgYWRkID0gZnVuY3Rpb24oX3Rhc2spIHtcbiAgICAgICAgaWYgKCFjb250YWlucyhfdGFzaykpIHtcbiAgICAgICAgICAgIF90YXNrLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGVjdGVkLnB1c2goX3Rhc2spO1xuICAgICAgICAgICAgZG9tLnNlbGVjdChfdGFzay5pZCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGFkZEV4Y2x1c2l2ZSA9IGZ1bmN0aW9uKF90YXNrKSB7XG4gICAgICAgIGNsZWFyKCk7XG4gICAgICAgIF90YXNrLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgYWRkKF90YXNrKTtcbiAgICB9O1xuXG4gICAgbGV0IHJlbW92ZSA9IGZ1bmN0aW9uKF90YXNrKSB7XG4gICAgICAgIGxldCBpZHggPSBzZWxlY3RlZC5pbmRleE9mKF90YXNrKTtcblxuICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGVkLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgX3Rhc2suc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGRvbS51bnNlbGVjdChfdGFzay5pZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBsZXQgY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yIChsZXQgdGFzayBvZiBzZWxlY3RlZCkge1xuICAgICAgICAgICAgdGFzay5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZG9tLnVuc2VsZWN0KHRhc2suaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZWN0ZWQuc3BsaWNlKDAsIHNlbGVjdGVkLmxlbmd0aCk7XG4gICAgfTtcblxuICAgIGxldCBjb250YWlucyA9IGZ1bmN0aW9uKF90YXNrKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3RlZC5pbmRleE9mKF90YXNrKSA+PSAwO1xuICAgIH07XG5cbiAgICBsZXQgdXBkYXRlU2VsZWN0aW9uID0gZnVuY3Rpb24oX3Rhc2spIHtcbiAgICAgICAgaWYgKHN0YXRlTWFuYWdlci5zZWxlY3Rpb25NYXNzKSB7XG4gICAgICAgICAgICBpZiAoIXNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uYWRkRXhjbHVzaXZlKF90YXNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGlkT3JkZXIgPSB0YXNrTGlzdC5nZXRJZE9yZGVyKHRydWUpO1xuICAgICAgICAgICAgICAgIGxldCBzdGFydElkeCA9IGlkT3JkZXIuaW5kZXhPZihzZWxlY3Rpb24uc2VsZWN0ZWRbMF0uaWQpO1xuICAgICAgICAgICAgICAgIGxldCBlbmRJZHggPSBpZE9yZGVyLmluZGV4T2YoX3Rhc2suaWQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChlbmRJZHggPCBzdGFydElkeCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gc3RhcnRJZHg7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0SWR4ID0gZW5kSWR4O1xuICAgICAgICAgICAgICAgICAgICBlbmRJZHggPSBidWZmZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRW5zdXJlIHdlIGFsd2F5cyByZXRhaW4gdGhlIHNhbWUgZmlyc3Qgc2VsZWN0ZWQgdGFzay5cbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uYWRkRXhjbHVzaXZlKHNlbGVjdGlvbi5zZWxlY3RlZFswXSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPD0gZW5kSWR4OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkT3JkZXJbaV0gIT0gc2VsZWN0aW9uLnNlbGVjdGVkWzBdLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24uYWRkKHRhc2tMaXN0LmdldFRhc2tCeUlkKGlkT3JkZXJbaV0sIHRydWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNsaWNrZWQgdGFzayB0byBzZWxlY3Rpb24uXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGVNYW5hZ2VyLnNlbGVjdGlvbkFkZFRvKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uLmNvbnRhaW5zKF90YXNrKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5yZW1vdmUoX3Rhc2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uYWRkKF90YXNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8gU2VsZWN0IG9ubHkgY2xpY2tlZCB0YXNrLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZWN0aW9uLmFkZEV4Y2x1c2l2ZShfdGFzayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdHJpZ2dlck1lbnUgPSBmdW5jdGlvbihfY2xpZW50WCwgX2NsaWVudFksIF9zZWxlY3Rpb25BZGRUbykge1xuICAgICAgICBsZXQgdGFzayA9IHRhc2tMaXN0LmdldFRhc2tCeUlkKGRvbS5nZXRUYXNrSWRBdFBvcyhfY2xpZW50WCwgXG4gICAgICAgICAgICBfY2xpZW50WSksIHRydWUpO1xuICAgIFxuICAgICAgICBpZiAodGFzayAmJiAhc2VsZWN0ZWQuaW5jbHVkZXModGFzaykpIHtcbiAgICAgICAgICAgIHVwZGF0ZVNlbGVjdGlvbih0YXNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXNrICYmIHNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRvbS5mcmVlemUoKTtcbiAgICAgICAgICAgIC8vc2VsZWN0aW9uLmFkZCh0YXNrKTtcbiAgICAgICAgICAgIGxldCBtZW51VGV4dHMgPSBbIFwiTmV3IHRhc2sgKGFib3ZlKVwiLCBcIk5ldyB0YXNrIChiZWxvdylcIiwgXG4gICAgICAgICAgICAgICAgXCJOZXcgdGFzayAoYXMgc3VidGFzaylcIiwgXCJDb3B5ICh3aXRoIHN1YnRhc2tzKVwiLCBcbiAgICAgICAgICAgICAgICBcIkNvcHkgKHdpdGhvdXQgc3VidGFza3MpXCIsIFwiQ3V0ICh3aXRoIHN1YnRhc2tzKVwiLCBcbiAgICAgICAgICAgICAgICBcIkN1dCAod2l0aG91dCBzdWJ0YXNrcylcIiBdO1xuICAgICAgICAgICAgbGV0IG1lbnVGdW5jdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7dGFzay5zdXBlcnRhc2tMaXN0LmNyZWF0ZVRhc2soXG4gICAgICAgICAgICAgICAgICAgIHRhc2suc3VwZXJ0YXNrTGlzdC5nZXRUYXNrSWR4KHRhc2spLCB0cnVlKTt9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge3Rhc2suc3VwZXJ0YXNrTGlzdC5jcmVhdGVUYXNrKFxuICAgICAgICAgICAgICAgICAgICB0YXNrLnN1cGVydGFza0xpc3QuZ2V0VGFza0lkeCh0YXNrKSArIDEsIHRydWUpO30sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7dGFzay5zdWJ0YXNrTGlzdC5jcmVhdGVUYXNrKG51bGwsIHRydWUpO30sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLmNvcHkoc2VsZWN0aW9uLnNlbGVjdGVkLCB0cnVlLCB0YXNrTGlzdCk7fSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtjb3BpZXIuY29weShzZWxlY3Rpb24uc2VsZWN0ZWQsIGZhbHNlLCB0YXNrTGlzdCk7fSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtjb3BpZXIuY3V0KHNlbGVjdGlvbi5zZWxlY3RlZCwgdHJ1ZSwgdHJ1ZSwgdGFza0xpc3QpO30sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLmN1dChzZWxlY3Rpb24uc2VsZWN0ZWQsIGZhbHNlLCB0cnVlLCB0YXNrTGlzdCk7fVxuICAgICAgICAgICAgXTtcbiAgICBcbiAgICAgICAgICAgIC8vIE9ubHkgc2hvdyBwYXN0ZSBvcHRpb24gaWYgdGhlcmUncyBzb21ldGhpbmcgdG8gcGFzdGUuXG4gICAgICAgICAgICBpZiAoY29waWVyLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtZW51VGV4dHMucHVzaChcIlBhc3RlIChhYm92ZSlcIiwgXCJQYXN0ZSAoYmVsb3cpXCIsIFwiUGFzdGUgKGFzIHN1YnRhc2spXCIpO1xuICAgICAgICAgICAgICAgIG1lbnVGdW5jdGlvbnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLnBhc3RlKHRhc2suc3VwZXJ0YXNrTGlzdCwgXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnN1cGVydGFza0xpc3QuZ2V0VGFza0lkeCh0YXNrKSk7fSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLnBhc3RlKHRhc2suc3VwZXJ0YXNrTGlzdCwgXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnN1cGVydGFza0xpc3QuZ2V0VGFza0lkeCh0YXNrKSArIDEpO30sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge2NvcGllci5wYXN0ZSh0YXNrLnN1YnRhc2tMaXN0KTt9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWVudVRleHRzLnB1c2goXCJEZWxldGUgKGluY2x1ZGluZyBzdWJ0YXNrcylcIixcbiAgICAgICAgICAgICAgICBcIkRlbGV0ZSAobm90IGluY2x1ZGluZyBzdWJ0YXNrcylcIik7XG4gICAgICAgICAgICBtZW51RnVuY3Rpb25zLnB1c2goZnVuY3Rpb24oKSB7Y29waWVyLnJlbW92ZShzZWxlY3Rpb24uc2VsZWN0ZWQsIHRydWUsIFxuICAgICAgICAgICAgICAgICAgICB0cnVlKX0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLnJlbW92ZShzZWxlY3Rpb24uc2VsZWN0ZWQsIGZhbHNlLCBcbiAgICAgICAgICAgICAgICAgICAgdHJ1ZSl9XG4gICAgICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBtZW51ID0gbmV3IFJpZ2h0Q2xpY2tNZW51KG1lbnVUZXh0cywgbWVudUZ1bmN0aW9ucyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5hcHBlbmRDaGlsZChtZW51LnN2Zyk7XG4gICAgICAgICAgICBtZW51LmJ1dHRvbkRvd24oX2NsaWVudFgsIF9jbGllbnRZKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbS5mcmVlemUoKTtcbiAgICAgICAgICAgIGxldCBtZW51VGV4dHMgPSBbIFwiTmV3IHRhc2tcIl07XG4gICAgICAgICAgICBsZXQgbWVudUZ1bmN0aW9ucyA9IFtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHt0YXNrTGlzdC5jcmVhdGVUYXNrKHRhc2tMaXN0LnRhc2tzLmxlbmd0aCwgXG4gICAgICAgICAgICAgICAgICAgIHRydWUpO31cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGlmIChjb3BpZXIuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1lbnVUZXh0cy5wdXNoKFwiUGFzdGVcIik7XG4gICAgICAgICAgICAgICAgbWVudUZ1bmN0aW9ucy5wdXNoKGZ1bmN0aW9uKCkge2NvcGllci5wYXN0ZSh0YXNrTGlzdCwgXG4gICAgICAgICAgICAgICAgICAgIHRhc2tMaXN0LnRhc2tzLmxlbmd0aCl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IG1lbnUgPSBuZXcgUmlnaHRDbGlja01lbnUobWVudVRleHRzLCBtZW51RnVuY3Rpb25zKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuYXBwZW5kQ2hpbGQobWVudS5zdmcpO1xuICAgICAgICBtZW51LmJ1dHRvbkRvd24oX2NsaWVudFgsIF9jbGllbnRZKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gZWxzZSBpZiAoY29waWVyLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgLy8gICAgIGRvbS5mcmVlemUoKTtcbiAgICAgICAgLy8gICAgIGxldCBtZW51ID0gbmV3IFJpZ2h0Q2xpY2tNZW51KFsgXCJOZXcgdGFza1wiLCBcIlBhc3RlXCIgXSwgXG4gICAgICAgIC8vICAgICAgICAgW1xuICAgICAgICAvLyAgICAgICAgICAgICBmdW5jdGlvbigpIHtjb3BpZXIucGFzdGUodGFza0xpc3QsIHRhc2tMaXN0LnRhc2tzLmxlbmd0aCl9XG4gICAgICAgIC8vICAgICAgICAgXSk7XG4gICAgICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5hcHBlbmRDaGlsZChtZW51LnN2Zyk7XG4gICAgICAgIC8vICAgICBtZW51LmJ1dHRvbkRvd24oX2NsaWVudFgsIF9jbGllbnRZKTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHNlbGVjdGVkLFxuICAgICAgICBhZGQsXG4gICAgICAgIGFkZEV4Y2x1c2l2ZSxcbiAgICAgICAgcmVtb3ZlLFxuICAgICAgICBjbGVhcixcbiAgICAgICAgY29udGFpbnMsXG4gICAgICAgIHVwZGF0ZVNlbGVjdGlvbixcbiAgICAgICAgdHJpZ2dlck1lbnVcbiAgICB9XG59KSgpO1xuXG5sZXQgdGFza0xpc3QgPSBuZXcgVGFza0xpc3QobnVsbCwgWyBuZXcgVGFzayhcIlRlc3QgVGFza1wiKSBdKTtcbnRhc2tMaXN0LnRhc2tzWzBdLmFkZFN1YnRhc2sobmV3IFRhc2soXCJBbm90aGVyIHRhc2tcIiwgXCIyMDI0LTAyLTAxXCIsIFwiMTc6MDBcIixcbiAgICBcIlRoaXMgaXMgYSB0ZXN0IHRhc2suXCIsIDIsIDMsIFwiTm8gbm90ZXMgZm9yIHRoaXMgdGFzay5cIikpO1xudGFza0xpc3QudGFza3NbMF0uc3VidGFza3NbMF0uYWRkU3VidGFzayhuZXcgVGFzayhcIkZvdXJ0aCB0YXNrXCIpKTtcbnRhc2tMaXN0LnRhc2tzWzBdLnN1YnRhc2tzWzBdLnN1YnRhc2tzWzBdLmFkZFN1YnRhc2sobmV3IFRhc2soXCJGaWZ0aCB0YXNrXCIpKTtcbnRhc2tMaXN0LnRhc2tzWzBdLnN1YnRhc2tzWzBdLnN1YnRhc2tzWzBdLmFkZFN1YnRhc2sobmV3IFRhc2soXCJTaXh0aCB0YXNrXCIpKTtcbnRhc2tMaXN0LnRhc2tzWzBdLmFkZFN1YnRhc2sobmV3IFRhc2soXCJBIHRoaXJkIHRhc2tcIikpO1xuLy90b3BMZXZlbFRhc2tzWzBdLnN1YnRhc2tMaXN0LnJlbW92ZUlkeCgwKTtcbi8vdG9wTGV2ZWxUYXNrc1swXS5zdWJ0YXNrTGlzdC5yZW1vdmVJZCgxKTtcbi8vY29waWVyLmNvcHkodGFza0xpc3QudGFza3NbMF0uc3VidGFza0xpc3QudGFza3NbMF0sIHRydWUsIHRhc2tMaXN0KTtcbi8vY29waWVyLmNvcHkodGFza0xpc3QudGFza3NbMF0uc3VidGFza3NbMF0sIHRydWUpO1xuLy9jb3BpZXIuY3V0KHRhc2tMaXN0LnRhc2tzWzBdLnN1YnRhc2tMaXN0LnRhc2tzWzBdLCBmYWxzZSk7XG4vL2NvcGllci5jdXQodGFza0xpc3QudGFza3NbMF0uc3VidGFza0xpc3QudGFza3NbMF0sIHRydWUpO1xuXG50YXNrTGlzdC50YXNrcy5mb3JFYWNoKF9lbGVtID0+IHtcbiAgICBfZWxlbS5sb2coKTtcbn0pO1xuXG50YXNrTGlzdC5yZWZyZXNoRG9tKHRydWUpO1xuLy9jb3BpZXIucGFzdGUodGFza0xpc3QudGFza3NbMF0uc3VidGFza3NbMF0uc3VidGFza3NbMF0uc3VidGFza3NbMV0pO1xuLy9jb3BpZXIucGFzdGUodGFza0xpc3QsIDApO1xuXG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2UgPT4ge1xuLy8gICAgIGlmIChfZS5idXR0b24gPT0gMikge1xuLy8gICAgICAgICBtZW51LmJ1dHRvbkRvd24oX2UuY2xpZW50WCwgX2UuY2xpZW50WSk7XG4vLyAgICAgfVxuLy8gfSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoX2UpID0+IHtcbiAgICBfZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gY29uc29sZS5sb2coX2UpO1xuICAgIC8vIGxldCB0YXNrID0gdGFza0xpc3QuZ2V0VGFza0J5SWQoZG9tLmdldFRhc2tJZEF0UG9zKF9lLnBhZ2VYLCBfZS5wYWdlWSksIHRydWUpO1xuXG4gICAgLy8gaWYgKHRhc2spIHtcbiAgICAvLyAgICAgaWYgKHNlbGVjdGlvbi5zZWxlY3Rpb25BZGRUbykge1xuICAgIC8vICAgICAgICAgc2VsZWN0aW9uLmFkZCh0YXNrKTtcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgIHNlbGVjdGlvbi5hZGRFeGNsdXNpdmUodGFzayk7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3Rpb24uc2VsZWN0ZWQpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgLy8gY29uc29sZS5sb2coc2VsZWN0aW9uLnNlbGVjdGVkLmxlbmd0aCk7XG5cbiAgICAvLyBpZiAoc2VsZWN0aW9uLnNlbGVjdGVkLmxlbmd0aCkge1xuICAgIC8vICAgICBkb20uZnJlZXplKCk7XG4gICAgLy8gICAgIC8vc2VsZWN0aW9uLmFkZCh0YXNrKTtcbiAgICAvLyAgICAgbGV0IG1lbnVUZXh0cyA9IFsgXCJDb3B5ICh3aXRoIHN1YnRhc2tzKVwiLCBcIkNvcHkgKHdpdGhvdXQgc3VidGFza3MpXCIsIFxuICAgIC8vICAgICBcIkN1dCAod2l0aCBzdWJ0YXNrcylcIiwgXCJDdXQgKHdpdGhvdXQgc3VidGFza3MpXCIgXTtcbiAgICAvLyAgICAgbGV0IG1lbnVGdW5jdGlvbnMgPSBbXG4gICAgLy8gICAgICAgICBmdW5jdGlvbigpIHtjb3BpZXIuY29weShzZWxlY3Rpb24uc2VsZWN0ZWQsIHRydWUsIHRhc2tMaXN0KX0sXG4gICAgLy8gICAgICAgICBmdW5jdGlvbigpIHtjb3BpZXIuY29weShzZWxlY3Rpb24uc2VsZWN0ZWQsIGZhbHNlLCB0YXNrTGlzdCl9LFxuICAgIC8vICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLmN1dChzZWxlY3Rpb24uc2VsZWN0ZWQsIHRydWUsIHRydWUsIHRhc2tMaXN0KX0sXG4gICAgLy8gICAgICAgICBmdW5jdGlvbigpIHtjb3BpZXIuY3V0KHNlbGVjdGlvbi5zZWxlY3RlZCwgZmFsc2UsIHRydWUsIHRhc2tMaXN0KX1cbiAgICAvLyAgICAgXTtcblxuICAgIC8vICAgICAvLyBPbmx5IHNob3cgcGFzdGUgb3B0aW9uIGlmIHRoZXJlJ3Mgc29tZXRoaW5nIHRvIHBhc3RlLlxuICAgIC8vICAgICBpZiAoY29waWVyLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAvLyAgICAgICAgIG1lbnVUZXh0cy5wdXNoKFwiUGFzdGUgKGFib3ZlKVwiLCBcIlBhc3RlIChiZWxvdylcIiwgXCJQYXN0ZSAoYXMgc3VidGFzaylcIik7XG4gICAgLy8gICAgICAgICBtZW51RnVuY3Rpb25zLnB1c2goXG4gICAgLy8gICAgICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLnBhc3RlKHRhc2suc3VwZXJ0YXNrTGlzdCwgXG4gICAgLy8gICAgICAgICAgICAgICAgIHRhc2suc3VwZXJ0YXNrTGlzdC5nZXRUYXNrSWR4KHRhc2spKX0sXG4gICAgLy8gICAgICAgICAgICAgZnVuY3Rpb24oKSB7Y29waWVyLnBhc3RlKHRhc2suc3VwZXJ0YXNrTGlzdCwgXG4gICAgLy8gICAgICAgICAgICAgICAgIHRhc2suc3VwZXJ0YXNrTGlzdC5nZXRUYXNrSWR4KHRhc2spICsgMSl9LFxuICAgIC8vICAgICAgICAgICAgIGZ1bmN0aW9uKCkge2NvcGllci5wYXN0ZSh0YXNrLnN1YnRhc2tMaXN0KX1cbiAgICAvLyAgICAgICAgICk7XG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICBsZXQgbWVudSA9IG5ldyBSaWdodENsaWNrTWVudShtZW51VGV4dHMsIG1lbnVGdW5jdGlvbnMpO1xuICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5hcHBlbmRDaGlsZChtZW51LnN2Zyk7XG4gICAgLy8gICAgIG1lbnUuYnV0dG9uRG93bihfZS5wYWdlWCwgX2UucGFnZVkpO1xuICAgIC8vIH0gZWxzZSBpZiAoY29waWVyLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAvLyAgICAgZG9tLmZyZWV6ZSgpO1xuICAgIC8vICAgICBsZXQgbWVudSA9IG5ldyBSaWdodENsaWNrTWVudShbIFwiUGFzdGVcIiBdLCBcbiAgICAvLyAgICAgICAgIFtcbiAgICAvLyAgICAgICAgICAgICBmdW5jdGlvbigpIHtjb3BpZXIucGFzdGUodGFza0xpc3QpfVxuICAgIC8vICAgICAgICAgXSk7XG4gICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmFwcGVuZENoaWxkKG1lbnUuc3ZnKTtcbiAgICAvLyAgICAgbWVudS5idXR0b25Eb3duKF9lLnBhZ2VYLCBfZS5wYWdlWSk7XG4gICAgLy8gfVxuXG59KTtcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgX2UgPT4ge1xuICAgIC8vIGxldCB0YXNrID0gdGFza0xpc3QuZ2V0VGFza0J5SWQoZG9tLmdldFRhc2tJZEF0UG9zKF9lLnBhZ2VYLCBfZS5wYWdlWSksIHRydWUpO1xuICAgIGxldCB0YXNrID0gdGFza0xpc3QuZ2V0VGFza0J5SWQoZG9tLmdldFRhc2tJZEF0UG9zKF9lLmNsaWVudFgsIF9lLmNsaWVudFkpLCB0cnVlKTtcbiAgICAvLyBsZXQgdW5kZXJNb3VzZSA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KF9lLnBhZ2VYLCBfZS5wYWdlWSk7XG4gICAgbGV0IHVuZGVyTW91c2UgPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludChfZS5jbGllbnRYLCBfZS5jbGllbnRZKTtcbiAgICBcbiAgICBpZiAoIXN0YXRlTWFuYWdlci5jdXJyZW50bHlFZGl0aW5nKSB7XG4gICAgICAgIGlmICghX2UudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImlucHV0LWJ1dHRvblwiKSkge1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24udXBkYXRlU2VsZWN0aW9uKHRhc2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbmVlZENsZWFyID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGVsZW0gb2YgdW5kZXJNb3VzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJ0YXNrLWV4cGFuZC1pbWdcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJzdWJ0YXNrcy1wbHVzLWltZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmVlZENsZWFyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChuZWVkQ2xlYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIF9lID0+IHtcbiAgICBpZiAoX2UuYnV0dG9uID09IDAgJiYgIXN0YXRlTWFuYWdlci5jdXJyZW50bHlFZGl0aW5nKSB7XG4gICAgICAgIGRvbS50aGF3KCk7XG4gICAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgX2UgPT4ge1xuICAgIGlmIChfZS5idXR0b24gPT0gMiAmJiAhc3RhdGVNYW5hZ2VyLmN1cnJlbnRseUVkaXRpbmcpIHtcbiAgICAgICAgc2VsZWN0aW9uLnRyaWdnZXJNZW51KF9lLmNsaWVudFgsIF9lLmNsaWVudFksIHN0YXRlTWFuYWdlci5zZWxlY3Rpb25BZGRUbyk7XG4gICAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIF9lID0+IHtcbiAgICBzdGF0ZU1hbmFnZXIudG91Y2gudGltZS5zcGxpY2UoMCwgMSk7XG4gICAgc3RhdGVNYW5hZ2VyLnRvdWNoLnRpbWUucHVzaChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG5cbiAgICBzdGF0ZU1hbmFnZXIudG91Y2gucG9zLnNwbGljZSgwLCAxKTtcbiAgICAvLyB0b3VjaC5wb3MucHVzaCh7IHg6IF9lLnRvdWNoZXNbMF0ucGFnZVgsIHk6IF9lLnRvdWNoZXNbMF0ucGFnZVkgfSk7XG4gICAgc3RhdGVNYW5hZ2VyLnRvdWNoLnBvcy5wdXNoKHsgeDogX2UudG91Y2hlc1swXS5jbGllbnRYLCBcbiAgICAgICAgeTogX2UudG91Y2hlc1swXS5jbGllbnRZIH0pO1xuXG4gICAgaWYgKHN0YXRlTWFuYWdlci50b3VjaC50aW1lWzBdICYmIFxuICAgICAgICBzdGF0ZU1hbmFnZXIudG91Y2gudGltZVsxXSAtIHN0YXRlTWFuYWdlci50b3VjaC50aW1lWzBdPCAzMDApIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKHN0YXRlTWFuYWdlci50b3VjaC5wb3NbMV0ueCAtIFxuICAgICAgICAgICAgICAgIHN0YXRlTWFuYWdlci50b3VjaC5wb3NbMF0ueCkgPCA0MCAmJlxuICAgICAgICAgICAgICAgIE1hdGguYWJzKHN0YXRlTWFuYWdlci50b3VjaC5wb3NbMV0ueSAtIFxuICAgICAgICAgICAgICAgIHN0YXRlTWFuYWdlci50b3VjaC5wb3NbMF0ueSkgPCA0MCkge1xuICAgICAgICAgICAgc2VsZWN0aW9uLnRyaWdnZXJNZW51KHN0YXRlTWFuYWdlci50b3VjaC5wb3NbMV0ueCwgXG4gICAgICAgICAgICAgICAgc3RhdGVNYW5hZ2VyLnRvdWNoLnBvc1sxXS55LCBzdGF0ZU1hbmFnZXIuc2VsZWN0aW9uQWRkVG8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGVNYW5hZ2VyLnRvdWNoLnRvdWNoZWRJZC5zcGxpY2UoMCwgMSk7XG4gICAgc3RhdGVNYW5hZ2VyLnRvdWNoLnRvdWNoZWRJZC5wdXNoKGRvbS5nZXRUYXNrSWRBdFBvcyhfZS50b3VjaGVzWzBdLmNsaWVudFgsIFxuICAgICAgICBfZS50b3VjaGVzWzBdLmNsaWVudFkpKTtcbiAgICBjb25zb2xlLmxvZyhcIlNldCBsYXN0IHRvdWNoZWQgdG8gXCIgKyBzdGF0ZU1hbmFnZXIudG91Y2gudG91Y2hlZElkKTtcbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgX2UgPT4ge1xuXG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgX2UgPT4ge1xuICAgIGlmIChfZS5rZXkgPT0gXCJlXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0aW9uLnNlbGVjdGVkKTtcbiAgICB9XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
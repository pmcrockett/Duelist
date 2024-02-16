import dateFormat, { masks } from "dateformat";

const taskBin = document.querySelector(".task-bin");
const priorityList = [ "N/A", "Unimportant", "Important", "Urgent" ];
const progressList = [ "N/A", "Not started", "In progress", "Complete" ];

export function createCard(_task) {
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

    let hDiv = createAppend("div", "card-header-div", card);
    let titleContainer = createAppend("div", "card-title-container", hDiv);

    if (_task.priority) {
        titleContainer.appendChild(createPrioritySvg(_task.priority));
    }

    if (_task.progress) {
        titleContainer.appendChild(createProgressSvg(_task.progress));
    }

    let h2 = createAppend("h2", [ "card-title", "card-editable" ], 
        titleContainer, _task.title);
    let editSvg = createAppend(
        createSvg("M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M15.1,7.07C15.24,7.07 15.38,7.12 15.5,7.23L16.77,8.5C17,8.72 17,9.07 16.77,9.28L15.77,10.28L13.72,8.23L14.72,7.23C14.82,7.12 14.96,7.07 15.1,7.07M13.13,8.81L15.19,10.87L9.13,16.93H7.07V14.87L13.13,8.81Z", 
            "Edit task", true),
        "edit-task-img",
        hDiv
    )

    if (_task.dueDate) {
        let dueDate = createAppend("div", [ "card-due-date", "card-editable" ],
            hDiv, `${dateFormat(_task.dueDate, "dddd, mmmm dS, yyyy")}`);
    }

    if (_task.dueTime) {
        let dueDate = createAppend("div", [ "card-due-time", "card-editable" ],
            hDiv, `${dateFormat(_task.dueTime, "h:MM TT")}`);
    }

    let taskExpandSvg = createAppend(
        createSvg("", "Expand", true),
        "task-expand-img",
        hDiv
    );

    if (!_task.hasContent()) {
        taskExpandSvg.classList.add("hidden");
    }

    let taskExpandPath = taskExpandSvg.querySelector("path:not(.bg-img)");
    updateTaskExpandView(taskExpandPath, card, _task);

    if (_task.priority > 0 || _task.progress > 0) {
        let infoContainer = createAppend("div", "info-container", card);

        if (_task.priority > 0) {
            let priorityContainer = createAppend("div", "card-container", 
                infoContainer);
            let priorityLabel = createAppend("div", "card-label", 
                priorityContainer, "Priority");
            let priority = createAppend("div", 
                [ "card-priority", "card-editable" ], priorityContainer,
                priorityList[_task.priority]);
        }
    
        if (_task.progress > 0 || _task.useProgressFromSubtasks) {
            let progressContainer = createAppend("div", "card-container", 
                infoContainer);
            let progressLabel = createAppend("div", "card-label", 
                progressContainer, "Progress");
            let prog = createAppend("div", 
                [ "card-progress", "card-editable" ], progressContainer,
                progressList[_task.progress]);

            if (_task.useProgressFromSubtasks) {
                prog.textContent += " (from subtasks)";
            }
        }
    }

    if (_task.description.length) {
        let descContainer = createAppend("div", "card-container", card);
        let desc = createAppend("div", [ "card-description", "card-content", 
            "card-editable" ], descContainer, _task.description);
        let descLabel = createAppend("div", "card-label", descContainer, "About");
    }

    if (_task.notes.length) {
        let notesContainer = createAppend("div", "card-container", card);
        let notes = createAppend("div", [ "card-notes", "card-content", 
            "card-editable" ], notesContainer, _task.notes);
        let notesLabel = createAppend("div", "card-label", notesContainer, "Notes");
    }

    let subtasks = taskBin.querySelector(`.subtasks.id-${_task.id}`);
    let needSubtasksListener = false;

    if (!subtasks) {
        needSubtasksListener = true;
        subtasks = document.createElement("div");
        card.insertAdjacentElement("afterend", subtasks);
        subtasks.classList.add("subtasks", `id-${_task.id}`);

        var subtasksHeader = createAppend("div", [ "subtasks-header", 
            `id-${_task.id}` ], subtasks);
        subtasksHeader.setAttribute("style", indentStr);

        if (!_task.subtasks.length) {
            subtasksHeader.classList.add("hidden");
        } else {
            subtasksHeader.classList.remove("hidden");
        }

        let subtasksPlusSvg = createAppend(
            createSvg("", "Subtasks", true),
            "subtasks-plus-img",
            subtasksHeader
        );

        let subtasksPlusPath = subtasksPlusSvg.querySelector("path:not(.bg-img)");
        setSubtaskExpandView(_task.subtaskList.expanded, subtasks, _task, false);

        let subtasksText = createAppend("div", [ "subtasks-text", 
            `id-${_task.id}` ], subtasksHeader, `${_task.subtasks.length} 
            ${_task.subtasks.length == 1 ? "subtask" : "subtasks"}`);
    } else {
        subtasks.remove();
        card.insertAdjacentElement("afterend", subtasks);
        var subtasksHeader = subtasks.querySelector(".subtasks-header");

        if (!_task.subtasks.length) {
            subtasksHeader.classList.add("hidden");
        } else {
            subtasksHeader.classList.remove("hidden");
        }

        let subtasksText = subtasks.querySelector(".subtasks-text");
        subtasksText.textContent = `${_task.subtasks.length} 
            ${_task.subtasks.length == 1 ? "subtask" : "subtasks"}`;
    }

    return {
        task: card,
        subtasks: subtasks,
        subtasksExpand: subtasksHeader,
        needSubtasksListener,
        taskExpand: taskExpandSvg,
        taskExpandPath: taskExpandPath,
        header: hDiv,
        editOpen: editSvg
    };
}

export function updateTaskExpandView(_svgPath, _card, _task) {
    expandCard(_task, _card);
    
    if (_task.expanded) {
        _svgPath.setAttribute("d", "M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M17,14L12,9L7,14H17Z");
    } else {
        _svgPath.setAttribute("d", "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M7,10L12,15L17,10H7Z");
    }
}

export function setSubtaskExpandView(_expanded, _card, _task, _recursive) {
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

export function freeze() {
    taskBin.classList.add("freeze");
}

export function thaw() {
    taskBin.classList.remove("freeze");
}

export function select(_taskId) {
    let card = taskBin.querySelector(`.task.id-${_taskId}`);

    if (card) {
        card.classList.add("selected");
    }
}

export function unselect(_taskId) {
    let card = taskBin.querySelector(`.task.id-${_taskId}`);

    if (card) {
        card.classList.remove("selected");
    }
}

export function getTaskIdAtPos(_clientX, _clientY) {
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

export function createInputBox(_task) {
    freeze();
    let body = document.querySelector("body");
    let card = body.querySelector(`.task.id-${_task.id}`);
    card.classList.add("editing");
    let cardInput = createAppend("div", "card-input", body);

    let titleInput = createInput("text", null, "input-title", _task.title, 
        cardInput, "field-container", "Task name");
    titleInput.focus();
    titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);

    let dueContainer = createAppend("div", [ "due-container", "input-container" ],
        cardInput);
    let dateInput = createInput("date", null, "input-date", _task.dueDateStr, 
        dueContainer, "field-container", "Due date");
    let timeInput = createInput("time", null, "input-time", _task.dueTimeStr, 
        dueContainer, "field-container", "Due time");

    let descInput = createInput("textarea", null, "input-desc", _task.description, 
        cardInput, "field-container", "Description");

    let radioContainer = createAppend("div", [ "radio-container", 
        "input-container" ], cardInput);

    let priorityFieldContainer = createAppend("div", "field-container", 
        radioContainer);
    let priorityLabel = createAppend("div", "pseudo-label", priorityFieldContainer,
        "Priority");
    let priorityField = createAppend(
        createRadioField("priority-radio", _task.priority, priorityList),
        null, priorityFieldContainer);
    setInputAttributes(priorityField, null, "input-priority");

    let progressFieldContainer = createAppend("div", "field-container", 
        radioContainer);
    let progressLabel = createAppend("div", "pseudo-label", 
        progressFieldContainer, "Progress");
    let progressField = createAppend(
        createRadioField("progress-radio", _task.progress, progressList),
        null, progressFieldContainer);
    setInputAttributes(progressField, null, "input-progress");
    let progressCheckContainer = createAppend("div", "progress-check-container",
        progressFieldContainer);
    let progressCheck = createAppend("input", null, progressCheckContainer);
    setInputAttributes(progressCheck, "checkbox", "progress-check");

    if (_task.useProgressFromSubtasks) {
        progressCheck.setAttribute("checked", "checked");
    }

    let progressCheckLabel = createAppend("label", null, progressCheckContainer,
        "Set progress from subtasks");
    progressCheckLabel.setAttribute("for", "progress-check");
    updateProgressField(progressCheck, progressField);

    let notesInput = createInput("textarea", null, "input-note", _task.notes, 
        cardInput, "field-container", "Notes");

    let buttonDiv = createAppend("div", "input-buttons", cardInput);
    let confirm = createAppend(
        createSvg("M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",
        "Confirm", true, "input-button"),
        [ "confirm-edit-img", "input-button" ], buttonDiv
    );
    let cancel = createAppend(
        createSvg("M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z",
        "Cancel", true, "input-button"),
        [ "confirm-edit-img", "input-button" ], buttonDiv
    );

    return {
        card,
        cardInput,
        titleInput,
        dateInput,
        timeInput,
        descInput,
        priorityField,
        progressCheck,
        progressField,
        notesInput,
        confirm,
        cancel
    };
}

function createAppend(_elemType, _classes, _parentElem, _textContent) {
    // If _elemType is a string, create it; otherwise assume it's an existing
    // element and use it as passed.
    if (typeof _elemType == "string") {
        var elem = document.createElement(_elemType);
    } else {
        elem = _elemType;
    }
    
    if (_classes) {
        // Can pass array of strings or single string.
        if (typeof _classes == "string") {
            elem.classList.add(_classes);
        } else {
            elem.classList.add(..._classes);
        }
    }

    if (_textContent) {
        elem.textContent = _textContent;
    }

    _parentElem.appendChild(elem);

    return elem;
}

export function updateProgressField(_check, _field) {
    if (_check.checked) {
        _field.setAttribute("disabled", "disabled");
    } else {
        _field.removeAttribute("disabled");
    }
}

export function getRadioValue(_fieldset) {
    let radios = _fieldset.querySelectorAll("input");

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return i;
        }
    }

    return -1;
}

function createInput(_type, _classes, _name, _value, _containerParent, 
        _containerClasses, _labelText, _labelClasses) {
    let container = createAppend("div", _containerClasses, _containerParent);
    let elemLabel = createAppend("label", _labelClasses, container, _labelText);
    elemLabel.setAttribute("for", _name);

    if (_type == "textarea") {
        var elem = createAppend("textarea", _classes, container, _value);
        setInputAttributes(elem, null, _name, null);
    } else {
        var elem = createAppend("input", _classes, container);
        setInputAttributes(elem, _type, _name, _value);
    }

    return elem;
}

function setInputAttributes(_elem, _type, _nameId, _value) {
    if (_type) _elem.setAttribute("type", _type);

    if (_nameId) {
        _elem.setAttribute("name", _nameId);
        _elem.setAttribute("id", _nameId);
    }

    if (_value) _elem.setAttribute("value", _value);
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
import { format } from "date-fns";

const taskBin = document.querySelector(".task-bin");
const priorityList = [ "N/A", "Unimportant", "Important", "Urgent" ];
const progressList = [ "N/A", "Not started", "In progress", "Complete" ];

export let frozen = false;

export function createCard(_task, _stateManager) {
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
        dueDate.textContent = `${format(_task.dueDate, "EEEE, LLLL do, yyyy")}`;
        dueDate.classList.add("card-due-date", "card-editable");
        hDiv.appendChild(dueDate);
    }

    if (_task.dueTime) {
        let dueTime = document.createElement("div");
        dueTime.textContent = `${format(_task.dueTime, "h:mm aaa")}`;
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

    let htmlBody = document.querySelector("body");
    svg.addEventListener("click", _event => {createInputBox(_task, _stateManager, 
        htmlBody)});

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

export function freeze() {
    frozen = true;
    taskBin.classList.add("freeze");
}

export function thaw() {
    frozen = false;
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

export function getTaskIdAtPos(_x, _y) {
    let underMouse = document.elementsFromPoint(_x, _y);
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

function createInputBox(_task, _stateManager, _body) {
    if (_stateManager.currentlyEditing) return;
    freeze();
    let card = _body.querySelector(`.task.id-${_task.id}`);
    card.classList.add("editing");

    _task.currentlyEditing = true;
    _stateManager.currentlyEditing = true;

    // let cardSpacer = document.createElement("div");
    // cardSpacer.classList.add("card-spacer")
    // _body.appendChild(cardSpacer);

    let cardInput = document.createElement("div");
    cardInput.classList.add("card-input");
    _body.appendChild(cardInput);

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
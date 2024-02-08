import { format } from "date-fns";

const taskBin = document.querySelector(".task-bin");
const priorityList = [ "N/A", "Unimportant", "Important", "Urgent" ];
const progressList = [ "N/A", "Not started", "In progress", "Complete" ];

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

    let card = document.createElement("div");
    card.classList.add("task", `id-${_task.id}`);
    card.setAttribute("style", `margin-left: calc(var(--card-indent) * ${_task.depth})`)

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
        "Edit task");
    svg.classList.add("edit-task-img");
    hDiv.appendChild(svg);

    if (_task.due) {
        let due = document.createElement("div");
        due.textContent = `${format(_task.due, "EEEE, LLLL do, yyyy (h:mm aaa)")}`;
        due.classList.add("card-due", "card-editable");
        hDiv.appendChild(due);
    }

    let spacer = document.createElement("div");
    spacer.classList.add("card-spacer", "card-content");
    card.appendChild(spacer);

    if (_task.priority > 0 || _task.progress > 0) {
        let infoContainer = createCardContainer([ "card-container" ]);
        card.appendChild(infoContainer);

        let infoLabel = createCardContainerLabel("Info", [ "card-label" ]);
        infoContainer.appendChild(infoLabel);

        let infoSubcontainer = document.createElement("div");
        infoSubcontainer.classList.add("info-subcontainer");
        infoContainer.appendChild(infoSubcontainer);

        if (_task.priority > 0) {
            let priority = document.createElement("div");
            priority.textContent = priorityList[_task.priority];
            priority.classList.add("card-priority", "card-editable");
            infoSubcontainer.appendChild(priority);
        }
    
        if (_task.progress > 0) {
            let prog = document.createElement("div");
            prog.textContent = progressList[_task.progress];
            prog.classList.add("card-progress", "card-editable");
            infoSubcontainer.appendChild(prog);
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
    } else {
        subtasks.remove();
        card.insertAdjacentElement("afterend", subtasks);
    }

    expandCard(_task, card);
    expandCard(_task, subtasks);

    hDiv.addEventListener("click", _event => {
        if (_stateManager.currentlyEditing) return;
        _task.expanded = !_task.expanded;
        expandCard(_task, card);
        expandCard(_task, subtasks);
    });

    let htmlBody = document.querySelector("body");
    svg.addEventListener("click", _event => {createInputBox(_task, _stateManager, 
        htmlBody)});

    return {
        task: card,
        subtasks: subtasks
    };
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

export function getTaskIdAtPos(_x, _y) {
    let underMouse = document.elementsFromPoint(_x, _y);

    for (let _elem of underMouse) {
        if (_elem.classList.contains("task")) {
            let idPos = _elem.className.indexOf("id-");
            let idEnd = _elem.className.indexOf(" ", idPos);
            if (idEnd < 0) idEnd = _elem.className.length;

            return Number(_elem.className.slice(idPos + 3, idEnd));
        }
    };

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

function expandCard(_task, _div, _subDiv) {
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
    _task.currentlyEditing = true;
    _stateManager.currentlyEditing = true;

    let cardInput = document.createElement("div");
    cardInput.classList.add("card-input");
    _body.appendChild(cardInput);

    let titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("value", _task.title);
    cardInput.appendChild(titleInput);

    let dateInput = document.createElement("input");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("value", _task.dueDate);
    cardInput.appendChild(dateInput);

    let timeInput = document.createElement("input");
    timeInput.setAttribute("type", "time");
    timeInput.setAttribute("value", _task.dueTime);
    cardInput.appendChild(timeInput);

    let descInput = document.createElement("textarea");
    descInput.textContent = _task.description;
    cardInput.appendChild(descInput);

    let priorityField = createRadioField("priority-radio", _task.priority, priorityList);
    cardInput.appendChild(priorityField);

    let progressField = createRadioField("progress-radio", _task.progress, progressList);
    cardInput.appendChild(progressField);

    let notesInput = document.createElement("textarea");
    notesInput.textContent = _task.notes;
    cardInput.appendChild(notesInput);

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("input-buttons");
    cardInput.appendChild(buttonDiv);

    let confirm = createSvg("M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",
        "Confirm");
    confirm.classList.add("confirm-edit-img");
    buttonDiv.appendChild(confirm);

    let cancel = createSvg("M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z",
        "Cancel");
    cancel.classList.add("confirm-edit-img");
    buttonDiv.appendChild(cancel);

    confirm.addEventListener("click", _event => {
        _task.currentlyEditing = false;
        _stateManager.currentlyEditing = false;

        _task.title = titleInput.value;
        _task.dueDate = dateInput.value;
        _task.dueTime = timeInput.value;
        _task.updateDue();
        _task.description = descInput.value;
        _task.priority = getRadioValue(priorityField);
        _task.progress = getRadioValue(progressField);
        _task.notes = notesInput.value;

        cardInput.remove();
        _task.refreshDom(false);
    });

    cancel.addEventListener("click", _event => {
        _task.currentlyEditing = false;
        _stateManager.currentlyEditing = false;
        
        cardInput.remove();
    });
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

function createSvg(_path, _title) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    
    let title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = _title;
    svg.appendChild(title);

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", _path);
    svg.appendChild(path);

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

    let prioritySvg = createSvg(priorityPath[_priority - 1], priorityList[_priority]);
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

    let progressSvg = createSvg(progressPath[_progress - 1], progressList[_progress]);
    progressSvg.classList.add("progress-img", progressClass[_progress - 1]);

    return progressSvg;
}
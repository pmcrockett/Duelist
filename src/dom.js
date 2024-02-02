import { format } from "date-fns";

let taskBin = document.querySelector(".task-bin");

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

    let h2 = document.createElement("h2");
    h2.textContent = _task.title;
    h2.classList.add("card-title", "card-editable");
    hDiv.appendChild(h2);

    let svg = createSvg("M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M15.1,7.07C15.24,7.07 15.38,7.12 15.5,7.23L16.77,8.5C17,8.72 17,9.07 16.77,9.28L15.77,10.28L13.72,8.23L14.72,7.23C14.82,7.12 14.96,7.07 15.1,7.07M13.13,8.81L15.19,10.87L9.13,16.93H7.07V14.87L13.13,8.81Z", 
        "Edit task");
    svg.classList.add("edit-task-img");
    hDiv.appendChild(svg);

    let due = document.createElement("div");
    due.textContent = `${format(_task.due, "EEEE, LLLL do, yyyy (h:mm aaa)")}`;
    due.classList.add("card-due", "card-editable");
    hDiv.appendChild(due);

    let spacer = document.createElement("div");
    spacer.classList.add("card-spacer", "card-content");
    card.appendChild(spacer);

    let desc = document.createElement("p");
    desc.textContent = _task.description;
    desc.classList.add("card-description", "card-content", "card-editable");
    card.appendChild(desc);

    let priority = document.createElement("p");
    priority.textContent = _task.priority;
    priority.classList.add("card-priority", "card-content", "card-editable");
    card.appendChild(priority);

    let prog = document.createElement("p");
    prog.textContent = _task.progress;
    prog.classList.add("card-progress", "card-content", "card-editable");
    card.appendChild(prog);

    let notes = document.createElement("p");
    notes.textContent = _task.notes;
    notes.classList.add("card-notes", "card-content", "card-editable");
    card.appendChild(notes);

    let subtasks = taskBin.querySelector(`.subtasks.id-${_task.id}`);

    if (!subtasks) {
        subtasks = document.createElement("div");
        supertaskDiv.appendChild(subtasks);
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
    cardInput.appendChild(titleInput);

    let confirm = createSvg("M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",
        "Confirm");
    confirm.classList.add("confirm-edit-img");
    cardInput.appendChild(confirm);

    confirm.addEventListener("click", _event => {
        _task.currentlyEditing = false;
        _stateManager.currentlyEditing = false;

        _task.title = titleInput.value;

        cardInput.remove();
        _task.refreshDom(false);
    });
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
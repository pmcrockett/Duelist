import { format } from "date-fns";

let taskBin = document.querySelector(".task-bin");

export function createCard(_task) {
    // title;
    // due;
    // description;
    // progress;
    // notes;
    // id;
    let supertaskDiv = null;
    let supertask = _task.supertask;
    
    if (supertask) {
        supertaskDiv = taskBin.querySelector(`.subtasks.id-${supertask.id}`);
    } else {
        supertaskDiv = taskBin;
    }

    let newCard = document.createElement("div");
    newCard.classList.add("task", `id-${_task.id}`);
    newCard.setAttribute("style", `margin-left: calc(var(--card-indent) * ${_task.depth})`)
    supertaskDiv.appendChild(newCard);

    let newH2 = document.createElement("h2");
    newH2.textContent = _task.title;
    newH2.classList.add("card-title");
    newCard.appendChild(newH2);

    let newDue = document.createElement("div");
    //newDiv.textContent = `${_task.dueDate} ${_task.dueTime}`;
    newDue.textContent = `${format(_task.due, "EEEE, LLLL do, yyyy (h:mm aaa)")}`;
    newDue.classList.add("card-due");
    newCard.appendChild(newDue);

    let spacer = document.createElement("div");
    spacer.classList.add("card-spacer", "card-content");
    newCard.appendChild(spacer);

    let newDesc = document.createElement("p");
    newDesc.textContent = _task.description;
    newDesc.classList.add("card-description", "card-content");
    newCard.appendChild(newDesc);

    let newPriority = document.createElement("p");
    newPriority.textContent = _task.priority;
    newPriority.classList.add("card-priority", "card-content");
    newCard.appendChild(newPriority);

    let newProg = document.createElement("p");
    newProg.textContent = _task.progress;
    newProg.classList.add("card-progress", "card-content");
    newCard.appendChild(newProg);

    let newNotes = document.createElement("p");
    newNotes.textContent = _task.notes;
    newNotes.classList.add("card-notes", "card-content");
    newCard.appendChild(newNotes);

    let newSubtasks = document.createElement("div");
    newSubtasks.classList.add("subtasks", `id-${_task.id}`);
    supertaskDiv.appendChild(newSubtasks);

    expandCard(_task, newCard);
    expandCard(_task, newSubtasks);

    newCard.addEventListener("click", _event => {
        _task.expanded = !_task.expanded;
        expandCard(_task, newCard);
        expandCard(_task, newSubtasks);
    });

    return {
        task: newCard,
        subtasks: newSubtasks
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
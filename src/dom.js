import { formatDistance, subDays } from "date-fns";

let taskBin = document.querySelector(".task-bin");

export function createCard(_task) {
    // title;
    // due;
    // description;
    // progress;
    // notes;
    // id;
    let newCard = document.createElement("div");
    newCard.classList.add("task");
    taskBin.appendChild(newCard);

    let newDiv = document.createElement("div");
    //newDiv.textContent = `${_task.dueDate} ${_task.dueTime}`;
    newDiv.textContent = `${_task.due.toLocaleString()}`;
    newCard.appendChild(newDiv);

    let newH2 = document.createElement("h2");
    newH2.textContent = _task.title;
    newCard.appendChild(newH2);

    let newP = document.createElement("p");
    newP.textContent = _task.priority;
    newCard.appendChild(newP);

    newP = document.createElement("p");
    newP.textContent = _task.progress;
    newCard.appendChild(newP);

    newP = document.createElement("p");
    newP.textContent = _task.description;
    newCard.appendChild(newP);

    newP = document.createElement("p");
    newP.textContent = _task.notes;
    newCard.appendChild(newP);
}
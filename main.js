/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
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
    due;
    description;
    progress;
    notes;
    id;
    currentlyEditing;
    useProgressFromSubtasks;
    subtaskList;
    supertask;
    expanded;
    static lastId = -1;

    constructor(_supertask, _title, _due, _description, _progress, _notes) {
        this.title = _title;
        this.due = _due;
        this.description = _description;
        this.progress = _progress;
        this.notes = _notes;
        this.id = Task.generateId();
        this.currentlyEditing = "";
        this.subtaskList = new SubtaskList();
        this.expanded = true;
        this.useProgressFromSubtasks = true;

        if (_supertask) {
            _supertask.subtaskList.add(this);
            this.supertask = _supertask;
        } else {
            this.supertask = null;
        }
        // Place DOM object in supertask or root array
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

    static generateId() {
        return ++Task.lastId;
    }
}

class SubtaskList {
    subtasks;

    constructor(_subtasks) {
        this.subtasks = _subtasks || null;
    }

    sort() {

    }

    add(_task) {
        this.subtasks.push(_task);
    }

    // Does removal from the subtask list imply full deletion?
    remove(_id) {
        for (let i = 0; i < this.subtasks.length; i++) {
            if (this.subtasks[i].id == _id) {
                this.subtasks[i].supertask = null;
                this.subtasks.remove[i];
                return true;
            }
        }

        return false;
    }

    hasSubtasks() {
        return this.subtasks.length >= 1;
    }
}

let topLevelTasks = [ new Task(null, "Test Task") ];
console.log(topLevelTasks);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZHVlbGlzdC8uL3NyYy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGFza1xuICAgIC8vIE1ldGhvZHNcbiAgICAgICAgLy8gZGVsZXRlXG4gICAgICAgIC8vIGNvcHlcbiAgICAgICAgLy8gY3V0XG4gICAgICAgIC8vIHBhc3RlXG4gICAgICAgIC8vIGVkaXRcbiAgICAgICAgLy8gZXhwYW5kXG4gICAgICAgIC8vIHNvcnRTdWJ0YXNrc1xuICAgIC8vIFByb3BlcnRpZXNcbiAgICAgICAgLy8gZHVlXG4gICAgICAgIC8vIHRpdGxlXG4gICAgICAgIC8vIGRlc2NyaXB0aW9uXG4gICAgICAgIC8vIHByaW9yaXR5XG4gICAgICAgIC8vIG5vdGVzXG4gICAgICAgIC8vIHByb2dyZXNzXG4gICAgICAgIC8vIHVzZVByb2dyZXNzRnJvbVN1YnRhc2tzXG4gICAgICAgIC8vIHN1YnRhc2tzXG4gICAgICAgIC8vIGV4cGFuZGVkXG5cbi8vIE1lbnUgKD8pXG5cbi8vIFRvcC1sZXZlbCBhcnJheSBvZiB0YXNrc1xuXG4vLyBET00gbW9kdWxlXG5cbmNsYXNzIFRhc2sge1xuICAgIHRpdGxlO1xuICAgIGR1ZTtcbiAgICBkZXNjcmlwdGlvbjtcbiAgICBwcm9ncmVzcztcbiAgICBub3RlcztcbiAgICBpZDtcbiAgICBjdXJyZW50bHlFZGl0aW5nO1xuICAgIHVzZVByb2dyZXNzRnJvbVN1YnRhc2tzO1xuICAgIHN1YnRhc2tMaXN0O1xuICAgIHN1cGVydGFzaztcbiAgICBleHBhbmRlZDtcbiAgICBzdGF0aWMgbGFzdElkID0gLTE7XG5cbiAgICBjb25zdHJ1Y3Rvcihfc3VwZXJ0YXNrLCBfdGl0bGUsIF9kdWUsIF9kZXNjcmlwdGlvbiwgX3Byb2dyZXNzLCBfbm90ZXMpIHtcbiAgICAgICAgdGhpcy50aXRsZSA9IF90aXRsZTtcbiAgICAgICAgdGhpcy5kdWUgPSBfZHVlO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gX2Rlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gX3Byb2dyZXNzO1xuICAgICAgICB0aGlzLm5vdGVzID0gX25vdGVzO1xuICAgICAgICB0aGlzLmlkID0gVGFzay5nZW5lcmF0ZUlkKCk7XG4gICAgICAgIHRoaXMuY3VycmVudGx5RWRpdGluZyA9IFwiXCI7XG4gICAgICAgIHRoaXMuc3VidGFza0xpc3QgPSBuZXcgU3VidGFza0xpc3QoKTtcbiAgICAgICAgdGhpcy5leHBhbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXNlUHJvZ3Jlc3NGcm9tU3VidGFza3MgPSB0cnVlO1xuXG4gICAgICAgIGlmIChfc3VwZXJ0YXNrKSB7XG4gICAgICAgICAgICBfc3VwZXJ0YXNrLnN1YnRhc2tMaXN0LmFkZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc3VwZXJ0YXNrID0gX3N1cGVydGFzaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3VwZXJ0YXNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBQbGFjZSBET00gb2JqZWN0IGluIHN1cGVydGFzayBvciByb290IGFycmF5XG4gICAgfVxuXG4gICAgZWRpdFRpdGxlKCkge1xuXG4gICAgfVxuXG4gICAgZWRpdER1ZSgpIHtcblxuICAgIH1cblxuICAgIGVkaXREZXNjcmlwdGlvbigpIHtcblxuICAgIH1cblxuICAgIGVkaXRQcm9ncmVzcygpIHtcblxuICAgIH1cblxuICAgIGVkaXROb3RlcygpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBnZW5lcmF0ZUlkKCkge1xuICAgICAgICByZXR1cm4gKytUYXNrLmxhc3RJZDtcbiAgICB9XG59XG5cbmNsYXNzIFN1YnRhc2tMaXN0IHtcbiAgICBzdWJ0YXNrcztcblxuICAgIGNvbnN0cnVjdG9yKF9zdWJ0YXNrcykge1xuICAgICAgICB0aGlzLnN1YnRhc2tzID0gX3N1YnRhc2tzIHx8IG51bGw7XG4gICAgfVxuXG4gICAgc29ydCgpIHtcblxuICAgIH1cblxuICAgIGFkZChfdGFzaykge1xuICAgICAgICB0aGlzLnN1YnRhc2tzLnB1c2goX3Rhc2spO1xuICAgIH1cblxuICAgIC8vIERvZXMgcmVtb3ZhbCBmcm9tIHRoZSBzdWJ0YXNrIGxpc3QgaW1wbHkgZnVsbCBkZWxldGlvbj9cbiAgICByZW1vdmUoX2lkKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJ0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3VidGFza3NbaV0uaWQgPT0gX2lkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJ0YXNrc1tpXS5zdXBlcnRhc2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3VidGFza3MucmVtb3ZlW2ldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhhc1N1YnRhc2tzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJ0YXNrcy5sZW5ndGggPj0gMTtcbiAgICB9XG59XG5cbmxldCB0b3BMZXZlbFRhc2tzID0gWyBuZXcgVGFzayhudWxsLCBcIlRlc3QgVGFza1wiKSBdO1xuY29uc29sZS5sb2codG9wTGV2ZWxUYXNrcyk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
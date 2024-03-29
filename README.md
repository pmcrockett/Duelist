# Duelist

![Duelist](/images/duelist1.jpg?raw=true "Duelist")

Live version at https://pmcrockett.github.io/Duelist

Duelist is a JavaScript-based todo list that uses a folder-like structure so tasks can be nested. It automatically saves its state to the browser's local storage.

Right-click (or double-tap on mobile) to bring up a menu for adding, deleting, copying, and pasting tasks. A task can be edited by clicking the pencil button that appears when hovering over its header. Multiple tasks can be selected for copying or deleting by holding ctrl (add to selection) or shift (contiguous select).

Holding ctrl while expanding a subtask list will expand all nested subtasks in the hierarchy.

The *Set progress from subtasks* option automatically manages a task's progress state by considering its subtasks' progress. If no subtasks have been started, the task will be listed as *Not started*; if all subtasks are complete, the task will be listed as *Complete*; and any other state will be listed as *In progress*. Subtasks that have no progress state (*N/A*) aren't considered in the calculation.

If it is not being set from subtasks, the progress state of a task can be quickly changed by clicking the progress icon on the task's header.
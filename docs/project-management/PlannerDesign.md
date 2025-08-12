Create a fully functional and interactive, drag and drop capable, move planner feature, designed with a customizable Kanban-style Trello inspired UI. This feature should be pre-populated with tasks from the moveplannerchecklist document.
The UI should be divided into two main sections: a persistent Checklist of Tasks organized within their respective categories to the left and the main Planning Board on the right.

1. Main Planning Board
This is the central interactive area, organized into vertical frames representing different timeframes.
•	Customizable Lists:
o	The board should start with default lists with titles based on the timeline headers in the checklist doc
o	Include a button labeled "+ Add another timeframe" that allows users to create new custom lists on the board.
o	Each list should be a droppable area for task cards.
•	Timeline Frames (Timeframes):
o	Each frame represents a timeframe and should be customizable.
o	Each frame must display the following elements:
	TimeFrame: The title based on where the tasks fall within the checklist doc (e.g., 8 weeks before move, 3 days before move, move day, etc.)
	Task Cards: an individual card for each task with a clickable check box
	Sub-task Icon & Functionality: An icon indicating the presence of sub-tasks. Clicking this icon should toggle the visibility of a sub-task checklist within the card. For example, the "Configure App Settings" card should have sub-tasks like "Set up owners/spaces with color coding" and "Configure preferences for notifications."
	Custom Tags: Allow for user-defined, color-coded tags to be added to a card (e.g., a blue "Application" tag).
	Priority Tags: Display a clear, color-coded priority level (e.g., a red "Pretty High" tag).
	Status Tags: Show the current status of the task (e.g., a yellow "Status: To-Do" tag).
	Member Assigned: An icon or avatar representing the team member assigned to the task.

2. Left-Side Panel: Checklist of Tasks
This panel serves as a master list or backlog of all tasks from the moveplanchecklist document
•	Structure: This should be a simple, scrollable list of tasks with the same design style as the previous section.
•	Functionality:
o	Users must be able to drag any task from this checklist and drop it onto any of the Frames on the main Planning Board, which will create a new Timeline Card for that task.
o	The original checklist on the left should remain housed, with a strikethrough indicator, when a task is dragged from it.
3. Overall Functionality & Style
•	Toggleable Checklists: The entire left-side panel should be collapsable for visibility, allowing the user to hide or show the master "Checklist of Tasks" to maximize board space.
•	Aesthetics: The visual design components should closely match the provided Planner Page Markup.jpg, featuring the apps color palette  with the exception of the custom coloring options for Frames and tags.
•	Interactivity: All dragging and dropping, button clicks, and toggling should be smooth and intuitive.

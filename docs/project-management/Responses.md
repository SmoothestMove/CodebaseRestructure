Questions for Clarification:

  1. Task Edit Button Design:
  - The button should be visible upon hovering of the Task Card (PC view), mobile view will still utilize the long-press to edit.
  - Only on hover (in PC view; integrate an option that implies a long-press to edit for mobile view)
  - To the right of the Task Card centered.

  2. Modal Enhancement Priority:
  - Custom fields (the timeline and task list housing cards (the grey backgrounds) are not a design intent, the grey was chosen due to it being neutral) 
  - Not at the moment, however each option should allow for user customization (adding a label, choosing its color, etc.) and should, by default, include:
1. Priority 
•	High
•	Medium
•	Low
•	Critical
2. Label 
•	Packing & Organizing
•	Logistics & Transportation
•	Cleaning & Maintenance
•	Utilities & Services
•	Inventory & Documentation
3. Risk 
•	Low Risk
•	Moderate Risk
•	High Risk
4. Status (Standard Task Status Options)
•	Not Started
•	In Progress
•	Completed
•	Blocked/Pending
•	Cancelled
  - The modal should offer the same options to the user that the image displays:
Main Task Actions:
•	Overall Task: A circle checkbox next to the task title to mark the task as complete and the clickable title to change the task title itself.
•	+ Add: An option to add additions to the labels, dates, checklist, members, and create a custom: 
o	Checkbox
o	Date
o	Dropdown
o	Number
o	Text
•	Labels: An option to add labels or tags.
•	Dates: An option to set dates (e.g., due date).
•	Checklist: An option to add a checklist to the task.
•	Members: An option to assign members to the task.
Task Details:
•	Description: A text box to add a more detailed description of the task.
Custom Fields: This section allows for adding specific, structured information.
•	Priority: A dropdown menu to select the task's priority level.
•	Status: A dropdown menu to select the current status of the task.
•	Risk: A dropdown menu to select the risk level associated with the task.
•	Effort: An input field to specify the effort required for the task.
•	Edit: A button to edit the custom fields themselves.

  3. Interaction Behavior:
  - Clicking the card body should bring up a TaskDetails modal that displays the data regarding the task as a whole (e.g., displays the tasks checklist if applicable, the descriptions, any additional notes, etc.) where as the task card itself only uses icon indicators to reflect that the additional information (a checklist, description, notes, etc.) exists.
  - Use standard conventions, maintain consistency for user appeal.
  - Due to the potentially large amount of information that can be in the modal, a whole page version for mobile may be ideal. 

  4. Custom Fields Configuration:
  - Per move, due to it being a consumer level application, each user is assigned their own move in the database unless joined using a pre-existing MoveID. Defaults are universal, any and all customizations and personalizations should be maintained within the specific move in which they were made.
  - yes
  - Use best judgement

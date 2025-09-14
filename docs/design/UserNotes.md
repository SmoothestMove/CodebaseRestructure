Planner Notes

[ ] Task Details Modal

    [X] Assignments: The assignment feature for tasks should allow users to assign tasks to:

        [X] Members: Any participant in a move can be assigned a task.

        [X] Owners: Any created owner can be assigned to a task.

        [X] Spaces: Rooms can be assigned to a task.

    [ ] Non-Exclusive Assignments: Assignments are not exclusive; any combination of the three assignees (Members, Owners, and Spaces) can be assigned to a single task.

    [ ] Task Cards (Task List & Timeline)

        [ ] Functionality: Clicking or tapping an empty space within a Task Card should open the details modal, allowing the user to edit the task.

        [ ] Visuals: When assigned, the Owner and Spaces icons should be colored with their corresponding color (for the owner or communal room assigned).

        [ ] Icons: A Task Card with assignments has a Member avatar in the upper-right corner. The Spaces icon is in the bottom-right, with the Owners icon above it.

    [ ] Frame Headers

        [ ] Functionality: The same functionality for empty space on Frame Headers (opening the FrameHeaderModal) exists as with Task Cards. The Frame Title and sub-title should also be editable if a user taps directly on the text.

    [ ] Add Tasks

        [ ] Functionality: When a user adds a task, either to the Task List or the Timeline, the Task Details modal should display. This allows the user to properly create a new task instead of just adding an empty card.

    [ ] Add Frame

        [ ] Functionality: The rightmost spot on the Timeline should always be an "Add Frame" button. When a new Frame is created, a "Frame Header Modal" should display, allowing the user to create the Frame's title, sub-title, and color.

    [ ] Task List

        [ ] Functionality: The Task List should have a button at the top that allows the user to collapse (><) and expand (<>) the list. This provides additional space to view and modify tasks on the Timeline.

Dashboard

    [ ] Dashboard Overhaul: The Dashboard needs a complete design and functionality overhaul. It should provide an overview of all data within the app, designed to give insight into the most important information from each feature.

    [ ] Box Packing Progress: A stacked area chart at the top displaying the overall and individual progress of packing.

    [ ] Box Statuses: A stacked progress bar below the area chart showing the statuses of all boxes in the database, with overall and individual options.

    [ ] Spaces and Boxes: A dynamic bento grid of cards displaying the spaces and the number of boxes each space contains.

        [ ] The card sizes should dynamically change based on the number of boxes in each space.

        [ ] The more boxes, the larger the card.

    [ ] Truck Load Overview: If inventory is being loaded into the truck, an overview of the Truck Layout should be shown. This display should include the number of boxes in each zone and who they belong to (based on Owner color).

    [ ] Budget Overview: The dashboard budget should provide an overview of expenses.

Overall Design Notes

    [ ] Responsive/Mobile-First Design: The app needs an overhaul with a responsive/mobile-first design foundation.

    [ ] Bottom Navigation Bar: The bottom navigation bar needs to be changed.

        [ ] There should be five overall buttons.

        [ ] The middle button should be the scanner button.

        [ ] The other four buttons should be UI-appropriate categorical top-level buttons. The sub-level buttons will be the routes to the various features and pages of the app.
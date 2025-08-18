You are an expert UI developer. Your task is to design and implement the UI based on Trello’s Kanban board but with specific changes and pre-defined content described below. 
GOALS
- Implement a Kanban-style Planner with Frames (columns) representing moving timeline stages.
- Keep Trello-like card features (labels/tags, checklists, assignments, attachments, comments, due/start dates, custom fields, covers).
- Include a persistent "Task List" column on the far left containing all available tasks. Users drag tasks from Task List into a Frame to assign them to that timeframe (or use a long-press for options popup including a move to option)
- Default Frames and Tasks must be created automatically for a new move.

UI STRUCTURE & DEFAULT FRAMESET
- Board layout: horizontal scrollable Frames, Task List pinned far left.
- Each Frame: title, color coding, date range (relative to move date), progress indicator.
- Default Frames (order left → right, with example relative offsets from Move Day):
  1. App Setup & Initial Planning (**Immediately**)
  2. 8 Weeks: Planning, Purging & Well-being (**-8 weeks**)
  3. 7 Weeks: Supplies & Equipment (**-7 weeks**)
  4. 6 Weeks: Logistics & Records (**-6 weeks**)
  5. 5 Weeks: Packing (**-5 weeks**)
  6. 4 Weeks: Admin & Appointments (**-4 weeks**)
  7. 2–3 Weeks: Confirmations & Final Prep (**-3 weeks to -2 weeks**)
  8. 1 Week: Home Stretch (**-1 week**)
  9. Day Before Move (**-1 day**)
  10. Move Day (**0 days**)
  11. Post-Move (**+1 day to +1 month**)
- Allow user customization of frame count, names, and date ranges, but these are the defaults for new moves.

DEFAULT TASK SET
- All new moves populate Task List with all tasks from the categories below, tagged with their intended default Frame. Tasks are preassigned but allows for full customization.

1. **App Setup & Initial Planning**
   - Get Comfortable with the App
   - Configure App Settings
   - Assess Your DIY Move Capacity
   - Define Spaces & Create Owners
   - Generate & Test Your Move ID
   - Invite & Onboard Helpers
   - Verify Scanning Functionality
   - Establish Your Moving Budget
   - Set Up Your Timeline & Calendar
   - Consider Backup Plans

2. **8 Weeks: Planning, Purging & Well-being**
   - Address the Emotional Side of Moving
   - Declutter Every Room
   - Pay Up Bills & Debts
   - Determine Required Truck Size
   - Research Rental Truck Companies
   - Gather Quotes for Truck Rentals
   - Outline Your Packing Strategy
   - Schedule High-Demand Appointments
   - Identify & Plan for Non-Allowable Items
   - Create a Preliminary Floor Plan

3. **7 Weeks: Supplies & Equipment**
   - Purchase Packing Materials
   - Source Free Boxes (Optional)
   - Rent or Buy Moving Equipment
   - Prep Your Packing Stations
   - Begin Selling & Donating Items
   - Be Charitable

4. **6 Weeks: Logistics & Records**
   - Reserve Your Moving Truck
   - Back Up Digital Files
   - Organize Vital Documents
   - Apply for Parking Permits
   - Reserve Elevators & Loading Docks
   - Obtain Medical & Prescription Records
   - Transfer School Records
   - Notify Landlord & Review Lease
   - Finalize Pet Logistics

5. **5 Weeks: Packing**
   - Begin Packing Non-Essential Areas
   - Label & Inventory Every Box
   - Disassemble Large Furniture
   - Prepare Your Specialty Item Strategy
   - Use Up Perishable Items

6. **4 Weeks: Admin & Appointments**
   - File a Change of Address with USPS
   - Update Your Address with Key Institutions
   - Transfer or Cancel Memberships
   - Schedule Utility Services
   - Return All Borrowed Items
   - Arrange Childcare & Pet Care for Move Day
   - Schedule Move-Out Repairs & Cleaning
   - Plan Your Farewells

7. **2–3 Weeks: Confirmations & Final Prep**
   - Confirm All Reservations
   - Measure Critical Pathways
   - Finalize Your Furniture Placement Plan
   - Dispose of Hazardous Materials
   - Have Your Car Serviced
   - Plan Your Travel & Truck Route
   - Pack All Non-Essential Items
   - Pack an "Essentials" Box
   - Secure Valuables & Important Documents

8. **1 Week: Home Stretch**
   - Finalize Plans with Helpers
   - Pack Remaining Belongings
   - Remove Wall Hangings & Patch Holes
   - Deep Clean Your Home
   - 1 Day Out (Defrost fridge, last items, load personal vehicle)

9. **Day Before Move**
   *(If not merged into “1 Week” tasks, treat as own Frame for short-term to-do)*

10. **Move Day**
    - Get a Good Night’s Sleep & Start Early
    - Dress Appropriately
    - Pick Up the Truck
    - Ensure Safety
    - Load the Truck Correctly
    - Final Walkthrough & Security Check
    - Arrival & Unloading
    - Post-Unload

11. **Post-Move**
    - First 72 Hours: Check Utilities, Scan Boxes, Unpack High-Priority Rooms, Tend to Pets, Childproof Home, Break Down Boxes
    - First 2 Weeks: Update Registrations & Address, Establish Healthcare & Schooling, Secure New Home, Finalize Budget
    - First Month & Beyond: Explore & Connect, Throw Housewarming Party, Review Your DIY Moving Experience

UX FLOW
1. **Task Sourcing**: All default and custom tasks appear in Task List initially. Templates can be cloned; original remains in Task List but receives a strikethrough when listed within a Frame.
2. **Assigning Tasks**: Drag (or long-press move) from Task List to Frame  → automatically set start/due dates to frame range unless manually overridden.
3. **Editing**: Cards can be opened to edit title, description, checklist, attachments, tags, assignees, dates, recurrence.
4. **Automation**: Moving a card into “Move Day” or “1 Week” triggers related automation (packing checklist, notifications).
5. **Progress Tracking**: Frames show percent complete based on checklists + card completion.
/
> This repository was built upon a mock-project template.
> You can see in `TODO.md` that there were a series of tasks given to be completed.
>
> All the tasks are complete in this project workspace!
> I had a lot of fun completing these tasks on my own and tweaking the codebase, to help practice and showcase my skills.

# Volunteering System
This project is designed to match volunteers up with different tasks for a volunteering event.
The system takes in a list of volunteer data, and a list of task data, in order to accomplish this.
The data is parsed and fed through an algorithm to maximize volunteer satisfaction rates.

## How to Run
Download the code, and then run:
1. `npm install`
1. `npm start`

## How to Use
### Input Values
The input values can all be found in the csv files.
Navigate to `./src/data/` in order to view all the task and volunteer input data!

### Terminal Output
When you run the script, data is output in your terminal.

<details><summary>Here is an example of the output...</summary>

~~~md
Task #1: Get Supplies
        Assigned to Volunteer #1: Mike

Task #2: Bring Snacks
        Assigned to Volunteer #9: Alice

Task #3: Volunteer Check-in
        Assigned to Volunteer #8: Cindy
        Assigned to Volunteer #9: Alice
        Assigned to Volunteer #7: Bobby

Task #4: Separate Recyclables
        Assigned to Volunteer #7: Bobby

Task #5: Haul Trash
        Assigned to Volunteer #4: Marcia

Task #6: Haul Recyclables
        Assigned to Volunteer #3: Greg

Task #7: First Aid
        Assigned to Volunteer #6: Jan
        Assigned to Volunteer #2: Carol

Task #8: After Party Coordination
        Assigned to Volunteer #6: Jan

Task #9: Transportation
        Assigned to Volunteer #2: Carol
        Assigned to Volunteer #1: Mike

Task #10: Playground Repair
        Assigned to Volunteer #3: Greg

Task #11: Green Thumb
        Assigned to Volunteer #1: Mike

Task #12: Mowing
        Assigned to Volunteer #3: Greg

Task #13: Edging
        Assigned to Volunteer #5: Peter

Task #14: Get Donated Plants
        Assigned to Volunteer #2: Carol
        Assigned to Volunteer #6: Jan

Task #15: Paparazzi
        Assigned to Volunteer #4: Marcia
        Assigned to Volunteer #8: Cindy

Task #16: Social Media Guru
        Assigned to Volunteer #4: Marcia
        Assigned to Volunteer #7: Bobby

Satisfaction Score: 51
~~~

</details>

This data shows which tasks are assigned to which volunteers, plus a heuristic ranking the overall satisfaction score.

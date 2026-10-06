import type {Task} from './task.mts'
import type {Volunteer} from './volunteer.mts'

class AssignmentServer {
	tasks: Record<number, Task>
	volunteers: Record<number, Volunteer>
	assignments: Map<Task, Volunteer>

	constructor(
		tasks: Record<number, Task>,
		volunteers: Record<number, Volunteer>,
	) {
		this.tasks = tasks
		this.volunteers = volunteers
		this.assignments = new Map( )
	}

	/**
	 * Returns a list of volunteers who are interested in the given task.
	 */
	getInterestedVolunteers(task: Task): Volunteer[ ] {
		return Object.values(this.volunteers).filter((volunteer) => {
			return volunteer.isInterested(task)
		})
	}

	/**
	 * Assigns a volunteer to each task based on their interests.
	 */
	assignTasks( ) {
		for (const task of Object.values(this.tasks)) {
			const interestedVolunteers = this.getInterestedVolunteers(task)
			const allVolunteers = Object.values(this.volunteers)
			let volunteer
			if (interestedVolunteers.length > 0) {
				volunteer = interestedVolunteers[0]
			} else {
				volunteer = allVolunteers[0]
			}
			if (volunteer == null) {
				throw new Error('A task remained unassigned.')
			}
			this.assignments.set(task, volunteer)
		}
	}

	/**
	 * Prints assignments of volunteers to tasks.
	 */
	printAssignments( ) {
		for (const task of Object.values(this.tasks)) {
			const assignee = this.assignments.get(task)
			console.log(`${task}`)
			if (assignee !== undefined) {
				console.log(`\tAssigned to ${assignee}`)
			} else {
				console.log('\tUnassigned')
			}
			console.log( )
		}
	}
}

export {AssignmentServer}

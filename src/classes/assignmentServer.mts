import type {Task} from './task.mts'
import type {Volunteer} from './volunteer.mts'

class AssignmentServer {
	tasksById: Record<number, Task>
	volunteersById: Record<number, Volunteer>
	assignments: Map<Task, Volunteer[ ]>

	constructor(
		tasksById: Record<number, Task>,
		volunteersById: Record<number, Volunteer>,
	) {
		this.tasksById = tasksById
		this.volunteersById = volunteersById
		this.assignments = new Map( )
	}

	get tasks( ) {return Object.values(this.tasksById)}
	get volunteers( ) {return Object.values(this.volunteersById)}

	get assignees( ): Map<Volunteer, Task[ ]> {
		const allAssignees = new Map<Volunteer, Task[ ]>( )
		for (const [task, assignees] of this.assignments.entries( )) {
			for (const assignee of assignees) {
				const assignments = allAssignees.get(assignee) ?? [ ]
				assignments.push(task)
				allAssignees.set(assignee, assignments)
			}
		}
		return allAssignees
	}

	/**
	 * Returns a list of volunteers who are interested in the given task.
	 */
	getInterestedVolunteers(task: Task): Volunteer[ ] {
		return this.volunteers.filter((volunteer) => {
			return volunteer.isInterested(task)
		})
	}

	/**
	 * Returns the overall satisfaction rating for all volunteers in the server.
	 */
	getSatisfactionScore( ): number {
		let score = 0
		for (const [volunteer, tasks] of this.assignees.entries( )) {
			score += volunteer.getSatisfactionScore(tasks)
		}
		return score
	}

	/**
	 * Assigns a volunteer to each task based on their interests.
	 */
	assignTasks( ) {
		for (const task of this.tasks) {
			const interestedVolunteers = this.getInterestedVolunteers(task)
			let volunteer
			if (interestedVolunteers.length > 0) {
				volunteer = interestedVolunteers[0]
			}
			else {
				volunteer = this.volunteers[0]
			}
			if (volunteer == null) {
				throw new Error('A task remained unassigned.')
			}
			this.assignments.set(task, [volunteer])
		}
	}

	/**
	 * Prints assignments of volunteers to tasks.
	 */
	printAssignments( ) {
		for (const task of this.tasks) {
			const assignees = this.assignments.get(task)
			console.log(`${task}`)
			if (assignees !== undefined && assignees.length > 0) {
				for (const assignee of assignees) {
					console.log(`\tAssigned to ${assignee}`)
				}
			}
			else {
				console.log('\tUnassigned')
			}
			console.log( )
		}
		console.log(`Satisfaction Score: ${this.getSatisfactionScore( )}`)
	}
}

export {AssignmentServer}

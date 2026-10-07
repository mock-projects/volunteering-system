import type {Task} from './task.mts'
import type {Volunteer} from './volunteer.mts'

class AssignmentServer {
	tasksById: Record<number, Task>
	volunteersById: Record<number, Volunteer>

	constructor(
		tasksById: Record<number, Task>,
		volunteersById: Record<number, Volunteer>,
	) {
		this.tasksById = tasksById
		this.volunteersById = volunteersById
	}

	get tasks( ) {return Object.values(this.tasksById)}
	get volunteers( ) {return Object.values(this.volunteersById)}

	/**
	 * Returns a list of tasks that were assigned to specified volunteer.
	 */
	getAssignedTasks(volunteer: Volunteer): Task[ ] {
		return this.tasks.filter((task) => {
			return task.assignees.includes(volunteer)
		})
	}

	/**
	 * Returns a list of volunteers who are interested in the given task.
	 */
	getInterestedVolunteers(task: Task): Volunteer[ ] {
		return this.volunteers.filter((volunteer) => {
			return volunteer.interestedTasks.includes(task)
		})
	}

	/**
	 * Returns a number representing how satisfied a volunteer would be,
	 * given a list of unique tasks that they are assigned.
	 */
	getSatisfactionLevel(volunteer: Volunteer, desiredMaxLoad?: number): number {
		const assignedTasks = this.getAssignedTasks(volunteer)

		let score: number = 0
		assignedTasks.forEach((task) => {
			score += volunteer.getTaskDesirabilityScore(task)
		})

		if (!desiredMaxLoad) return score

		// If there is a desired max load of tasks for this volunteer,
		// then add a penalty for crossing that threshold.
		const numOverloaded = assignedTasks.length - desiredMaxLoad
		if (numOverloaded > 0) score -= numOverloaded
		return score
	}

	/**
	 * Returns the overall satisfaction rating for all volunteers in the server.
	 */
	getOverallSatisfactionLevel( ): number {
		// Penalize the score of volunteers who get assigned too many tasks.
		const maxTaskLoad = Math.ceil(this.tasks.length / this.volunteers.length)

		let score = 0
		for (const volunteer of this.volunteers) {
			score += this.getSatisfactionLevel(volunteer, maxTaskLoad)
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
			task.assignees.push(volunteer)
		}
	}

	/**
	 * Prints assignments of volunteers to tasks.
	 */
	printAssignments( ) {
		for (const task of this.tasks) {
			const assignees = task.assignees
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
		console.log(`Satisfaction Score: ${this.getOverallSatisfactionLevel( )}`)
	}
}

export {AssignmentServer}

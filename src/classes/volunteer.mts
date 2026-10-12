import type {AssignmentServer} from './assignmentServer.mts'
import type {Task} from './task.mts'

class Volunteer {
	event: AssignmentServer
	id: number
	name: string
	interestedTasks: Task[ ]
	#maxTaskWorkload: number | null

	constructor(event: AssignmentServer, id: number, name: string, maxTaskWorkload?: number) {
		this.event = event
		this.id = id
		this.name = name
		this.interestedTasks = [ ]
		this.#maxTaskWorkload = maxTaskWorkload ?? null
	}

	/**
	 * Returns a number representing how many tasks that a
	 * volunteer would like to be assigned to, at maximum.
	 */
	maxTaskWorkload( ) {
		// Checks if there is already a maximum registered to the user.
		if (this.#maxTaskWorkload != null) return this.#maxTaskWorkload

		// Calculates a sensible default maximum number of tasks.
		const numVolunteers = this.event.volunteers.length
		const numTaskSlots = this.event.tasks.reduce((openSlots, task) => {
			return openSlots + task.volunteersNeeded
		}, 0)
		return Math.ceil(numTaskSlots / numVolunteers)
	}

	/**
	 * Returns a list of tasks that were assigned to this volunteer.
	 */
	getAssignedTasks( ): Task[ ] {
		return this.event.tasks.filter((task) => {
			return task.assignees.has(this)
		})
	}

	countAssignedTasks( ) {
		return this.getAssignedTasks( ).length
	}

	getAvailability( ) {
		return Math.max(0, this.maxTaskWorkload( ) - this.countAssignedTasks( ))
	}

	hasAvailability( ) {
		return this.getAvailability( ) > 0
	}

	/**
	 * Returns a number representing how desirable the given
	 * task is to this volunteer.
	 */
	getTaskDesirabilityScore(task: Task): number {
		// Obtain the index of the task from the list.
		const taskIndex = this.interestedTasks.indexOf(task)
		if (taskIndex === -1) return -1
		else return Math.max(4 - taskIndex, 1)
	}

	/**
	 * Returns a number representing how satisfied a volunteer would be,
	 * given a list of unique tasks that they are assigned.
	 */
	getSatisfactionScore(desiredMaxLoad?: number): number {
		const assignedTasks = this.getAssignedTasks( )

		let score: number = 0
		assignedTasks.forEach((task) => {
			score += this.getTaskDesirabilityScore(task)
		})

		if (!desiredMaxLoad) return score

		// If there is a desired max load of tasks for this volunteer,
		// then add a penalty for crossing that threshold.
		const numOverloaded = assignedTasks.length - desiredMaxLoad
		if (numOverloaded > 0) score -= numOverloaded
		return score
	}

	toString( ): string {
		return `Volunteer #${this.id}: ${this.name}`
	}
}

export {Volunteer}

import type {Task} from './task.mts'

class Volunteer {
	id: number
	name: string
	interestedTasks: Task[ ]

	constructor(id: number, name: string) {
		this.id = id
		this.name = name
		this.interestedTasks = [ ]
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

	toString( ): string {
		return `Volunteer #${this.id}: ${this.name}`
	}
}

export {Volunteer}

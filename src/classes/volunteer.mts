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

	toString( ): string {
		return `Volunteer #${this.id}: ${this.name}`
	}

	addInterestedTask(task: Task) {
		this.interestedTasks.push(task)
	}

	removeInterestedTask(task: Task) {
		const taskIndex = this.interestedTasks.indexOf(task)
		if (taskIndex >= 0) {
			this.interestedTasks.splice(taskIndex, 1)
		}
	}

	isInterested(task: Task): boolean {
		return this.interestedTasks.includes(task)
	}
}

export {Volunteer}

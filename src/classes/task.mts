import type {Volunteer} from './volunteer.mts'

class Task {
	id: number
	name: string
	description: string
	assignees: Volunteer[ ]

	constructor(id: number, name: string, description: string) {
		this.id = id
		this.name = name
		this.description = description
		this.assignees = [ ]
	}

	toString( ) {
		return `Task #${this.id}: ${this.name}`
	}
}

export {Task}

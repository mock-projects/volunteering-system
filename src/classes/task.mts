import type {Volunteer} from './volunteer.mts'

class Task {
	id: number
	name: string
	description: string
	volunteersNeeded: number
	assignees: Set<Volunteer>

	constructor(
		id: number,
		name: string,
		description: string,
		volunteersNeeded: number,
	) {
		this.id = id
		this.name = name
		this.description = description
		this.volunteersNeeded = volunteersNeeded
		this.assignees = new Set( )
	}

	toString( ) {
		return `Task #${this.id}: ${this.name}`
	}
}

export {Task}

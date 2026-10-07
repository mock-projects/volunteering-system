import type {AssignmentServer} from './assignmentServer.mts'
import type {Volunteer} from './volunteer.mts'

class Task {
	event: AssignmentServer
	id: number
	name: string
	description: string
	volunteersNeeded: number
	assignees: Set<Volunteer>

	constructor(
		event: AssignmentServer,
		id: number,
		name: string,
		description: string,
		volunteersNeeded: number,
	) {
		this.event = event
		this.id = id
		this.name = name
		this.description = description
		this.volunteersNeeded = volunteersNeeded
		this.assignees = new Set( )
	}

	/**
	 * Returns a list of volunteers who are interested in the given task.
	 */
	getInterestedVolunteers( ): Volunteer[ ] {
		return this.event.volunteers.filter((volunteer) => {
			return volunteer.interestedTasks.includes(this)
		})
	}

	/**
	 * Returns a sorted list of volunteers,
	 * based on how interested they are in the given task.
	 */
	getVolunteersByInterestLevel( ): Volunteer[ ] {
		return this.event.volunteers.sort((vol01, vol02) => {
			const score01 = vol01.getTaskDesirabilityScore(this)
			const score02 = vol02.getTaskDesirabilityScore(this)
			return score02 - score01
		})
	}

	toString( ) {
		return `Task #${this.id}: ${this.name}`
	}
}

export {Task}

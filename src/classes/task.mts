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

	get openSlots( ) {
		return Math.max(0, this.volunteersNeeded - this.assignees.size)
	}

	get hasOpenSlots( ) {
		return this.openSlots > 0
	}

	/**
	 * Returns a score representing how popular a task currently is.
	 * This algorithm accounts for existing assignments.
	 * If a task's slots are full of volunteers already, it returns `NaN`.
	*/
	getPopularityScore( ): number {
		let score = 0

		// Add up the total desirabilty score for each volunteer.
		for (const volunteer of this.getInterestedVolunteers( )) {
			// Skip volunteers who are already assigned to the task.
			if (this.assignees.has(volunteer)) continue
			score += volunteer.getTaskDesirabilityScore(this)
		}

		// Divide the score by the number of open slots.
		score /= (this.volunteersNeeded - this.assignees.size)

		return score
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

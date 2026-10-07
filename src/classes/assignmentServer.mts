import type {Task} from './task.mts'
import type {Volunteer} from './volunteer.mts'

class AssignmentServer {
	#tasks: Set<Task>
	#volunteers: Set<Volunteer>

	constructor(
		tasks: Iterable<Task>,
		volunteers: Iterable<Volunteer>,
	) {
		this.#tasks = new Set(tasks)
		this.#volunteers = new Set(volunteers)
	}

	get tasks( ) {return [...this.#tasks]}
	get volunteers( ) {return [...this.#volunteers]}

	/**
	 * Returns a list of tasks that were assigned to specified volunteer.
	 */
	getAssignedTasks(volunteer: Volunteer): Task[ ] {
		return this.tasks.filter((task) => {
			return task.assignees.has(volunteer)
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
	 * Returns a sorted list of tasks,
	 * with more-popular tasks appearing at the front.
	 */
	getTasksByPopularityLevel( ): Task[ ] {
		return this.tasks.sort((task01, task02) => {
			let score01 = 0
			let score02 = 0

			for (const volunteer of task01.assignees) {
				score01 += volunteer.getTaskDesirabilityScore(task01)
			}
			for (const volunteer of task02.assignees) {
				score02 += volunteer.getTaskDesirabilityScore(task02)
			}

			score01 /= task01.volunteersNeeded
			score02 /= task02.volunteersNeeded

			return score02 - score01
		})
	}

	/**
	 * Returns a sorted list of volunteers,
	 * based on how interested they are in the given task.
	 */
	getVolunteersByInterestLevel(task: Task): Volunteer[ ] {
		return this.volunteers.sort((vol01, vol02) => {
			const score01 = vol01.getTaskDesirabilityScore(task)
			const score02 = vol02.getTaskDesirabilityScore(task)
			return score02 - score01
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
		// Sort tasks by popularity (less-popular tasks appear first).
		let sortedTasks = this.getTasksByPopularityLevel( ).reverse( )
		const popularTasks = sortedTasks.filter((task) => (
			this.getInterestedVolunteers(task).length > 0
		))
		const unpopularTasks = sortedTasks.filter((task) => (
			this.getInterestedVolunteers(task).length <= 0
		))
		// Less-popular tasks appear first, but zero-interest tasks appear last.
		sortedTasks = [...popularTasks, ...unpopularTasks]

		// Loop over each task and assign volunteers.
		for (const task of sortedTasks) {
			const volunteerCandidates = this.getVolunteersByInterestLevel(task)
			if (task.volunteersNeeded > volunteerCandidates.length) {
				throw new Error('A task needs too many volunteers.')
			}
			const volunteers = volunteerCandidates.slice(0, task.volunteersNeeded)
			for (const volunteer of volunteers) task.assignees.add(volunteer)
		}
	}

	/**
	 * Prints assignments of volunteers to tasks.
	 */
	printAssignments( ) {
		for (const task of this.tasks) {
			const assignees = task.assignees
			console.log(`${task}`)
			if (assignees !== undefined && assignees.size > 0) {
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

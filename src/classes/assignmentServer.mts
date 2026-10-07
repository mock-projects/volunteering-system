import {loadTasks, loadVolunteers} from '../utilities/util.mts'
import type {Task} from './task.mts'
import type {Volunteer} from './volunteer.mts'

class AssignmentServer {
	#tasks: Set<Task>
	#volunteers: Set<Volunteer>

	constructor( ) {
		this.#tasks = new Set( )
		this.#volunteers = new Set( )
	}

	get tasks( ) {return [...this.#tasks]}
	get volunteers( ) {return [...this.#volunteers]}

	async loadCsvData(
		tasksCsvFilepath: string,
		volunteersCsvFilePath: string,
	) {
		this.#tasks = await loadTasks(this, tasksCsvFilepath)
		this.#volunteers = await loadVolunteers(this, volunteersCsvFilePath)
	}

	/**
	 * Returns a sorted list of tasks,
	 * with more-popular tasks appearing at the front.
	 */
	getTasksByPopularityLevel( ): Task[ ] {
		return this.tasks.sort((task01, task02) => {
			let score01 = 0
			let score02 = 0

			for (const volunteer of task01.getInterestedVolunteers( )) {
				score01 += volunteer.getTaskDesirabilityScore(task01)
			}
			for (const volunteer of task02.getInterestedVolunteers( )) {
				score02 += volunteer.getTaskDesirabilityScore(task02)
			}

			score01 /= task01.volunteersNeeded
			score02 /= task02.volunteersNeeded

			return score02 - score01
		})
	}

	/**
	 * Returns the overall satisfaction rating for all volunteers in the server.
	 */
	getOverallSatisfactionScore( ): number {
		// Penalize the score of volunteers who get assigned too many tasks.
		const maxTaskLoad = Math.ceil(this.tasks.length / this.volunteers.length)

		let score = 0
		for (const volunteer of this.volunteers) {
			score += volunteer.getSatisfactionScore(maxTaskLoad)
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
			task.getInterestedVolunteers( ).length > 0
		))
		const unpopularTasks = sortedTasks.filter((task) => (
			task.getInterestedVolunteers( ).length <= 0
		))
		// Less-popular tasks appear first, but zero-interest tasks appear last.
		sortedTasks = [...popularTasks, ...unpopularTasks]

		// Loop over each task and assign volunteers.
		for (const task of sortedTasks) {
			const volunteerCandidates = task.getVolunteersByInterestLevel( )
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
		console.log(`Satisfaction Score: ${this.getOverallSatisfactionScore( )}`)
	}
}

export {AssignmentServer}

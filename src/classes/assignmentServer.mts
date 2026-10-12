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
			return task02.getPopularityScore( ) - task01.getPopularityScore( )
		})
	}

	getVolunteersByAvailability( ): Volunteer[ ] {
		return this.volunteers.toSorted((vol01, vol02) => {
			const availability01 = vol01.getAvailability( )
			const availability02 = vol02.getAvailability( )
			// Volunteers with higher availability appear first.
			if (availability01 !== availability02) return availability01 - availability02

			const score01 = vol01.getSatisfactionScore( )
			const score02 = vol02.getSatisfactionScore( )
			return score01 - score02 // Higher satisfaction first, as tiebreaker.
		})
	}

	/**
	 * Returns the overall satisfaction rating for all volunteers in the server.
	 */
	getOverallSatisfactionScore( ): number {
		let score = 0
		for (const volunteer of this.volunteers) {
			score += volunteer.getSatisfactionScore( )
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

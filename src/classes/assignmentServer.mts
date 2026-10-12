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
		return this.tasks.toSorted((task01, task02) => {
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

		/*
		The intention of this loop is to:
		- loop over each "rank" of assignments, starting with #1.
		- find the most "unpopular" tasks, and assign volunteers to them.
		- Volunteers are sorted by (1) how many tasks they are assigned (lowest first),
			with (2) how many tasks they are interested in as a tiebreaker.
		- Volunteers who have a full schedule are skipped entirely.
		*/
		let sortedTasks = this.getTasksByPopularityLevel( ).reverse( )
		let interestIndex = 0

		while (this.volunteers.some((volunteer) => (
			volunteer.interestedTasks.length > interestIndex
		))) {
			// Find a volunteer with rank i for each task.
			for (const task of sortedTasks) {
				// Skip tasks that have no slots remaining.
				if (!task.hasOpenSlots) continue

				// Find the most interested, most available, pickiest volunteers.
				const volunteers = task.getVolunteersByInterestLevel( )
				const selectedVolunteer = volunteers.find((volunteer) => (
					!task.assignees.has(volunteer)
					&& volunteer.hasAvailability( )
					&& volunteer.interestedTasks.indexOf(task) === interestIndex
				))

				// Skip tasks without enough enthusiasm.
				if (selectedVolunteer == undefined) continue

				// Assign our top candidate.
				task.assignees.add(selectedVolunteer)
			}

			// Updated how popular tasks are after assignments.
			sortedTasks = this.getTasksByPopularityLevel( ).reverse( )
			interestIndex += 1
		}


		/*
		This loop will assign leftover tasks
		to the most available volunteers remaining.
		*/
		while (
			this.volunteers.some((volunteer) => (
				volunteer.hasAvailability( )
			))
			&& this.tasks.some((task) => (
				task.hasOpenSlots
			))
		) {
			for (const task of sortedTasks) {
				// Skip tasks that have no slots remaining.
				if (!task.hasOpenSlots) continue

				// Find the most available, happiest volunteers.
				const volunteers = this.getVolunteersByAvailability( )
				const selectedVolunteer = volunteers.find((volunteer) => (
					!task.assignees.has(volunteer)
					&& volunteer.hasAvailability( )
				))

				// Skip tasks that cannot be filled.
				if (selectedVolunteer == undefined) continue

				// Assign our top candidate.
				task.assignees.add(selectedVolunteer)
			}
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

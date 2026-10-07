import * as fs from 'fs'
import * as readline from 'readline'
import {Task} from '../classes/task.mts'
import {Volunteer} from '../classes/volunteer.mts'
import type {AssignmentServer} from '../classes/assignmentServer.mts'

type TaskCsvRow = [
	id: string,
	name: string,
	volunteersNeeded: string,
	description: string,
]

type VolunteerCsvRow = [id: string, name: string, interestedTasks: string]

const isTaskCsvRow = (fields: string[ ]): fields is TaskCsvRow => (
	fields.length >= 4
)

const isVolunteerCsvRow = (fields: string[ ]): fields is VolunteerCsvRow => (
	fields.length === 3
)

const loadTasks = async (event: AssignmentServer, filename: string) => {
	const tasks: Set<Task> = new Set( )

	const reader = readline.createInterface({
		input: fs.createReadStream(filename),
	})

	for await (const line of reader) {
		// CSV type guard
		const parsedLine = line.split(',')
		if (parsedLine.length <= 1) {
			continue // This was an empty row, we can throw it out.
		}
		else if (!isTaskCsvRow(parsedLine)) {
			throw new Error('Expected at least 4 task data fields.')
		}

		const taskId = parseInt(parsedLine[0])
		const name = parsedLine[1]
		const volunteersNeeded = parseInt(parsedLine[2])
		const description = parsedLine.slice(3).join(',')

		// Skip invalid task IDs.
		// This is usually just the first row in the CSV, since it's a header.
		if (isNaN(taskId)) continue

		// Create a new task given this data.
		tasks.add(new Task(event, taskId, name, description, volunteersNeeded))
	}

	return tasks
}

const loadVolunteers = async (event: AssignmentServer, filename: string) => {
	const tasks = event.tasks
	const volunteers: Set<Volunteer> = new Set( )

	const reader = readline.createInterface({
		input: fs.createReadStream(filename),
	})

	for await (const line of reader) {
		// CSV type guard
		const parsedLine = line.split(',')
		if (parsedLine.length <= 1) {
			continue // This was an empty row, we can throw it out.
		}
		else if (!isVolunteerCsvRow(parsedLine)) {
			throw new Error('Expected exactly 3 volunteer data fields.')
		}

		const volunteerId = parseInt(parsedLine[0])
		const name = parsedLine[1]
		// Entries after the second position in the CSV are task IDs.
		const taskIds = parsedLine[2]
			.split(' ')
			.map((id: string) => (parseInt(id)))
			.filter((id: number) => (!isNaN(id)))

		// Skip invalid volunteer IDs.
		// This is usually just the first row in the CSV, since it's a header.
		if (isNaN(volunteerId)) continue

		// Create a new volunteer and add interested tasks.
		const volunteer = new Volunteer(event, volunteerId, name)
		taskIds
			.map((taskId: number) => (tasks.find((task) => (task.id === taskId))))
			.filter((task): task is Task => (task !== undefined))
			.forEach((task: Task) => (volunteer.interestedTasks.push(task)))

		volunteers.add(volunteer)
	}

	return volunteers
}

export {loadTasks, loadVolunteers}

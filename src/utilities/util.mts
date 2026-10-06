import * as fs from 'fs'
import * as readline from 'readline'
import {Task} from '../classes/task.mts'
import {Volunteer} from '../classes/volunteer.mts'

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

const loadTasks = async (filename: string) => {
	const tasks: Record<number, Task> = { }

	const reader = readline.createInterface({
		input: fs.createReadStream(filename),
	})

	for await (const line of reader) {
		// CSV type guard
		const parsedLine = line.split(',')
		if (parsedLine.length <= 1) {
			continue // This was an empty row, we can throw it out.
		} else if (!isTaskCsvRow(parsedLine)) {
			throw new Error('Expected at least 4 task data fields.')
		}

		const taskId = parseInt(parsedLine[0])
		const name = parsedLine[1]
		const description = parsedLine.slice(3).join(',')

		// Skip invalid task IDs.
		// This is usually just the first row in the CSV, since it's a header.
		if (isNaN(taskId)) continue

		// Create a new task given this data.
		tasks[taskId] = new Task(taskId, name, description)
	}

	return tasks
}

const loadVolunteers = async (
	filename: string,
	tasks: Record<number, Task>,
) => {
	const volunteers: Record<number, Volunteer> = { }

	const reader = readline.createInterface({
		input: fs.createReadStream(filename),
	})

	for await (const line of reader) {
		// CSV type guard
		const parsedLine = line.split(',')
		if (parsedLine.length <= 1) {
			return // This was an empty row, we can throw it out.
		} else if (!isVolunteerCsvRow(parsedLine)) {
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
		const volunteer = new Volunteer(volunteerId, name)
		taskIds
			.map((taskId: number) => (tasks[taskId]))
			.filter((task): task is Task => (task !== undefined))
			.forEach((task: Task) => (volunteer.addInterestedTask(task)))

		volunteers[volunteerId] = volunteer
	}

	return volunteers
}

export {loadTasks, loadVolunteers}

import {AssignmentServer} from './classes/assignmentServer.mts'
import {loadTasks, loadVolunteers} from './utilities/util.mts'

const main = async ( ) => {
	const tasks = await loadTasks('src/data/tasks.csv')
	const volunteers = await loadVolunteers('src/data/volunteers.csv', tasks)
	const server = new AssignmentServer(tasks, volunteers)

	server.assignTasks( )
	server.printAssignments( )
}

void main( )

import {AssignmentServer} from './classes/assignmentServer.mts'

const main = async ( ) => {
	const server = new AssignmentServer( )
	await server.loadCsvData('src/data/tasks.csv', 'src/data/volunteers.csv')

	server.assignTasks( )
	server.printAssignments( )
}

void main( )

let grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');
let readline = require('readline');

let reader = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var proto = grpc.loadPackageDefinition(
	protoLoader.loadSync('../server-proto/proto/vacaciones.proto', {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	})
);

const REMOTE_URL = '0.0.0.0:50050';
let client = new proto.work_leave.EmployeeLeaveDaysService(
	REMOTE_URL,
	grpc.credentials.createInsecure()
);

let employee = {};

function makeQuestion(question) {
	return new Promise(resolve => {
		reader.question(question, answer => {
			resolve(answer);
		});
	});
}

async function getEmployeeData() {
	employee.id = await makeQuestion('enter your id: ');
	employee.name = await makeQuestion('enter your name: ');
	employee.accrued_leave_days = parseInt(
		await makeQuestion('enter your accured_leave_days: ')
	);
	employee.requested_leave_days = parseInt(
		await makeQuestion('enter your requested_leave_days: ')
	);
	console.log('\nemployee: ', employee);
	reader.close();
}

getEmployeeData().then(() => {
	client.grantLeave(employee, (err, res) => {
		console.log('\nResponse: ', res ? res : err);
	});
});

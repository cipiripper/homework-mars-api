import ApiServer from "./api-server";

function processFailure(error: Error) {
	console.error("Process failed due to unhandled exception or an unhandled rejection.");

	if (error) {
		console.error(error.stack);
	}

	process.exit(1);
}

process.on("unhandledRejection", processFailure);
process.on("unhandledError", processFailure);

const server = new ApiServer();
server.start();
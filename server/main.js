// import our dependencies
const
	express = require('express'),
	sqlite = require('sqlite3');

// a helper funcion to log server activity to the console with timestamps
function log(message) {
	const timestamp = new Date()
		.toISOString()
		.substr(0, 19);
	console.log(`${timestamp} ${message}`);
}

// open a connect to the database file using sqlite
const db = new sqlite
	.Database(
		// this argument specifies the database file location
		'server/database',
		// using this mode causes the program to throw an error if the file isn't found
		sqlite.OPEN_READWRITE
	)
	// enable foreign keys since they're disabled by default in sqlite
	.exec('PRAGMA foreign_keys = ON');

// set the port that the express web server will listen on
const port = 8081;

// configure the express server
express()
	// log every request
	.use((req, res, next) => {
		log(`[${req.method}] ${req.path}`);
		next();
	})
	// use the static middleware to serve the client application files from the client folder
	.use(express.static('client'))
	// use the json middleware to parse the json values sent from the client application
	.use(express.json())
	// return the categories from the database
	.get('/categories', (req, res) => {
		db.all(
			`SELECT
				id,
				name
			FROM
				category
			ORDER BY
				name`,
			[],
			(error, categories) => {
				res.json(categories);
			}
		);
	})
	// return the tasks from the database
	.get('/tasks', (req, res) => {
		db.all(
			`SELECT
				task.id,
				task.name,
				task.description,
				task.due_date,
				category.name AS category,
				category.color
			FROM
				task
				JOIN category ON (
					category.id = task.category_id
				)
			ORDER BY task.id DESC`,
			[],
			(error, tasks) => {
				res.json(tasks.map(task => ({
					...task,
					// we need to rename the property from due_date to dueDate to follow javascript
					// naming conventions and also convert the date into a friendlier human-readable
					// format
					dueDate: new Date(task.due_date).toDateString()
				})));
			}
		);
	})
	// add a new task to the database
	.post('/tasks/add', (req, res) => {
		// if the id column is left out then sqlite will automatically fill it in because it's
		// the primary key. it's a good idea to let the database handle assigning the id.
		db.run(
			`INSERT INTO task
				(name, description, due_date, category_id)
			VALUES
				($name, $description, $due_date, $category_id)`,
			{
				$name: req.body.name,
				$description: req.body.description,
				// we need to convert the date into the ISO format the sqlite is expecting
				$due_date: new Date(req.body.dueDate).toISOString(),
				$category_id: req.body.categoryId
			},
			error => {
				// todo: we should check to see if an error occured before sending
				// a 200 (OK) response to the client
				res.sendStatus(200);
			}
		);
	})
	// delete a task from the database
	.post('/tasks/delete', (req, res) => {
		db.run(
			`DELETE FROM task
			WHERE id = $id`,
			{
				$id: req.query.id
			},
			error => {
				res.sendStatus(200);
			}
		);
	})
	// start the server
	.listen(port, () => {
		log(`listening on port ${port}`)
	});
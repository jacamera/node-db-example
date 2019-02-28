const
	// task table elements
	taskRows = document.getElementById('task-rows'),
	taskRowTemplate = document.getElementById('task-row-template-container').children[0],
	// new task form elements
	newTaskForm = document.getElementById('new-task-form'),
	nameTextBox = newTaskForm.querySelector('input[name="name"]'),
	descriptionTextBox = newTaskForm.querySelector('input[name="description"]'),
	dueDatePicker = newTaskForm.querySelector('input[name="due-date"]'),
	categoryIdSelectList = newTaskForm.querySelector('select[name="category-id"]');

// clear any existing values and hide the form
function clearNewTaskForm() {
	// hide the new task form
	newTaskForm.style.display = 'none';
	// clear the values from the text boxes
	nameTextBox.value = '';
	descriptionTextBox.value = '';
	dueDatePicker.value = '';
	// remove all the options from the select list
	while (categoryIdSelectList.children.length) {
		categoryIdSelectList.lastChild.remove();
	}
}

// fetch the tasks from the server and add a row to the table for each one
function populateTaskTable() {
	// remove all existing rows from the table
	while (taskRows.children.length) {
		taskRows.lastChild.remove();
	}
	// fetch the tasks
	fetch('/tasks')
		// convert the response to a json object
		.then(response => response.json())
		// process the json object
		.then(tasks => {
			// check if there are any tasks
			if (tasks.length) {
				// add a row to the table for each task
				for (const task of tasks) {
					// clone our blank template row
					const taskRow = taskRowTemplate.cloneNode(true);
					// fill in the content using the values from the task
					taskRow.querySelector('.id').textContent = task.id;
					taskRow.querySelector('.name .color-indicator').style.backgroundColor = task.color;
					taskRow.querySelector('.name .text').textContent = task.name;
					taskRow.querySelector('.description').textContent = task.description;
					taskRow.querySelector('.due-date').textContent = task.dueDate;
					taskRow.querySelector('.category').textContent = task.category;
					taskRow.querySelector('.delete-button').value = task.id;
					// add the row to the table
					taskRows.appendChild(taskRow);
				}
			} else {
				// create a placeholder row to indicate that no tasks have been found
				const placeholderTaskCell = document.createElement('td');
				placeholderTaskCell.textContent = 'No tasks found.';
				placeholderTaskCell.colSpan = taskRowTemplate.children.length;
				taskRows.appendChild(
					document
						.createElement('tr')
						.appendChild(placeholderTaskCell)
				);
			}
		});
}

// add event listener to the add task button
document
	.getElementById('add-task-button')
	.addEventListener('click',  () => {
		// show the new task form
		newTaskForm.style.display = 'block';
		// fetch the categories
		fetch('/categories')
			// convert the response to a json object
			.then(response => response.json())
			// process the json object
			.then(categories => {
				// add an option to the select list for each category
				for (const category of categories) {
					// create an option element
					const option = document.createElement('option');
					// set the value and display text from the category
					option.value = category.id;
					option.textContent = category.name;
					// add the option to the select list
					categoryIdSelectList.appendChild(option);
				}
			});
	});

// add event listener to the new task form cancel button
document
	.getElementById('clear-task-form-button')
	.addEventListener('click', e => {
		// prevent the browser from submitting the form
		e.preventDefault();
		// clear the form
		clearNewTaskForm();
	});

// add event listener to the new task from submit button
document
	.getElementById('save-task-form-button')
	.addEventListener('click', e => {
		// prevent the browser from submitting the form
		e.preventDefault();
		// send the form values to the server
		fetch(
				'/tasks/add',
				{
					// encode the values as a json object
					body: JSON.stringify({
						name: nameTextBox.value,
						description: descriptionTextBox.value,
						dueDate: dueDatePicker.value,
						categoryId: categoryIdSelectList.value
					}),
					// specify the content-type as json so Express knows how to parse it
					headers: {
						'Content-Type': 'application/json'
					},
					// use the post method since this operation changes data on the server
					method: 'POST'
				}
			)
			.then(() => {
				// clear the form
				clearNewTaskForm();
				// refresh the table to show the new task
				populateTaskTable();
			});
	});

// add an event listener to the task rows to handle the delete button clicks.
// attaching the handler to the tbody element allows us to set up a single
// event listener for all its children including the delete buttons instead of
// adding a listener to every delete button individually.
taskRows.addEventListener('click', e => {
	// we have to check that the delete button is the target since we attached
	// the listener to the tbody element
	if (
		e.target.classList &&
		e.target.classList.contains('delete-button') &&
		confirm(`Delete task # ${e.target.value}?`)
	) {
		// send the request to the server
		fetch(
				// include the id in the query string. since we just have a single value to send
				// it's easier than sending a json object.
				`/tasks/delete?id=${e.target.value}`,
				{
					method: 'POST'
				}
			)
			.then(() => {
				// refresh the table to remove the deleted task
				populateTaskTable();
			});
	}
});

// populate the table on the initial load
populateTaskTable();
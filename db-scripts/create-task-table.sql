CREATE TABLE task (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	due_date DATETIME NOT NULL,
	category_id INTEGER NOT NULL REFERENCES category (id)
);
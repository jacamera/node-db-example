# node-db-example
## Introduction
This example application demonstrates how to read and write data to and from a relational database using a web application built using NodeJS. The application is a task manager that can create, categorize and delete tasks.

Relational databases are not the only way to store information, but they provide some notable advantages over other storage formats for typical programming use cases. The relational model enables developers to store data in a way that provides both integrity and flexibility. Data is stored in rows within tables that have specified data types and relationships to other tables. These data types and relationships can be enforced by the database in order to guarantee that records are stored in the correct format and that references to other records are always valid.

The tables defined in this example program are structured as follows:

    +---------------------------------------+        +-----------------------------------+
    |task                                   |        |category                           |
    +-----------+---------+---------+-------+        +--------+---------+--------+-------+
    |name       |data type|nullable |key    |        |name    |data type|nullable|key    |
    +-----------+---------+---------+-------+        +--------+---------+--------+-------+
    |id         |INTEGER  |         |PRIMARY|    +-->+id      |INTEGER  |        |PRIMARY|
    |name       |TEXT     |         |       |    |   |name    |TEXT     |        |       |
    |description|TEXT     |    X    |       |    |   |color   |TEXT     |        |       |
    |due_date   |DATETIME |         |       |    |   +--------+---------+--------+-------+
    |category_id|INTEGER  |         |FOREIGN+----+   
    +-----------+---------+---------+-------+
- There are two tables: `task` and `category`.
- Each table should describe an object that you want to model in your application.
- Each table needs a primary key that can be used to uniquely identify rows. An integer column named "id" is a common pattern.
- The columns in each table represent different properties of the object.
- The data type specifies what kind of data the column will hold.
- Each column can be nullable or non-nullable. If column is nullable then it can contain an empty (NULL) value. If it is non-nullable then it must contain a non-NULL value.
- Foreign key columns reference the primary key of another table. The data type of both columns must match.
### About SQLite
The database used in this example is [SQLite](https://www.sqlite.org), which is unique amongst relational databases in that the entire database is contained within a single file that is accessed by a single process using the SQLite library. This contrasts with the more typical database server (e.g. MySQL, PostgreSQL, Oracle, etc.) which requires lengthy installation and configuration to get up and running.

Although SQLite is simpler than server style databases, it implements a large portion of the Structured Query Language (SQL) which is the standard language used to communicate with relational databases. It is a great way to get started with SQL and is sometimes even a better option than a full-fledged database server due to its simple yet powerful design.
## Application Architecture
                      +-------------+
                      | Browser     |
                      | Web Client  |
                      +-----+-------+
                            |
                            |
    +--------+        +-----v------+
    | SQLite |        | NodeJS     |
    | CLI    |        | Web Server |
    +----+---+        +-----+------+
         |                  |
         +------+  +--------+
                |  |
           +----v--v----+
           |  Database  |
           |  File      |
           +------------+
- **Browser Web Client**: The web client application is located in the `client` folder and runs in the web browser.
- **NodeJS Web Server**: The web server application is located in the `server` folder and uses the Express package to serve the static web client to the browser, respond to requests from the web client application and interface with the database using the SQLite3 package.
- **SQLite CLI**: The SQLite command line interface (CLI) is a utility program that allows you to interface with the database independent of the NodeJS web server. This is especially useful for setting up the initial database, running ad-hoc queries, importing and exporting data and performing other administrative tasks.
- **Database File**: The file that contains all the SQLite data. This file is in a binary format and can only be read and modified by SQLite.
## Setup Guide
Open a terminal session and navigate to this project's directory before running any commands.
### Database Setup
1. Download the SQLite CLI from the [SQLite download page](https://www.sqlite.org/download.html). Select the precompiled binaries for your operating system and extract the SQLite CLI executable to the root of this project's directory.

    *Note: The SQLite CLI is a binary utility that should not be checked into source control. It can alternatively be placed in another directory on your system that is located in your PATH environment variable.*
2. Start a CLI session by running the CLI executable.

        ./sqlite3
2. Create the database in the `server` directory.

        .open server/database

    The `.open` command creates the database file if it doesn't already exist.
3. Run the table creation scripts in the `db-scripts` folder to create the tables.

        .read db-scripts/create-category-table.sql
        .read db-scripts/create-task-table.sql
    
    The `.read` command executes the SQL statements in the specified files.
3. Insert a couple categories into the category table to get started:

        INSERT INTO category (name, color) VALUES ('Budget', 1, 'red');
        INSERT INTO category (name, color) VALUES ('Housework', 2, 'blue');

    Individual SQL statements entered into the CLI must be terminated with a semicolon.
4. Exit the CLI.

        .exit
### NodeJS Setup
*Note: This guide assumes that NodeJS and Node Package Manager are already installed*
1. Install the NodeJS packages using Node Package Manager.

        npm install
2. Start the server.

        node server/main.js
3. Open a browser and navigate to the server address to run the client application.
## Reference Material
- [NodeJS Docs](https://nodejs.org/en/docs/)
- [Express API Reference](https://expressjs.com/en/4x/api.html)
- [node-sqlite3 API Reference](https://github.com/mapbox/node-sqlite3/wiki/API)
- [SQLite CLI Reference](https://www.sqlite.org/cli.html)
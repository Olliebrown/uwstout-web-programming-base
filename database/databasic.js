import fs from 'fs'
import crypto from 'crypto'
import mariaDB from 'mariadb'
import dotenv from 'dotenv'

import phpMysqliConfigure from './phpConfigure.js'

// Make sure a .env file exists
if (!fs.existsSync('./.env')) {
  console.error('ERROR: Could not find a ".env" file in your main folder.')
  console.error('Open example.env and read the comments there to create one.')
  process.exit(-1)
}

// Load the env file's values
dotenv.config()
const DB_HOST = process.env.DB_HOST ?? 'localhost'
const DB_PORT = process.env.DB_PORT ?? '3306'
const DB_USER = process.env.DB_USER ?? 'unknown'
const DB_PASSWORD = process.env.DB_PASSWORD ?? 'badpass'

// Username for the new database user
const NEW_USERNAME = 'webUser'

// Tables in the littleIMDB database
const IMDB_TABLES = [
  'movie',
  'actor-1', 'actor-2', 'actor-3', 'actor-4',
  'crew',
  'genres',
  'movies_actors-1', 'movies_actors-2', 'movies_actors-3', 'movies_actors-4', 'movies_actors-5',
  'movies_crew',
  'crew_genres-1', 'crew_genres-2'
]

// Read the SQL files
const simpsonsSQL = fs.readFileSync('./database/simpsonsCreate.sql', { encoding: 'utf8' })
const littleIMDBSQL = IMDB_TABLES.map(tableName =>
  fs.readFileSync(`./database/littleIMDB/${tableName}.sql`, { encoding: 'utf8' })
)
const myflixSQL = fs.readFileSync('./database/myflixCreate.sql', { encoding: 'utf8' })
const peopleSQL = fs.readFileSync('./database/peopleCreate.sql', { encoding: 'utf8' })

// Setup a pooled DB connection
const createPool = () => mariaDB.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  connectionLimit: 5,
  multipleStatements: true
})

// Test connecting to the database
async function connectToDatabase (pool) {
  try {
    const conn = await pool.getConnection()
    return conn
  } catch (err) {
    console.error('============================================')
    console.error('Failed to connect to DB')
    console.error(err.message)
    console.error('============================================')
  }

  return null
}

async function checkUserExists (conn, username) {
  try {
    const result = await conn.query(`
    SELECT COUNT(*) AS count FROM mysql.user WHERE user='${username}';
    `)
    return result[0].count > 0
  } catch (err) {
    console.error('Failed to check if user exists')
    console.error(err.message)
    return false
  }
}

// Create a user account on the server
async function createDatabaseUser (conn, username, password) {
  try {
    const result = await conn.query(`
      DROP USER IF EXISTS '${username}'@'localhost';
      CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}';
    `)
    result.forEach((packet, i) => {
      if (packet.warningStatus > 0) {
        console.log(`Command ${i + 1}: `, packet)
      }
    })
    return true
  } catch (err) {
    console.error('Failed to create user')
    console.error(err.message)
    return false
  }
}

async function setUserPermissions (conn, username, databases) {
  if (!Array.isArray(databases)) { databases = [databases] }

  try {
    const result = await conn.query(`
      ${databases.map(database => `GRANT SELECT ON ${database}.* TO '${username}'@'localhost'; FLUSH PRIVILEGES;`).join('\n')}
    `)
    result.forEach((packet, i) => {
      if (packet.warningStatus > 0) {
        console.log(`Command ${i + 1}: `, packet)
      }
    })

    return true
  } catch (err) {
    console.error('Failed to set user permissions')
    console.error(err.message)
    return false
  }
}

async function checkDatabaseExists (conn, database, tables) {
  try {
    const result = await conn.query(`
    SELECT COUNT(*) AS count FROM information_schema.schemata WHERE schema_name='${database}';
    `)
    if (result[0].count === 0) { return false }

    if (tables) {
      const tableResult = await conn.query(`
      SELECT COUNT(*) AS count FROM information_schema.tables WHERE
        table_schema='${database}' AND table_name IN (${tables.map(table => `'${table}'`).join(',')});
      `)
      return tableResult[0].count === BigInt(tables.length)
    }

    return true
  } catch (err) {
    console.error('Failed to check if database exists')
    console.error(err.message)
    return false
  }
}

// Run a multiline query (probably loaded from a file)
async function runMultilineQuery (conn, querySQL) {
  try {
    const result = await conn.query(querySQL)
    result.forEach((packet, i) => {
      if (packet.affectedRows > 0) {
        console.log(`Command ${i + 1}: `, { affectedRows: packet.affectedRows })
      }
    })
    return true
  } catch (err) {
    console.error('Failed to create/update database')
    console.error(err.message)
    return false
  }
}

// Run a basic test of database functionality
async function testDatabase () {
  // Enabling mysqli extension
  console.log('\nEnabling mysqli extension')
  console.log('============================================')
  const enabled = phpMysqliConfigure()
  console.log('============================================')
  console.log(`  --> ${enabled ? 'Enabled' : 'Failed to enable'}`)

  // Create connection pool
  console.log('\nCreating connection pool with the following credentials ...')
  console.log('============================================')
  console.log({ DB_HOST, DB_PORT, DB_USER, DB_PASSWORD: '********' })
  const pool = createPool()
  console.log('============================================')

  // Make initial connection
  console.log('\nConnecting to Database ...')
  const conn = await connectToDatabase(pool)
  if (conn) {
    console.log('  --> Connection succeeded')
    console.log('\nChecking web user ...')

    // Create the default web user
    let userCreated = false
    let newPW = ''
    {
      console.log('\nCreating new web database user and updating permissions')
      console.log('============================================')
      if (!(await checkUserExists(conn, NEW_USERNAME))) {
        newPW = crypto.randomUUID()
        userCreated = await createDatabaseUser(conn, NEW_USERNAME, newPW)
      }
      const result = await setUserPermissions(conn, NEW_USERNAME, ['simpsons', 'myflix', 'littleIMDB', 'people'])
      console.log('============================================')
      console.log(`  --> Creation ${userCreated ? 'succeeded' : 'skipped'}`)
      console.log(`  --> Permission updates ${result ? 'succeeded' : 'failed'}`)
    }

    console.log('\nChecking database data ...')

    // Sync the example databases
    if (!(await checkDatabaseExists(conn, 'simpsons', ['students', 'teachers', 'courses', 'grades']))) {
      console.log('\nCreating/updating example database "simpsons"')
      console.log('============================================')
      const result = await runMultilineQuery(conn, simpsonsSQL)
      console.log('============================================')
      console.log(`  --> Creation/update ${result ? 'succeeded' : 'failed'}`)
    }

    if (!(await checkDatabaseExists(conn, 'littleIMDB', ['movie', 'actor', 'crew', 'genre', 'movies_actors', 'movies_crew', 'crew_genres']))) {
      console.log('\nCreating/updating example database "littleIMDB"')
      for (let i = 0; i < IMDB_TABLES.length; i++) {
        const tableName = IMDB_TABLES[i]
        console.log(`  --> Creating "${tableName}" table`)
        console.log('============================================')
        const result = await runMultilineQuery(conn, littleIMDBSQL[i])
        console.log('============================================')
        console.log(`  --> Creation/update ${result ? 'succeeded' : 'failed'}`)
      }
    }

    if (!(await checkDatabaseExists(conn, 'myflix', ['movies']))) {
      console.log('\nCreating/updating example database "myflix"')
      console.log('============================================')
      const result = await runMultilineQuery(conn, myflixSQL)
      console.log('============================================')
      console.log(`  --> Creation/update ${result ? 'succeeded' : 'failed'}`)
    }

    if (!(await checkDatabaseExists(conn, 'people', ['customer']))) {
      console.log('\nCreating/updating example database "people"')
      console.log('============================================')
      const result = await runMultilineQuery(conn, peopleSQL)
      console.log('============================================')
      console.log(`  --> Creation/update ${result ? 'succeeded' : 'failed'}`)
    }

    console.log('\n  --> Database data check complete')

    // Close the connection
    conn.release()

    // Output user account data
    if (userCreated) {
      fs.writeFileSync('./dbUser.txt', `username=${NEW_USERNAME}\npassword=${newPW}`)
      console.log('\n**************************************************')
      console.log('Here are your connection details (COPY THESE!)')
      console.log('    Username:', NEW_USERNAME)
      console.log('    Password:', newPW)
      console.log('(these are also saved in dbUser.txt)')
      console.log('**************************************************')
    } else {
      console.log('\n**************************************************')
      console.log('webUser account was not changed. Your login details')
      console.log('are the same as before (see dbUser.txt).')
      console.log('**************************************************')
    }
  } else {
    console.log('  --> Connection failed')
  }

  // Close connection pool
  await pool.end()
}

testDatabase()

import fs from 'fs'
import crypto from 'crypto'
import mariaDB from 'mariadb'
import dotenv from 'dotenv'

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

// Read the SQL files
const simpsonsSQL = fs.readFileSync('./database/simpsonsCreate.sql', { encoding: 'utf8' })
const littleIMDBSQL = fs.readFileSync('./database/littleIMDBCreate.sql', { encoding: 'utf8' })
const myflixSQL = fs.readFileSync('./database/myflixCreate.sql', { encoding: 'utf8' })

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

// Create a user account on the server
async function createDatabaseUser (conn, username, password, databases) {
  if (!Array.isArray(databases)) { databases = [databases] }

  try {
    const result = await conn.query(`
      DROP USER '${username}'@'localhost';
      CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}';
      ${databases.map(database => `GRANT SELECT ON ${database}.* TO '${username}'@'localhost'; FLUSH PRIVILEGES;`).join('\n')}
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

    // Create the default web user
    let userCreated = false
    const newPW = crypto.randomUUID()
    console.log('\nCreating new web database user')
    console.log('============================================')
    userCreated = await createDatabaseUser(conn, NEW_USERNAME, newPW, ['simpsons', 'myflix', 'tinyimdb'])
    console.log('============================================')
    console.log(`  --> Creation/update ${userCreated ? 'succeeded' : 'failed'}`)

    // Sync the example databases
    {
      console.log('\nCreating/updating example database "simpsons"')
      console.log('============================================')
      const result = await runMultilineQuery(conn, simpsonsSQL)
      console.log('============================================')
      console.log(`  --> Creation/update ${result ? 'succeeded' : 'failed'}`)
    }

    {
      console.log('\nCreating/updating example database "littleIMDB"')
      console.log('============================================')
      const result = await runMultilineQuery(conn, littleIMDBSQL)
      console.log('============================================')
      console.log(`  --> Creation/update ${result ? 'succeeded' : 'failed'}`)
    }

    {
      console.log('\nCreating/updating example database "myflix"')
      console.log('============================================')
      const result = await runMultilineQuery(conn, myflixSQL)
      console.log('============================================')
      console.log(`  --> Creation/update ${result ? 'succeeded' : 'failed'}`)
    }

    // Close the connection
    conn.release()

    // Output connection data
    if (userCreated) {
      fs.writeFileSync('./dbUser.txt', `username=${NEW_USERNAME}\npassword=${newPW}`)
      console.log('\n**************************************************')
      console.log('Here are your connection details (COPY THESE!)')
      console.log('    Username:', NEW_USERNAME)
      console.log('    Password:', newPW)
      console.log('(these are also saved in dbUser.txt)')
      console.log('**************************************************')
    }
  } else {
    console.log('  --> Connection failed')
  }

  // Close connection pool
  await pool.end()
}

testDatabase()

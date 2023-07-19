import fs from 'fs'
import path from 'path'

export default function phpMysqliConfigure () {
  const HOME_DIR = path.join(process.env.HOME, 'AppData', 'Local')

  // Look for the right folder (just grab the first one that starts with php)
  const folders = fs.readdirSync(HOME_DIR)
  const folderName = folders.find(folder => folder.toLowerCase().startsWith('php')) ?? 'unknown'
  const phpFolder = path.join(HOME_DIR, folderName)

  // Confirm folder exists
  if (!fs.existsSync(phpFolder)) {
    console.error(`Failed to find php folder under "${HOME_DIR}".  Is it installed?`)
    return false
  }
  console.log('Found php folder:', phpFolder)

  // Is php already configured
  if (fs.existsSync(path.join(phpFolder, 'php.ini'))) {
    console.error('php.ini already exists')
    const configFile = fs.readFileSync(path.join(phpFolder, 'php.ini'), { encoding: 'utf8' })

    if (configFile.match(/^extension=mysqli$/) !== -1 && configFile.match(/^extension_dir=ext$/) !== -1) {
      console.log('mysqli extension already enabled')
      return true
    }

    // Update to enable the mysqli extension
    const lines = configFile.split('\n')
    findAndReplaceOrAdd(';extension=mysqli', 'extension=mysqli', lines)
    findAndReplaceOrAdd('extension_dir=', 'extension_dir=ext', lines)

    // Write out as NEW php.ini
    fs.writeFileSync(path.join(phpFolder, 'php.ini'), lines.join('\n'), { encoding: 'utf8' })

    console.log('Updated php.ini to enable mysqli')
    return true
  }

  // Create php.ini from php.ini-development
  if (!fs.existsSync(path.join(phpFolder, 'php.ini-development'))) {
    console.error('Failed to find php.ini-development in php folder')
    return false
  }

  // Read the default development ini file
  const configFile = fs.readFileSync(path.join(phpFolder, 'php.ini-development'), { encoding: 'utf8' })

  // Update to enable the mysqli extension
  const lines = configFile.split('\n')
  findAndReplaceOrAdd(';extension=mysqli', 'extension=mysqli', lines)
  findAndReplaceOrAdd('extension_dir=', 'extension_dir=ext', lines)

  // Write out as php.ini
  fs.writeFileSync(path.join(phpFolder, 'php.ini'), lines.join('\n'), { encoding: 'utf8' })
  console.log('Copied php.ini-development to php.ini and enabled mysqli')
  return false
}

function findAndReplaceOrAdd (find, replace, lines) {
  const index = lines.findIndex(line => line.includes(find))
  if (index === -1) {
    lines.push(replace)
    lines.push('')
  } else {
    lines[index] = replace
  }
}

import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { Compartment } from '@codemirror/state'
import { sql } from '@codemirror/lang-sql'

import { basicLight } from './lightTheme.js'
import { basicDark } from './darkTheme.js'

import { createCodeMirrorSetup } from './myConfig.js'

let editor = {}
const editorTheme = new Compartment()

export function addCodeEditor (editorID, initialCode = '', languageSettings = {}, darkTheme = true, editorSettings = null) {
  editor = new EditorView({
    extensions: [
      createCodeMirrorSetup(editorSettings),
      keymap.of([indentWithTab]),
      editorTheme.of(darkTheme ? basicDark : basicLight),
      sql(languageSettings)
    ],
    parent: document.querySelector(`#${editorID}`),
    doc: initialCode
  })
}

export function getEditorCode () {
  if (editor) {
    return editor.state.doc.toString()
  }
  return ''
}

export function setEditorCode (code) {
  if (editor) {
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: code
      }
    })
  }
}

export function enableDarkTheme (enable) {
  if (editor) {
    editor.dispatch({
      effects: editorTheme.reconfigure(
        (enable ? basicDark : basicLight)
      )
    })
  }
}

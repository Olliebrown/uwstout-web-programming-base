import { EditorState } from '@codemirror/state'

import {
  keymap, highlightSpecialChars, drawSelection,
  highlightActiveLine, dropCursor,
  rectangularSelection, crosshairCursor,
  lineNumbers, highlightActiveLineGutter
} from '@codemirror/view'

import {
  defaultHighlightStyle, syntaxHighlighting,
  indentOnInput, bracketMatching,
  foldGutter, foldKeymap
} from '@codemirror/language'

import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'

export function createCodeMirrorSetup ({
  enableLineNumbers = true,
  enableCodeFolding = true,
  enableHighlightActiveLine = true,
  enableHighlightActiveGutter = true,
  enableHighlightSelectionMatches = true,
  enableHighlightBracketMatching = true,
  enableAutoCloseBrackets = true,
  enableAutocomplete = true,
  enableSyntaxHighlighting = true,
  enableMultipleSelections = true
}) {
  return [
    enableLineNumbers ? lineNumbers() : null,
    enableHighlightActiveGutter ? highlightActiveLineGutter() : null,
    enableHighlightActiveLine ? highlightActiveLine() : null,
    enableHighlightSelectionMatches ? highlightSelectionMatches() : null,
    enableHighlightBracketMatching ? bracketMatching() : null,
    enableAutoCloseBrackets ? closeBrackets() : null,
    enableAutocomplete ? autocompletion() : null,
    enableSyntaxHighlighting ? syntaxHighlighting(defaultHighlightStyle, { fallback: true }) : null,
    enableMultipleSelections ? EditorState.allowMultipleSelections.of(true) : null,
    enableCodeFolding ? foldGutter() : null,
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    indentOnInput(),
    rectangularSelection(),
    crosshairCursor(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap
    ])
  ].filter(value => value !== null)
}

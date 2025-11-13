import Editor, { type OnMount } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import { useEffect, useRef } from 'react'
import './JavaEditor.css'

export interface EditorHighlight {
  line: number
  startColumn: number
  endColumn: number
}

interface JavaEditorProps {
  code: string
  onChange: (value: string) => void
  highlights?: EditorHighlight[]
}

export function JavaEditor({ code, onChange, highlights }: JavaEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])

  const handleMount: OnMount = (editorInstance, monacoInstance) => {
    editorRef.current = editorInstance
    monacoRef.current = monacoInstance
  }

  useEffect(() => {
    const editorInstance = editorRef.current
    const monacoInstance = monacoRef.current
    if (!editorInstance || !monacoInstance) {
      return
    }

    const decorations = (highlights ?? []).map((highlight) => ({
      range: new monacoInstance.Range(
        highlight.line,
        highlight.startColumn,
        highlight.line,
        highlight.endColumn,
      ),
      options: {
        inlineClassName: 'editor-error-highlight',
        stickiness:
          monacoInstance.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
      },
    }))

    decorationsRef.current = editorInstance.deltaDecorations(
      decorationsRef.current,
      decorations,
    )
  }, [highlights, code])

  return (
    <div className="editor-wrapper">
      <Editor
        height="420px"
        defaultLanguage="java"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value ?? '')}
        onMount={handleMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  )
}

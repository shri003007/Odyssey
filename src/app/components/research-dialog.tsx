import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Save, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Markdown } from 'tiptap-markdown'
import { EditorToolbar } from '../../components/editor-toolbar'

interface ResearchResult {
  topic: string;
  research: string;
}

interface ResearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: ResearchResult;
  onUpdateResearch: (updatedResearch: string) => void;
}

export function ResearchDialog({ isOpen, onClose, result, onUpdateResearch }: ResearchDialogProps) {
  const [isCopied, setIsCopied] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: 'Research content will appear here...',
      }),
      Highlight,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Markdown,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: result.research,
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[300px] p-4 focus:outline-none'
      }
    }
  })

  const handleCopy = useCallback(() => {
    if (editor) {
      const markdown = editor.storage.markdown.getMarkdown()
      navigator.clipboard.writeText(markdown)
      setIsCopied(true)
      toast.success('Content copied to clipboard')
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [editor])

  const handleSave = useCallback(() => {
    if (editor) {
      const updatedContent = editor.getHTML()
      onUpdateResearch(updatedContent)
      toast.success('Research content updated')
      onClose() // Close the dialog after saving
    }
  }, [editor, onUpdateResearch, onClose])

  const handleFormatText = (format: string) => {
    if (!editor) return
    
    // First ensure editor is focused
    editor.commands.focus()
    
    // Small delay to ensure focus is set
    setTimeout(() => {
      switch (format) {
        case 'bold':
          editor.commands.toggleBold()
          break
        case 'italic':
          editor.commands.toggleItalic()
          break
        case 'underline':
          editor.commands.toggleUnderline()
          break
        case 'strike':
          editor.commands.toggleStrike()
          break
        case 'code':
          editor.commands.toggleCode()
          break
        case 'highlight':
          editor.commands.toggleHighlight()
          break
        case 'link':
          const url = window.prompt('Enter the URL')
          if (url) {
            editor.commands.setLink({ href: url })
          }
          break
        case 'image':
          const src = window.prompt('Enter the image URL')
          if (src) {
            editor.commands.setImage({ src })
          }
          break
        case 'bulletList':
          editor.commands.toggleBulletList()
          break
        case 'orderedList':
          editor.commands.toggleOrderedList()
          break
        case 'blockquote':
          editor.commands.toggleBlockquote()
          break
        case 'h1':
          editor.commands.toggleHeading({ level: 1 })
          break
        case 'h2':
          editor.commands.toggleHeading({ level: 2 })
          break
        case 'h3':
          editor.commands.toggleHeading({ level: 3 })
          break
        case 'alignLeft':
          editor.commands.setTextAlign('left')
          break
        case 'alignCenter':
          editor.commands.setTextAlign('center')
          break
        case 'alignRight':
          editor.commands.setTextAlign('right')
          break
        case 'alignJustify':
          editor.commands.setTextAlign('justify')
          break
        default:
          break
      }
    }, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Research Results: {result.topic}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0"> {/* Add min-h-0 to enable proper flex behavior */}
          <EditorToolbar onFormatText={handleFormatText} editor={editor} />
          
          <div className="flex-1 overflow-y-auto border rounded-md bg-background">
            <div className="h-full">
              <EditorContent 
                editor={editor} 
                className="h-full tiptap-editor prose-lg max-w-none focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4 border-t pt-4">
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {isCopied ? 'Copied' : 'Copy as Markdown'}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


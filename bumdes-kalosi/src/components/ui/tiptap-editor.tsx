"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Toggle } from "@/components/ui/toggle"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading2,
    Heading3,
    Link as LinkIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from 'react'

interface TiptapEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function TiptapEditor({ value, onChange, placeholder = "Tulis konten di sini..." }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg border shadow-sm',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false // Fixes some hydration mismatch in Next.js
    })

    // Sync content if value changes externally (e.g. reset form)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (value === "") {
                editor.commands.clearContent()
            }
            // Careful with infinite loops here, usually better to strictly control or rely on initial content only
            // But for simple forms this is often okay if controlled properly
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col w-full rounded-md border border-input shadow-xs bg-transparent dark:bg-input/30 ring-offset-background placeholder:text-muted-foreground focus-within:ring-[3px] focus-within:ring-ring/10 focus-within:border-ring transition-[color,box-shadow]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b p-1 bg-muted/40 rounded-t-md">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    aria-label="Heading 2"
                    className="h-8 w-8"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    aria-label="Heading 3"
                    className="h-8 w-8"
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-4 bg-border mx-1 self-center" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Bold"
                    className="h-8 w-8"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Italic"
                    className="h-8 w-8"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('link')}
                    onPressedChange={() => {
                        const previousUrl = editor.getAttributes('link').href
                        const url = window.prompt('URL', previousUrl)

                        if (url === null) {
                            return
                        }

                        if (url === '') {
                            editor.chain().focus().extendMarkRange('link').unsetLink().run()
                            return
                        }

                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                    }}
                    aria-label="Link"
                    className="h-8 w-8"
                >
                    <LinkIcon className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-4 bg-border mx-1 self-center" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet List"
                    className="h-8 w-8"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Ordered List"
                    className="h-8 w-8"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Blockquote"
                    className="h-8 w-8"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-4 bg-border mx-1 self-center" />

                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().undo().run()}
                    className="hover:bg-muted h-8 w-8"
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    onPressedChange={() => editor.chain().focus().redo().run()}
                    className="hover:bg-muted h-8 w-8"
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Toggle>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} className="min-h-[200px]" />
        </div>
    )
}

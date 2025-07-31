// src/components/editor/TiptapEditor.tsx
"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

type TiptapEditorProps = {
  content: string;
  onChange: (richText: string) => void;
};

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  // ... Toolbar code remains the same
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1 flex flex-wrap items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit.configure({})],
    // If content is a stringified JSON, parse it. Otherwise, use it as is (for initial empty state).
    content: content ? JSON.parse(content) : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // FIX: Added prose classes for proper typography styling (fixes lists)
        class:
          "prose dark:prose-invert max-w-none rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]",
      },
    },
    onUpdate({ editor }) {
      // FIX: Output content as a JSON string for the server action
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div className="flex flex-col justify-stretch gap-2">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

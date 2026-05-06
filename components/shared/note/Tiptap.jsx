"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";

const Tiptap = ({ onChange, content }) => {
  const handleChange = (newContent) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML()); 
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const normalizedContent = content || "";
    if (editor.getHTML() !== normalizedContent) {
      editor.commands.setContent(normalizedContent, { emitUpdate: false });
    }
  }, [content, editor]);

  return (
    <div className="w-full">
      <Toolbar editor={editor} content={content} />
      <EditorContent
        style={{ whiteSpace: "pre-line" }}
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;

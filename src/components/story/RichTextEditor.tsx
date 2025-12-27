"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Type,
    AlignCenter,
    AlignLeft,
    AlignRight,
    AlignJustify,
    Highlighter
} from "lucide-react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const FontSize = Extension.create({
    name: "fontSize",
    addOptions() {
        return {
            types: ["textStyle"],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize:
                (fontSize: string) =>
                    ({ chain }: any) => {
                        return chain().setMark("textStyle", { fontSize }).run();
                    },
            unsetFontSize:
                () =>
                    ({ chain }: any) => {
                        return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
                    },
        } as any;
    },
});

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Underline"
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bulletList") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("orderedList") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("blockquote") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Blockquote"
            >
                <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <select
                onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                value={editor.getAttributes("textStyle").fontFamily || ""}
                className="bg-transparent text-sm text-gray-600 p-1 rounded hover:bg-gray-200 cursor-pointer outline-none"
                title="Font Family"
            >
                <option value="">Default</option>
                <option value="Inter">Inter</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
            </select>

            <select
                onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                value={editor.getAttributes("textStyle").fontSize || "16px"}
                className="bg-transparent text-sm text-gray-600 p-1 rounded hover:bg-gray-200 cursor-pointer outline-none"
                title="Font Size"
            >
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
                <option value="30px">30</option>
                <option value="36px">36</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Align Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
                title="Align Justify"
            >
                <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <div className="flex items-center gap-1" title="Text Color">
                <Type className="w-4 h-4 text-gray-400" />
                <input
                    type="color"
                    onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                    value={editor.getAttributes("textStyle").color || "#000000"}
                    className="w-6 h-6 p-0 rounded cursor-pointer bg-transparent border-none"
                />
            </div>

            <div className="flex items-center gap-1" title="Highlight Color">
                <Highlighter className="w-4 h-4 text-gray-400" />
                <input
                    type="color"
                    onInput={(event) => editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run()}
                    value={editor.getAttributes("highlight").color || "#ffff00"}
                    className="w-6 h-6 p-0 rounded cursor-pointer bg-transparent border-none"
                />
            </div>

            <div className="flex-1" />

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-30"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-30"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            FontFamily,
            FontSize as any,
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight.configure({ multicolor: true }),
            Placeholder.configure({
                placeholder: placeholder || "Start writing your masterpiece...",
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-4 font-serif",
            },
        },
    });

    return (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-purple-400 transition-colors">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

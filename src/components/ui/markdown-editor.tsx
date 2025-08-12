import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    content,
    onChange,
    placeholder = "Nhập nội dung markdown của bạn...",
    className = ""
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isPreview, setIsPreview] = useState(false);

    const insertText = (before: string, after: string = '') => {
        if (!textareaRef.current) return;
        
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        
        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
        onChange(newText);
        
        // Set cursor position after inserted text
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const toolbarButtons = [
        { label: 'B', title: 'Bold', action: () => insertText('**', '**') },
        { label: 'I', title: 'Italic', action: () => insertText('*', '*') },
        { label: '~~S~~', title: 'Strikethrough', action: () => insertText('~~', '~~') },
        { label: 'H1', title: 'Heading 1', action: () => insertText('# ') },
        { label: 'H2', title: 'Heading 2', action: () => insertText('## ') },
        { label: 'H3', title: 'Heading 3', action: () => insertText('### ') },
        { label: '•', title: 'Bullet List', action: () => insertText('- ') },
        { label: '1.', title: 'Numbered List', action: () => insertText('1. ') },
        { label: '🔗', title: 'Link', action: () => insertText('[', '](url)') },
        { label: '📷', title: 'Image', action: () => insertText('![alt text](', ')') },
        { label: '💬', title: 'Quote', action: () => insertText('> ') },
        { label: '```', title: 'Code Block', action: () => insertText('```\n', '\n```') },
        { label: '`', title: 'Inline Code', action: () => insertText('`', '`') },
        { label: '📋', title: 'Table', action: () => insertText('| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |') },
    ];

    return (
        <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
            {/* Toolbar */}
            <div className="bg-accent/10 border-b border-border p-2 flex flex-wrap gap-1 items-center">
                {toolbarButtons.map((button, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={button.action}
                        title={button.title}
                        className="px-2 py-1 text-sm bg-background hover:bg-accent/20 border border-border rounded transition-colors duration-200 font-mono"
                    >
                        {button.label}
                    </button>
                ))}
                
                <div className="ml-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsPreview(false)}
                        className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                            !isPreview 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background hover:bg-accent/20 border border-border'
                        }`}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreview(true)}
                        className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                            isPreview 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background hover:bg-accent/20 border border-border'
                        }`}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Editor/Preview Area */}
            <div className="min-h-[300px]">
                {isPreview ? (
                    <div className="p-4 prose prose-invert max-w-none">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Custom styling for code blocks
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                                            <code className={`language-${match[1]} text-sm text-white`} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    ) : (
                                        <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                // Custom styling for headings
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-bold text-text mb-4 mt-6 first:mt-0">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-bold text-text mb-3 mt-5">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-semibold text-text mb-2 mt-4">{children}</h3>
                                ),
                                h4: ({ children }) => (
                                    <h4 className="text-lg font-semibold text-text mb-2 mt-3">{children}</h4>
                                ),
                                // Custom styling for paragraphs
                                p: ({ children }) => (
                                    <p className="text-text mb-4 leading-relaxed">{children}</p>
                                ),
                                // Custom styling for lists
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside text-text mb-4 space-y-1">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside text-text mb-4 space-y-1">{children}</ol>
                                ),
                                li: ({ children }) => (
                                    <li className="text-text">{children}</li>
                                ),
                                // Custom styling for blockquotes
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted mb-4">
                                        {children}
                                    </blockquote>
                                ),
                                // Custom styling for links
                                a: ({ children, href }) => (
                                    <a 
                                        href={href} 
                                        className="text-primary hover:text-primary/80 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                // Custom styling for images
                                img: ({ src, alt }) => (
                                    <div className="my-6">
                                        <img
                                            src={src}
                                            alt={alt || 'Image'}
                                            className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                                            loading="lazy"
                                        />
                                        {alt && (
                                            <p className="text-center text-sm text-muted mt-2 italic">{alt}</p>
                                        )}
                                    </div>
                                ),
                                // Custom styling for tables
                                table: ({ children }) => (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full border border-border rounded-lg">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className="bg-accent/10">{children}</thead>
                                ),
                                tbody: ({ children }) => (
                                    <tbody className="divide-y divide-border">{children}</tbody>
                                ),
                                tr: ({ children }) => (
                                    <tr className="hover:bg-accent/5">{children}</tr>
                                ),
                                th: ({ children }) => (
                                    <th className="px-4 py-2 text-left font-semibold text-text border-b border-border">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="px-4 py-2 text-text border-b border-border">
                                        {children}
                                    </td>
                                ),
                            }}
                        >
                            {content || '*No content to preview*'}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-full min-h-[300px] p-4 bg-background text-text border-none outline-none resize-none font-mono text-sm leading-relaxed"
                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
                    />
                )}
            </div>
        </div>
    );
};

export default MarkdownEditor;
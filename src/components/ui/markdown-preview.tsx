import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
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
          img: ({ src, alt }) => {
            let width, height, realAlt, rotate;
            if (alt && alt.includes("|")) {
              const [altText, size, r] = alt.split("|");
              realAlt = altText;
              const [w, h] = size.split("x");
              width = w ? parseInt(w) : undefined;
              height = h ? parseInt(h) : undefined;
              rotate = r ? parseInt(r) : undefined;
            } else {
              realAlt = alt;
            }

            return (
              <div className="my-6 text-center">
                <img
                  src={src}
                  alt={realAlt || "Image"}
                  width={width}
                  height={height}
                  className="rounded-lg shadow-lg inline-block max-w-[500px] h-auto"
                  loading="lazy"
                  style={{ transform: `rotate(${rotate}deg)` }}
                />
                {realAlt && (
                  <p className="text-sm text-muted mt-2 italic">{realAlt}</p>
                )}
              </div>
            );
          },
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
        {content}
      </ReactMarkdown>
    </div>
  );
} 
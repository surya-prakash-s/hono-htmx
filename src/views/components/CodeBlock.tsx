import type { FC, PropsWithChildren } from 'hono/jsx';

interface CodeBlockProps {
  language?: string;
  filename?: string;
}

const CodeBlock: FC<PropsWithChildren<CodeBlockProps>> = ({
  children,
  language = 'html',
  filename,
}) => {
  return (
    <div class="code-block-container">
      {filename && (
        <div class="code-filename">
          <span class="file-icon">{getFileIcon(filename)}</span>
          <span>{filename}</span>
        </div>
      )}
      <pre class={`code-block language-${language}`}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

function getFileIcon(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'html':
      return '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    case 'css':
      return '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    case 'json':
      return '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    default:
      return '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
  }
}

export default CodeBlock;

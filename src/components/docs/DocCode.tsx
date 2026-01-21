import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface DocCodeProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

const DocCode = ({
  code,
  language = "bash",
  title,
  showLineNumbers = false,
}: DocCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/80">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {title && (
            <span className="text-xs text-slate-500 font-mono">{title}</span>
          )}
          {!title && language && (
            <span className="text-xs text-slate-600 font-mono uppercase">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers && (
                <span className="select-none text-slate-600 w-8 flex-shrink-0 text-right pr-4">
                  {index + 1}
                </span>
              )}
              <code className="text-cyan-300">{line}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default DocCode;

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { config } from '../../config';

const languageOptions = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const defaultCodes = {
  python: '# Python 3\nprint("Hello, World!")\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
};

export default function CodeRunner() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(defaultCodes[language]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);
  const [executionDuration, setExecutionTime] = useState<string | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(defaultCodes[language]);
  }, [language]);

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);
    setStderr(null);
    setExitCode(null);
    setExecutionTime(null);

    try {
      const response = await fetch(`${config.backendUrl}/api/onlinecompiler/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, input }),
      });

      const data = await response.json();
      setOutput(data.stdout);
      setStderr(data.stderr);
      setExitCode(data.exitCode);
      setExecutionTime(data.executionDuration);
    } catch (error) {
      setStderr('❌ Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white text-center py-4 shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">🚀 Code Runner</h1>
        <p className="text-sm text-blue-200">Compile & Execute Python, Java, and C++ code online</p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center p-4 bg-blue-950 border-b border-blue-800">
        <select
          className="bg-blue-800 text-white px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languageOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleRun}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow transition disabled:opacity-50"
        >
          {loading ? '⏳ Running...' : '▶ Run Code'}
        </button>
      </div>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 flex-grow overflow-hidden">
        {/* Code Editor */}
        <div className="h-full bg-gray-900 rounded-xl shadow-inner overflow-hidden border border-gray-800">
          <Editor
            height="100%"
            language={language}
            value={code}
            defaultLanguage={language}
            theme="vs-dark"
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
            }}
          />
        </div>

        {/* Input/Output */}
        <div className="flex flex-col h-full gap-4">
          {/* Input */}
          <textarea
            className="w-full h-1/3 bg-gray-800 text-white p-3 rounded-md resize-none outline-none border border-gray-700"
            placeholder="Standard Input (stdin)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Output Box */}
          <div className="flex-1 bg-gray-900 p-4 rounded-md border border-gray-700 overflow-auto">
            <h2 className="text-lg font-semibold mb-2 text-white">📤 Output</h2>
            {output && (
              <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
            )}
            {stderr && (
              <pre className="whitespace-pre-wrap text-red-400">{stderr}</pre>
            )}
            {exitCode !== null && (
              <p className="mt-3 text-sm text-gray-400">Exit Code: {exitCode}</p>
            )}
            {executionDuration !== null && (
              <p className="text-xs text-blue-300">Execution Time: {executionDuration}</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-center py-3 text-sm text-blue-200">
        © {new Date().getFullYear()} Code Runner
      </footer>
    </div>
  );
}

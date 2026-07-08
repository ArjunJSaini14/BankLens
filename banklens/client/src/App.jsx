import { useState, useRef } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setSummary("");

    const formData = new FormData();
    formData.append("statement", file);

    try {
      const res = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSummary(data.summary);
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setSummary("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">
              💳
            </div>
            <span className="text-2xl font-bold text-blue-600 tracking-tight">BankLens</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Upload a bank statement and get an instant AI-powered summary.
          </p>
        </div>

        {/* Upload Card */}
        {!summary && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-5">
            <h2 className="text-base font-semibold text-gray-800 mb-5">Upload Statement</h2>

            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              onClick={() => inputRef.current.click()}
            >
              <div className="text-4xl mb-3">📄</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Click to upload your statement</div>
              <div className="text-xs text-gray-400">Supports .txt, .csv, .pdf</div>
              <input
                ref={inputRef}
                type="file"
                accept=".txt,.csv,.pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {file && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-2 mt-4">
                📎 {file.name}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mt-4">
                ⚠️ {error}
              </div>
            )}

            {loading ? (
              <div className="text-center mt-6">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Analyzing your statement...</p>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!file}
                className="w-full mt-5 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5"
              >
                Analyze Statement
              </button>
            )}
          </div>
        )}

        {/* Results Card */}
        {summary && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-base font-semibold text-gray-800">Your Summary</h2>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                ✓ Complete
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{summary}</p>
            <button
              onClick={reset}
              className="w-full mt-7 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all"
            >
              Analyze Another Statement
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Your file is never stored. Powered by Claude AI.
        </p>

      </div>
    </div>
  );
}

export default App;
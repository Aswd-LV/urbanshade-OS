import { useState } from "react";
import { Search, Database, Trash2, Edit, Check, X } from "lucide-react";
import { toast } from "sonner";

const StorageTab = () => {
  const [storageSearch, setStorageSearch] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const storageEntries = Object.entries(localStorage)
    .filter(([key]) => 
      !key.includes('recovery_images') && key.toLowerCase().includes(storageSearch.toLowerCase())
    )
    .sort(([a], [b]) => a.localeCompare(b));

  const handleEditValue = (key: string) => {
    if (editingKey === key) {
      localStorage.setItem(key, editValue);
      setEditingKey(null);
      setRefreshKey(k => k + 1);
      toast.success(`Updated: ${key}`);
    } else {
      setEditingKey(key);
      setEditValue(localStorage.getItem(key) || '');
    }
  };

  const handleDeleteKey = (key: string) => {
    localStorage.removeItem(key);
    setRefreshKey(k => k + 1);
    toast.success(`Deleted: ${key}`);
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2);
  };

  return (
    <div className="h-full flex flex-col" key={refreshKey}>
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={storageSearch}
            onChange={e => setStorageSearch(e.target.value)}
            placeholder="Search storage keys..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          {localStorage.length} keys | {getStorageSize()} KB
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {storageEntries.length === 0 ? (
          <div className="text-center text-slate-600 py-12">
            <Database className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No matching storage keys found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {storageEntries.map(([key, value]) => (
              <div 
                key={key} 
                className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Database className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400 font-mono text-sm truncate">{key}</span>
                      <span className="text-xs text-slate-600">({value.length} chars)</span>
                    </div>
                    {editingKey === key ? (
                      <textarea
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="w-full p-2 bg-slate-900 border border-amber-500/50 rounded text-xs font-mono text-slate-300 resize-none"
                        rows={3}
                        autoFocus
                      />
                    ) : (
                      <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-all max-h-20 overflow-hidden">
                        {value.length > 200 ? value.substring(0, 200) + '...' : value}
                      </pre>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {editingKey === key ? (
                      <>
                        <button
                          onClick={() => handleEditValue(key)}
                          className="p-1.5 hover:bg-green-500/20 rounded text-green-400"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingKey(null)}
                          className="p-1.5 hover:bg-red-500/20 rounded text-red-400"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditValue(key)}
                          className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(key)}
                          className="p-1.5 hover:bg-red-500/20 rounded text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageTab;

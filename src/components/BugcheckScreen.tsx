import { useEffect, useState } from "react";

export interface BugcheckData {
  code: string;
  description: string;
  timestamp: string;
  location?: string;
  stackTrace?: string;
  systemInfo?: Record<string, string>;
}

interface BugcheckScreenProps {
  bugcheck: BugcheckData;
  onRestart: () => void;
  onReportToDev: () => void;
  onRecovery?: () => void;
}

// Real bugcheck codes with detailed descriptions
export const BUGCHECK_CODES: Record<string, { 
  hex: string; 
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO"; 
  category: string;
  userDescription: string;
  technicalDescription: string;
  possibleCauses: string[];
  suggestedFixes: string[];
}> = {
  DESKTOP_MALFUNC: { 
    hex: "0x00000001", 
    severity: "HIGH", 
    category: "Desktop",
    userDescription: "The desktop display system has malfunctioned",
    technicalDescription: "Desktop component failed to render or entered an invalid state",
    possibleCauses: ["Icon collision", "Layout corruption", "Render loop"],
    suggestedFixes: ["Restart the system", "Clear desktop layout", "Reset to defaults"]
  },
  RENDER_FAILURE: { 
    hex: "0x00000002", 
    severity: "HIGH", 
    category: "Rendering",
    userDescription: "A visual component failed to display correctly",
    technicalDescription: "React component threw an unhandled exception during render",
    possibleCauses: ["Invalid props", "Missing data", "Component crash"],
    suggestedFixes: ["Refresh the page", "Check for corrupted data", "Report to developers"]
  },
  ICON_COLLISION: { 
    hex: "0x00000003", 
    severity: "MEDIUM", 
    category: "Desktop",
    userDescription: "Desktop icons overlapped in an unrecoverable way",
    technicalDescription: "Multiple icons assigned to same position, conflict resolution failed",
    possibleCauses: ["Drag-drop error", "Layout save failure", "Position corruption"],
    suggestedFixes: ["Reset icon positions", "Clear desktop cache"]
  },
  WINDOW_OVERFLOW: { 
    hex: "0x00000004", 
    severity: "MEDIUM", 
    category: "Window Manager",
    userDescription: "Too many windows were open or window state became invalid",
    technicalDescription: "Window manager exceeded maximum window count or z-index overflow",
    possibleCauses: ["Window leak", "Unclosed modals", "Z-index overflow"],
    suggestedFixes: ["Close all windows", "Restart system"]
  },
  DATA_INCORRECT: { 
    hex: "0x00000010", 
    severity: "CRITICAL", 
    category: "Data Integrity",
    userDescription: "Saved data was found to be corrupted or invalid",
    technicalDescription: "Data validation failed - stored data does not match expected schema",
    possibleCauses: ["Storage corruption", "Incomplete save", "Version mismatch"],
    suggestedFixes: ["Factory reset", "Restore from backup", "Clear localStorage"]
  },
  STATE_CORRUPTION: { 
    hex: "0x00000011", 
    severity: "CRITICAL", 
    category: "State",
    userDescription: "The application's internal state became inconsistent",
    technicalDescription: "React state entered an impossible combination of values",
    possibleCauses: ["Race condition", "Improper state update", "Memory issue"],
    suggestedFixes: ["Restart immediately", "Report bug with steps to reproduce"]
  },
  STORAGE_OVERFLOW: { 
    hex: "0x00000012", 
    severity: "HIGH", 
    category: "Storage",
    userDescription: "Storage space has been exhausted",
    technicalDescription: "localStorage quota exceeded - cannot save any more data",
    possibleCauses: ["Too many files", "Large file stored", "Quota limit reached"],
    suggestedFixes: ["Delete unnecessary files", "Clear old data", "Use recovery mode"]
  },
  STORAGE_QUOTA_EXCEEDED: { 
    hex: "0x00000012", 
    severity: "HIGH", 
    category: "Storage",
    userDescription: "Storage space has been exhausted",
    technicalDescription: "localStorage quota exceeded - cannot save any more data",
    possibleCauses: ["Too many files", "Large file stored", "Quota limit reached"],
    suggestedFixes: ["Delete unnecessary files", "Clear old data", "Use recovery mode"]
  },
  PARSE_FAILURE: { 
    hex: "0x00000013", 
    severity: "HIGH", 
    category: "Data",
    userDescription: "Could not read saved data - it appears corrupted",
    technicalDescription: "JSON.parse threw an exception on stored data",
    possibleCauses: ["Incomplete write", "Manual edit error", "Encoding issue"],
    suggestedFixes: ["Clear corrupted key", "Factory reset if critical data"]
  },
  KERNEL_PANIC: { 
    hex: "0x00000020", 
    severity: "CRITICAL", 
    category: "Kernel",
    userDescription: "The core system encountered a fatal error",
    technicalDescription: "Core system module threw an unrecoverable exception",
    possibleCauses: ["Critical module failure", "Memory exhaustion", "Infinite loop"],
    suggestedFixes: ["Restart required", "May need factory reset"]
  },
  MEMORY_EXHAUSTED: { 
    hex: "0x00000021", 
    severity: "CRITICAL", 
    category: "Memory",
    userDescription: "The system ran out of available memory",
    technicalDescription: "Browser memory limit reached - allocation failed",
    possibleCauses: ["Memory leak", "Too many open apps", "Large data set"],
    suggestedFixes: ["Close browser tabs", "Restart browser", "Reduce open apps"]
  },
  MEMORY_PRESSURE: { 
    hex: "0x00000021", 
    severity: "HIGH", 
    category: "Memory",
    userDescription: "The system is running low on available memory",
    technicalDescription: "JavaScript heap usage is critically high",
    possibleCauses: ["Memory leak", "Too many open apps", "Large data set"],
    suggestedFixes: ["Close browser tabs", "Restart browser", "Reduce open apps"]
  },
  INFINITE_LOOP: { 
    hex: "0x00000022", 
    severity: "HIGH", 
    category: "Process",
    userDescription: "A process got stuck in an endless loop",
    technicalDescription: "Detected infinite re-render or processing loop",
    possibleCauses: ["useEffect dependency error", "Recursive call", "Logic error"],
    suggestedFixes: ["Restart system", "Report bug to developers"]
  },
  INFINITE_LOOP_DETECTED: { 
    hex: "0x00000022", 
    severity: "HIGH", 
    category: "Process",
    userDescription: "A component is re-rendering excessively",
    technicalDescription: "Detected infinite re-render loop in React component",
    possibleCauses: ["useEffect dependency error", "Recursive call", "State update loop"],
    suggestedFixes: ["Restart system", "Report bug to developers"]
  },
  STACK_OVERFLOW: { 
    hex: "0x00000023", 
    severity: "CRITICAL", 
    category: "Stack",
    userDescription: "Too many nested operations caused a stack overflow",
    technicalDescription: "Maximum call stack size exceeded",
    possibleCauses: ["Deep recursion", "Circular reference", "Infinite recursion"],
    suggestedFixes: ["Restart required", "Report to developers with reproduction steps"]
  },
  COMPONENT_STACK_OVERFLOW: { 
    hex: "0x00000024", 
    severity: "CRITICAL", 
    category: "Stack",
    userDescription: "A component caused a stack overflow",
    technicalDescription: "Maximum call stack size exceeded in component tree",
    possibleCauses: ["Deeply nested components", "Recursive rendering", "Circular dependencies"],
    suggestedFixes: ["Restart required", "Check component hierarchy"]
  },
  DOM_MUTATION_OVERFLOW: { 
    hex: "0x00000025", 
    severity: "HIGH", 
    category: "DOM",
    userDescription: "Too many DOM changes occurred rapidly",
    technicalDescription: "Excessive DOM mutations detected - possible infinite update loop",
    possibleCauses: ["Animation loop error", "Rapid state updates", "MutationObserver issue"],
    suggestedFixes: ["Restart system", "Check for runaway animations"]
  },
  NETWORK_FAILURE_CASCADE: { 
    hex: "0x00000030", 
    severity: "HIGH", 
    category: "Network",
    userDescription: "Multiple network connections failed consecutively",
    technicalDescription: "Detected cascade of network failures - API or connectivity issue",
    possibleCauses: ["Server unreachable", "API rate limiting", "Network instability"],
    suggestedFixes: ["Check internet connection", "Wait and retry", "Check server status"]
  },
  LOCALSTORAGE_CORRUPTION: { 
    hex: "0x00000031", 
    severity: "CRITICAL", 
    category: "Storage",
    userDescription: "Critical system data is corrupted",
    technicalDescription: "JSON parse failed on critical localStorage keys",
    possibleCauses: ["Incomplete write", "Browser crash during save", "Manual tampering"],
    suggestedFixes: ["Use data recovery", "Factory reset", "Restore from backup"]
  },
  DEV_ERR: { 
    hex: "0x000000FF", 
    severity: "INFO", 
    category: "Developer",
    userDescription: "This is a developer-triggered test error",
    technicalDescription: "Manually triggered via DEF-DEV console for testing",
    possibleCauses: ["Developer testing", "DEF-DEV command"],
    suggestedFixes: ["No action needed - this was intentional"]
  },
  DEV_TEST: { 
    hex: "0x000000FE", 
    severity: "INFO", 
    category: "Developer",
    userDescription: "This is a test bugcheck for debugging purposes",
    technicalDescription: "Test bugcheck triggered via DEF-DEV admin panel",
    possibleCauses: ["Intentional test"],
    suggestedFixes: ["Click restart to continue"]
  },
  UNHANDLED_EXCEPTION: { 
    hex: "0x00000099", 
    severity: "HIGH", 
    category: "Exception",
    userDescription: "An unexpected error occurred that wasn't handled",
    technicalDescription: "Uncaught exception propagated to top level error boundary",
    possibleCauses: ["Unhandled promise rejection", "Uncaught throw", "Async error"],
    suggestedFixes: ["Restart system", "Report bug with console logs"]
  },
  ASYNC_FAILURE: { 
    hex: "0x0000009A", 
    severity: "MEDIUM", 
    category: "Async",
    userDescription: "An asynchronous operation failed unexpectedly",
    technicalDescription: "Unhandled promise rejection at top level",
    possibleCauses: ["Network timeout", "API error", "Race condition"],
    suggestedFixes: ["Retry the operation", "Check network connection"]
  },
  UNKNOWN_FATAL: { 
    hex: "0x000000DE", 
    severity: "CRITICAL", 
    category: "Unknown",
    userDescription: "An unknown fatal error occurred",
    technicalDescription: "Unrecognized error type triggered system halt",
    possibleCauses: ["Unknown"],
    suggestedFixes: ["Factory reset may be required", "Contact developers"]
  },
};

export const BugcheckScreen = ({ bugcheck, onRestart, onReportToDev, onRecovery }: BugcheckScreenProps) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [showingDetails, setShowingDetails] = useState(false);

  const codeInfo = BUGCHECK_CODES[bugcheck.code] || {
    hex: "0x000000DE",
    severity: "CRITICAL" as const,
    category: "Unknown",
    userDescription: "An unknown error occurred",
    technicalDescription: bugcheck.description,
    possibleCauses: ["Unknown cause"],
    suggestedFixes: ["Restart the system"]
  };

  // Save bugcheck to localStorage for DEF-DEV
  useEffect(() => {
    const existing = localStorage.getItem('urbanshade_bugchecks');
    const bugchecks = existing ? JSON.parse(existing) : [];
    bugchecks.push({ ...bugcheck, fromError: true });
    localStorage.setItem('urbanshade_bugchecks', JSON.stringify(bugchecks.slice(-50)));
  }, [bugcheck]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedOption(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowDown") {
        setSelectedOption(prev => Math.min(2, prev + 1));
      } else if (e.key === "Enter") {
        if (selectedOption === 0) onRestart();
        else if (selectedOption === 1) onRestart();
        else if (selectedOption === 2 && onRecovery) onRecovery();
      } else if (e.key === "F8") {
        setShowingDetails(!showingDetails);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOption, onRestart, onRecovery, showingDetails]);

  const options = [
    { 
      label: "Launch Startup Repair (recommended)", 
      desc: "Attempt to automatically fix problems that are preventing UrbanShade from starting",
    },
    { 
      label: "Start UrbanShade Normally", 
      desc: "Continue to boot without making changes",
    },
    { 
      label: "Open Recovery Environment", 
      desc: "Access advanced recovery tools and options",
    },
  ];

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    if (index === 0) onRestart();
    else if (index === 1) onRestart();
    else if (index === 2 && onRecovery) onRecovery();
    else if (index === 2) onReportToDev();
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col font-mono z-[9999] select-none">
      {/* Grey header bar - classic BIOS style */}
      <div className="bg-[#aaaaaa] text-black px-4 py-1.5 text-center">
        <span className="font-bold tracking-wide">UrbanShade Error Recovery</span>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 text-[13px] leading-relaxed">
        {/* Error message */}
        <p className="mb-2">
          UrbanShade failed to start. A recent hardware or software change might be
        </p>
        <p className="mb-4">the cause.</p>

        {/* Error details block */}
        <div className="mb-4 text-gray-400">
          <p>Status: {codeInfo.hex} {bugcheck.code}</p>
          {bugcheck.location && <p>File: {bugcheck.location}</p>}
        </div>

        {/* Help text */}
        <p className="mb-2">
          If UrbanShade files have been damaged or configured incorrectly, Startup Repair
        </p>
        <p className="mb-2">
          can help diagnose and fix the problem. If power was interrupted during
        </p>
        <p className="mb-4">startup, choose Start UrbanShade Normally.</p>

        <p className="text-gray-400 mb-6">(Use the arrow keys to highlight your choice.)</p>

        {/* Options list */}
        <div className="space-y-0.5 mb-8">
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => handleOptionClick(i)}
              onMouseEnter={() => setSelectedOption(i)}
              className={`px-2 py-0.5 cursor-pointer ${
                selectedOption === i 
                  ? "bg-[#aaaaaa] text-black" 
                  : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>

        {/* Description of selected option */}
        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-300">
            Description: {options[selectedOption]?.desc}
          </p>
        </div>

        {/* Technical details (F8 to toggle) */}
        {showingDetails && (
          <div className="mt-6 pt-4 border-t border-gray-700 text-gray-500 text-xs">
            <p className="mb-2">Technical Details:</p>
            <p className="mb-1">  {codeInfo.technicalDescription}</p>
            <p className="mt-2 mb-1">Possible Causes:</p>
            {codeInfo.possibleCauses.map((cause, i) => (
              <p key={i}>  - {cause}</p>
            ))}
            {bugcheck.stackTrace && (
              <>
                <p className="mt-2 mb-1">Stack Trace:</p>
                <pre className="text-[10px] whitespace-pre-wrap max-h-20 overflow-y-auto">
                  {bugcheck.stackTrace}
                </pre>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer bar - classic BIOS style */}
      <div className="bg-[#aaaaaa] text-black px-4 py-1.5 flex justify-between text-[13px]">
        <span>ENTER=Choose</span>
        <span>
          <button 
            onClick={onReportToDev}
            className="hover:underline mr-6"
          >
            F10=DEF-DEV
          </button>
          <span>F8=Details</span>
        </span>
        <span>ESC=Cancel</span>
      </div>
    </div>
  );
};

// Helper to create bugcheck
export const createBugcheck = (
  code: keyof typeof BUGCHECK_CODES | string, 
  description: string, 
  location?: string,
  stackTrace?: string
): BugcheckData => ({
  code,
  description,
  timestamp: new Date().toISOString(),
  location,
  stackTrace,
  systemInfo: {
    userAgent: navigator.userAgent.slice(0, 80),
    localStorage: `${localStorage.length} entries`,
    url: window.location.pathname,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
  }
});
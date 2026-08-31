import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  FileText,
  CheckCircle2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Play,
  Cpu,
  Layers,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  Sun,
  Moon,
  AlertCircle,
  Trophy,
  Upload,
  Code,
} from 'lucide-react';
import API from '../../services/api';
import { MonacoCodeEditor } from '../editor/MonacoCodeEditor';

const TECH_STACKS = [
  { id: 'Java', name: 'Java', color: 'from-amber-500 to-orange-600', icon: '☕' },
  { id: 'Python', name: 'Python', color: 'from-blue-500 to-cyan-500', icon: '🐍' },
  { id: 'Node.js', name: 'Node.js', color: 'from-emerald-500 to-teal-600', icon: '🟢' },
  { id: 'React.js', name: 'React.js', color: 'from-sky-500 to-indigo-500', icon: '⚛️' },
  { id: 'C++', name: 'C++', color: 'from-purple-500 to-indigo-600', icon: '⚡' },
  { id: 'System Design', name: 'System Design', color: 'from-pink-500 to-rose-600', icon: '🌐' },
  { id: 'SQL & DB', name: 'SQL & DB', color: 'from-slate-500 to-slate-700', icon: '🗄️' },
];

const AI_PERSONAS = [
  { role: 'Senior Java Microservices Architect', topic: 'Java', difficulty: 'Senior Architect', desc: 'Deep dive into JVM internals, Spring Boot, concurrency, and Kafka.' },
  { role: 'Python AI & Backend Engineer', topic: 'Python', difficulty: 'Mid-Level', desc: 'Focuses on GIL, asyncio, memory management, and FastAPI performance.' },
  { role: 'Full-Stack Node & React Architect', topic: 'Node.js', difficulty: 'Senior Architect', desc: 'Covers Libuv event loop, React 18 Fiber, streams, and system scaling.' },
  { role: 'Low-Latency C++ Systems Engineer', topic: 'C++', difficulty: 'Staff Principal', desc: 'Tests RAII, move semantics, smart pointers, memory layouts, and vtables.' },
  { role: 'Distributed Systems & Cloud Lead', topic: 'System Design', difficulty: 'Senior Architect', desc: 'Rate limiters, database sharding, consistent hashing, and caching.' },
  { role: 'Database Performance Engineer', topic: 'SQL & DB', difficulty: 'Senior Architect', desc: 'Focuses on query optimization, indexing strategies, transaction management, and database scaling.' },
];

const RANDOM_QUESTIONS = {
  'Java': [
    { 
      type: 'mcq',
      question: "What is the difference between == and .equals() in Java?", 
      difficulty: 'easy', 
      tags: ['basics', 'comparison', 'objects'],
      options: [
        "A) == compares values, .equals() compares references",
        "B) == compares references, .equals() compares values",
        "C) Both compare references",
        "D) Both compare values"
      ],
      correctAnswer: 1, // Index of correct option (0-based)
      expectedKeyPoints: ['== compares references', '.equals() compares values', 'String pool behavior']
    },
    { 
      type: 'mcq',
      question: "Which data structure is best for frequent insertions and deletions at both ends?", 
      difficulty: 'medium', 
      tags: ['collections', 'data-structures', 'performance'],
      options: [
        "A) ArrayList",
        "B) LinkedList",
        "C) HashSet",
        "D) TreeMap"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['LinkedList node-based', 'Doubly-linked structure', 'O(1) operations at ends']
    },
    { 
      type: 'coding',
      question: "Write a Java method to reverse a string without using built-in reverse functions.",
      difficulty: 'medium', 
      tags: ['strings', 'algorithms', 'coding'],
      starterCode: `public String reverseString(String str) {
    // Your code here
    return "";
}`,
      expectedKeyPoints: ['StringBuilder or char array', 'Loop iteration', 'String concatenation']
    },
    { 
      type: 'coding',
      question: "Implement a thread-safe singleton pattern in Java.",
      difficulty: 'hard', 
      tags: ['design-patterns', 'concurrency', 'thread-safety'],
      starterCode: `public class Singleton {
    private static Singleton instance;
    
    // Your code here
    
    public static Singleton getInstance() {
        return instance;
    }
}`,
      expectedKeyPoints: ['Private constructor', 'Static instance', 'Synchronized access', 'Double-checked locking']
    },
    { 
      type: 'text',
      question: "How does Java's garbage collection work and what are the different types of collectors?", 
      difficulty: 'hard', 
      tags: ['memory-management', 'jvm', 'performance'],
      expectedKeyPoints: ['Generational garbage collection', 'G1 collector', 'CMS collector', 'Serial/Parallel collectors']
    },
  ],
  'Python': [
    { 
      type: 'mcq',
      question: "What is the difference between lists and tuples in Python?", 
      difficulty: 'easy', 
      tags: ['basics', 'data-structures', 'immutability'],
      options: [
        "A) Lists are immutable, tuples are mutable",
        "B) Lists are mutable, tuples are immutable",
        "C) Both are immutable",
        "D) Both are mutable"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['Lists are mutable', 'Tuples are immutable', 'Performance differences']
    },
    { 
      type: 'mcq',
      question: "What does the Global Interpreter Lock (GIL) affect in Python?", 
      difficulty: 'medium', 
      tags: ['concurrency', 'performance', 'internals'],
      options: [
        "A) Memory management",
        "B) Multi-threaded CPU performance",
        "C) File I/O operations",
        "D) Network operations"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['GIL prevents parallel execution', 'Impact on CPU-bound tasks', 'Workarounds with multiprocessing']
    },
    { 
      type: 'coding',
      question: "Write a Python function to implement a binary search algorithm.",
      difficulty: 'medium', 
      tags: ['algorithms', 'search', 'coding'],
      starterCode: `def binary_search(arr, target):
    # Your code here
    return -1`,
      expectedKeyPoints: ['Divide and conquer', 'Sorted array requirement', 'Time complexity O(log n)']
    },
    { 
      type: 'coding',
      question: "Implement a Python decorator that measures function execution time.",
      difficulty: 'hard', 
      tags: ['decorators', 'metaprogramming', 'performance'],
      starterCode: `import time

def timing_decorator(func):
    # Your code here
    return wrapper

@timing_decorator
def example_function():
    time.sleep(1)`,
      expectedKeyPoints: ['Function wrapper', 'Time measurement', 'Preserving function metadata']
    },
    { 
      type: 'text',
      question: "How does Python's asyncio and event loop mechanism work for concurrent programming?", 
      difficulty: 'hard', 
      tags: ['async', 'concurrency', 'event-loop'],
      expectedKeyPoints: ['Event loop architecture', 'async/await syntax', 'Coroutines vs threads', 'I/O performance']
    },
  ],
  'Node.js': [
    { 
      type: 'mcq',
      question: "What is Node.js and why is it used for backend development?", 
      difficulty: 'easy', 
      tags: ['basics', 'architecture', 'javascript'],
      options: [
        "A) A database management system",
        "B) A JavaScript runtime for server-side development",
        "C) A frontend framework",
        "D) A CSS preprocessor"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['V8 engine', 'Event-driven', 'Non-blocking I/O', 'Single-threaded']
    },
    { 
      type: 'mcq',
      question: "Which phase of the Node.js event loop handles I/O callbacks?", 
      difficulty: 'medium', 
      tags: ['internals', 'event-loop', 'asynchronous'],
      options: [
        "A) Timers phase",
        "B) Poll phase",
        "C) Check phase",
        "D) Close callbacks phase"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['Poll phase', 'I/O callback execution', 'Event loop phases']
    },
    { 
      type: 'coding',
      question: "Write a Node.js function to read a file asynchronously and return its content.",
      difficulty: 'medium', 
      tags: ['file-system', 'async', 'coding'],
      starterCode: `const fs = require('fs').promises;

async function readFileContent(filePath) {
    // Your code here
    return "";
}`,
      expectedKeyPoints: ['fs.promises API', 'Async/await', 'Error handling', 'File path handling']
    },
    { 
      type: 'coding',
      question: "Implement a simple Express.js middleware for logging request details.",
      difficulty: 'hard', 
      tags: ['express', 'middleware', 'logging'],
      starterCode: `function requestLogger(req, res, next) {
    // Your code here
    next();
}`,
      expectedKeyPoints: ['Middleware pattern', 'Request/response objects', 'Next function', 'Logging implementation']
    },
    { 
      type: 'text',
      question: "What are streams in Node.js and when would you use them for processing large data?", 
      difficulty: 'hard', 
      tags: ['streams', 'performance', 'data-processing'],
      expectedKeyPoints: ['Readable/writable streams', 'Pipe mechanism', '_BACKPRESSURE handling', 'Memory efficiency']
    },
  ],
  'React.js': [
    { 
      type: 'mcq',
      question: "What is React and why would you use it for building user interfaces?", 
      difficulty: 'easy', 
      tags: ['basics', 'components', 'virtual-dom'],
      options: [
        "A) A database framework",
        "B) A JavaScript library for building user interfaces",
        "C) A CSS framework",
        "D) A backend framework"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['Component-based', 'Virtual DOM', 'Declarative syntax', 'One-way data flow']
    },
    { 
      type: 'mcq',
      question: "Which React hook is used for side effects in functional components?", 
      difficulty: 'medium', 
      tags: ['hooks', 'state-management', 'functional-components'],
      options: [
        "A) useState",
        "B) useEffect",
        "C) useContext",
        "D) useReducer"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['useEffect', 'Side effects', 'Dependency array', 'Cleanup function']
    },
    { 
      type: 'coding',
      question: "Write a React component that fetches data from an API and displays it.",
      difficulty: 'medium', 
      tags: ['hooks', 'api', 'coding'],
      starterCode: `import React, { useState, useEffect } from 'react';

function DataFetcher() {
    // Your code here
    return (
        <div>
            {/* Display data here */}
        </div>
    );
}`,
      expectedKeyPoints: ['useState', 'useEffect', 'Fetch API', 'Loading states', 'Error handling']
    },
    { 
      type: 'coding',
      question: "Implement a custom React hook for managing local storage.",
      difficulty: 'hard', 
      tags: ['hooks', 'custom-hooks', 'storage'],
      starterCode: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // Your code here
    return [value, setValue];
}`,
      expectedKeyPoints: ['Custom hook pattern', 'LocalStorage API', 'Synchronization', 'Error handling']
    },
    { 
      type: 'text',
      question: "How does React's reconciliation algorithm work to update the DOM efficiently?", 
      difficulty: 'hard', 
      tags: ['internals', 'performance', 'virtual-dom'],
      expectedKeyPoints: ['Diff algorithm', 'Key importance', 'Component lifecycle', 'Batching updates']
    },
  ],
  'C++': [
    { 
      type: 'mcq',
      question: "What is the difference between a struct and a class in C++?", 
      difficulty: 'easy', 
      tags: ['basics', 'oop', 'access-control'],
      options: [
        "A) Structs can't have methods, classes can",
        "B) Structs have public default access, classes have private",
        "C) Structs are value types, classes are reference types",
        "D) No difference"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['Default access modifiers', 'Inheritance differences', 'Usage conventions']
    },
    { 
      type: 'mcq',
      question: "Which smart pointer should be used for exclusive ownership of a resource?", 
      difficulty: 'medium', 
      tags: ['memory-management', 'pointers', 'modern-cpp'],
      options: [
        "A) shared_ptr",
        "B) weak_ptr",
        "C) unique_ptr",
        "D) raw pointer"
      ],
      correctAnswer: 2,
      expectedKeyPoints: ['unique_ptr ownership', 'Exclusive access', 'Memory management', 'No copying']
    },
    { 
      type: 'coding',
      question: "Write a C++ function to implement a template-based stack data structure.",
      difficulty: 'medium', 
      tags: ['templates', 'data-structures', 'coding'],
      starterCode: `template <typename T>
class Stack {
private:
    // Your code here
public:
    void push(const T& value);
    T pop();
    bool isEmpty() const;
};`,
      expectedKeyPoints: ['Template syntax', 'Dynamic array or linked list', 'Push/pop operations', 'Memory management']
    },
    { 
      type: 'coding',
      question: "Implement a C++ class using RAII for file resource management.",
      difficulty: 'hard', 
      tags: ['memory-management', 'resources', 'best-practices'],
      starterCode: `#include <fstream>
#include <string>

class FileHandler {
private:
    std::ofstream file;
    std::string filename;
public:
    FileHandler(const std::string& fname);
    ~FileHandler();
    void write(const std::string& content);
};`,
      expectedKeyPoints: ['Constructor acquisition', 'Destructor release', 'Exception safety', 'Automatic cleanup']
    },
    { 
      type: 'text',
      question: "What are move semantics in C++ and how do they improve performance over copy semantics?", 
      difficulty: 'hard', 
      tags: ['performance', 'cpp11', 'optimization'],
      expectedKeyPoints: ['Rvalue references', 'Move constructor', 'Move assignment', 'Performance benefits']
    },
  ],
  'System Design': [
    { 
      type: 'mcq',
      question: "What is the difference between vertical and horizontal scaling?", 
      difficulty: 'easy', 
      tags: ['scalability', 'architecture', 'basics'],
      options: [
        "A) Vertical: add more servers, Horizontal: upgrade existing server",
        "B) Vertical: upgrade existing server, Horizontal: add more servers",
        "C) Both are the same",
        "D) Vertical: scale out, Horizontal: scale up"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['Vertical: scale up', 'Horizontal: scale out', 'Cost implications', 'Complexity differences']
    },
    { 
      type: 'mcq',
      question: "According to CAP theorem, which properties can a distributed system simultaneously guarantee?", 
      difficulty: 'medium', 
      tags: ['distributed-systems', 'consistency', 'availability'],
      options: [
        "A) Consistency, Availability, Partition tolerance",
        "B) Only two of the three properties",
        "C) All three properties",
        "D) Only one property"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['Consistency', 'Availability', 'Partition tolerance', 'Trade-offs']
    },
    { 
      type: 'coding',
      question: "Design a simple rate limiter using the token bucket algorithm (pseudo-code).",
      difficulty: 'medium', 
      tags: ['algorithms', 'security', 'scalability'],
      starterCode: `class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate;
        this.lastRefill = Date.now();
    }
    
    // Your code here
    allowRequest() {
        // Implement token bucket logic
        return true/false;
    }
}`,
      expectedKeyPoints: ['Token bucket algorithm', 'Rate limiting', 'Refill mechanism', 'Capacity management']
    },
    { 
      type: 'coding',
      question: "Design a simple URL shortener service (describe the data model and API endpoints).",
      difficulty: 'hard', 
      tags: ['architecture', 'api-design', 'database'],
      starterCode: `// Data Model
interface ShortenedURL {
    id: string;
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    expiresAt?: Date;
}

// API Endpoints to implement:
// POST /shorten - Create short URL
// GET /:code - Redirect to original URL
// GET /stats/:code - Get URL statistics

// Your implementation notes:`,
      expectedKeyPoints: ['Database schema', 'API design', 'Hash function', 'Redirection logic', 'Analytics']
    },
    { 
      type: 'text',
      question: "What are microservices and how do they differ from monolithic architecture in terms of scalability?", 
      difficulty: 'hard', 
      tags: ['architecture', 'microservices', 'scalability'],
      expectedKeyPoints: ['Service decomposition', 'Independent deployment', 'Communication patterns', 'Operational complexity']
    },
  ],
  'SQL & DB': [
    { 
      type: 'mcq',
      question: "What is the difference between DELETE and TRUNCATE in SQL?", 
      difficulty: 'easy', 
      tags: ['basics', 'operations', 'performance'],
      options: [
        "A) DELETE is DDL, TRUNCATE is DML",
        "B) DELETE is DML, TRUNCATE is DDL",
        "C) Both are DML",
        "D) Both are DDL"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['DELETE is DML', 'TRUNCATE is DDL', 'Rollback capability', 'Performance differences']
    },
    { 
      type: 'mcq',
      question: "Which JOIN returns all rows from the left table and matching rows from the right table?", 
      difficulty: 'medium', 
      tags: ['joins', 'queries', 'data-retrieval'],
      options: [
        "A) INNER JOIN",
        "B) LEFT JOIN",
        "C) RIGHT JOIN",
        "D) FULL OUTER JOIN"
      ],
      correctAnswer: 1,
      expectedKeyPoints: ['LEFT JOIN', 'All left table rows', 'Matching right table rows', 'NULL handling']
    },
    { 
      type: 'coding',
      question: "Write a SQL query to find the top 3 highest-paid employees in each department.",
      difficulty: 'medium', 
      tags: ['queries', 'aggregation', 'window-functions'],
      starterCode: `-- Table: employees (id, name, salary, department_id)
-- Table: departments (id, name)

SELECT 
    d.name as department,
    e.name as employee,
    e.salary
FROM employees e
-- Your code here
ORDER BY d.name, e.salary DESC;`,
      expectedKeyPoints: ['Window functions', 'PARTITION BY', 'ROW_NUMBER or RANK', 'JOIN operations']
    },
    { 
      type: 'coding',
      question: "Write a SQL query to find duplicate records in a table and delete them.",
      difficulty: 'hard', 
      tags: ['queries', 'duplicates', 'data-cleaning'],
      starterCode: `-- Table: users (id, email, name, created_at)

-- Find duplicates:
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Delete duplicates (keep the one with lowest id):
-- Your code here`,
      expectedKeyPoints: ['GROUP BY', 'HAVING clause', 'Subqueries', 'DELETE with JOIN', 'ROW_NUMBER']
    },
    { 
      type: 'text',
      question: "Explain the difference between clustered and non-clustered indexes and their impact on database performance.", 
      difficulty: 'hard', 
      tags: ['performance', 'indexes', 'internals'],
      expectedKeyPoints: ['Clustered: data order', 'Non-clustered: separate structure', 'Storage implications', 'Query optimization']
    },
  ],
};

export const VoiceInterviewRoom = ({ onCompleteReport, isDark: propIsDark, setIsDark: propSetIsDark }) => {
  // Topic and difficulty selection
  const [selectedTopic, setSelectedTopic] = useState('React.js');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(1);
  
  // Modal states
  const [showSmartMatchModal, setShowSmartMatchModal] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showForceSubmit, setShowForceSubmit] = useState(false);
  
  // Session states
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  
  // Validation states
  const [responseValidation, setResponseValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  
  // Question states
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionMetrics, setQuestionMetrics] = useState([]);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [questionTypeProgress, setQuestionTypeProgress] = useState({
    mcq: { answered: 0, correct: 0, total: 2 },
    coding: { answered: 0, total: 2 },
    text: { answered: 0, total: 1 }
  });
  
  // Answer states
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [codeEditorContent, setCodeEditorContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Voice/AI states
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [liveCaption, setLiveCaption] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "Can you explain how React's Virtual DOM reconciliation diffing algorithm works, and why unique keys are required for list elements?",
    difficulty: 'medium',
    tags: ['react', 'performance', 'virtual-dom'],
    expectedKeyPoints: ["Tree comparison O(N) heuristic", "Component type matching", "Keyed element reordering"],
  });
  const [candidateResponse, setCandidateResponse] = useState('');
  const [transcriptHistory, setTranscriptHistory] = useState([
    {
      speaker: 'AI Technical Evaluator',
      text: "Can you explain how React's Virtual DOM reconciliation diffing algorithm works, and why unique keys are required for list elements?",
      time: 'Just now',
    },
  ]);
  const [evaluating, setEvaluating] = useState(false);
  const [lastEval, setLastEval] = useState(null);
  const [cumulativeScores, setCumulativeScores] = useState([]);
  
  // Interaction states
  const [hasInteracted, setHasInteracted] = useState(false);
  const recognitionRef = useRef(null);
  
  // Use props if provided, otherwise use local state for backward compatibility
  const [localIsDark, setLocalIsDark] = useState(false);
  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;
  const setIsDark = propSetIsDark !== undefined ? propSetIsDark : setLocalIsDark;

  // Question timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sessionComplete && !evaluating) {
        setQuestionTimer(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionComplete, evaluating]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Check for session completion
  useEffect(() => {
    if (questionCount > 5) {
      setSessionComplete(true);
      const totalScore = cumulativeScores.length > 0 
        ? Math.round(cumulativeScores.reduce((a, b) => a + b, 0) / cumulativeScores.length)
        : 0;
      
      // Calculate actual MCQ correct count
      const actualMcqCorrect = questionTypeProgress.mcq.correct;
      
      const summary = {
        totalQuestions: questionCount - 1,
        mcqScore: actualMcqCorrect,
        mcqTotal: questionTypeProgress.mcq.total,
        mcqAnswered: questionTypeProgress.mcq.answered,
        codingCompleted: questionTypeProgress.coding.answered,
        codingTotal: questionTypeProgress.coding.total,
        textCompleted: questionTypeProgress.text.answered,
        textTotal: questionTypeProgress.text.total,
        overallScore: totalScore,
        totalTime: questionTimer,
        questionMetrics: questionMetrics,
        sessionScores: cumulativeScores,
        topic: selectedTopic,
      };
      setSessionSummary(summary);
      
      // Auto-generate report
      if (onCompleteReport) {
        onCompleteReport(summary);
      }
    }
  }, [questionCount, questionTypeProgress, cumulativeScores, questionTimer, questionMetrics, onCompleteReport]);

  const generateRandomQuestion = () => {
    const topicQuestions = RANDOM_QUESTIONS[selectedTopic] || RANDOM_QUESTIONS['React.js'];
    
    // Get available questions that haven't been asked yet
    const availableQuestions = topicQuestions.filter(q => !askedQuestions.has(q.question));
    
    // If all questions have been asked, reset
    if (availableQuestions.length === 0) {
      setAskedQuestions(new Set());
      return generateRandomQuestion();
    }
    
    // Select random question from available ones
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Mark as asked
    setAskedQuestions(prev => new Set([...prev, selectedQuestion.question]));
    
    // Set question start time for tracking
    setQuestionStartTime(Date.now());
    
    // Reset question timer for new question
    setQuestionTimer(0);
    
    // Reset type-specific states
    setSelectedMcqOption(null);
    setCodeEditorContent(selectedQuestion.starterCode || `function solve(input) {\n  // Write your code solution here...\n  return "15";\n}`);
    setUploadedFile(null);
    
    return selectedQuestion;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCandidateResponse(event.target.result);
        setUploadedFile(file.name);
        setValidationError(null);
        setValidationWarnings([]);
        setValidationResult(null);
      };
      reader.readAsText(file);
    }
  };

  const checkAnswerValidation = (response) => {
    const errors = [];
    const warnings = [];
    const questionText = typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion;
    const expectedPoints = currentQuestion?.expectedKeyPoints || [];

    // Check if response is empty
    if (!response || response.trim().length === 0) {
      errors.push('Response cannot be empty. Please provide an answer.');
      return { isValid: false, errors, warnings, score: 0 };
    }

    // Check minimum length (at least 10 characters for meaningful response - reduced from 20)
    if (response.trim().length < 10) {
      errors.push('Response is too short. Please provide a more detailed answer (minimum 10 characters).');
    }

    // Check if response contains expected key points (correctness check)
    let correctnessScore = 0;
    let matchedPoints = [];
    let missingPoints = [];
    
    if (expectedPoints.length > 0) {
      const lowerResponse = response.toLowerCase();
      matchedPoints = expectedPoints.filter(point => 
        lowerResponse.includes(point.toLowerCase())
      );
      missingPoints = expectedPoints.filter(point => 
        !lowerResponse.includes(point.toLowerCase())
      );
      
      // Calculate correctness score based on key points coverage
      correctnessScore = Math.round((matchedPoints.length / expectedPoints.length) * 100);
      
      // Changed from error to warning - allow submission even with no key points matched
      if (matchedPoints.length === 0) {
        warnings.push('Your answer doesn\'t seem to address the key concepts. Try to include relevant technical terms and concepts, but you can still proceed.');
      } else if (correctnessScore < 50) {
        warnings.push(`Your answer only covers ${matchedPoints.length} out of ${expectedPoints.length} key concepts. Consider adding more details.`);
      }
    }

    // Check if response is just repeating the question
    const lowerResponse = response.toLowerCase();
    const lowerQuestion = questionText.toLowerCase();
    if (lowerResponse.includes(lowerQuestion.substring(0, 20))) {
      errors.push('Your answer appears to repeat the question. Please provide a substantive response.');
    }

    // Check response quality indicators
    const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 5) {
      warnings.push('Your answer is quite brief. Consider providing more detailed explanation.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: correctnessScore,
      matchedPoints,
      missingPoints,
      wordCount,
      totalExpectedPoints: expectedPoints.length
    };
  };

  // Session timer
  useEffect(() => {
    if (hasInteracted && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
  }, [hasInteracted, sessionStartTime]);

  const getSessionDuration = () => {
    if (!sessionStartTime) return '0:00';
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    if (hasInteracted && currentQuestion) {
      const questionText = typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion;
      speakAiText(questionText);
    }
  }, [hasInteracted, currentQuestion]);

  const speakAiText = (text) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsAiSpeaking(true);
        utterance.onend = () => setIsAiSpeaking(false);
        utterance.onerror = () => setIsAiSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        setIsAiSpeaking(false);
      }
    }
  };

  const handleTopicChange = async (topicId) => {
    setSelectedTopic(topicId);
    setQuestionCount(1);
    setEvaluating(true);
    try {
      const res = await API.get(`/ai/question?topic=${encodeURIComponent(topicId)}&difficulty=${selectedDifficulty}&questionCount=1`);
      if (res.data.success && res.data.data) {
        const qObj = res.data.data;
        setCurrentQuestion(qObj);
        const questionText = typeof qObj === 'object' ? qObj.question : qObj;
        const newRecord = {
          speaker: 'AI Technical Evaluator',
          text: `[Switched to ${topicId}] ${questionText}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setTranscriptHistory((prev) => [...prev, newRecord]);
        speakAiText(questionText);
      }
    } catch (err) {
      console.warn('API question fetch fallback engaged');
      // Use local questions as fallback
      const randomQuestion = generateRandomQuestion();
      setCurrentQuestion(randomQuestion);
      const questionText = typeof randomQuestion === 'object' ? randomQuestion.question : randomQuestion;
      const newRecord = {
        speaker: 'AI Technical Evaluator',
        text: `[Switched to ${topicId}] ${questionText}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setTranscriptHistory((prev) => [...prev, newRecord]);
      speakAiText(questionText);
    } finally {
      setEvaluating(false);
    }
  };

  const handleApplyPersona = (persona) => {
    setSelectedTopic(persona.topic);
    setSelectedDifficulty(persona.difficulty);
    setShowSmartMatchModal(false);
    handleTopicChange(persona.topic);
  };

  const toggleMicListening = () => {
    if (!isListening) {
      setIsListening(true);
      setLiveCaption('');
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
          let interimText = '';
          let finalText = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalText += transcript + ' ';
            } else {
              interimText += transcript;
            }
          }
          
          // Update live caption with interim results
          setLiveCaption(finalText + interimText);
          // Update candidate response with final text
          if (finalText) {
            setCandidateResponse(prev => prev + finalText);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setValidationError('Microphone access denied. Please allow microphone access in your browser settings.');
          } else if (event.error === 'no-speech') {
            setValidationError('No speech detected. Please try again.');
          } else {
            setValidationError('Speech recognition error: ' + event.error);
          }
          setIsListening(false);
          setLiveCaption('');
        };

        recognition.onend = () => {
          if (isListening && recognitionRef.current) {
            // Restart if still supposed to be listening
            recognition.start();
          }
        };

        recognition.start();
      } else {
        console.error('Speech recognition not supported in this browser');
        setIsListening(false);
      }
    } else {
      setIsListening(false);
      setLiveCaption('');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  const handleSubmitAnswer = async (force = false) => {
    let userText = '';
    let isMcqCorrect = false;

    // Handle different question types
    if (currentQuestion?.type === 'mcq') {
      if (selectedMcqOption === null) {
        setValidationError('Please select an option before submitting.');
        return;
      }
      userText = currentQuestion.options[selectedMcqOption];
      isMcqCorrect = selectedMcqOption === currentQuestion.correctAnswer;
      
      // For MCQ, if answer is wrong, show error
      if (!isMcqCorrect && !force) {
        setValidationError('Incorrect answer. Please try again.');
        return;
      }
    } else if (currentQuestion?.type === 'coding') {
      if (!codeEditorContent.trim()) {
        setValidationError('Please provide a code solution before submitting.');
        return;
      }
      userText = codeEditorContent;
    } else if (currentQuestion?.type === 'text') {
      if (!candidateResponse.trim() && !uploadedFile) {
        setValidationError('Please provide an answer before submitting.');
        return;
      }
      userText = candidateResponse;
    } else {
      // Fallback for questions without explicit type
      if (!candidateResponse.trim() && !uploadedFile) {
        setValidationError('Please provide an answer before submitting.');
        return;
      }
      userText = candidateResponse;
    }

    // Validate the response for text/coding questions
    if (currentQuestion?.type !== 'mcq') {
      setIsCheckingAnswer(true);
      setValidationError(null);
      setValidationWarnings([]);
      setValidationResult(null);
      setShowForceSubmit(false);
      
      const validation = checkAnswerValidation(userText);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        setValidationError(validation.errors[0]);
        setIsCheckingAnswer(false);
        return;
      }

      if (validation.warnings.length > 0 && !force) {
        setValidationWarnings(validation.warnings);
        setShowForceSubmit(true);
        setIsCheckingAnswer(false);
        return;
      }
    }

    setIsCheckingAnswer(false);
    setCandidateResponse('');
    setUploadedFile(null);
    setIsListening(false);

    // Calculate time spent on this question
    const timeSpent = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTranscript = [
      ...transcriptHistory,
      { speaker: 'Candidate', text: userText, time: timeStr },
    ];
    setTranscriptHistory(newTranscript);

    setEvaluating(true);
    try {
      const nextQNum = questionCount + 1;
      const questionText = typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion;
      
      const res = await API.post('/ai/evaluate', {
        question: questionText,
        candidateAnswer: userText,
        topic: selectedTopic,
        questionCount: nextQNum,
        expectedKeyPoints: currentQuestion.expectedKeyPoints || [],
        questionType: currentQuestion?.type || 'text',
        isMcqCorrect: currentQuestion?.type === 'mcq' ? isMcqCorrect : undefined,
      });

      if (res.data.success && res.data.data) {
        const evalData = res.data.data;
        setLastEval(evalData);
        if (evalData.score) {
          setCumulativeScores((prev) => [...prev, evalData.score]);
        }

        // Track question metrics
        const metric = {
          questionNumber: questionCount,
          question: questionText,
          difficulty: currentQuestion.difficulty || 'medium',
          tags: currentQuestion.tags || [],
          timeSpent: timeSpent,
          score: evalData.score,
          keyPointsCovered: evalData.mlAnalysis?.foundTerms || [],
          feedback: evalData.feedback,
          questionType: currentQuestion?.type || 'text',
          isMcqCorrect: currentQuestion?.type === 'mcq' ? isMcqCorrect : undefined,
        };
        setQuestionMetrics(prev => [...prev, metric]);

        // Update question type progress
        if (currentQuestion?.type) {
          setQuestionTypeProgress(prev => ({
            ...prev,
            [currentQuestion.type]: {
              ...prev[currentQuestion.type],
              answered: prev[currentQuestion.type].answered + 1,
              correct: currentQuestion.type === 'mcq' && isMcqCorrect 
                ? prev[currentQuestion.type].correct + 1 
                : prev[currentQuestion.type].correct
            }
          }));
        }

        const aiFollowUp = evalData.followUpQuestion || `Great response! Now let's explore deeper memory management in ${selectedTopic}.`;
        setCurrentQuestion({ question: aiFollowUp });
        setQuestionCount(nextQNum);

        newTranscript.push({
          speaker: 'AI Technical Evaluator',
          text: `[Question #${nextQNum}] ${aiFollowUp}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setTranscriptHistory(newTranscript);
        speakAiText(aiFollowUp);
      }
    } catch (err) {
      console.warn('API evaluation fallback engaged');
      const nextQNum = questionCount + 1;
      const randomQuestionObj = generateRandomQuestion();
      const randomQuestion = typeof randomQuestionObj === 'object' ? randomQuestionObj.question : randomQuestionObj;
      
      // Track question metrics for fallback
      const metric = {
        questionNumber: questionCount,
        question: typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion,
        difficulty: currentQuestion.difficulty || 'medium',
        tags: currentQuestion.tags || [],
        timeSpent: timeSpent,
        score: currentQuestion?.type === 'mcq' ? (isMcqCorrect ? 100 : 0) : validationResult?.score || 70,
        keyPointsCovered: validationResult?.matchedPoints || [],
        feedback: validationResult?.warnings?.join('. ') || 'API unavailable - using offline evaluation',
        questionType: currentQuestion?.type || 'text',
        isMcqCorrect: currentQuestion?.type === 'mcq' ? isMcqCorrect : undefined,
      };
      setQuestionMetrics(prev => [...prev, metric]);

      // Update question type progress for fallback
      if (currentQuestion?.type) {
        setQuestionTypeProgress(prev => ({
          ...prev,
          [currentQuestion.type]: {
            ...prev[currentQuestion.type],
            answered: prev[currentQuestion.type].answered + 1,
            correct: currentQuestion.type === 'mcq' && isMcqCorrect 
              ? prev[currentQuestion.type].correct + 1 
              : prev[currentQuestion.type].correct
          }
        }));
      }

      setCurrentQuestion(randomQuestionObj);
      setQuestionCount(nextQNum);

      newTranscript.push({
        speaker: 'AI Technical Evaluator',
        text: `[Question #${nextQNum}] ${randomQuestion}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setTranscriptHistory(newTranscript);
      speakAiText(randomQuestion);
    } finally {
      setEvaluating(false);
    }
  };

  const avgScore = Math.round(
    cumulativeScores.reduce((a, b) => a + b, 0) / cumulativeScores.length
  );

  const handleSkipQuestion = () => {
    setShowSkipConfirm(false);
    const nextQNum = questionCount + 1;
    const randomQuestionObj = generateRandomQuestion();
    const randomQuestion = typeof randomQuestionObj === 'object' ? randomQuestionObj.question : randomQuestionObj;
    
    // Track skipped question metrics
    const timeSpent = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0;
    const metric = {
      questionNumber: questionCount,
      question: typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion,
      difficulty: currentQuestion.difficulty || 'medium',
      tags: currentQuestion.tags || [],
      timeSpent: timeSpent,
      score: 0, // Skipped questions get 0 score
      keyPointsCovered: [],
      feedback: 'Question skipped by candidate',
    };
    setQuestionMetrics(prev => [...prev, metric]);

    setCurrentQuestion(randomQuestionObj);
    setQuestionCount(nextQNum);

    const newTranscript = [
      ...transcriptHistory,
      { speaker: 'Candidate', text: '[Question Skipped]', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { speaker: 'AI Technical Evaluator', text: `[Question #${nextQNum}] ${randomQuestion}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ];
    setTranscriptHistory(newTranscript);
    speakAiText(randomQuestion);
  };

  const renderReportModal = () => {
    if (!onCompleteReport) return null;
    
    const totalSessionTime = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
    const avgTimePerQuestion = questionMetrics.length > 0 
      ? Math.round(questionMetrics.reduce((sum, m) => sum + m.timeSpent, 0) / questionMetrics.length)
      : 0;
    
    const difficultyBreakdown = {
      easy: questionMetrics.filter(m => m.difficulty === 'easy'),
      medium: questionMetrics.filter(m => m.difficulty === 'medium'),
      hard: questionMetrics.filter(m => m.difficulty === 'hard'),
    };

    const avgScoreByDifficulty = {
      easy: difficultyBreakdown.easy.length > 0 
        ? Math.round(difficultyBreakdown.easy.reduce((sum, m) => sum + m.score, 0) / difficultyBreakdown.easy.length)
        : 0,
      medium: difficultyBreakdown.medium.length > 0 
        ? Math.round(difficultyBreakdown.medium.reduce((sum, m) => sum + m.score, 0) / difficultyBreakdown.medium.length)
        : 0,
      hard: difficultyBreakdown.hard.length > 0 
        ? Math.round(difficultyBreakdown.hard.reduce((sum, m) => sum + m.score, 0) / difficultyBreakdown.hard.length)
        : 0,
    };

    const allTags = [...new Set(questionMetrics.flatMap(m => m.tags))];
    const tagPerformance = allTags.map(tag => {
      const tagQuestions = questionMetrics.filter(m => m.tags.includes(tag));
      const avgTagScore = tagQuestions.length > 0 
        ? Math.round(tagQuestions.reduce((sum, m) => sum + m.score, 0) / tagQuestions.length)
        : 0;
      return { tag, avgScore: avgTagScore, questionCount: tagQuestions.length };
    });

    const reportData = {
      sessionScores: cumulativeScores,
      transcriptHistory,
      topic: selectedTopic,
      questionMetrics,
      totalSessionTime,
      avgTimePerQuestion,
      difficultyBreakdown,
      avgScoreByDifficulty,
      tagPerformance,
      overallAvgScore: avgScore,
      questionTypeProgress,
    };

    return null; // Report modal is handled by parent component
  };

  const renderSessionCompleteModal = () => {
    if (!sessionComplete || !sessionSummary) return null;

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 animate-in fade-in ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/50'}`}>
        <div className={`w-full max-w-2xl p-6 rounded-2xl border space-y-4 shadow-2xl ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`text-lg font-heading font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Trophy className="w-5 h-5 text-amber-400" /> Session Complete!
            </h3>
            <button
              onClick={() => setSessionComplete(false)}
              className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} text-base font-bold px-2 py-1 rounded-lg`}
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-2xl font-heading font-extrabold text-indigo-400`}>{sessionSummary.overallScore}%</span>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Overall Score</span>
            </div>
            <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-2xl font-heading font-extrabold text-emerald-400`}>{sessionSummary.mcqScore}/{sessionSummary.mcqTotal}</span>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>MCQ Correct</span>
            </div>
            <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-2xl font-heading font-extrabold text-purple-400`}>{formatTime(sessionSummary.totalTime)}</span>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Time</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Question Type Breakdown:</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                <span className={`text-xs font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>MCQ</span>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sessionSummary.mcqScore}/{sessionSummary.mcqTotal}</span>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                <span className={`text-xs font-semibold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Coding</span>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sessionSummary.codingCompleted}/{sessionSummary.codingTotal}</span>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-500/10 border-slate-500/30' : 'bg-slate-100 border-slate-300'}`}>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Text</span>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sessionSummary.textCompleted}/{sessionSummary.textTotal}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setSessionComplete(false);
                setQuestionCount(1);
                setQuestionTypeProgress({
                  mcq: { answered: 0, correct: 0, total: 2 },
                  coding: { answered: 0, total: 2 },
                  text: { answered: 0, total: 1 }
                });
                setQuestionMetrics([]);
                setCumulativeScores([]);
                setAskedQuestions(new Set());
                setQuestionTimer(0);
                const randomQuestion = generateRandomQuestion();
                setCurrentQuestion(randomQuestion);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'}`}
            >
              Start New Session
            </button>
            <button
              onClick={() => onCompleteReport(sessionSummary)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all"
            >
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-2 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Top AI / ML Tech Stack Selector & Smart Match Control Bar */}
      <div className={`p-2 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-2 ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className={`text-xs font-bold font-mono flex items-center gap-1.5 flex-shrink-0 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Cpu className="w-4 h-4 text-indigo-400" /> Stack:
          </span>

          {TECH_STACKS.map((stack) => (
            <button
              key={stack.id}
              onClick={() => handleTopicChange(stack.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 border ${selectedTopic === stack.id ? `bg-gradient-to-r ${stack.color} text-white border-transparent shadow-lg` : isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}
            >
              <span>{stack.icon}</span>
              <span>{stack.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'} transition-colors`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className={`${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'} rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-indigo-500`}
          >
            <option value="Junior">Junior Level</option>
            <option value="Medium">Mid-Level</option>
            <option value="Senior Architect">Senior Architect</option>
            <option value="Staff Principal">Staff Principal</option>
          </select>

          <button
            onClick={() => setShowSmartMatchModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all transform hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI/ML Smart Match
          </button>
        </div>
      </div>

      {/* Main Grid: AI Assistant Core & Voice Conversation Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* Left Column: AI Core Avatar */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          {/* AI Core Avatar */}
          <div
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[280px] ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}
          >
            {/* Animated Aura */}
            <div
              className={`absolute w-72 h-72 rounded-full blur-3xl transition-all duration-700 ${
                isAiSpeaking
                  ? 'bg-purple-600/30 scale-125'
                  : isListening
                  ? 'bg-emerald-600/30 scale-110'
                  : 'bg-indigo-600/20 scale-100'
              }`}
            ></div>

            {/* AI Core Avatar */}
            <div
              className={`relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 mb-4 shadow-2xl transition-transform duration-500 ${
                isAiSpeaking ? 'scale-110 animate-pulse' : ''
              }`}
            >
              <div className={`w-full h-full rounded-[22px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                <Bot className="w-14 h-14 text-pink-400" />
              </div>
            </div>

            <h3 className={`text-lg font-heading font-extrabold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Technical Interviewer <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {selectedTopic} • Q#{questionCount}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                {selectedDifficulty}
              </span>
              {sessionStartTime && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                  ⏱️ {getSessionDuration()}
                </span>
              )}
            </div>

            {/* Audio Waveform */}
            <div className={`flex items-center gap-1.5 h-10 mt-5 px-4 py-2 rounded-full border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              {[40, 70, 30, 90, 50, 100, 60, 80, 45, 95, 35].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isAiSpeaking
                      ? 'bg-pink-400 animate-pulse'
                      : isListening
                      ? 'bg-emerald-400 animate-pulse'
                      : isDark ? 'bg-slate-700' : 'bg-slate-400'
                  }`}
                  style={{ height: isAiSpeaking || isListening ? `${h}%` : '20%' }}
                ></span>
              ))}
            </div>

            {/* Voice Control Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setHasInteracted(true);
                  toggleMicListening();
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-lg ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? 'Stop Speaking' : 'Start Answer (Voice)'}
              </button>
            </div>

            {/* Live Caption Display */}
            {liveCaption && (
              <div className={`mt-4 px-4 py-2 rounded-lg text-xs font-mono text-center animate-in fade-in ${
                isDark ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Live Caption</span>
                </div>
                <p className="leading-relaxed">"{liveCaption}"</p>
              </div>
            )}
          </div>

          {/* Machine Learning NLP Rating Card */}
          {lastEval && (
            <div className={`p-3 rounded-xl border border-indigo-500/30 space-y-3 shadow-xl animate-in fade-in ${isDark ? 'glass-panel bg-slate-950/90' : 'bg-white border-slate-200'}`}>
              <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-2 font-mono">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> ML Correctness Rating (Q#{questionCount - 1})
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                    Grade {lastEval.mlAnalysis?.grade || 'A'} • {lastEval.score}% Correct
                  </span>
                </div>
              </div>

              {/* Progress Meters */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className={`flex justify-between text-[11px] font-mono mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>🎯 Concept Coverage</span>
                    <span className="text-emerald-400 font-bold">{lastEval.mlAnalysis?.conceptScore ?? 85}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${lastEval.mlAnalysis?.conceptScore ?? 85}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className={`flex justify-between text-[11px] font-mono mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>🧠 Terminology Precision</span>
                    <span className="text-purple-400 font-bold">{lastEval.mlAnalysis?.terminologyScore ?? 80}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${lastEval.mlAnalysis?.terminologyScore ?? 80}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className={`flex justify-between text-[11px] font-mono mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>💬 Structural Clarity & Depth</span>
                    <span className="text-cyan-400 font-bold">{lastEval.mlAnalysis?.clarityScore ?? 90}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${lastEval.mlAnalysis?.clarityScore ?? 90}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Found Domain Keywords Chips */}
              {lastEval.mlAnalysis?.foundTerms?.length > 0 && (
                <div className={`pt-2 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                  <span className={`text-[10px] font-mono block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Domain Keywords Extracted:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lastEval.mlAnalysis.foundTerms.map((term, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                        ✓ {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className={`text-xs leading-relaxed pt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lastEval.feedback}</p>
            </div>
          )}
        </div>

        {/* Right Column: Question Display, Answer Box & Log */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          {/* Active Question Box */}
          <div className={`p-3 rounded-lg border space-y-2 ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <span className="text-[10px] font-mono tracking-wider text-pink-400 uppercase font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Current Interview Question #{questionCount} ({selectedTopic})
              </span>
              <div className="flex items-center gap-2">
                {currentQuestion?.type && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    currentQuestion.type === 'mcq' 
                      ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                      : currentQuestion.type === 'coding'
                      ? isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                      : isDark ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {currentQuestion.type}
                  </span>
                )}
                {currentQuestion?.difficulty && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    currentQuestion.difficulty === 'easy' 
                      ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : currentQuestion.difficulty === 'medium'
                      ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                      : isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                )}
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Adaptive Dynamic LLM Prompt</span>
              </div>
            </div>
            <h4 className={`text-base font-semibold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentQuestion ? (typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion) : 'Loading question...'}
            </h4>
            {currentQuestion?.tags && currentQuestion.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentQuestion.tags.map((tag, idx) => (
                  <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Text/Voice Input Box */}
          <div className={`p-3 rounded-lg border flex flex-col gap-2 ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            
            {/* MCQ Options */}
            {currentQuestion?.type === 'mcq' && currentQuestion?.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedMcqOption === idx;
                  const showResult = selectedMcqOption !== null;
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  const isWrongSelection = isSelected && !isCorrect;
                  const isCorrectSelection = isSelected && isCorrect;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => selectedMcqOption === null && setSelectedMcqOption(idx)}
                      disabled={selectedMcqOption !== null}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                        isCorrectSelection
                          ? isDark 
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' 
                            : 'bg-emerald-100 border-emerald-500 text-emerald-700'
                          : isWrongSelection
                          ? isDark 
                            ? 'bg-rose-600/30 border-rose-500 text-rose-300' 
                            : 'bg-rose-100 border-rose-500 text-rose-700'
                          : showResult && isCorrect
                          ? isDark 
                            ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-400' 
                            : 'bg-emerald-50 border-emerald-500/50 text-emerald-600'
                          : isSelected
                          ? isDark 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                            : 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : isDark 
                            ? 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold mr-2">{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {showResult && isWrongSelection && (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Code Editor for Coding Questions */}
            {currentQuestion?.type === 'coding' && (
              <div className="h-64">
                <MonacoCodeEditor
                  code={codeEditorContent}
                  onChange={setCodeEditorContent}
                  language={codeLanguage}
                  onLanguageChange={setCodeLanguage}
                  onSubmitCode={() => handleSubmitAnswer()}
                  isDark={isDark}
                />
              </div>
            )}

            {/* Text Input for Text Questions */}
            {(currentQuestion?.type === 'text' || !currentQuestion?.type) && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={candidateResponse}
                    onChange={(e) => {
                      setCandidateResponse(e.target.value);
                      setValidationError(null);
                      setValidationWarnings([]);
                      setValidationResult(null);
                    }}
                    placeholder={`Type your response for ${selectedTopic} or click the microphone to speak...`}
                    className={`w-full h-24 border rounded-lg p-3 text-xs font-sans resize-none focus:outline-none focus:border-indigo-500 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  />
                  
                  {/* Microphone Button */}
                  <button
                    onClick={toggleMicListening}
                    className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : isDark 
                          ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' 
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    title={isListening ? 'Stop recording' : 'Start voice input (requires microphone permission)'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Live Caption Display */}
                {liveCaption && (
                  <div className={`text-xs ${isDark ? 'text-indigo-400' : 'text-indigo-600'} italic`}>
                    🎤 {liveCaption}
                  </div>
                )}
                
                {/* File Upload Option */}
                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-indigo-300'}`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Upload File</span>
                    <input
                      type="file"
                      accept=".txt,.md,.js,.py,.java,.cpp,.c"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedFile && (
                    <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      <CheckCircle className="w-3 h-3" />
                      {uploadedFile}
                    </span>
                  )}
                </div>
              </div>
            )}

            {validationError && (
              <div className={`p-2 rounded-lg text-xs flex items-center gap-2 ${isDark ? 'bg-rose-950/50 border border-rose-800/50 text-rose-300' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {validationError}
              </div>
            )}

            {validationResult && validationResult.isValid && currentQuestion?.type !== 'mcq' && (
              <div className={`p-3 rounded-lg border space-y-2 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                {/* Correctness Score */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Answer Correctness:</span>
                  <span className={`text-sm font-bold ${validationResult.score >= 70 ? 'text-emerald-400' : validationResult.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {validationResult.score}%
                  </span>
                </div>

                {/* Key Points Coverage */}
                {validationResult.totalExpectedPoints > 0 && (
                  <div className="space-y-1">
                    <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Key Points: {validationResult.matchedPoints.length}/{validationResult.totalExpectedPoints}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {validationResult.matchedPoints.map((point, idx) => (
                        <span key={idx} className={`px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300`}>
                          ✓ {point}
                        </span>
                      ))}
                      {validationResult.missingPoints.map((point, idx) => (
                        <span key={idx} className={`px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300`}>
                          ✗ {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {validationWarnings.length > 0 && (
                  <div className="pt-2 border-t border-slate-700">
                    {validationWarnings.map((warning, idx) => (
                      <div key={idx} className={`text-[10px] flex items-start gap-1 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                        <span>⚠</span>
                        <span>{warning}</span>
                      </div>
                    ))}
                    {showForceSubmit && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleSubmitAnswer(true)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
                        >
                          Submit Anyway
                        </button>
                        <button
                          onClick={() => {
                            setShowForceSubmit(false);
                            setValidationWarnings([]);
                            setValidationResult(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-200 text-slate-600 hover:text-slate-900'} transition-colors`}
                        >
                          Revise Answer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentQuestion?.type === 'mcq' 
                  ? `Selected: ${selectedMcqOption !== null ? currentQuestion.options[selectedMcqOption].substring(0, 20) + '...' : 'None'}`
                  : currentQuestion?.type === 'coding'
                  ? `Characters: ${codeEditorContent.length}`
                  : currentQuestion?.type === 'text'
                  ? `Characters: ${candidateResponse.length} | File: ${uploadedFile || 'None'}`
                  : `Characters: ${candidateResponse.length}`
                }
              </span>

              <div className="flex items-center gap-2">
                {/* Try Again button for MCQ when wrong answer */}
                {currentQuestion?.type === 'mcq' && selectedMcqOption !== null && selectedMcqOption !== currentQuestion.correctAnswer && (
                  <button
                    onClick={() => setSelectedMcqOption(null)}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-md transition-all"
                  >
                    Try Again
                  </button>
                )}

                <button
                  onClick={() => handleSubmitAnswer(false)}
                  disabled={evaluating || isCheckingAnswer || 
                    (currentQuestion?.type === 'mcq' && selectedMcqOption === null) ||
                    (currentQuestion?.type === 'mcq' && selectedMcqOption !== null && selectedMcqOption !== currentQuestion.correctAnswer) ||
                    (currentQuestion?.type === 'coding' && !codeEditorContent.trim()) ||
                    (currentQuestion?.type === 'text' && !candidateResponse.trim() && !uploadedFile) ||
                    (!currentQuestion?.type && !candidateResponse.trim() && !uploadedFile)
                  }
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {isCheckingAnswer ? (
                    'Validating Response...'
                  ) : evaluating ? (
                    'AI Analyzing Response...'
                  ) : (
                    <>
                      <MessageSquare className="w-3.5 h-3.5" /> Submit Response & Next Question
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transcript Log */}
          <div className={`p-3 rounded-lg border flex-1 flex flex-col min-h-[180px] ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <div className={`flex items-center justify-between border-b pb-2 mb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-xs font-bold flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <FileText className="w-4 h-4 text-indigo-400" /> Continuous Speech Transcript Log ({transcriptHistory.length} turns)
              </span>
              {onCompleteReport && (
                <button
                  onClick={() =>
                    onCompleteReport({
                      sessionScores: cumulativeScores,
                      transcriptHistory,
                      topic: selectedTopic,
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate Final Scorecard
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[260px]">
              {transcriptHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    item.speaker.includes('AI')
                      ? isDark ? 'bg-purple-950/30 border border-purple-800/40 text-purple-200' : 'bg-purple-50 border border-purple-200 text-purple-800'
                      : isDark ? 'bg-slate-900 border border-slate-800 text-slate-200 ml-4' : 'bg-slate-50 border border-slate-200 text-slate-700 ml-4'
                  }`}
                >
                  <div className={`flex items-center justify-between text-[10px] font-mono mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="font-bold">{item.speaker}</span>
                    <span>{item.time}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI / ML Smart Match Persona Selection Modal */}
      {showSmartMatchModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 animate-in fade-in ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/50'}`}>
          <div className={`w-full max-w-xl p-4 rounded-2xl border space-y-3 shadow-2xl ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-lg font-heading font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Sparkles className="w-5 h-5 text-amber-400" /> AI / ML Smart Persona Matcher
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Select an architectural target persona to auto-tune questions</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSmartMatchModal(false)}
                className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} text-base font-bold px-2 py-1 rounded-lg`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {AI_PERSONAS.map((persona, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPersona(persona)}
                  className={`p-3 rounded-xl border hover:border-purple-500/50 transition-all cursor-pointer flex items-center justify-between group ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                        {persona.topic}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                        {persona.difficulty}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold group-hover:text-purple-300 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {persona.role}
                    </h4>
                    <p className={`text-xs leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{persona.desc}</p>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white text-purple-400 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            <div className={`pt-2 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                onClick={() => setShowSmartMatchModal(false)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Complete Report Modal */}
      {renderReportModal()}

      {/* Skip Question Confirmation Modal */}
      {showSkipConfirm && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 animate-in fade-in ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/50'}`}>
          <div className={`w-full max-w-md p-4 rounded-2xl border space-y-4 shadow-2xl ${isDark ? 'glass-panel bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-lg font-heading font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Skip Question?
              </h3>
              <button
                type="button"
                onClick={() => setShowSkipConfirm(false)}
                className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} text-base font-bold px-2 py-1 rounded-lg`}
              >
                ✕
              </button>
            </div>
            
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Are you sure you want to skip this question? This will move to the next question without evaluating your response.
            </p>
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md"
              >
                Skip Question
              </button>
            </div>
          </div>
        </div>
      )}

      {renderSessionCompleteModal()}
    </div>
  );
};

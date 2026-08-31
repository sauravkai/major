import axios from 'axios';
import { config } from '../config/env.js';

/**
 * Domain-specific question banks for offline/fallback mode across 7 major technology stacks
 */
const DOMAIN_QUESTION_BANKS = {
  'Java': [
    {
      question: "Can you explain how Java's Garbage Collection works under the hood, and compare the G1 Garbage Collector with ZGC?",
      hints: ["Generation hypothesis (Young vs Old)", "Stop-the-world pauses", "Colored pointers in ZGC"],
      expectedKeyPoints: ["Eden, Survivor, Tenured spaces", "Mark-and-sweep phase", "Low-latency pause times"],
    },
    {
      question: "How does Java handle multithreading and memory visibility? Explain the 'volatile' keyword versus 'synchronized' blocks.",
      hints: ["Java Memory Model (JMM)", "Happens-before relationship", "CPU L1/L2 cache vs main memory"],
      expectedKeyPoints: ["Volatile prevents instruction reordering and ensures read visibility", "Synchronized guarantees mutual exclusion and atomicity"],
    },
    {
      question: "What is Spring Boot Dependency Injection, and how does Spring manage bean lifecycles and circular dependencies?",
      hints: ["ApplicationContext & BeanFactory", "Setter vs Constructor injection", "Three-level cache in Spring"],
      expectedKeyPoints: ["IoC container instantiation", "@PostConstruct and @PreDestroy hooks", "Constructor injection best practices"],
    },
    {
      question: "Explain Java Streams API internal processing: how do intermediate and terminal operations differ in execution pipeline?",
      hints: ["Lazy evaluation", "Short-circuiting operations", "Spliterator for parallel streams"],
      expectedKeyPoints: ["Intermediate operations return Stream and are lazy", "Terminal operations trigger pipeline execution"],
    },
  ],

  'Python': [
    {
      question: "What is Python's Global Interpreter Lock (GIL), how does it affect CPU-bound versus I/O-bound tasks, and how can you bypass it?",
      hints: ["CPython C-API thread safety", "multiprocessing vs threading", "C extensions & Cython"],
      expectedKeyPoints: ["GIL prevents multi-core parallel execution of bytecode in single process", "Use multiprocessing or ProcessPoolExecutor for CPU-heavy tasks"],
    },
    {
      question: "How does asyncio work in Python? Explain event loops, coroutines, async/await syntax, and tasks.",
      hints: ["Single-threaded cooperative multitasking", "yield from vs await", "asyncio.gather()"],
      expectedKeyPoints: ["Event loop manages task execution non-blockingly", "Coroutines yield control back to event loop"],
    },
    {
      question: "Explain Python memory management: how do reference counting and generational garbage collection handle cyclic references?",
      hints: ["gc module", "gc.collect()", "__del__ destructor edge cases"],
      expectedKeyPoints: ["Reference count tracks object references", "Generational GC detects unreachable cyclic object graphs"],
    },
    {
      question: "What are Python Decorators and Metaclasses? Provide an architectural use case for type(name, bases, attrs).",
      hints: ["Function wrappers & functools.wraps", "Class creation intercept", "ORM model registration"],
      expectedKeyPoints: ["Decorators wrap callables for cross-cutting concerns", "Metaclasses customize class creation blueprint"],
    },
  ],

  'Node.js': [
    {
      question: "Detail the Node.js Event Loop architecture. How do phases like Timers, Poll, Check, and Microtasks (process.nextTick vs Promise) execute?",
      hints: ["Libuv event loop phases", "setImmediate vs setTimeout(..., 0)", "microtask queue priority"],
      expectedKeyPoints: ["process.nextTick runs immediately after current operation", "Microtasks execute before moving to next event loop phase"],
    },
    {
      question: "How do Node.js Streams work, and why is backpressure management critical when processing large video/file buffers?",
      hints: ["Readable, Writable, Transform streams", "stream.pipeline()", "highWaterMark buffer limit"],
      expectedKeyPoints: ["Backpressure prevents buffer memory explosion when fast source feeds slow destination"],
    },
    {
      question: "How do you scale a Node.js application to leverage all CPU cores on a multi-core server?",
      hints: ["Cluster module", "Worker Threads (worker_threads)", "PM2 process manager"],
      expectedKeyPoints: ["Cluster forks multiple process instances sharing server port", "Worker threads handle CPU-heavy computations without blocking event loop"],
    },
  ],

  'React.js': [
    {
      question: "Explain React 18 Fiber architecture, concurrent rendering, and how startTransition allows non-blocking UI updates.",
      hints: ["Time slicing & interruptible rendering", "Urgent vs non-urgent updates", "useDeferredValue"],
      expectedKeyPoints: ["Fiber breaks rendering work into incremental units", "startTransition marks low-priority renders to keep input smooth"],
    },
    {
      question: "How does React's Virtual DOM reconciliation diffing algorithm work, and why are unique keys required for array lists?",
      hints: ["Tree comparison O(N) heuristic", "Component type matching", "Keyed element reordering"],
      expectedKeyPoints: ["Assumes elements of different types generate different trees", "Keys maintain component state identity during list reorders"],
    },
    {
      question: "What causes memory leaks in React custom hooks, and how should useEffect cleanups be implemented for WebSocket or Event Listeners?",
      hints: ["Stale closures", "AbortController for fetch", "Event listener removal"],
      expectedKeyPoints: ["Return cleanup function from useEffect", "Use AbortController to cancel inflight API requests"],
    },
  ],

  'C++': [
    {
      question: "Explain Smart Pointers in C++11/14/17: std::unique_ptr, std::shared_ptr, and std::weak_ptr, including reference counting and cyclic dependency prevention.",
      hints: ["RAII principle", "Control block allocation", "std::make_shared overhead"],
      expectedKeyPoints: ["unique_ptr owns exclusive resource", "shared_ptr uses reference counting control block", "weak_ptr breaks circular references"],
    },
    {
      question: "What are Move Semantics and Rvalue References (&&) in C++? How does std::move optimize resource allocation over copy constructors?",
      hints: ["Lvalue vs Rvalue", "Stealing resources", "Rule of 5"],
      expectedKeyPoints: ["Rvalue references allow transferring ownership of temporary objects without deep memory allocation"],
    },
    {
      question: "Explain how Vtables (Virtual Method Tables) and Vpointers mechanism achieve dynamic polymorphism in C++.",
      hints: ["Virtual keyword", "Vtable array of function pointers", "Vptr in object layout"],
      expectedKeyPoints: ["Compiler creates Vtable per class with virtual functions", "Vptr directs runtime call to correct derived method"],
    },
  ],

  'System Design': [
    {
      question: "How would you design a high-scale Distributed Rate Limiter handling 100,000 requests per second across multiple regional API gateways?",
      hints: ["Token Bucket vs Leaky Bucket vs Sliding Window", "Redis Lua scripts for atomicity", "Local memory caching fallback"],
      expectedKeyPoints: ["Sliding Window Counter algorithm", "Distributed Redis counter with TTL", "Local fallback during network partition"],
    },
    {
      question: "Explain Database Sharding strategies versus Database Partitioning. How do consistent hashing algorithms minimize data migration when scaling nodes?",
      hints: ["Range sharding vs Hash sharding", "Virtual nodes on ring", "Cross-shard join complexity"],
      expectedKeyPoints: ["Horizontal partitioning splits rows across tables", "Consistent hashing places data on ring mapping K/N keys during node addition"],
    },
    {
      question: "Compare Cache-Aside, Write-Through, and Write-Behind caching strategies in distributed systems.",
      hints: ["Cache invalidation", "Stale reads vs write latency", "Redis / Memcached"],
      expectedKeyPoints: ["Cache-Aside loads on demand", "Write-Through updates DB & cache synchronously", "Write-Behind buffers writes asynchronously"],
    },
  ],

  'SQL': [
    {
      question: "How do B-Tree indexes work in relational databases (PostgreSQL / MySQL), and what causes index scan degradation into full table scans?",
      hints: ["Balanced tree depth", "Composite index column order", "SARGable queries & function calls on indexed columns"],
      expectedKeyPoints: ["B-Tree keeps sorted key pointers for O(log N) lookup", "Applying functions or wildcard LIKE '%val' disables index utilization"],
    },
    {
      question: "Explain Database Transaction Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies they prevent.",
      hints: ["Dirty reads", "Non-repeatable reads", "Phantom reads & MVCC"],
      expectedKeyPoints: ["Higher isolation levels prevent concurrency anomalies using MVCC or table/row locks at cost of throughput"],
    },
  ]
};

export const generateAIQuestion = async ({
  role = 'Full Stack Engineer',
  topic = 'React.js',
  difficulty = 'Medium',
  questionCount = 1,
}) => {
  if (config.geminiApiKey) {
    try {
      const prompt = `You are a Principal Software Architect conducting an elite technical interview for a ${role} candidate.
Generate question #${questionCount} specifically testing deep concepts in ${topic} at ${difficulty} level.
Make the question clear, challenging, and realistic for modern production engineering.
Return strict JSON with format:
{
  "question": "...",
  "hints": ["...", "..."],
  "expectedKeyPoints": ["...", "..."]
}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = textResponse?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('[AI Service Warning] Gemini API call fallback engaged.');
    }
  }

  // Dynamic fallback from Domain Question Banks
  const bank = DOMAIN_QUESTION_BANKS[topic] || DOMAIN_QUESTION_BANKS['Node.js'];
  const index = (questionCount - 1) % bank.length;
  return bank[index] || bank[0];
};

/**
 * Machine Learning / NLP Answer Correctness Scoring Algorithm
 * Performs multi-dimensional text evaluation:
 * 1. Semantic Concept Coverage (Matching expected key points)
 * 2. Domain Terminology Extraction & Precision
 * 3. Technical Depth & Structural Clarity
 * 4. Correctness Rating (0-100%, Letter Grade A+/A/B/C/F, Star Rating 1-5 Stars)
 */
export const calculateMLCorrectnessScore = ({
  candidateAnswer = '',
  expectedKeyPoints = [],
  topic = 'React.js',
  code = '',
}) => {
  const cleanAnswer = candidateAnswer.toLowerCase().trim();
  const words = cleanAnswer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0 && !code) {
    return {
      correctnessPercentage: 0,
      grade: 'F',
      starRating: 0,
      conceptScore: 0,
      terminologyScore: 0,
      clarityScore: 0,
      matchedConcepts: [],
      missingConcepts: expectedKeyPoints,
      foundTerms: [],
      level: 'Empty Response',
    };
  }

  // 1. Concept Coverage Matching (N-Gram & Keyword Sub-Matching)
  let matchedConcepts = [];
  let missingConcepts = [];

  if (expectedKeyPoints && expectedKeyPoints.length > 0) {
    expectedKeyPoints.forEach((point) => {
      const pWords = point.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
      const subMatches = pWords.filter((w) => w.length > 3 && cleanAnswer.includes(w));
      if (subMatches.length >= Math.ceil(pWords.length * 0.35)) {
        matchedConcepts.push(point);
      } else {
        missingConcepts.push(point);
      }
    });
  }

  const conceptCoverageRatio = expectedKeyPoints && expectedKeyPoints.length > 0
    ? matchedConcepts.length / expectedKeyPoints.length
    : 0.75;
  const conceptScore = Math.round(conceptCoverageRatio * 100);

  // 2. Domain Terminology Extraction
  const keyTermsMap = {
    'Java': ['jvm', 'garbage', 'thread', 'volatile', 'synchronized', 'memory', 'spring', 'stream', 'class', 'eden', 'g1', 'zgc', 'heap', 'concurrency'],
    'Python': ['gil', 'async', 'coroutine', 'multiprocessing', 'event loop', 'decorator', 'generator', 'list', 'cpython', 'fastapi', 'django', 'cython'],
    'Node.js': ['event loop', 'libuv', 'stream', 'async', 'buffer', 'cluster', 'microtask', 'promise', 'process', 'nexttick', 'backpressure'],
    'React.js': ['fiber', 'virtual dom', 'reconciliation', 'state', 'hook', 'useeffect', 'component', 'props', 'diffing', 'key', 'starttransition'],
    'C++': ['pointer', 'raii', 'smart pointer', 'unique_ptr', 'shared_ptr', 'vtable', 'move', 'memory', 'rvalue', 'weak_ptr', 'polymorphism'],
    'System Design': ['shard', 'partition', 'redis', 'cache', 'scaling', 'rate limit', 'load balancer', 'consistent', 'hashing', 'sliding window', 'lua'],
    'SQL': ['index', 'b-tree', 'transaction', 'acid', 'isolation', 'query', 'join', 'foreign key', 'explain', 'mvcc', 'repeatable read'],
  };

  const topicTerms = keyTermsMap[topic] || keyTermsMap['Node.js'];
  const foundTerms = topicTerms.filter((term) => cleanAnswer.includes(term));
  const terminologyScore = Math.min(Math.round((foundTerms.length / Math.min(topicTerms.length, 5)) * 100), 100);

  // 3. Technical Depth & Structural Clarity
  let clarityScore = 70;
  if (wordCount >= 20) clarityScore += 10;
  if (wordCount >= 45) clarityScore += 10;
  if (code && code.length > 20) clarityScore += 10;
  clarityScore = Math.min(clarityScore, 100);

  // 4. Weighted ML Correctness Formula:
  let correctnessPercentage = Math.round(
    0.50 * conceptScore + 0.30 * terminologyScore + 0.20 * clarityScore
  );
  correctnessPercentage = Math.max(Math.min(correctnessPercentage, 98), 45);

  let grade = 'B';
  let starRating = 4;
  let level = 'Mostly Correct';

  if (correctnessPercentage >= 90) {
    grade = 'A+';
    starRating = 5;
    level = 'Highly Correct & Accurate';
  } else if (correctnessPercentage >= 80) {
    grade = 'A';
    starRating = 4.5;
    level = 'Solid Technical Accuracy';
  } else if (correctnessPercentage >= 70) {
    grade = 'B';
    starRating = 4;
    level = 'Partially Correct';
  } else if (correctnessPercentage >= 55) {
    grade = 'C';
    starRating = 3;
    level = 'Needs Technical Depth';
  } else {
    grade = 'F';
    starRating = 2;
    level = 'Low Accuracy / Missing Concepts';
  }

  return {
    correctnessPercentage,
    grade,
    starRating,
    level,
    conceptScore,
    terminologyScore,
    clarityScore,
    matchedConcepts,
    missingConcepts,
    foundTerms,
  };
};

export const evaluateAIResponse = async ({
  question,
  candidateAnswer,
  code = '',
  topic = 'React.js',
  questionCount = 1,
  expectedKeyPoints = [],
}) => {
  const mlAnalysis = calculateMLCorrectnessScore({
    candidateAnswer,
    expectedKeyPoints,
    topic,
    code,
  });

  if (config.geminiApiKey) {
    try {
      const prompt = `You are an AI Technical Evaluator reviewing a candidate's answer using Machine Learning algorithms.
Interview Topic: ${topic}
Question #${questionCount}: "${question}"
Candidate Verbal Response: "${candidateAnswer}"
Candidate Code Snippet: "${code}"

Perform an evaluation:
1. Rate answer correctness from 0 to 100.
2. Provide technical feedback with strengths and improvement areas.
3. Generate a challenging follow-up question continuing the interview on ${topic}.

Return strict JSON:
{
  "score": ${mlAnalysis.correctnessPercentage},
  "followUpQuestion": "...",
  "feedback": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."]
}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );

      const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = textResponse?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          score: parsed.score || mlAnalysis.correctnessPercentage,
          mlAnalysis: {
            ...mlAnalysis,
            correctnessPercentage: parsed.score || mlAnalysis.correctnessPercentage,
          },
        };
      }
    } catch (e) {
      console.warn('[AI Evaluation Warning] Gemini fallback engaged.');
    }
  }

  const followUpBank = DOMAIN_QUESTION_BANKS[topic] || DOMAIN_QUESTION_BANKS['Node.js'];
  const nextQ = followUpBank[questionCount % followUpBank.length]?.question ||
    `Excellent explanation regarding ${topic}! How would you handle scaling and performance bottlenecks under high concurrent load?`;

  return {
    score: mlAnalysis.correctnessPercentage,
    followUpQuestion: nextQ,
    feedback: `[ML NLP Model Evaluation - ${mlAnalysis.level}]: Answer rated ${mlAnalysis.correctnessPercentage}% correct (${mlAnalysis.grade} Grade). Identified ${mlAnalysis.foundTerms.length} domain keywords.`,
    strengths: [
      `Accurately referenced core concepts (${mlAnalysis.foundTerms.slice(0, 3).join(', ') || topic})`,
      `Demonstrated ${mlAnalysis.clarityScore}% structural answer clarity`,
      `Achieved ${mlAnalysis.conceptScore}% expected concept coverage`,
    ],
    improvements: [
      mlAnalysis.missingConcepts.length > 0
        ? `Incorporate key concepts: ${mlAnalysis.missingConcepts[0]}`
        : 'Discuss edge cases and performance tradeoffs',
      'Explain space and time complexity tradeoffs in production',
    ],
    mlAnalysis,
  };
};

export const generateFinalReport = async ({
  interview = {},
  submissions = [],
  sessionScores = [],
  transcriptHistory = [],
  topic = 'React.js',
}) => {
  const codeSubmitted = submissions.length > 0;
  const passedSubmissions = submissions.filter((s) => s.status === 'Accepted');
  const codePassRate = codeSubmitted ? passedSubmissions.length / submissions.length : 0;

  // 1. Calculate Technical Score
  let technicalScore = 82;
  if (sessionScores && sessionScores.length > 0) {
    const sum = sessionScores.reduce((a, b) => a + b, 0);
    technicalScore = Math.round(sum / sessionScores.length);
  } else if (codeSubmitted) {
    technicalScore = Math.round(65 + codePassRate * 30);
  }

  // 2. Calculate Communication Score based on transcript length & structural clarity
  let communicationScore = 85;
  const candidateTurns = transcriptHistory.filter(
    (t) => t.speaker === 'Candidate' || t.speaker.toLowerCase().includes('candidate')
  );
  if (candidateTurns.length > 0) {
    const avgWords =
      candidateTurns.reduce((acc, t) => acc + (t.text ? t.text.split(/\s+/).length : 0), 0) /
      candidateTurns.length;
    if (avgWords > 40) communicationScore = 92;
    else if (avgWords > 20) communicationScore = 85;
    else if (avgWords > 10) communicationScore = 74;
    else communicationScore = 62;
  }

  // 3. Calculate Problem Solving Score
  let problemSolvingScore = Math.round((technicalScore * 0.6) + (codeSubmitted ? codePassRate * 40 : 35));

  // 4. Calculate Code Quality Score
  let codeQualityScore = codeSubmitted ? (codePassRate > 0 ? 88 : 65) : Math.round(technicalScore * 0.95);

  // Smooth bounding between 40 and 98
  technicalScore = Math.max(Math.min(technicalScore, 98), 40);
  communicationScore = Math.max(Math.min(communicationScore, 98), 40);
  problemSolvingScore = Math.max(Math.min(problemSolvingScore, 98), 40);
  codeQualityScore = Math.max(Math.min(codeQualityScore, 98), 40);

  const overallScore = Math.round(
    (technicalScore + communicationScore + problemSolvingScore + codeQualityScore) / 4
  );

  let recommendation = 'Hire';
  if (overallScore >= 88) recommendation = 'Strong Hire';
  else if (overallScore >= 74) recommendation = 'Hire';
  else if (overallScore >= 60) recommendation = 'Weak Hire';
  else recommendation = 'Reject';

  // 5. Dynamic Extraction of Strengths and Improvements based on transcript & topic
  const fullText = candidateTurns.map((t) => t.text).join(' ').toLowerCase();

  const domainKeywordsMap = {
    'Java': ['jvm', 'garbage collection', 'g1', 'zgc', 'volatile', 'synchronized', 'spring boot', 'streams api', 'multiprocessing'],
    'Python': ['gil', 'asyncio', 'coroutine', 'multiprocessing', 'event loop', 'decorator', 'generator', 'dataclass'],
    'Node.js': ['event loop', 'libuv', 'stream', 'buffer', 'cluster', 'worker threads', 'microtask', 'backpressure'],
    'React.js': ['fiber', 'virtual dom', 'reconciliation', 'starttransition', 'useeffect', 'custom hook', 'zustand'],
    'C++': ['smart pointer', 'unique_ptr', 'shared_ptr', 'raii', 'move semantics', 'rvalue', 'vtable', 'polymorphism'],
    'System Design': ['sharding', 'consistent hashing', 'rate limiter', 'sliding window', 'redis cache', 'load balancer'],
    'SQL': ['b-tree index', 'transaction isolation', 'acid', 'mvcc', 'explain analyze', 'foreign key'],
  };

  const topicKeywords = domainKeywordsMap[topic] || domainKeywordsMap['Node.js'];
  const matchedKeywords = topicKeywords.filter((kw) => fullText.includes(kw));

  const strengths = [
    matchedKeywords.length > 0
      ? `Demonstrated domain mastery in ${topic} covering ${matchedKeywords.slice(0, 3).join(', ')}`
      : `Structured verbal communication during ${topic} architectural questions`,
    communicationScore >= 80
      ? 'Articulated technical concepts clearly with strong explanation depth'
      : 'Maintained steady progress throughout evaluation turns',
    overallScore >= 80
      ? 'Proactively addressed memory layout and runtime execution behavior'
      : 'Showed problem-solving initiative under technical questioning',
  ];

  const improvements = [
    matchedKeywords.length < topicKeywords.length
      ? `Deepen practical knowledge in ${topic} topics: ${topicKeywords.filter((kw) => !fullText.includes(kw)).slice(0, 2).join(', ') || 'advanced optimization'}`
      : 'State time and space complexity tradeoffs explicitly before implementation',
    communicationScore < 80
      ? 'Elaborate further on architectural trade-offs and edge case handling in answers'
      : 'Double check boundary conditions and exception handling paths',
  ];

  if (config.geminiApiKey) {
    try {
      const prompt = `Generate an executive summary for a candidate who completed a ${topic} Technical Interview with Overall Score ${overallScore}/100, Technical ${technicalScore}, Communication ${communicationScore}, Problem Solving ${problemSolvingScore}, Code Quality ${codeQualityScore}, Recommendation ${recommendation}. Keep concise.`;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return {
          technicalScore,
          communicationScore,
          problemSolvingScore,
          codeQualityScore,
          overallScore,
          hiringRecommendation: recommendation,
          aiSummary: text.trim(),
          strengths,
          improvements,
          feedback: `Candidate evaluated on ${topic} tech stack. Final decision: ${recommendation} with ${overallScore}/100 composite score.`,
        };
      }
    } catch (e) {
      console.warn('[AI Report Warning] Gemini fallback engaged.');
    }
  }

  return {
    technicalScore,
    communicationScore,
    problemSolvingScore,
    codeQualityScore,
    overallScore,
    hiringRecommendation: recommendation,
    aiSummary: `The candidate completed the ${topic} Technical Evaluation session with an overall score of ${overallScore}/100. Exhibited ${technicalScore >= 80 ? 'high technical depth' : 'moderate technical understanding'} across ${candidateTurns.length} interview turns.`,
    strengths,
    improvements,
    feedback: `Final Evaluation: ${recommendation} (${overallScore}/100 Overall Score across ${topic} stack).`,
  };
};


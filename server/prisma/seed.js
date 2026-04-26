import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const posts = [
  {
    title: "Understanding Time & Space Complexity in DSA",
    slug: "understanding-time-space-complexity-dsa",
    excerpt: "Master Big-O notation and learn how to analyze algorithms — the foundation of every coding interview and efficient software.",
    category: "DSA",
    tags: ["dsa", "algorithms", "coding", "interviews"],
    coverColor: "#7c3aed",
    readingTime: 10,
    featured: true,
    content: `<h2 id="why-complexity">Why Complexity Matters</h2><p>Every line of code you write has a cost. Understanding time and space complexity helps you predict how your code behaves as input grows from 10 items to 10 million.</p><h2 id="big-o">Big-O Notation</h2><p>Big-O describes the upper bound of an algorithm's growth rate. Common complexities ranked from best to worst:</p><pre><code>O(1)     — Constant (hash map lookup)\nO(log n) — Logarithmic (binary search)\nO(n)     — Linear (single loop)\nO(n log n) — Linearithmic (merge sort)\nO(n²)    — Quadratic (nested loops)\nO(2ⁿ)    — Exponential (recursive fibonacci)</code></pre><h2 id="arrays-vs-hashmaps">Arrays vs HashMaps</h2><p>The classic Two Sum problem illustrates this perfectly. A brute-force nested loop gives O(n²). Using a HashMap reduces it to O(n) by trading space for time — the most common optimization pattern in DSA.</p><h2 id="space-complexity">Space Complexity</h2><p>Space complexity measures additional memory your algorithm needs. In-place algorithms like quicksort use O(log n) space, while merge sort needs O(n). Recursion adds stack frames — always account for call stack depth.</p><h2 id="practice-tips">Practice Tips</h2><p>Start with arrays and strings, then move to linked lists, trees, and graphs. Solve 2-3 problems daily on LeetCode. Focus on patterns: sliding window, two pointers, BFS/DFS, dynamic programming. Understanding patterns matters more than memorizing solutions.</p>`,
    createdAt: new Date("2021-06-15"),
  },
  {
    title: "Arrays, Linked Lists & Stacks — When to Use What",
    slug: "arrays-linked-lists-stacks-when-to-use",
    excerpt: "A practical guide to fundamental data structures — understand the trade-offs so you always pick the right tool for the job.",
    category: "DSA",
    tags: ["dsa", "data-structures", "coding", "arrays"],
    coverColor: "#8b5cf6",
    readingTime: 8,
    featured: false,
    content: `<h2 id="arrays">Arrays</h2><p>Arrays store elements in contiguous memory. This gives O(1) random access but O(n) insertion/deletion in the middle. Use arrays when you need fast index-based access and know the size upfront.</p><h2 id="linked-lists">Linked Lists</h2><p>Each node points to the next, allowing O(1) insertion/deletion at known positions. But random access is O(n) since you must traverse from the head. Use linked lists for frequent insertions/deletions and when size is unpredictable.</p><h2 id="stacks">Stacks (LIFO)</h2><p>Last-In-First-Out. Push and pop are O(1). Stacks power function call management, undo operations, expression evaluation, and backtracking algorithms like DFS. The browser's back button is essentially a stack.</p><h2 id="queues">Queues (FIFO)</h2><p>First-In-First-Out. Enqueue and dequeue are O(1). Used in BFS traversal, task scheduling, print queues, and message buffers. Priority queues extend this with heap-based ordering.</p><h2 id="choosing">Choosing the Right Structure</h2><p>Need random access? Array. Frequent insert/delete? Linked list. LIFO behavior? Stack. FIFO behavior? Queue. Need key-value pairs? HashMap. The right data structure often matters more than the algorithm.</p>`,
    createdAt: new Date("2021-08-22"),
  },
  {
    title: "React Hooks Deep Dive — useState, useEffect & Beyond",
    slug: "react-hooks-deep-dive",
    excerpt: "Go beyond the basics of React hooks. Understand the mental model, common pitfalls, and advanced patterns that make your components cleaner.",
    category: "Frontend",
    tags: ["react", "javascript", "frontend", "hooks"],
    coverColor: "#06b6d4",
    readingTime: 9,
    featured: true,
    content: `<h2 id="mental-model">The Mental Model</h2><p>Hooks let you "hook into" React's state and lifecycle from function components. Each render is a snapshot — state, props, and effects all belong to that specific render.</p><h2 id="usestate">useState</h2><p>Manages local state. Use the functional updater form <code>setState(prev => prev + 1)</code> when new state depends on old state. Never mutate state directly — always create new objects/arrays.</p><h2 id="useeffect">useEffect</h2><p>Synchronizes your component with external systems (APIs, subscriptions, DOM). The dependency array controls when the effect re-runs. An empty array means "run once on mount." Always clean up subscriptions in the return function.</p><h2 id="common-pitfalls">Common Pitfalls</h2><p><strong>Stale closures:</strong> Effects capture variables from the render they belong to. If your effect uses a value that changes, include it in the dependency array.</p><p><strong>Infinite loops:</strong> Creating new objects/arrays in the render body and using them as dependencies causes infinite re-renders. Use useMemo or useCallback to stabilize references.</p><h2 id="custom-hooks">Custom Hooks</h2><p>Extract reusable logic into custom hooks. A hook is just a function that calls other hooks. <code>useLocalStorage</code>, <code>useFetch</code>, <code>useDebounce</code> — these patterns clean up your components dramatically.</p><h2 id="beyond-basics">useRef, useMemo, useCallback</h2><p><code>useRef</code> holds a mutable value that persists across renders without triggering re-renders. <code>useMemo</code> caches expensive computations. <code>useCallback</code> memoizes functions. Use them when you have measured performance problems, not preemptively.</p>`,
    createdAt: new Date("2023-03-10"),
  },
  {
    title: "Tailwind CSS — Why It Changed How I Build UIs",
    slug: "tailwind-css-changed-how-i-build-uis",
    excerpt: "From skeptic to convert — how utility-first CSS with Tailwind made me faster, more consistent, and eliminated the dreaded 'naming things' problem.",
    category: "Frontend",
    tags: ["tailwind", "css", "frontend", "design"],
    coverColor: "#38bdf8",
    readingTime: 7,
    featured: false,
    content: `<h2 id="the-problem">The CSS Problem</h2><p>Traditional CSS grows unbounded. You end up with thousands of lines of stylesheets, naming conflicts, dead code you're afraid to delete, and the constant question: "what do I name this class?"</p><h2 id="utility-first">Utility-First Approach</h2><p>Tailwind provides small, single-purpose classes: <code>flex</code>, <code>p-4</code>, <code>text-lg</code>, <code>bg-blue-500</code>. Instead of writing CSS, you compose utilities directly in your HTML. It feels wrong at first, then it clicks.</p><h2 id="why-it-works">Why It Works</h2><p><strong>No naming:</strong> You never waste time deciding between <code>.card-wrapper</code> and <code>.card-container</code>. <strong>No dead CSS:</strong> Utilities are only generated if used. <strong>Consistency:</strong> The spacing/color scale enforces design constraints. <strong>Speed:</strong> You style without switching files.</p><h2 id="responsive">Responsive Design</h2><p>Tailwind's responsive prefixes are intuitive: <code>md:flex-row</code> means "flex-row at medium breakpoint and above." Mobile-first by default. No more writing media queries manually.</p><h2 id="with-react">Tailwind + React</h2><p>The combination is powerful. Component-scoped styling without CSS modules or styled-components. Use <code>clsx</code> or <code>cn</code> for conditional classes. Extract repeated patterns into components, not utility classes.</p><h2 id="when-not">When Not to Use Tailwind</h2><p>Content-heavy sites with prose (use <code>@tailwindcss/typography</code>). Highly dynamic styles that depend on JS values (use inline styles). Teams that prefer strict separation of concerns.</p>`,
    createdAt: new Date("2023-07-18"),
  },
  {
    title: "Building REST APIs with Express.js — The Complete Guide",
    slug: "building-rest-apis-expressjs-complete-guide",
    excerpt: "From routing to middleware to error handling — everything you need to build production-ready APIs with Express.js and Node.js.",
    category: "Backend",
    tags: ["express", "nodejs", "backend", "api"],
    coverColor: "#f472b6",
    readingTime: 11,
    featured: true,
    content: `<h2 id="why-express">Why Express</h2><p>Express is the most popular Node.js framework for a reason: minimal, flexible, and battle-tested. It provides just enough structure without being opinionated about your architecture.</p><h2 id="project-structure">Project Structure</h2><pre><code>src/\n├── routes/       # Route definitions\n├── controllers/  # Business logic\n├── middleware/   # Auth, validation, logging\n├── models/       # Database models\n├── utils/        # Helpers\n└── index.js      # Entry point</code></pre><h2 id="routing">Routing</h2><p>Express Router lets you modularize routes. Group related endpoints: <code>/api/users</code>, <code>/api/posts</code>, <code>/api/auth</code>. Use proper HTTP methods: GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removes.</p><h2 id="middleware">Middleware</h2><p>Middleware functions execute in order. Use them for authentication (JWT verification), request validation (Joi/Zod schemas), logging, rate limiting, and CORS. The <code>next()</code> function passes control to the next middleware.</p><h2 id="error-handling">Error Handling</h2><p>Create a centralized error handler as the last middleware. Custom error classes with status codes keep your error responses consistent. Always handle async errors with try/catch or an async wrapper.</p><h2 id="database">Database Integration</h2><p>Use an ORM like Prisma or Sequelize for type-safe queries. Connection pooling is essential for production. Always validate and sanitize inputs before they reach your database.</p><h2 id="deployment">Deployment</h2><p>Use PM2 for process management in production. Set up health check endpoints. Use environment variables for configuration. Enable HTTPS and security headers with Helmet.</p>`,
    createdAt: new Date("2023-09-05"),
  },
  {
    title: "AWS for Developers — Services You Actually Need to Know",
    slug: "aws-for-developers-essential-services",
    excerpt: "Cut through the 200+ AWS services. Here are the 10 that matter most for web developers, with practical use cases for each.",
    category: "Cloud",
    tags: ["aws", "cloud", "devops", "backend"],
    coverColor: "#f59e0b",
    readingTime: 10,
    featured: false,
    content: `<h2 id="overwhelm">The AWS Overwhelm</h2><p>AWS has 200+ services. As a developer, you don't need most of them. Here are the ones that actually matter for building and deploying web applications.</p><h2 id="compute">EC2 & Lambda</h2><p><strong>EC2:</strong> Virtual servers. Use for traditional applications that need full server control. Choose t3.micro for dev, t3.medium+ for production. <strong>Lambda:</strong> Serverless functions. Pay only for execution time. Perfect for APIs, cron jobs, and event processing.</p><h2 id="storage">S3 & CloudFront</h2><p><strong>S3:</strong> Object storage for files, images, backups, and static website hosting. Virtually unlimited storage at pennies per GB. <strong>CloudFront:</strong> CDN that caches your content at edge locations worldwide. Put it in front of S3 for fast static asset delivery.</p><h2 id="database">RDS & DynamoDB</h2><p><strong>RDS:</strong> Managed PostgreSQL, MySQL, etc. Handles backups, patches, and replication. <strong>DynamoDB:</strong> NoSQL key-value store with single-digit millisecond latency. Great for session storage, user profiles, and high-throughput workloads.</p><h2 id="networking">Route 53 & VPC</h2><p><strong>Route 53:</strong> DNS service for domain management and routing. <strong>VPC:</strong> Virtual private cloud — your isolated network. Understand subnets, security groups, and NAT gateways for production setups.</p><h2 id="devops">ECS, ECR & CodePipeline</h2><p><strong>ECS:</strong> Container orchestration (runs your Docker containers). <strong>ECR:</strong> Container registry (stores your Docker images). <strong>CodePipeline:</strong> CI/CD automation. Together they form a complete deployment pipeline.</p>`,
    createdAt: new Date("2024-01-20"),
  },
  {
    title: "Networking Fundamentals Every Developer Should Know",
    slug: "networking-fundamentals-every-developer-should-know",
    excerpt: "DNS, TCP/IP, HTTP, HTTPS, WebSockets — understand how data actually travels across the internet and why it matters for your applications.",
    category: "Networking",
    tags: ["networking", "http", "dns", "backend"],
    coverColor: "#10b981",
    readingTime: 9,
    featured: false,
    content: `<h2 id="osi-model">The OSI Model (Simplified)</h2><p>Data travels through layers: Physical → Data Link → Network (IP) → Transport (TCP/UDP) → Application (HTTP). You mostly work at the top layers, but understanding the stack helps debug network issues.</p><h2 id="dns">DNS — The Internet's Phone Book</h2><p>When you type a URL, DNS resolves the domain to an IP address. The lookup chain: Browser cache → OS cache → Router → ISP DNS → Root servers → TLD servers → Authoritative server. Understanding DNS helps with domain setup, CDN configuration, and debugging "site not loading" issues.</p><h2 id="tcp-ip">TCP/IP</h2><p><strong>TCP</strong> provides reliable, ordered delivery with a three-way handshake (SYN, SYN-ACK, ACK). Used for HTTP, database connections, email. <strong>UDP</strong> is faster but unreliable — used for video streaming, gaming, and DNS queries.</p><h2 id="http">HTTP/HTTPS</h2><p>HTTP is stateless request-response. Key methods: GET (read), POST (create), PUT (update), DELETE (remove). Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error. HTTPS adds TLS encryption — always use it.</p><h2 id="websockets">WebSockets</h2><p>HTTP is one-way: client asks, server responds. WebSockets maintain a persistent two-way connection. Use for real-time features: chat, live notifications, collaborative editing, stock tickers.</p><h2 id="cors">CORS</h2><p>Cross-Origin Resource Sharing controls which domains can access your API. The browser sends a preflight OPTIONS request. Configure your server to allow specific origins, methods, and headers.</p>`,
    createdAt: new Date("2024-04-12"),
  },
  {
    title: "Redis — The Swiss Army Knife of Backend Development",
    slug: "redis-swiss-army-knife-backend",
    excerpt: "Caching, sessions, rate limiting, pub/sub, queues — Redis does it all. Learn when and how to use it in your applications.",
    category: "Backend",
    tags: ["redis", "caching", "backend", "database"],
    coverColor: "#ef4444",
    readingTime: 8,
    featured: false,
    content: `<h2 id="what-is-redis">What is Redis?</h2><p>Redis is an in-memory data store that operates at microsecond speeds. It's not just a cache — it's a versatile tool that solves many backend problems elegantly.</p><h2 id="caching">Caching</h2><p>The most common use case. Store database query results in Redis with a TTL. Cache invalidation strategies: time-based expiry, write-through (update cache on write), or event-based invalidation. Even simple caching can reduce database load by 80%.</p><h2 id="sessions">Session Storage</h2><p>Store user sessions in Redis instead of server memory. This enables horizontal scaling — any server can read any user's session. Use <code>express-session</code> with <code>connect-redis</code> for Express apps.</p><h2 id="rate-limiting">Rate Limiting</h2><p>Use Redis INCR with EXPIRE to implement rate limiting. Track request counts per IP or API key. When the count exceeds the limit within the time window, return 429 Too Many Requests.</p><h2 id="pub-sub">Pub/Sub & Queues</h2><p>Redis Pub/Sub enables real-time messaging between services. Redis Lists work as simple job queues — LPUSH to enqueue, BRPOP to dequeue. For production job queues, use BullMQ which builds on Redis.</p><h2 id="data-structures">Rich Data Structures</h2><p>Beyond strings: Hashes (objects), Lists (arrays), Sets (unique items), Sorted Sets (leaderboards), Streams (event logs). Each structure has specialized commands optimized for specific access patterns.</p>`,
    createdAt: new Date("2024-07-30"),
  },
  {
    title: "Docker for Full-Stack Developers — A Practical Guide",
    slug: "docker-fullstack-developers-practical-guide",
    excerpt: "Stop saying 'it works on my machine.' Learn Docker from Dockerfiles to Compose to production deployment with real full-stack examples.",
    category: "DevOps",
    tags: ["docker", "devops", "containers", "deployment"],
    coverColor: "#3b82f6",
    readingTime: 10,
    featured: true,
    content: `<h2 id="why-docker">Why Docker?</h2><p>Docker packages your app with its entire environment — OS, runtime, dependencies, config — into a portable container. Same behavior everywhere: your laptop, CI pipeline, production server.</p><h2 id="dockerfile">Writing a Dockerfile</h2><p>A Dockerfile is a recipe. Use multi-stage builds to keep images small:</p><pre><code>FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nEXPOSE 3000\nCMD ["node", "dist/index.js"]</code></pre><h2 id="compose">Docker Compose</h2><p>Define your full stack in one file: React frontend, Express API, PostgreSQL database, Redis cache. One <code>docker compose up</code> spins everything up with networking between services handled automatically.</p><h2 id="volumes">Volumes & Networking</h2><p>Volumes persist data beyond container lifecycle — essential for databases. Docker creates an internal network where containers communicate by service name. Your Express app connects to Postgres at <code>db:5432</code>, not <code>localhost</code>.</p><h2 id="best-practices">Best Practices</h2><p>Use <code>.dockerignore</code> to exclude node_modules. Pin base image versions. Don't run as root. Add health checks. Layer your Dockerfile — put infrequently changed layers (dependencies) before frequently changed ones (source code) for faster builds.</p><h2 id="production">Production Deployment</h2><p>Push images to a registry (Docker Hub, ECR, GCR). Use orchestration (ECS, Kubernetes) for scaling. Implement rolling updates for zero-downtime deployments. Monitor container health and resource usage.</p>`,
    createdAt: new Date("2024-10-05"),
  },
  {
    title: "Backend Architecture Patterns — MVC, Clean, and Microservices",
    slug: "backend-architecture-patterns-guide",
    excerpt: "Choose the right architecture for your project. Understand MVC, layered architecture, clean architecture, and when microservices actually make sense.",
    category: "Backend",
    tags: ["backend", "architecture", "nodejs", "system-design"],
    coverColor: "#a855f7",
    readingTime: 9,
    featured: false,
    content: `<h2 id="why-architecture">Why Architecture Matters</h2><p>Good architecture makes code maintainable, testable, and scalable. Bad architecture turns every feature into a struggle. The right choice depends on project size, team, and requirements.</p><h2 id="mvc">MVC Pattern</h2><p>Model-View-Controller separates data (Model), presentation (View), and logic (Controller). Express apps naturally follow this: routes → controllers → models. Simple, well-understood, perfect for most CRUD applications.</p><h2 id="layered">Layered Architecture</h2><p>Routes → Controllers → Services → Repositories → Database. Each layer only talks to the one below it. Services contain business logic, repositories handle data access. This separation makes testing and refactoring much easier.</p><h2 id="clean">Clean Architecture</h2><p>Dependencies point inward. Business logic (use cases) at the center, framework details (Express, Prisma) at the edges. Overkill for small projects, invaluable for complex domains. The key insight: your business logic shouldn't know about your web framework.</p><h2 id="microservices">Microservices</h2><p>Split your monolith into independent services communicating via APIs or message queues. Each service has its own database. Benefits: independent deployment, technology diversity, fault isolation. Costs: distributed system complexity, data consistency challenges, operational overhead.</p><h2 id="recommendation">What to Choose</h2><p>Start with a well-structured monolith (layered MVC). Extract microservices only when you have a specific scaling or team-independence problem. Premature microservices are the number one architecture mistake in startups.</p>`,
    createdAt: new Date("2025-01-14"),
  },
];

async function main() {
  console.log('🌱 Seeding database...');
  await prisma.post.deleteMany();
  await prisma.contact.deleteMany();
  for (const post of posts) {
    await prisma.post.create({ data: post });
  }
  console.log(`✅ Seeded ${posts.length} posts`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

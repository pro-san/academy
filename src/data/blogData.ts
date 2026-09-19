/**
 * Technical Articles & Engineering Blog Posts Data
 * High-leverage software engineering, full-stack architecture, and AI tutorials by Mr. KIM SAN.
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'AI & Full Stack' | 'Backend & DevOps' | 'Automation & APIs' | 'Database' | 'Frontend';
  publishedAt: string;
  readTimeOverride?: number; // Optional manual override, otherwise computed from content
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  coverImage: string;
  content: string; // Full markdown / text article used for dynamic content length reading time calculation
}

export const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'autonomous-ai-agents-gemini-react',
    title: 'Architecting Autonomous AI Agents with Gemini Models & React 18',
    excerpt:
      'A practical guide to building responsive server-sent streaming interfaces, robust tool invocation loops, and low-latency LLM agent pipelines in production applications.',
    category: 'AI & Full Stack',
    publishedAt: 'Sep 12, 2024',
    author: {
      name: 'Mr. KIM SAN',
      role: 'Full Stack & AI Engineer',
      avatar: '/images/kim-san.jpg',
    },
    tags: ['Gemini AI', 'React 18', 'TypeScript', 'Streaming', 'Agentic Workflows'],
    coverImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    content: `
# Architecting Autonomous AI Agents with Gemini Models & React 18

Modern web engineering is experiencing a profound paradigm shift: applications are transitioning from static request-response systems to proactive, autonomous agent ecosystems. Integrating Large Language Models (LLMs) like Google Gemini requires rethinking state synchronization, UI ergonomics, and error resilience.

## 1. The Core Architecture of an AI Agent Loop
An effective client-server AI agent pipeline consists of three symbiotic layers:
1. **The Context Orchestrator**: Collects user intent, application telemetry, and persistent user memories.
2. **The Decision Engine**: A server-side runner that queries Gemini with structured tool declarations (function calling) and evaluates whether further sub-tasks are necessary.
3. **The Reactive Streaming Layer**: Transmits progressive semantic chunks and UI tool cards to the React client via Server-Sent Events (SSE).

\`\`\`typescript
export async function runAgentStep(prompt: string, tools: ToolDefinition[]) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      tools: [{ functionDeclarations: tools }],
      temperature: 0.2,
    },
  });
  return response;
}
\`\`\`

## 2. Preventing Hallucinations with Grounded Tool Schemas
A common flaw in rudimentary agent implementations is unstructured text prompting. By defining rigid TypeScript interfaces mapped directly into OpenAPI function definitions, the Gemini model produces type-safe parameters that can be immediately validated before execution.

- Validate arguments with Zod schemas on the server boundary.
- Never grant the model raw SQL or shell execution permissions without multi-layered parameterization.
- Maintain an audit trail of every automated action taken by the agent.

## 3. Streaming UI Ergonomics in React
Users perceive latency significantly less when token streams arrive with smooth kinetic rhythm. Rather than updating React state on every raw SSE packet (which triggers dozens of re-renders per second), batch incoming tokens using \`requestAnimationFrame\` or a debounce queue.

## Conclusion
Autonomous AI agents are not science fiction—they are production-ready tools when paired with deliberate architectural boundaries, high-throughput streaming, and defensive tool validation.
    `,
  },
  {
    id: '2',
    slug: 'high-concurrency-laravel-docker-microservices',
    title: 'Scaling Laravel APIs with Redis Queues & Multi-Container Docker',
    excerpt:
      'How to decouple compute-intensive operations, implement resilient background workers, and eliminate database bottlenecks for 5,000+ requests per second.',
    category: 'Backend & DevOps',
    publishedAt: 'Aug 28, 2024',
    author: {
      name: 'Mr. KIM SAN',
      role: 'Lead Backend Developer',
      avatar: '/images/kim-san.jpg',
    },
    tags: ['Laravel', 'PHP 8.2', 'Docker', 'Redis', 'Microservices', 'Queue Workers'],
    coverImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    content: `
# Scaling Laravel APIs with Redis Queues & Multi-Container Docker

When scaling monolithic or modular Laravel applications to accommodate high-concurrency traffic bursts, naive synchronous controllers immediately collapse database connection pools. By shifting heavy workloads into isolated background workers, system responsiveness improves by orders of magnitude.

## The Bottleneck: Synchronous Task Execution
Consider an e-commerce checkout flow:
- Validating shopping cart items
- Charging Stripe/PayPal webhook payment intents
- Generating PDF invoices
- Dispatching email confirmations
- Notifying Telegram administrative channels

If executed in a single HTTP request lifecycle, the client waits over 3.8 seconds. If the external email service experiences a 5-second timeout, the entire order fails.

## The Solution: Asynchronous Event Dispatching
Using Laravel's unified Queue interface backed by Redis in-memory broker, we reduce the initial HTTP endpoint latency to under 45 milliseconds:

\`\`\`php
public function checkout(OrderRequest $request): JsonResponse
{
    $order = $this->orderService->createPendingOrder($request->validated());
    
    // Dispatch asynchronous pipeline
    ProcessPaymentJob::dispatch($order)->onQueue('high-priority');
    
    return response()->json([
        'status' => 'accepted',
        'order_id' => $order->id,
    ], 202);
}
\`\`\`

## Docker Orchestration for Elastic Scaling
By separating the Nginx web server, PHP-FPM application container, Redis instance, and isolated queue worker containers into a streamlined Docker Compose environment, individual components can be scaled independently based on CPU load.

\`\`\`yaml
services:
  app:
    build: .
    volumes:
      - .:/var/www/html
  worker:
    build: .
    command: php artisan queue:work redis --queue=high-priority,default --sleep=1 --tries=3
    deploy:
      replicas: 4
\`\`\`

## Key Takeaways
- Always offload I/O-bound third-party API calls to queues.
- Monitor Redis memory consumption with eviction policies (volatile-lru).
- Set dead-letter queues (failed_jobs) with automated Slack/Telegram alerting.
    `,
  },
  {
    id: '3',
    slug: 'telegram-bot-api-automation-nodejs',
    title: 'Building Production Telegram Bots with Node.js & Webhook Security',
    excerpt:
      'Comprehensive architecture for event-driven Telegram bot microservices: webhook signature validation, distributed session storage, and conversational menus.',
    category: 'Automation & APIs',
    publishedAt: 'Jul 15, 2024',
    author: {
      name: 'Mr. KIM SAN',
      role: 'Full Stack & Automation Engineer',
      avatar: '/images/kim-san.jpg',
    },
    tags: ['Telegram Bot', 'Node.js', 'Webhooks', 'Cybersecurity', 'Automation'],
    coverImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    content: `
# Building Production Telegram Bots with Node.js & Webhook Security

Telegram has evolved into one of the most powerful application platforms in the world. With over 900 million active users, Telegram bots can deliver mini-apps, automated trading telemetry, customer service ticketing, and internal devops orchestration.

## Polling vs. Webhooks in Production
While long-polling is convenient during local prototyping, it wastes compute cycles and cannot scale across multi-region serverless clusters. In production environments, webhooks are mandatory:
- Set up an HTTPS endpoint protected by a secret token (\`X-Telegram-Bot-Api-Secret-Token\`).
- Return HTTP 200 immediately before running heavy business logic to prevent Telegram from retrying webhook delivery.

\`\`\`typescript
app.post('/api/telegram-webhook', async (req, res) => {
  const secretHeader = req.headers['x-telegram-bot-api-secret-token'];
  if (secretHeader !== process.env.TELEGRAM_SECRET) {
    return res.status(403).send('Forbidden');
  }
  
  // Acknowledge receipt instantly
  res.status(200).json({ ok: true });
  
  // Process event in background worker
  await eventQueue.add('telegram-event', req.body);
});
\`\`\`

## Handling Multi-Step Conversational State
Users rarely complete transactions in a single command. Implementing a finite state machine (FSM) mapped to the user's \`chat.id\` ensures contextual recovery across network disruptions.

## Key Takeaways
- Always configure rate-limiting per chat ID to guard against spam attacks.
- Store user dialog sessions in Redis with TTL expiration.
- Utilize inline keyboards with callback data payloads for ergonomic mobile interactions.
    `,
  },
  {
    id: '4',
    slug: 'postgresql-mysql-query-optimization-10x',
    title: 'Optimizing SQL Queries & Indexing for 10x Throughput at Scale',
    excerpt:
      'Eliminate table scans, understand B-Tree composite index positioning, and debug query execution plans using EXPLAIN ANALYZE.',
    category: 'Database',
    publishedAt: 'Jun 05, 2024',
    author: {
      name: 'Mr. KIM SAN',
      role: 'Database & Backend Architect',
      avatar: '/images/kim-san.jpg',
    },
    tags: ['PostgreSQL', 'MySQL', 'Database Indexing', 'Performance', 'SQL'],
    coverImage:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80',
    content: `
# Optimizing SQL Queries & Indexing for 10x Throughput at Scale

Database performance is almost never limited by disk speed or memory size—it is bottlenecked by improper index selection, Cartesian cross joins, and N+1 query patterns that force sequential disk reads across millions of records.

## Understanding the B-Tree Index Hierarchy
When an index is placed on a database column, the storage engine creates an ordered balanced tree structure allowing O(log N) point lookups instead of O(N) full table scans.

### The Leftmost Prefix Rule
When creating composite multi-column indexes:
\`\`\`sql
CREATE INDEX idx_orders_user_status_date ON orders (user_id, status, created_at);
\`\`\`
This index will accelerate queries filtering by:
1. \`user_id\`
2. \`user_id\` AND \`status\`
3. \`user_id\` AND \`status\` AND \`created_at\`

It will NOT accelerate queries filtering solely by \`status\` or \`created_at\` without the leading prefix!

## Decoding EXPLAIN ANALYZE Output
Never optimize queries based on intuition. Always inspect the database query planner:
- Look for **Seq Scan** (Sequential Scan) on tables with more than 10,000 rows.
- Ensure **Index Scan** or **Bitmap Index Scan** is utilized.
- Check the cost difference between actual startup time and total time.

## Eliminating N+1 Query Traps in ORMs
Object-Relational Mappers like Eloquent (Laravel) or Prisma (Node.js) introduce insidious performance drains when relationships are lazy-loaded within loops. Eager loading with \`with(['relationship'])\` collapses 1,000 SQL queries into exactly 2 network roundtrips.

## Summary Checklist
- Index foreign keys and columns frequently used in WHERE, JOIN, and ORDER BY clauses.
- Keep transaction lifetimes short to prevent row-level lock contention.
- Monitor slow query logs daily and set alerts for queries exceeding 200ms.
    `,
  },
];

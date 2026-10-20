// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Abdul Hadi Adnan',
  initials: 'AHA',
  headline: 'Software engineer building backend, cloud & AI systems.',
  roles: ['Backend Engineer', 'Cloud Engineer', 'Solution Architect', 'GenAI Engineer', 'AI Quality Analyst'],
  location: 'Lahore, Pakistan',
  timezone: 'UTC+5',
  email: 'abdulhadiadnan1080@gmail.com',
  github: 'https://github.com/abdulhadiadnan1080',
  githubHandle: 'abdulhadiadnan1080',
  cv: '/Abdul_Hadi_Adnan_CV.pdf',
  photo: '/abdul.jpg',
  photoDuo: '/abdul-duo.jpg',
  intro:
    'I design and ship production systems for banks and other regulated industries, from the first workshop to the production runbook.',
  about: [
    'Most of my work sits where software meets regulation: banking pipelines, healthcare edge cases and AI-Act compliance. I aim for systems that are cheap to run, safe to audit and fast under load.',
    'I write the Infrastructure as Code (AWS CDK and Terraform), I write the runbooks, and I stay in the room with stakeholders to explain the trade-offs.',
  ],
}

// Rows for the "ledger" table in the impact section.
export const ledger = [
  { label: 'Bank users processed by one GenAI pipeline', value: '88,000' },
  { label: 'Daily running cost of that pipeline', value: '$1–10' },
  { label: 'Chatbot interactions per month', value: '110,000' },
  { label: 'Response time per interaction', value: '< 3 s' },
  { label: 'Engineers led as Pod Lead', value: '5' },
]

export const costCut = { before: 45000, after: 22000 }
export const concurrency = { before: 1, after: 100 }

export type PipelineNode = { id: string; title: string; service: string; body: string }

export const pipeline: PipelineNode[] = [
  { id: 'ingest', title: 'Flagged users', service: 'Apache Iceberg', body: 'Users the bank has flagged are extracted from Iceberg tables.' },
  { id: 'fanout', title: 'Processing', service: 'AWS Lambda', body: 'Multiple serverless Lambda functions process the users, which keeps the running cost for 88,000 users at $1–10 a day.' },
  { id: 'reason', title: 'Policy reasoning', service: 'Bedrock Agent Core', body: 'Agents built on Bedrock Agent Core check each user against the bank’s policies and government regulations.' },
  { id: 'decide', title: 'Model evaluation', service: 'Amazon Bedrock', body: 'Model outputs are checked for accuracy and grounding against those same policies.' },
  { id: 'act', title: 'Default prevention', service: 'Bank systems', body: 'The results go back to the bank so it can act before users default.' },
]

export type Project = {
  title: string
  kicker: string
  summary: string
  impact: string
  stack: string[]
  link?: string
}

export const featured: Project = {
  title: 'GenAI Default-Prevention Pipeline',
  kicker: 'Banking · GenAI · Client work',
  summary:
    'End-to-end infrastructure that extracts flagged users from Iceberg tables and processes them against bank and government policies using Amazon Bedrock, Bedrock Agent Core and multiple Lambda functions.',
  impact: '88,000 users at $1–10 per day',
  stack: ['Amazon Bedrock', 'Bedrock Agent Core', 'AWS Lambda', 'Apache Iceberg'],
}

export const clientProjects: Project[] = [
  {
    title: 'Backend Regional Migration',
    kicker: 'Banking · Cloud',
    summary: 'A 5-month engagement covering full system development and a zero-downtime migration of a bank backend to a new AWS region. The cutover itself took 2 days, with issues resolved on the spot.',
    impact: '$45k → $22k a month',
    stack: ['AWS', 'Regional migration', 'Backend'],
  },
  {
    title: 'Scalable Cognitive Chatbot Platform',
    kicker: 'Conversational AI',
    summary: 'Re-architected a single-EC2 chatbot that served one user at a time into a scalable, secure and compliant AWS platform on Bedrock.',
    impact: '1 → 100 concurrent users',
    stack: ['Amazon Bedrock', 'AWS'],
  },
  {
    title: 'Predictive Extraction & Onboarding',
    kicker: 'Banking · LLM',
    summary: 'LLM and AWS pipelines that identify users likely to default within 30 days, plus a complete onboarding pipeline for new bank accounts that integrates cleanly with existing systems.',
    impact: '30-day default prediction',
    stack: ['LLMs', 'AWS'],
  },
  {
    title: 'Sandbox & Custodian Governance',
    kicker: 'Platform · Compliance',
    summary: 'Isolated developer sandboxes and a daily Cloud Custodian pipeline for compliance, resource governance and cost, with safe teardown through AWS Nuke.',
    impact: 'Safe testing, full audit trail',
    stack: ['Cloud Custodian', 'AWS Nuke'],
  },
  {
    title: 'MSP Post-Sale Issue Platform',
    kicker: 'Security · Ops',
    summary: 'A secure system built with GuardDuty and related controls that routes each client issue to the right internal manager through a clean GUI.',
    impact: 'Issues reach the right owner',
    stack: ['GuardDuty', 'AWS'],
  },
]

export const ownProjects: Project[] = [
  {
    title: 'AI Infographic Learning Companion',
    kicker: 'Final-year project',
    summary: 'An AI-powered companion app that improves digital learning by generating infographics automatically. It combines NLP and data visualisation into interactive learning tools.',
    impact: 'NLP + data visualisation',
    stack: ['React', 'Python', 'NLP'],
    link: 'https://github.com/abdulhadiadnan1080',
  },
  {
    title: 'Portfolio Web Application',
    kicker: 'Personal project',
    summary: 'A responsive personal portfolio with a project showcase, blog integration and contact automation through APIs.',
    impact: 'Full-stack, API-driven',
    stack: ['React', 'CSS', 'Flask'],
    link: 'https://github.com/abdulhadiadnan1080',
  },
]

export type Job = { role: string; org: string; period: string; points: string[] }

export const experience: Job[] = [
  {
    role: 'Software Engineer',
    org: 'Devsinc',
    period: '2025 — Present',
    points: [
      'Owns technical design and delivery of client projects in banking and regulated domains, from discovery through production.',
      'Designs AWS architectures with Layer-7 security, VPCs, Transit Gateway, NACLs and hybrid connectivity.',
      'Leads GenAI workstreams and evaluates frontier models from Anthropic, Meta, OpenAI, xAI (Grok) and Ollama.',
      'Built daily Custodian compliance pipelines and developer sandboxes, and writes runbooks for every delivery.',
    ],
  },
  {
    role: 'Freelance Cloud & GenAI Engineer',
    org: 'Independent',
    period: '2021 — 2025',
    points: [
      'Started in quality control and fine-tuning work on frontier multimodal models, then became Pod Lead of 5 engineers.',
      'Led AI compliance remediation for the EU AI Act and Colorado AI Act, redesigning ML pipelines and governance.',
      'Shipped GenAI, computer-vision and cloud systems for healthcare, fintech, legal and banking clients under NDA.',
      'Delivered full Infrastructure as Code on both AWS CDK and Terraform.',
    ],
  },
]

export type RoleGroup = { role: string; proof: string; skills: string[] }

export const roleGroups: RoleGroup[] = [
  {
    role: 'Backend Engineer',
    proof: 'Built the Python and Lambda backends behind the bank pipelines, and led a full backend rebuild and regional migration.',
    skills: ['Python', 'Flask', 'API design', 'Event-driven systems', 'Microservices', 'SQL & NoSQL', 'Step Functions', 'SQS / SNS'],
  },
  {
    role: 'Cloud Engineer',
    proof: 'Cut a bank’s AWS bill from $45k to $22k a month, and runs daily Custodian governance.',
    skills: ['AWS', 'Azure', 'AWS CDK', 'Terraform', 'VPC', 'Transit Gateway', 'IAM', 'GuardDuty', 'CloudWatch', 'Cloud Custodian'],
  },
  {
    role: 'Solution Architect',
    proof: 'Owns projects from discovery workshops to production, and explains the trade-offs to non-technical stakeholders.',
    skills: ['System design', 'Client workshops', 'Multi-cloud', 'Security architecture', 'Runbooks', 'Documentation'],
  },
  {
    role: 'GenAI & ML Engineer',
    proof: 'Put Bedrock agents into production for 88,000 users, and has worked on fine-tuning frontier models.',
    skills: ['Amazon Bedrock', 'Agent Core', 'SageMaker', 'Fine-tuning', 'Knowledge graphs', 'Amazon Neptune', 'Computer vision', 'NLP', 'MLOps'],
  },
  {
    role: 'AI Quality & Compliance',
    proof: 'Led a 5-person pod focused on model quality, and led remediation work for the EU and Colorado AI Acts.',
    skills: ['LLM evaluation', 'Side-by-side ranking', 'Rubrics', 'Bias mitigation', 'EU AI Act', 'Colorado AI Act', 'HIPAA', 'PIPEDA', 'ISO'],
  },
]

export const education = [
  { school: 'Forman Christian College University', detail: 'BS Computer Science · Machine Learning & Deep Learning', period: '2026', place: 'Lahore' },
  { school: 'Lingnan University', detail: 'Exchange Student, Data Science · Algorithms, VR/AR, Unreal Engine 5', period: 'Exchange', place: 'Hong Kong' },
  { school: 'Roots International / MIUC', detail: 'Intermediate of Computer Science (ICS)', period: '2020 — 2022', place: 'Lahore' },
]

export const beyond = [
  { role: 'Executive Event Coordinator', org: 'Forman Music Society', year: '2025' },
  { role: 'Head of Graphics', org: 'Forman Dramatics Club', year: '2024' },
  { role: 'Graphics Supervisor', org: 'Forman Journalism Society', year: '2024' },
  { role: 'Logistics Manager', org: 'Forman Journalism Society', year: '2023' },
]

// Sections in page order. `nav` controls whether a section is linked in the top bar.
export const sections = [
  { id: 'top', label: 'Home', nav: false },
  { id: 'impact', label: 'Impact', nav: true },
  { id: 'pipeline', label: 'Architecture', nav: true },
  { id: 'work', label: 'Work', nav: true },
  { id: 'roles', label: 'Roles', nav: true },
  { id: 'experience', label: 'Experience', nav: true },
  { id: 'education', label: 'Education', nav: false },
  { id: 'terminal', label: 'Terminal', nav: false },
  { id: 'contact', label: 'Contact', nav: true },
]

// What Winston the dachshund says in each section.
export const guide: Record<string, string> = {
  top: 'Good day! I’m Winston. Allow me to show you around Abdul’s work.',
  impact: 'Start here: the numbers that matter. Watch that cost bar shrink.',
  pipeline: 'This is his featured architecture. Click any stage for the details.',
  work: 'The work itself. Hover over a project to open it up.',
  roles: 'He fits more than one chair. Here are the roles, with proof for each.',
  experience: 'The career so far, from model QC to owning production systems.',
  education: 'Schooled in Lahore and Hong Kong, and busy on campus too.',
  terminal: 'Fancy a terminal? Type “help”. I recommend “sudo hire abdul”.',
  contact: 'That’s the tour! Drop him a line. He replies faster than I fetch.',
}

export const winstonFacts = [
  'Woof! Dachshunds were bred to dig. Abdul digs into logs instead.',
  'I cost less per day than that bank pipeline. Barely.',
  'Try ⌘K. There’s a terminal hiding in here.',
  'My scarf is racing green. Very distinguished.',
  'I have never once caused downtime. Unlike the cat.',
]

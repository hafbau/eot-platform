# EOT Intelligence Platform - Product Requirements Document

**Version:** 1.0  
**Date:** July 15, 2025  
**Status:** Draft

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Personas](#user-personas)
4. [Core Features & Functionality](#core-features--functionality)
5. [Detailed User Journeys](#detailed-user-journeys)
6. [Technical Requirements](#technical-requirements)
7. [Data Model](#data-model)
8. [Integration Requirements](#integration-requirements)
9. [Security & Compliance](#security--compliance)
10. [Success Metrics](#success-metrics)
11. [Implementation Roadmap](#implementation-roadmap)

## Executive Summary

The EOT Intelligence Platform is an AI-powered construction claims management system that continuously monitors project schedules, automatically identifies claimable delays, assembles evidence in real-time, and generates comprehensive Extension of Time (EOT) submissions. The platform targets large contractors ($200M-$2B revenue) managing complex projects under FIDIC, NEC, and other standard contracts.

### Key Value Propositions
- **Revenue Recovery:** Identify and capture millions in missed claims
- **Time Efficiency:** Reduce claim preparation from weeks to hours
- **Risk Mitigation:** Never miss claim notification deadlines
- **Evidence Automation:** Real-time evidence collection and organization
- **Contract Intelligence:** AI-powered contract clause interpretation

## Product Overview

### Vision
Transform construction claims management from reactive firefighting to proactive revenue optimization through AI-powered schedule analysis and automated evidence assembly.

### Mission
Enable construction companies to capture 100% of legitimate claims while reducing administrative burden by 80%.

### Core Capabilities
1. **Continuous Schedule Monitoring** - Real-time analysis of schedule updates
2. **Automatic Delay Detection** - AI identification of claimable events
3. **Evidence Assembly Engine** - Automated collection and organization of supporting documents
4. **Contract Intelligence** - FIDIC/NEC clause mapping and interpretation
5. **Claim Generation** - One-click EOT submission package creation

## User Personas

### Primary Persona: Director of Project Controls
**Name:** David Chen  
**Demographics:** 44 years old, 15+ years experience, manages 5-10 major projects  
**Technical Proficiency:** Intermediate (uses Primavera P6, Excel, basic BI tools)

**Goals:**
- Capture all legitimate claims across portfolio
- Reduce weekend work on claim preparation
- Justify promotion to VP through measurable wins
- Implement strategic systems, not just firefight

**Pain Points:**
- Missing claim deadlines due to manual tracking
- Spending 20+ hours assembling evidence per claim
- Can't prove causation for client delays
- Losing millions in liquidated damages

**Day in Life:**
- 7:00 AM - Reviews overnight schedule updates
- 8:30 AM - Team meeting on critical delays
- 10:00 AM - Scrambles to find evidence for urgent claim
- 2:00 PM - Argues with client about delay responsibility
- 6:00 PM - Stays late assembling claim documentation

### Secondary Persona: Project Manager
**Name:** Sarah Williams  
**Demographics:** 38 years old, PE, manages $100M+ projects

**Goals:**
- Maintain project profitability
- Quick access to delay evidence
- Clear communication with stakeholders
- Protect team from unfair penalties

**Usage Pattern:**
- Reviews weekly delay alerts
- Approves evidence collection
- Signs off on claim submissions

### Tertiary Persona: Scheduler/Planner
**Name:** Ahmed Hassan  
**Demographics:** 32 years old, Planning Engineer, Primavera expert

**Goals:**
- Accurate schedule maintenance
- Clear delay impact analysis
- Recognition for claim contributions

**Usage Pattern:**
- Daily schedule updates
- Marks delay events
- Provides impact narratives

## Core Features & Functionality

### 1. Schedule Integration & Monitoring

#### 1.1 Schedule Import Engine
**Description:** Automated ingestion of project schedules from multiple sources

**Detailed Functionality:**
- **Primavera P6 Integration**
  - Direct API connection via Primavera Cloud
  - XER file import/export
  - Automatic daily sync with version control
  - Change detection and diff visualization

- **MS Project Integration**
  - XML import/export
  - MPP file processing
  - Cloud sync via Project Online

- **Other Formats**
  - Asta Powerproject support
  - Generic CSV/Excel import with mapping wizard
  - Custom format configuration

**Technical Details:**
- Maintains complete schedule history
- Tracks all baseline changes
- Preserves activity relationships and logic
- Stores resource assignments and costs

#### 1.2 Critical Path Analysis Engine
**Description:** Continuous analysis of critical and near-critical paths

**Detailed Functionality:**
- **Real-time CPM Calculations**
  - Forward/backward pass computation
  - Total float calculation
  - Free float analysis
  - Multiple float path identification

- **Near-Critical Monitoring**
  - Configurable threshold (default: 5 days)
  - Path volatility tracking
  - Risk scoring for path changes

- **Delay Impact Assessment**
  - Automatic fragnet insertion
  - Window analysis implementation
  - Time impact analysis (TIA)
  - Collapsed as-built methodology

### 2. AI-Powered Delay Detection

#### 2.1 Delay Event Recognition
**Description:** Machine learning models identify potential claimable delays

**Detailed Functionality:**
- **Pattern Recognition**
  - Historical delay pattern matching
  - Anomaly detection in activity durations
  - Sequence disruption identification
  - Resource conflict detection

- **Causation Analysis**
  - Client vs. contractor responsibility mapping
  - Weather impact correlation
  - Third-party delay identification
  - Concurrent delay analysis

- **Claim Opportunity Scoring**
  - Probability of success calculation
  - Potential value estimation
  - Evidence strength assessment
  - Contract clause applicability

#### 2.2 Natural Language Processing
**Description:** Extract delay events from project communications

**Detailed Functionality:**
- **Email/Document Scanning**
  - Keyword and phrase detection
  - Sentiment analysis for disputes
  - Date and duration extraction
  - Responsible party identification

- **Meeting Minutes Analysis**
  - Action item extraction
  - Decision tracking
  - Delay acknowledgment detection

### 3. Evidence Assembly Automation

#### 3.1 Document Collection Engine
**Description:** Automated gathering of claim-supporting documentation

**Detailed Functionality:**
- **Intelligent Document Search**
  - Temporal relevance filtering
  - Keyword-based retrieval
  - Related document clustering
  - Duplicate detection and removal

- **Evidence Categories**
  - Correspondence (emails, letters)
  - Site records (daily reports, photos)
  - Instructions (RFIs, change orders)
  - Third-party documents (weather, permits)
  - Meeting minutes and memos

- **Auto-Classification**
  - Document type recognition
  - Relevance scoring
  - Chronological organization
  - Causal chain construction

#### 3.2 Evidence Timeline Builder
**Description:** Visual timeline of events with supporting evidence

**Detailed Functionality:**
- **Interactive Timeline**
  - Drag-and-drop evidence placement
  - Multiple timeline views (daily, weekly, monthly)
  - Evidence strength indicators
  - Gap identification

- **Narrative Generation**
  - AI-written event descriptions
  - Cause-and-effect linking
  - Technical language optimization
  - Customizable templates

### 4. Contract Intelligence Module

#### 4.1 Contract Parser
**Description:** AI analysis of contract terms and conditions

**Detailed Functionality:**
- **Clause Extraction**
  - FIDIC Red/Yellow/Silver Book mapping
  - NEC3/NEC4 clause identification
  - Custom contract parsing
  - Amendment tracking

- **Key Terms Identification**
  - Notice periods
  - Claim procedures
  - Time bar provisions
  - Condition precedents

#### 4.2 Compliance Tracker
**Description:** Ensures claim submissions meet contractual requirements

**Detailed Functionality:**
- **Deadline Management**
  - Automatic calendar creation
  - Multi-stage notice tracking
  - Escalation workflows
  - Compliance scoring

- **Submission Validation**
  - Required document checklist
  - Format compliance checking
  - Completeness verification

### 5. Claim Generation System

#### 5.1 EOT Package Builder
**Description:** One-click generation of complete claim submissions

**Detailed Functionality:**
- **Document Assembly**
  - Cover letter generation
  - Executive summary creation
  - Detailed narrative compilation
  - Evidence appendix organization

- **Calculation Engine**
  - Delay duration computation
  - Cost impact calculation
  - Concurrent delay apportionment
  - Mitigation analysis

- **Visualization Tools**
  - Gantt chart generation
  - As-planned vs. as-built comparison
  - Delay fragnet illustration
  - S-curve analysis

#### 5.2 Multi-format Export
**Description:** Generate submissions in required formats

**Detailed Functionality:**
- **Output Formats**
  - PDF packages with bookmarks
  - Word documents with tracking
  - HTML interactive reports
  - Excel calculation sheets

## Detailed User Journeys

### Journey 1: Initial Project Setup

**Actor:** David Chen (Director of Project Controls)

#### Steps:

1. **Project Creation**
   - Clicks "New Project" button
   - Enters project details:
     - Project name: "Dubai Marina Tower Complex"
     - Contract value: $450M
     - Contract type: FIDIC Yellow Book
     - Start date: January 1, 2025
     - Planned duration: 36 months
   - Uploads contract PDF (system begins parsing)

2. **Schedule Import**
   - Selects "Import Schedule" 
   - Chooses Primavera P6 connection
   - Authenticates with P6 credentials
   - Selects project from P6 list
   - System imports 3,847 activities
   - Reviews import summary and approves

3. **Contract Configuration**
   - System shows extracted FIDIC clauses
   - Reviews Sub-Clause 20.1 (Contractor's Claims)
   - Confirms 28-day notice period
   - Adds custom client amendments
   - Sets up notification rules

4. **Team Setup**
   - Adds team members:
     - Sarah Williams (PM) - Approval rights
     - Ahmed Hassan (Scheduler) - Edit rights
     - Mark Johnson (QS) - View rights
   - Configures email notifications
   - Sets up weekly summary reports

5. **Baseline Configuration**
   - System detects 3 baselines in P6
   - Selects "Baseline 2 - Client Approved"
   - Enables daily sync schedule
   - Activates delay detection

**Time:** 25 minutes total

### Journey 2: Automatic Delay Detection & Evidence Collection

**Actor:** System (Automated) + Ahmed Hassan (Scheduler)

#### Steps:

1. **Daily Schedule Sync (3:00 AM)**
   - System connects to P6
   - Downloads latest schedule update
   - Detects 47 activity changes
   - Runs critical path analysis

2. **Delay Detection (3:15 AM)**
   - AI identifies 3 potential delays:
     - "Foundation Pour Zone A" - 15 days delay
     - "Steel Erection Tower B" - 8 days delay  
     - "MEP Rough-in Level 5" - 12 days delay
   - Analyzes causation patterns
   - Scores claim probability

3. **Evidence Collection (3:30 AM)**
   - Searches email system for keywords:
     - "foundation", "zone a", "concrete", "delay"
   - Finds 23 relevant emails
   - Extracts site diary entries for date range
   - Retrieves 8 RFIs related to foundation
   - Downloads weather data showing 5 rain days

4. **Alert Generation (6:00 AM)**
   - Creates delay alert dashboard
   - Sends notification to Ahmed
   - Prepares evidence summary

5. **Human Review (8:30 AM)**
   - Ahmed opens delay alert
   - Reviews "Foundation Pour Zone A" delay
   - Sees AI-suggested cause: "Client design change"
   - Confirms delay validity
   - Adds note: "Reinforcement redesign per RFI-234"
   - Triggers full claim analysis

**Time:** 5 minutes human interaction

### Journey 3: Claim Preparation & Submission

**Actor:** David Chen with AI assistance

#### Steps:

1. **Claim Initiation**
   - Opens "Foundation Delay - Zone A" alert
   - Reviews AI-generated summary:
     - Delay duration: 15 days
     - Critical path impact: Yes
     - Estimated cost impact: $1.2M
     - Evidence strength: 85%
   - Clicks "Prepare Claim"

2. **Evidence Review**
   - System shows timeline view
   - Reviews 23 emails in chronological order
   - Sees key email highlighted:
     - From: Client PM
     - Date: March 15, 2025
     - Content: "Please hold foundation work pending design review"
   - Reviews supporting documents:
     - RFI-234 (reinforcement clarification)
     - Design Change Notice DCN-089
     - Updated drawings (5 sheets)
   - Approves all evidence

3. **Narrative Generation**
   - AI generates claim narrative
   - Reviews 5-page detailed description
   - Edits minor technical details
   - Approves final narrative

4. **Impact Analysis Review**
   - Reviews time impact analysis
   - Sees fragnet showing 15-day insertion
   - Confirms critical path elongation
   - Reviews mitigation efforts
   - Approves analysis

5. **Package Finalization**
   - System generates complete package:
     - Cover letter to Engineer
     - Executive summary (2 pages)
     - Detailed narrative (12 pages)
     - Time impact analysis (8 pages)
     - Evidence appendix (134 pages)
   - Reviews PDF bookmarks
   - Digitally signs submission

6. **Submission & Tracking**
   - Clicks "Submit Claim"
   - System sends via email to Engineer
   - Creates follow-up reminders
   - Starts 28-day response timer

**Time:** 45 minutes total

### Journey 4: Portfolio Dashboard Review

**Actor:** David Chen (Weekly Review)

#### Steps:

1. **Dashboard Access**
   - Opens platform Monday morning
   - Sees portfolio overview:
     - 12 active projects
     - 7 open claims ($4.2M total)
     - 3 new delay alerts
     - 2 approaching deadlines

2. **Claims Pipeline Review**
   - Views claims funnel:
     - Identified: 15 opportunities ($8.5M)
     - In preparation: 4 claims ($2.1M)
     - Submitted: 7 claims ($4.2M)
     - Approved: 23 claims YTD ($12.3M)
   - Clicks into "Dubai Marina" project

3. **Project Deep Dive**
   - Reviews project health score: 78/100
   - Sees delay trend chart (improving)
   - Reviews claim success rate: 85%
   - Checks upcoming deadlines

4. **Action Items**
   - Approves 2 new claim preparations
   - Assigns claim review to Sarah
   - Schedules client meeting for major claim
   - Exports monthly report for VP

**Time:** 15 minutes

## Technical Requirements

### Architecture

#### Cloud Infrastructure
- **Platform:** AWS or Azure
- **Compute:** Auto-scaling EC2/Container instances
- **Storage:** S3 for documents, RDS for structured data
- **AI/ML:** SageMaker or Azure ML for model deployment

#### Application Stack
- **Backend:** Python/FastAPI or Node.js
- **Frontend:** React with TypeScript
- **Database:** PostgreSQL with TimescaleDB
- **Cache:** Redis for session and computation cache
- **Queue:** RabbitMQ or AWS SQS for job processing
- **Search:** Elasticsearch for document search

#### AI/ML Components
- **NLP:** Transformer models for document analysis
- **Schedule Analysis:** Custom CPM algorithms
- **Pattern Recognition:** Time-series analysis models
- **Document Classification:** CNN for document type detection

### Performance Requirements
- Schedule import: <5 minutes for 10,000 activities
- Delay detection: Real-time (<1 second)
- Evidence search: <3 seconds for 100K documents
- Claim generation: <2 minutes for complete package
- Concurrent users: Support 100+ simultaneous users
- Uptime: 99.9% availability SLA

### Integration APIs

#### Inbound Integrations
- Primavera P6 (REST API + SDK)
- Microsoft Project (Graph API)
- Document Management Systems (SharePoint, Box, Dropbox)
- Email systems (Exchange, Gmail API)
- ERP systems (SAP, Oracle)

#### Outbound Integrations
- Email delivery (SendGrid, AWS SES)
- E-signature (DocuSign, Adobe Sign)
- Cloud storage (OneDrive, Google Drive)
- BI tools (Power BI, Tableau)

## Data Model

### Core Entities

#### Project
```
- project_id (UUID)
- name
- contract_value
- contract_type (FIDIC/NEC/Custom)
- start_date
- planned_completion
- current_completion
- status
```

#### Schedule
```
- schedule_id (UUID)
- project_id (FK)
- version
- data_date
- activities (JSON)
- critical_path (Array)
- upload_timestamp
```

#### Delay_Event
```
- event_id (UUID)
- project_id (FK)
- activity_id
- detection_date
- delay_days
- cause_type
- probability_score
- evidence_strength
- claim_status
```

#### Evidence
```
- evidence_id (UUID)
- delay_event_id (FK)
- document_type
- source_system
- file_path
- relevance_score
- extracted_text
- metadata (JSON)
```

#### Claim
```
- claim_id (UUID)
- project_id (FK)
- reference_number
- submission_date
- notice_date
- claim_amount
- time_impact_days
- status
- response_due_date
```

## Integration Requirements

### Primavera P6 Integration
- Read/write access to projects
- Real-time schedule updates
- Baseline comparison
- Resource data access
- Cost data synchronization

### Document Management
- Full-text search capability
- Version control
- Access control inheritance
- Metadata extraction
- Bulk download support

### Communication Systems
- Email threading analysis
- Calendar integration
- Meeting recording transcription
- Instant message parsing

## Security & Compliance

### Data Security
- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Access Control:** Role-based (RBAC) with project isolation
- **Audit Trail:** Complete activity logging with immutable storage
- **Data Residency:** Regional deployment options for compliance

### Compliance Requirements
- **GDPR:** Data portability and right to deletion
- **SOC 2 Type II:** Annual certification
- **ISO 27001:** Information security management
- **Industry:** Construction industry data standards

### Authentication & Authorization
- **SSO Support:** SAML 2.0, OAuth 2.0
- **MFA:** TOTP, SMS, or hardware tokens
- **Session Management:** Configurable timeout, concurrent session limits
- **API Security:** JWT tokens with refresh mechanism

## Success Metrics

### Business Metrics
- **Revenue Impact:** Track claim success value
- **Time Savings:** Measure hours saved per claim
- **Success Rate:** Percentage of claims approved
- **Deadline Compliance:** Percentage of on-time submissions

### Usage Metrics
- **Active Users:** Daily/weekly/monthly active users
- **Projects:** Number of active projects
- **Claims Processed:** Volume and value metrics
- **Feature Adoption:** Usage of key features

### Performance Metrics
- **System Uptime:** 99.9% target
- **Response Time:** <2 seconds for key operations
- **Sync Reliability:** 99.5% successful syncs
- **AI Accuracy:** 85%+ delay detection accuracy

## Implementation Roadmap

### Phase 1: MVP (Months 1-2)
- Core schedule import (P6 only)
- Basic delay detection
- Manual evidence upload
- Simple claim generation
- Single project support

### Phase 2: Enhanced Intelligence (Months 3-4)
- AI-powered delay detection
- Automated evidence collection
- FIDIC contract parsing
- Multi-project dashboard
- Email integration

### Phase 3: Enterprise Features (Months 5-6)
- Full P6 bidirectional sync
- Advanced analytics
- Custom contract support
- API for third-party integration
- White-label options

### Phase 4: Scale & Optimize (Months 7+)
- Machine learning optimization
- Industry benchmarking
- Predictive analytics
- Mobile applications
- Global deployment

## Appendices

### A. Glossary
- **EOT:** Extension of Time
- **CPM:** Critical Path Method
- **FIDIC:** International Federation of Consulting Engineers
- **NEC:** New Engineering Contract
- **TIA:** Time Impact Analysis

### B. Contract Clause Examples
- FIDIC Sub-Clause 20.1: Contractor's Claims
- NEC Clause 61: Notifying Compensation Events
- Custom contract variations

### C. Competitive Analysis
- Current solutions lack AI integration
- Manual process standard in industry
- Opportunity for 10x improvement

---

**Document Control:**
- Author: Product Team
- Review: Engineering, Sales, Customer Success
- Approval: CEO/CTO
- Next Review: 30 days
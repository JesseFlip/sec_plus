window.STRATEGY_DATA = {
  TACTICS: [
    {
      title: "Triage-First Strategy",
      desc: "Flag complex Performance-Based Questions (PBQs) for later review and prioritize the multiple-choice section. This secures foundational points and builds psychological momentum."
    },
    {
      title: "Whiteboard Dump",
      desc: "Externalize highly volatile information—port numbers, cryptographic formulas, risk formulas (ALE=SLE×ARO)—immediately upon commencement to reduce cognitive load."
    }
  ],
  TOP_MISSED: [
    { rank: 1, group: "RTO vs. RPO", failure: "Conflating time to restore with volume of data lost.", impact: "High" },
    { rank: 2, group: "AuthN vs. AuthZ", failure: "Treating identity verification and permission granting as one.", impact: "High" },
    { rank: 3, group: "ECB vs. GCM", failure: "Failing to recognize structural insecurity of ECB.", impact: "Medium" },
    { rank: 4, group: "Risk Treatments", failure: "Confusing 'Transfer' (cost) with 'Mitigation' (probability).", impact: "High" },
    { rank: 5, group: "SIEM vs. SOAR", failure: "Missing distinction between visibility and automated response.", impact: "High" },
    { rank: 6, group: "Salting vs. Stretching", failure: "Confusing uniqueness protection with slowing brute force.", impact: "Medium" },
    { rank: 7, group: "IDS vs. IPS", failure: "Misunderstanding passive vs. active placement.", impact: "High" },
    { rank: 8, group: "DAC vs. MAC", failure: "Conflating ownership-based control with label-based clearance.", impact: "High" },
    { rank: 9, group: "BIA Metrics", failure: "Prioritizing MTTR over MTBF in availability scenarios.", impact: "Medium" },
    { rank: 10, group: "Zero Trust Planes", failure: "Misplacing Policy Decision Point (PDP) in the data plane.", impact: "High" }
  ],
  KEYWORD_TELLS: [
    { tell: "MOST cost-effective", meaning: "Cloud or policy-based solutions over hardware." },
    { tell: "FIRST step", meaning: "Identification, containment, or logging." },
    { tell: "LEAST administrative overhead", meaning: "Automation, SaaS/PaaS, or templates." },
    { tell: "BEST answer", meaning: "Addresses root cause or provides most comprehensive coverage." }
  ],
  PBQ_ARCHETYPES: [
    { type: "Network Diagram Analysis", task: "Placing security controls (Firewalls, IDS, DMZ) in topology." },
    { type: "Firewall/ACL Configuration", task: "Writing narrow rules (IP, Port, Protocol) based on requirements." },
    { type: "Log Triage", task: "Identifying 'Patient Zero' by correlating timestamps across logs." },
    { type: "Secure WiFi Setup", task: "Configuring WPA3-Enterprise with RADIUS vs. Personal." }
  ],
  CONCEPT_MATRIX: [
    { a: "Identification", b: "Authentication", diff: "Claiming identity vs. Proving it.", tell: "'Enter username' vs. 'Provide PIN/Biometric'", ex: "ID card number (ID) + Biometric scan (Auth)." },
    { a: "Authorization", b: "Accounting", diff: "Rights vs. Logging.", tell: "'Accessing file' vs. 'Reviewing logs'", ex: "Check 'Read' rights (AuthZ) then log the access (Accounting)." },
    { a: "Symmetric", b: "Asymmetric", diff: "Shared key (speed) vs. Key pair (trust).", tell: "'Bulk encryption' vs. 'Key exchange'", ex: "AES for DB (Symm), RSA for key exchange (Asymm)." },
    { a: "IDS", b: "IPS", diff: "Detect/Notify vs. Detect/Block.", tell: "'Passive/Alert' vs. 'Active/In-line'", ex: "NIDS alerts on SQLi, NIPS blocks it." },
    { a: "NIDS", b: "HIDS", diff: "Network-wide vs. Local system.", tell: "'Traffic patterns' vs. 'System file changes'", ex: "NIDS monitors subnet, HIDS detects passwd change." },
    { a: "Behavioral", b: "Heuristic", diff: "Baseline deviation vs. Rule-based 'looks like'.", tell: "'Anomalous' vs. 'Suspect code'", ex: "Login at 3 AM (Beh), code encrypting boot sector (Heur)." },
    { a: "DAC", b: "MAC", diff: "Owner decides vs. Labels decide.", tell: "'Discretionary' vs. 'Top Secret/Clearance'", ex: "File owner gives access (DAC), labels required for TS (MAC)." },
    { a: "RBAC", b: "ABAC", diff: "Job Role vs. Attributes/Context.", tell: "'Position' vs. 'IP/Time/Location'", ex: "HR manager access (RBAC), US office hours only (ABAC)." },
    { a: "Risk Accept", b: "Risk Mitigate", diff: "Choosing loss vs. Using controls.", tell: "'Cost exceeds fix' vs. 'Implementing safeguards'", ex: "No insurance for $100 mouse (Accept), firewall for hackers (Mitigate)." },
    { a: "Risk Avoid", b: "Risk Transfer", diff: "Stopping activity vs. Shifting cost.", tell: "'Discontinuing' vs. 'Insurance/BPO'", ex: "Unplug server (Avoid), buy cyber-insurance (Transfer)." },
    { a: "Hashing", b: "Encryption", diff: "One-way integrity vs. Reversible confidentiality.", tell: "'Check integrity' vs. 'Protect secrecy'", ex: "MD5 checks changes, AES hides content." },
    { a: "Digital Sign", b: "HMAC", diff: "Asymmetric (Non-repud) vs. Symmetric (Integrity/Auth).", tell: "'Sender's private key' vs. 'Shared secret'", ex: "Dev signs driver (Sign), router verifies peer (HMAC)." },
    { a: "ECB Mode", b: "CBC Mode", diff: "Insecure/Identical vs. Secure/Chained.", tell: "'Patterns visible' vs. 'IV'", ex: "Shapes visible in image (ECB), unique blocks (CBC)." },
    { a: "SIEM", b: "SOAR", diff: "Aggregation vs. Orchestration.", tell: "'Single pane of glass' vs. 'Playbooks'", ex: "View charts (SIEM), auto-trigger firewall block (SOAR)." },
    { a: "RTO", b: "RPO", diff: "Time to get back up vs. Acceptable data loss.", tell: "'Downtime limit' vs. 'Point-in-time recovery'", ex: "Back up in 2 hrs (RTO), lose 15 min data (RPO)." },
    { a: "MTBF", b: "MTTR", diff: "Reliability vs. Repair speed.", tell: "'How long it lasts' vs. 'How long to fix'", ex: "Runs 5 yrs before dying (MTBF), 2 hrs to swap drive (MTTR)." }
  ],
  MNEMONICS: [
    { cat: "OSI Layers", m: "Please Do Not Throw Sausage Pizza Away", comp: "Physical, Data Link, Network, Transport, Session, Presentation, Application" },
    { cat: "Incident Response", m: "Pick It Clean Every Rainy Level", comp: "Prep, ID, Contain, Eradicate, Recover, Lessons Learned" },
    { cat: "Order of Volatility", m: "Can Really Dig Logs Backup", comp: "CPU/Cache, RAM, Disk, Logs, Backups" },
    { cat: "MFA Factors", m: "Know Have Are Do Where", comp: "Knowledge, Have, Are (Bio), Do (Beh), Where (Loc)" }
  ],
  RESOURCES: [
    { name: "Professor Messer", tier: "S", cost: "$0 - $50", use: "Phase 1: Foundation" },
    { name: "Jason Dion Exams", tier: "S", cost: "~$15 - $30", use: "Phase 3: Polishing" },
    { name: "CertMaster Labs", tier: "A", cost: "$119+", use: "Phase 2: Hands-on" },
    { name: "Cyberkraft", tier: "S", cost: "$0", use: "Phase 3: PBQs" }
  ]
};

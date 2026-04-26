import { useState, useEffect, useCallback } from "react";

const STUDY_DATA = {
  exam: {
    code: "SY0-701",
    passingScore: 750,
    maxScore: 900,
    questions: 90,
    timeMinutes: 90,
    domains: [
      { id: 1, name: "General Security Concepts", weight: 12, color: "#E8A838" },
      { id: 2, name: "Threats, Vulnerabilities & Mitigations", weight: 22, color: "#D94F4F" },
      { id: 3, name: "Security Architecture", weight: 18, color: "#4F8BD9" },
      { id: 4, name: "Security Operations", weight: 28, color: "#4FD97A" },
      { id: 5, name: "Security Program Mgmt & Oversight", weight: 20, color: "#A64FD9" },
    ],
  },
  days: [
    {
      day: 1,
      title: "FOUNDATIONS & THREATS",
      subtitle: "Domains 1 & 2 — 34% of exam",
      blocks: [
        {
          id: "d1-morning",
          time: "9:00 AM – 12:00 PM",
          label: "MORNING",
          domain: 1,
          title: "Security Fundamentals & Controls",
          topics: [
            { id: "t1", text: "CIA Triad: Confidentiality, Integrity, Availability", key: true },
            { id: "t2", text: "Non-repudiation & Authentication (AAA)", key: true },
            { id: "t3", text: "Security Control Categories: Technical, Managerial, Operational, Physical" },
            { id: "t4", text: "Security Control Types: Preventive, Deterrent, Detective, Corrective, Compensating, Directive", key: true },
            { id: "t5", text: "Zero Trust Model: Control Plane vs Data Plane" },
            { id: "t6", text: "Change Management processes & impact to security" },
            { id: "t7", text: "Gap Analysis & security posture assessment" },
          ],
          guide: "Dion Ch. 1 + Gibson Ch. 1",
          tip: "Make a grid: Control Categories × Control Types with a real-world example in each cell. This WILL show up on the exam.",
        },
        {
          id: "d1-afternoon1",
          time: "1:00 PM – 3:00 PM",
          label: "AFTERNOON 1",
          domain: 2,
          title: "Threat Actors & Social Engineering",
          topics: [
            { id: "t8", text: "Threat Actor types: Nation-state, Insider, Hacktivist, Organized Crime, Script Kiddie", key: true },
            { id: "t9", text: "Threat Actor attributes: Motivation, Sophistication, Resources, Internal/External" },
            { id: "t10", text: "Attack vectors: Phishing (spear, whaling, vishing, smishing)", key: true },
            { id: "t11", text: "Social Engineering: Pretexting, Impersonation, Watering Hole, Typosquatting" },
            { id: "t12", text: "Social Engineering principles: Authority, Urgency, Consensus, Scarcity, Familiarity" },
            { id: "t13", text: "Physical social engineering: Tailgating, Piggybacking, Shoulder Surfing, Dumpster Diving" },
          ],
          guide: "Dion Ch. 2 & 4 + Gibson Ch. 5",
          tip: "Know the difference between phishing variants cold. Spear = targeted individual, Whaling = C-suite, Vishing = voice, Smishing = SMS.",
        },
        {
          id: "d1-afternoon2",
          time: "3:30 PM – 5:30 PM",
          label: "AFTERNOON 2",
          domain: 2,
          title: "Malware & Attack Indicators",
          topics: [
            { id: "t14", text: "Malware types: Virus, Worm, Trojan, RAT, Rootkit, Ransomware, Spyware, Keylogger, Bot/Botnet", key: true },
            { id: "t15", text: "Fileless malware & Living-off-the-Land attacks" },
            { id: "t16", text: "Indicators of Compromise (IoC) vs Indicators of Attack (IoA)" },
            { id: "t17", text: "Network attack indicators: Beaconing, irregular traffic, port scanning" },
            { id: "t18", text: "Password attacks: Brute force, Dictionary, Spraying, Credential Stuffing, Rainbow Tables", key: true },
            { id: "t19", text: "On-path attacks (MITM/MITB)" },
          ],
          guide: "Dion Ch. 5 (Malware) + Gibson Ch. 6-7",
          tip: "For each malware type, know: how it spreads, what it does, and one real-world example. Ransomware and Rootkits are exam favorites.",
        },
        {
          id: "d1-evening",
          time: "7:00 PM – 9:00 PM",
          label: "EVENING",
          domain: 2,
          title: "Vulnerabilities & Application Attacks",
          topics: [
            { id: "t20", text: "Vulnerability types: Software, Hardware, Config, Zero-day, Third-party", key: true },
            { id: "t21", text: "Injection attacks: SQL injection, XSS, LDAP injection, Command injection", key: true },
            { id: "t22", text: "Buffer overflow, Race condition, TOCTOU" },
            { id: "t23", text: "Privilege escalation: Vertical vs Horizontal" },
            { id: "t24", text: "Replay attacks & Session hijacking" },
            { id: "t25", text: "DoS/DDoS: Volumetric, Protocol, Application layer" },
            { id: "t26", text: "DNS attacks: Poisoning, Spoofing, Zone Transfer" },
          ],
          guide: "Dion Ch. 13 + Gibson Ch. 7",
          tip: "SQL injection and XSS are almost guaranteed on the exam. Know the difference: SQLi targets the database, XSS targets the user's browser.",
        },
      ],
    },
    {
      day: 2,
      title: "ARCHITECTURE & OPERATIONS",
      subtitle: "Domains 3 & 4 — 46% of exam",
      blocks: [
        {
          id: "d2-morning",
          time: "9:00 AM – 11:30 AM",
          label: "MORNING",
          domain: 3,
          title: "Security Architecture & Infrastructure",
          topics: [
            { id: "t27", text: "Cloud models: IaaS, PaaS, SaaS, XaaS — shared responsibility", key: true },
            { id: "t28", text: "Cloud deployment: Public, Private, Hybrid, Community, Multi-cloud" },
            { id: "t29", text: "Virtualization: Hypervisor Type 1 vs Type 2, VM escape, VM sprawl" },
            { id: "t30", text: "Containerization, Microservices, Serverless architecture" },
            { id: "t31", text: "Network segmentation, DMZ, VLAN, Air gap", key: true },
            { id: "t32", text: "Infrastructure as Code (IaC), SDN, SD-WAN" },
            { id: "t33", text: "IoT, ICS/SCADA, Embedded systems security" },
          ],
          guide: "Dion Ch. 10-11 + Gibson Ch. 3-4",
          tip: "Cloud shared responsibility is HUGE. Remember: IaaS = you manage most, SaaS = provider manages most. Draw the responsibility line for each.",
        },
        {
          id: "d2-mid",
          time: "11:30 AM – 1:00 PM",
          label: "MIDDAY",
          domain: 3,
          title: "Cryptography & PKI",
          topics: [
            { id: "t34", text: "Symmetric (AES, 3DES) vs Asymmetric (RSA, ECC, Diffie-Hellman)", key: true },
            { id: "t35", text: "Hashing: MD5, SHA-1, SHA-256 — collision, salting, key stretching (PBKDF2, bcrypt)", key: true },
            { id: "t36", text: "PKI: CA, RA, CRL, OCSP, Certificate types (DV, OV, EV, Wildcard, SAN)" },
            { id: "t37", text: "Digital signatures & certificates, Certificate pinning" },
            { id: "t38", text: "Key exchange, Key escrow, Perfect Forward Secrecy" },
            { id: "t39", text: "Steganography, Tokenization, Data masking" },
            { id: "t40", text: "Blockchain & post-quantum cryptography concepts" },
          ],
          guide: "Dion Ch. 6 + Gibson Ch. 10",
          tip: "Symmetric = fast, one key, bulk encryption. Asymmetric = slow, two keys, key exchange & signatures. Know which algorithms go where.",
        },
        {
          id: "d2-afternoon1",
          time: "2:00 PM – 4:30 PM",
          label: "AFTERNOON",
          domain: 4,
          title: "IAM, Hardening & Security Techniques",
          topics: [
            { id: "t41", text: "Authentication factors: Something you know/have/are + MFA", key: true },
            { id: "t42", text: "SSO, LDAP, OAuth, SAML, OpenID Connect, RADIUS, TACACS+", key: true },
            { id: "t43", text: "Access control models: DAC, MAC, RBAC, ABAC, Rule-Based" },
            { id: "t44", text: "Privileged Access Management (PAM), Just-in-Time permissions" },
            { id: "t45", text: "Hardening: OS, Applications, Endpoints — removing unnecessary services, disabling ports" },
            { id: "t46", text: "Firewall types: Stateful, Stateless, WAF, NGFW", key: true },
            { id: "t47", text: "IDS/IPS: Signature-based vs Behavior-based, NIDS vs HIDS" },
            { id: "t48", text: "Wireless security: WPA3, WPA2-Enterprise, EAP types, Rogue AP, Evil Twin", key: true },
          ],
          guide: "Dion Ch. 12, 14-15 + Gibson Ch. 2, 3, 4",
          tip: "SAML = enterprise SSO (XML-based). OAuth = authorization delegation (tokens). OpenID Connect = authentication layer on top of OAuth. Know the differences.",
        },
        {
          id: "d2-evening",
          time: "6:00 PM – 9:00 PM",
          label: "EVENING",
          domain: 4,
          title: "Monitoring, Incident Response & Forensics",
          topics: [
            { id: "t49", text: "SIEM: Aggregation, Correlation, Alerting, Dashboards, Log analysis", key: true },
            { id: "t50", text: "SOAR, NetFlow, sFlow, Packet capture, Protocol analyzer" },
            { id: "t51", text: "Log types: OS, Application, Network, Firewall, DNS" },
            { id: "t52", text: "Vulnerability scanning vs Penetration testing", key: true },
            { id: "t53", text: "Incident Response phases: Preparation → Detection → Analysis → Containment → Eradication → Recovery → Lessons Learned", key: true },
            { id: "t54", text: "Digital forensics: Order of volatility, Chain of custody, Legal hold, E-discovery" },
            { id: "t55", text: "Forensic imaging, Write blockers, Hashing for evidence integrity" },
            { id: "t56", text: "Automation & Orchestration: Playbooks, Runbooks, SCAP" },
            { id: "t57", text: "Resilience: RAID (0,1,5,6,10), HA, Load balancing, Backups (Full, Incremental, Differential)", key: true },
          ],
          guide: "Dion Ch. 15 (Security Techniques), Alerting, Incident Response, Automation + Gibson Ch. 8-9",
          tip: "IR phases are a guaranteed question. Memorize the order. Also know: RPO (how much data you can lose) vs RTO (how long you can be down).",
        },
      ],
    },
    {
      day: 3,
      title: "GOVERNANCE & FINAL PUSH",
      subtitle: "Domain 5 (20%) + Full Review + Practice Exams",
      blocks: [
        {
          id: "d3-morning",
          time: "9:00 AM – 12:00 PM",
          label: "MORNING",
          domain: 5,
          title: "Governance, Risk & Compliance",
          topics: [
            { id: "t58", text: "Governance: Policies, Standards, Procedures, Guidelines, Baselines", key: true },
            { id: "t59", text: "Risk Management: Risk assessment (Qualitative vs Quantitative), Risk register", key: true },
            { id: "t60", text: "Risk response: Accept, Avoid, Transfer, Mitigate" },
            { id: "t61", text: "Business Impact Analysis (BIA): RTO, RPO, MTTR, MTBF", key: true },
            { id: "t62", text: "Frameworks: NIST CSF, NIST RMF, ISO 27001/27002, SOC 2, CIS" },
            { id: "t63", text: "Regulations: GDPR, HIPAA, PCI-DSS, SOX, FERPA, CCPA" },
            { id: "t64", text: "Data classification: Public, Internal, Confidential, Restricted" },
            { id: "t65", text: "Data roles: Owner, Custodian, Steward, Controller, Processor, DPO" },
          ],
          guide: "Dion Ch. 7-9 + Gibson Ch. 11-12",
          tip: "Know which regulation applies to which industry: HIPAA = healthcare, PCI-DSS = payment cards, GDPR = EU personal data, SOX = publicly traded companies.",
        },
        {
          id: "d3-mid",
          time: "1:00 PM – 3:00 PM",
          label: "MIDDAY",
          domain: 5,
          title: "Third-Party Risk, Awareness & Data Protection",
          topics: [
            { id: "t66", text: "Third-party risk: Vendor assessment, Supply chain attacks, SLA management", key: true },
            { id: "t67", text: "Due diligence & due care in vendor relationships" },
            { id: "t68", text: "Security Awareness training: Phishing campaigns, Role-based training" },
            { id: "t69", text: "Data protection: Encryption at rest vs in transit vs in use" },
            { id: "t70", text: "Data loss prevention (DLP): Network, Endpoint, Cloud" },
            { id: "t71", text: "Data destruction: Purging, Degaussing, Shredding, Crypto-shredding" },
            { id: "t72", text: "Privacy: Data minimization, Purpose limitation, Consent" },
            { id: "t73", text: "Penetration testing types: Black/White/Gray box, Rules of engagement" },
            { id: "t74", text: "Audits: Internal vs External, Compliance scans, Attestation" },
          ],
          guide: "Dion Ch. 7, Data Protection, Security Awareness, Audits + Gibson Ch. 11-12",
          tip: "Supply chain attacks are increasingly tested. Know SolarWinds as the textbook example. Also know: vendor questionnaires, right-to-audit clauses, and MSAs.",
        },
        {
          id: "d3-afternoon",
          time: "3:30 PM – 5:30 PM",
          label: "AFTERNOON",
          domain: 0,
          title: "Weak Spot Review & Flashcards",
          topics: [
            { id: "t75", text: "Review all topics marked as incomplete above" },
            { id: "t76", text: "Re-read key concepts (★ starred items) across all domains" },
            { id: "t77", text: "Create/review flashcards for port numbers (22, 25, 53, 80, 443, 389, 636, 3389)" },
            { id: "t78", text: "Review acronyms list — you WILL see acronyms you don't recognize as distractors" },
            { id: "t79", text: "Review the Security Controls grid (Categories × Types) one more time" },
          ],
          guide: "Both guides — index/glossary sections",
          tip: "If you're scoring 80%+ on practice tests, you're in the zone. Focus on concepts you keep getting wrong, not re-reading what you already know.",
        },
        {
          id: "d3-evening",
          time: "6:00 PM – 9:00 PM",
          label: "EVENING",
          domain: 0,
          title: "Practice Exams & Exam Strategy",
          topics: [
            { id: "t80", text: "Take a full 90-question practice exam (timed — 90 minutes)" },
            { id: "t81", text: "Review every wrong answer — understand WHY" },
            { id: "t82", text: "Review PBQ strategies: drag-and-drop, config screens, matching" },
            { id: "t83", text: "Exam strategy: Flag PBQs, do multiple-choice first, come back to PBQs" },
            { id: "t84", text: "Night before: Light review only. Rest. Hydrate. No cramming." },
          ],
          guide: "Practice exams from both guides",
          tip: "Skip PBQs on first pass — they eat time. Answer all multiple-choice first, then circle back. You need 750/900 (≈83%). Manage your time.",
        },
      ],
    },
  ],
};

const PORTS = [
  { port: "20/21", service: "FTP", note: "20=data, 21=control" },
  { port: "22", service: "SSH/SCP/SFTP", note: "Secure shell" },
  { port: "23", service: "Telnet", note: "Insecure!" },
  { port: "25", service: "SMTP", note: "Email sending" },
  { port: "53", service: "DNS", note: "TCP+UDP" },
  { port: "67/68", service: "DHCP", note: "Server/Client" },
  { port: "80", service: "HTTP", note: "Unencrypted web" },
  { port: "88", service: "Kerberos", note: "Auth protocol" },
  { port: "110", service: "POP3", note: "Email retrieval" },
  { port: "143", service: "IMAP", note: "Email retrieval" },
  { port: "161/162", service: "SNMP", note: "Network mgmt" },
  { port: "389", service: "LDAP", note: "Directory" },
  { port: "443", service: "HTTPS", note: "Encrypted web" },
  { port: "445", service: "SMB", note: "File sharing" },
  { port: "636", service: "LDAPS", note: "Secure LDAP" },
  { port: "993", service: "IMAPS", note: "Secure IMAP" },
  { port: "995", service: "POP3S", note: "Secure POP3" },
  { port: "1433", service: "MSSQL", note: "Database" },
  { port: "1723", service: "PPTP", note: "VPN (legacy)" },
  { port: "3306", service: "MySQL", note: "Database" },
  { port: "3389", service: "RDP", note: "Remote desktop" },
  { port: "5060/5061", service: "SIP", note: "VoIP" },
  { port: "6514", service: "Syslog TLS", note: "Secure logging" },
];

const ACRONYM_FLASH = [
  { a: "SIEM", f: "Security Info & Event Mgmt" },
  { a: "SOAR", f: "Security Orchestration, Automation & Response" },
  { a: "IDS/IPS", f: "Intrusion Detection/Prevention System" },
  { a: "DLP", f: "Data Loss Prevention" },
  { a: "PAM", f: "Privileged Access Management" },
  { a: "RBAC", f: "Role-Based Access Control" },
  { a: "ABAC", f: "Attribute-Based Access Control" },
  { a: "PKI", f: "Public Key Infrastructure" },
  { a: "CA", f: "Certificate Authority" },
  { a: "OCSP", f: "Online Certificate Status Protocol" },
  { a: "CRL", f: "Certificate Revocation List" },
  { a: "MTTR", f: "Mean Time To Repair" },
  { a: "MTBF", f: "Mean Time Between Failures" },
  { a: "RPO", f: "Recovery Point Objective" },
  { a: "RTO", f: "Recovery Time Objective" },
  { a: "BIA", f: "Business Impact Analysis" },
  { a: "BCP", f: "Business Continuity Plan" },
  { a: "AUP", f: "Acceptable Use Policy" },
  { a: "MOU/MOA", f: "Memorandum of Understanding/Agreement" },
  { a: "NGFW", f: "Next-Generation Firewall" },
  { a: "WAF", f: "Web Application Firewall" },
  { a: "EDR", f: "Endpoint Detection & Response" },
  { a: "XDR", f: "Extended Detection & Response" },
  { a: "MDR", f: "Managed Detection & Response" },
  { a: "SCAP", f: "Security Content Automation Protocol" },
  { a: "CVE", f: "Common Vulnerabilities & Exposures" },
  { a: "CVSS", f: "Common Vulnerability Scoring System" },
  { a: "NIST CSF", f: "National Institute of Standards & Technology Cybersecurity Framework" },
];

export default function SecurityPlusStudyMap() {
  const [completed, setCompleted] = useState({});
  const [confidence, setConfidence] = useState({});
  const [activeDay, setActiveDay] = useState(1);
  const [view, setView] = useState("map");
  const [flashMode, setFlashMode] = useState("ports");
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashRevealed, setFlashRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const c = await window.storage.get("sec-plus-completed");
        if (c) setCompleted(JSON.parse(c.value));
      } catch {}
      try {
        const cf = await window.storage.get("sec-plus-confidence");
        if (cf) setConfidence(JSON.parse(cf.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const saveCompleted = useCallback(async (next) => {
    setCompleted(next);
    try { await window.storage.set("sec-plus-completed", JSON.stringify(next)); } catch {}
  }, []);

  const saveConfidence = useCallback(async (next) => {
    setConfidence(next);
    try { await window.storage.set("sec-plus-confidence", JSON.stringify(next)); } catch {}
  }, []);

  const toggleTopic = (id) => {
    const next = { ...completed, [id]: !completed[id] };
    saveCompleted(next);
  };

  const setBlockConfidence = (blockId, level) => {
    const next = { ...confidence, [blockId]: level };
    saveConfidence(next);
  };

  const totalTopics = STUDY_DATA.days.flatMap(d => d.blocks.flatMap(b => b.topics)).length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((completedCount / totalTopics) * 100);

  const dayData = STUDY_DATA.days.find(d => d.day === activeDay);

  const getDomainColor = (domainId) => {
    if (domainId === 0) return "#8B8FA3";
    return STUDY_DATA.exam.domains.find(d => d.id === domainId)?.color || "#8B8FA3";
  };

  const getDomainName = (domainId) => {
    if (domainId === 0) return "All Domains — Review";
    return STUDY_DATA.exam.domains.find(d => d.id === domainId)?.name || "";
  };

  const confLabels = ["", "🔴 Not yet", "🟡 Shaky", "🟢 Solid", "💎 Locked in"];
  const confColors = ["", "#ef4444", "#eab308", "#22c55e", "#8b5cf6"];

  const flashCards = flashMode === "ports" ? PORTS : ACRONYM_FLASH;

  const resetProgress = async () => {
    if (confirm("Reset all progress? This can't be undone.")) {
      setCompleted({});
      setConfidence({});
      try { await window.storage.delete("sec-plus-completed"); } catch {}
      try { await window.storage.delete("sec-plus-confidence"); } catch {}
    }
  };

  if (!loaded) return <div style={{ padding: 40, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-color, #e2e8f0)" }}>Loading study map...</div>;

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
      color: "var(--text-color, #e2e8f0)",
      background: "var(--bg-color, #0f1117)",
      minHeight: "100vh",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg-color: #0f1117;
          --surface: #1a1d27;
          --surface2: #252836;
          --border: #2e3244;
          --text-color: #e2e8f0;
          --text-dim: #8b8fa3;
          --text-bright: #ffffff;
          --accent: #60a5fa;
        }
        @media (prefers-color-scheme: light) {
          :root {
            --bg-color: #f5f5f7;
            --surface: #ffffff;
            --surface2: #f0f0f3;
            --border: #d8dae0;
            --text-color: #1e1e2e;
            --text-dim: #6b7080;
            --text-bright: #000000;
            --accent: #3b82f6;
          }
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #1a1d27 0%, #0f1117 100%)",
        borderBottom: "1px solid var(--border)",
        padding: "24px 20px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, background: "#D94F4F", color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: 600, letterSpacing: 1 }}>3-DAY SPRINT</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "var(--text-dim)" }}>SY0-701</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-bright)", letterSpacing: "-0.5px", marginBottom: 2 }}>
          Security+ Study Map
        </h1>
        <p style={{ fontSize: 12, color: "var(--text-dim)" }}>750/900 to pass · 90 questions · 90 minutes</p>

        {/* PROGRESS BAR */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>
            <span>{completedCount}/{totalTopics} topics covered</span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600, color: pct >= 80 ? "#22c55e" : pct >= 50 ? "#eab308" : "var(--text-dim)" }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: pct >= 80 ? "linear-gradient(90deg, #22c55e, #4ade80)" : pct >= 50 ? "linear-gradient(90deg, #eab308, #facc15)" : "linear-gradient(90deg, #60a5fa, #93c5fd)",
              borderRadius: 3,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* DOMAIN WEIGHT STRIP */}
        <div style={{ display: "flex", gap: 2, marginTop: 12, borderRadius: 4, overflow: "hidden", height: 18 }}>
          {STUDY_DATA.exam.domains.map(d => (
            <div key={d.id} style={{
              flex: d.weight,
              background: d.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'JetBrains Mono'",
              opacity: 0.85,
            }}>{d.weight}%</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
          {STUDY_DATA.exam.domains.map(d => (
            <div key={d.id} style={{ flex: d.weight, fontSize: 8, color: "var(--text-dim)", textAlign: "center", lineHeight: "1.2" }}>
              D{d.id}
            </div>
          ))}
        </div>
      </div>

      {/* NAV TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        {["map", "ports", "acronyms"].map(v => (
          <button key={v} onClick={() => { setView(v); if (v === "ports") setFlashMode("ports"); if (v === "acronyms") setFlashMode("acronyms"); }} style={{
            flex: 1, padding: "10px 8px", border: "none", background: view === v ? "var(--surface2)" : "transparent",
            color: view === v ? "var(--text-bright)" : "var(--text-dim)", fontSize: 12, fontWeight: 600, cursor: "pointer",
            borderBottom: view === v ? "2px solid var(--accent)" : "2px solid transparent",
            fontFamily: "'IBM Plex Sans'",
          }}>
            {v === "map" ? "📋 Study Map" : v === "ports" ? "🔌 Ports" : "📖 Acronyms"}
          </button>
        ))}
      </div>

      {/* FLASHCARD VIEWS */}
      {(view === "ports" || view === "acronyms") && (
        <div style={{ padding: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
              {flashIndex + 1} / {flashCards.length} — Tap card to reveal
            </span>
          </div>
          <div
            onClick={() => setFlashRevealed(!flashRevealed)}
            style={{
              background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12,
              padding: 32, textAlign: "center", cursor: "pointer", minHeight: 140,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {flashMode === "ports" ? (
              <>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 32, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
                  {flashCards[flashIndex].port}
                </div>
                {flashRevealed && (
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-bright)" }}>{flashCards[flashIndex].service}</div>
                    <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>{flashCards[flashIndex].note}</div>
                  </div>
                )}
                {!flashRevealed && <div style={{ fontSize: 13, color: "var(--text-dim)" }}>What service runs here?</div>}
              </>
            ) : (
              <>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 26, fontWeight: 700, color: "#A64FD9", marginBottom: 8 }}>
                  {flashCards[flashIndex].a}
                </div>
                {flashRevealed && (
                  <div style={{ fontSize: 16, fontWeight: 500, color: "var(--text-bright)" }}>{flashCards[flashIndex].f}</div>
                )}
                {!flashRevealed && <div style={{ fontSize: 13, color: "var(--text-dim)" }}>What does it stand for?</div>}
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => { setFlashIndex(Math.max(0, flashIndex - 1)); setFlashRevealed(false); }}
              style={{ flex: 1, padding: "10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-color)", fontSize: 14, cursor: "pointer" }}>← Prev</button>
            <button onClick={() => { setFlashIndex((flashIndex + 1) % flashCards.length); setFlashRevealed(false); }}
              style={{ flex: 1, padding: "10px", background: "var(--accent)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>
          </div>
          {/* Full list below */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dim)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Quick Reference</h3>
            <div style={{ display: "grid", gap: 4 }}>
              {flashCards.map((c, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", padding: "6px 10px",
                  background: i % 2 === 0 ? "var(--surface)" : "transparent", borderRadius: 4, fontSize: 12,
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600, color: "var(--accent)", minWidth: 80 }}>
                    {flashMode === "ports" ? c.port : c.a}
                  </span>
                  <span style={{ color: "var(--text-color)", textAlign: "right" }}>
                    {flashMode === "ports" ? `${c.service} — ${c.note}` : c.f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STUDY MAP VIEW */}
      {view === "map" && (
        <div style={{ padding: "0" }}>
          {/* DAY SELECTOR */}
          <div style={{ display: "flex", gap: 0, padding: "0", background: "var(--bg-color)" }}>
            {STUDY_DATA.days.map(d => {
              const dayTopics = d.blocks.flatMap(b => b.topics);
              const dayDone = dayTopics.filter(t => completed[t.id]).length;
              const dayPct = Math.round((dayDone / dayTopics.length) * 100);
              const isActive = activeDay === d.day;
              return (
                <button key={d.day} onClick={() => setActiveDay(d.day)} style={{
                  flex: 1, padding: "14px 8px 10px", border: "none", cursor: "pointer",
                  background: isActive ? "var(--surface)" : "var(--bg-color)",
                  borderTop: isActive ? `3px solid ${d.day === 1 ? "#E8A838" : d.day === 2 ? "#4F8BD9" : "#A64FD9"}` : "3px solid transparent",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: isActive ? "var(--text-bright)" : "var(--text-dim)" }}>
                    D{d.day}
                  </span>
                  <span style={{ fontSize: 9, color: "var(--text-dim)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {d.title.split(" ")[0]}
                  </span>
                  <span style={{
                    fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 600, marginTop: 2,
                    color: dayPct === 100 ? "#22c55e" : dayPct > 0 ? "#eab308" : "var(--text-dim)",
                  }}>{dayPct}%</span>
                </button>
              );
            })}
          </div>

          {/* DAY CONTENT */}
          <div style={{ padding: "16px 16px 100px" }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-bright)", letterSpacing: "-0.3px" }}>{dayData.title}</h2>
              <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{dayData.subtitle}</p>
            </div>

            {dayData.blocks.map(block => {
              const blockDone = block.topics.filter(t => completed[t.id]).length;
              const blockTotal = block.topics.length;
              const blockPct = Math.round((blockDone / blockTotal) * 100);
              const domainColor = getDomainColor(block.domain);
              const conf = confidence[block.id] || 0;

              return (
                <div key={block.id} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
                  marginBottom: 12, overflow: "hidden",
                  borderLeft: `3px solid ${domainColor}`,
                }}>
                  {/* Block header */}
                  <div style={{ padding: "12px 14px 8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div>
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: domainColor, fontWeight: 600 }}>
                          {block.label} · {block.time}
                        </span>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-bright)", marginTop: 2 }}>{block.title}</h3>
                        <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{getDomainName(block.domain)}</span>
                      </div>
                      <span style={{
                        fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700,
                        color: blockPct === 100 ? "#22c55e" : "var(--text-dim)",
                        background: "var(--surface2)", padding: "2px 8px", borderRadius: 4,
                      }}>{blockDone}/{blockTotal}</span>
                    </div>

                    {/* Mini progress */}
                    <div style={{ height: 3, background: "var(--surface2)", borderRadius: 2, marginTop: 6, marginBottom: 4 }}>
                      <div style={{ height: "100%", width: `${blockPct}%`, background: domainColor, borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                  </div>

                  {/* Topics */}
                  <div style={{ padding: "0 14px 8px" }}>
                    {block.topics.map(topic => (
                      <div key={topic.id} onClick={() => toggleTopic(topic.id)} style={{
                        display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 0",
                        borderBottom: "1px solid var(--border)", cursor: "pointer",
                        opacity: completed[topic.id] ? 0.5 : 1, transition: "opacity 0.2s",
                      }}>
                        <div style={{
                          width: 18, height: 18, minWidth: 18, borderRadius: 4, marginTop: 1,
                          border: completed[topic.id] ? "none" : `2px solid ${domainColor}40`,
                          background: completed[topic.id] ? domainColor : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: "#fff", fontWeight: 700,
                        }}>
                          {completed[topic.id] && "✓"}
                        </div>
                        <span style={{
                          fontSize: 13, lineHeight: 1.4,
                          color: completed[topic.id] ? "var(--text-dim)" : "var(--text-color)",
                          textDecoration: completed[topic.id] ? "line-through" : "none",
                        }}>
                          {topic.key && <span style={{ color: domainColor, fontWeight: 700 }}>★ </span>}
                          {topic.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Guide reference + tip */}
                  <div style={{ padding: "8px 14px", background: "var(--surface2)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>
                      📘 <span style={{ fontWeight: 600 }}>{block.guide}</span>
                    </div>
                    <div style={{ fontSize: 11, color: domainColor, fontStyle: "italic", lineHeight: 1.4 }}>
                      💡 {block.tip}
                    </div>
                  </div>

                  {/* Confidence selector */}
                  <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: "var(--text-dim)", minWidth: 60 }}>Confidence:</span>
                    {[1, 2, 3, 4].map(level => (
                      <button key={level} onClick={() => setBlockConfidence(block.id, level)} style={{
                        padding: "3px 8px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10,
                        background: conf === level ? confColors[level] + "30" : "var(--surface)",
                        color: conf === level ? confColors[level] : "var(--text-dim)",
                        fontWeight: conf === level ? 700 : 400,
                        outline: conf === level ? `1px solid ${confColors[level]}50` : "none",
                      }}>
                        {confLabels[level]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Reset */}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={resetProgress} style={{
                background: "transparent", border: "1px solid var(--border)", borderRadius: 6,
                padding: "8px 20px", color: "var(--text-dim)", fontSize: 11, cursor: "pointer",
              }}>Reset All Progress</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

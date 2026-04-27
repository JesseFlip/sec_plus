const PORTS = [
  {port:"20/21",service:"FTP",note:"20=data, 21=control"},{port:"22",service:"SSH/SCP/SFTP",note:"Secure shell"},
  {port:"23",service:"Telnet",note:"Insecure!"},{port:"25",service:"SMTP",note:"Email sending"},
  {port:"53",service:"DNS",note:"TCP+UDP"},{port:"67/68",service:"DHCP",note:"Server/Client"},
  {port:"80",service:"HTTP",note:"Unencrypted web"},{port:"88",service:"Kerberos",note:"Auth protocol"},
  {port:"110",service:"POP3",note:"Email retrieval"},{port:"143",service:"IMAP",note:"Email retrieval"},
  {port:"161/162",service:"SNMP",note:"Network mgmt"},{port:"389",service:"LDAP",note:"Directory"},
  {port:"443",service:"HTTPS",note:"Encrypted web"},{port:"445",service:"SMB",note:"File sharing"},
  {port:"636",service:"LDAPS",note:"Secure LDAP"},{port:"993",service:"IMAPS",note:"Secure IMAP"},
  {port:"995",service:"POP3S",note:"Secure POP3"},{port:"1433",service:"MSSQL",note:"Database"},
  {port:"1723",service:"PPTP",note:"VPN (legacy)"},{port:"3306",service:"MySQL",note:"Database"},
  {port:"3389",service:"RDP",note:"Remote desktop"},{port:"5060/5061",service:"SIP",note:"VoIP"},
  {port:"6514",service:"Syslog TLS",note:"Secure logging"},
];

const ACRONYMS = [
  {a:"SIEM",f:"Security Info & Event Mgmt"},{a:"SOAR",f:"Security Orchestration, Automation & Response"},
  {a:"IDS/IPS",f:"Intrusion Detection/Prevention System"},{a:"DLP",f:"Data Loss Prevention"},
  {a:"PAM",f:"Privileged Access Management"},{a:"RBAC",f:"Role-Based Access Control"},
  {a:"ABAC",f:"Attribute-Based Access Control"},{a:"PKI",f:"Public Key Infrastructure"},
  {a:"CA",f:"Certificate Authority"},{a:"OCSP",f:"Online Certificate Status Protocol"},
  {a:"CRL",f:"Certificate Revocation List"},{a:"MTTR",f:"Mean Time To Repair"},
  {a:"MTBF",f:"Mean Time Between Failures"},{a:"RPO",f:"Recovery Point Objective"},
  {a:"RTO",f:"Recovery Time Objective"},{a:"BIA",f:"Business Impact Analysis"},
  {a:"BCP",f:"Business Continuity Plan"},{a:"AUP",f:"Acceptable Use Policy"},
  {a:"MOU/MOA",f:"Memorandum of Understanding/Agreement"},{a:"NGFW",f:"Next-Generation Firewall"},
  {a:"WAF",f:"Web Application Firewall"},{a:"EDR",f:"Endpoint Detection & Response"},
  {a:"XDR",f:"Extended Detection & Response"},{a:"MDR",f:"Managed Detection & Response"},
  {a:"SCAP",f:"Security Content Automation Protocol"},{a:"CVE",f:"Common Vulnerabilities & Exposures"},
  {a:"CVSS",f:"Common Vulnerability Scoring System"},
  {a:"NIST CSF",f:"National Institute of Standards & Technology Cybersecurity Framework"},
];

window.FLASHCARD_DATA = { PORTS, ACRONYMS };

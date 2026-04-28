const fs = require('fs');

let file = fs.readFileSync('index.html', 'utf8');

// 1. Remove const T
const startMatch = 'const T = {';
const startIdx = file.indexOf(startMatch);
let braceCount = 0;
let endIdx = -1;
const firstBraceIdx = startIdx + startMatch.length - 1;

for (let i = firstBraceIdx; i < file.length; i++) {
  if (file[i] === '{') braceCount++;
  else if (file[i] === '}') braceCount--;
  if (braceCount === 0) {
    endIdx = i + 1;
    if (file[endIdx] === ';') endIdx++;
    break;
  }
}

file = file.substring(0, startIdx) + '/* T object moved to lang.js */\n' + file.substring(endIdx);

// 2. Inject lang.js script tag
const babelIdx = file.indexOf('<script type="text/babel">');
file = file.substring(0, babelIdx) + '<script src="lang.js"></script>\n' + file.substring(babelIdx);

// 3. Update fonts
file = file.replace('body{', 'body{font-size: 1.125rem;line-height: 1.6;');
file = file.replace('h2{', 'h2{font-size: 1.25rem;');
file = file.replace('h3{', 'h3{font-size: 1.15rem;');

// 4. Inject Banner CSS
const cssToInject = `
/* Scrolling Banner */
@keyframes scrollBanner {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
`;
file = file.replace('/* Responsive */', cssToInject + '/* Responsive */');

// 5. Inject showBanner state
const stateToInject = `  const [showBanner, setShowBanner] = useState(() => localStorage.getItem("sp-banner-closed") !== "true");\n`;
file = file.replace('const [langSearch,setLangSearch]=useState("");', 'const [langSearch,setLangSearch]=useState("");\n' + stateToInject);

// 6. Inject Banner JSX
const bannerJsx = `
    showBanner && React.createElement("div", {style:{background:"var(--accent)",color:"#fff",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}},
      React.createElement("div", {style:{overflow:"hidden",whiteSpace:"nowrap",flex:1}},
        React.createElement("div", {style:{display:"inline-block",animation:"scrollBanner 15s linear infinite"}}, "Welcome! We've improved readability and added more language options for our global classmates.")
      ),
      React.createElement("button", {onClick:()=>{setShowBanner(false);localStorage.setItem("sp-banner-closed","true")},style:{background:"transparent",border:"none",color:"#fff",marginLeft:16,cursor:"pointer",fontSize:16,fontWeight:"bold"}}, "✕")
    ),
`;
file = file.replace('return React.createElement("div",{className:"main-wrap"},', 'return React.createElement("div",{className:"main-wrap"},\n' + bannerJsx);

// 7. Fix Language Picker Overlap
file = file.replace(
  'React.createElement("div",{style:{position:"fixed",top:10,right:10,zIndex:100}},',
  'React.createElement("div",{style:{position:"fixed",top: showBanner ? 50 : 10,right:10,zIndex:100, transition: "top 0.3s ease"}},'
);

// 8. Replace handleChatSubmit
const chatStart = "  const handleChatSubmit = (e) => {";
const chatEnd = "  const [showResetModal, setShowResetModal] = useState(false);";
const chatStartIdx = file.indexOf(chatStart);
const chatEndIdx = file.indexOf(chatEnd);

const replacementChat = \`  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userInput = chatInput.trim();
    setChatMessages(prev => [...prev, {role: "user", text: userInput}]);
    setChatInput("");

    // Add a loading message
    setChatMessages(prev => [...prev, {role: "bot", text: "..."}]);

    try {
      const prompt = "You are an AI Tutor strictly limited to CompTIA Security+ SY0-701 objectives. Answer concisely in " + (T[lang]?._name || "English") + ". User says: " + userInput;
      const res = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt));
      if (!res.ok) throw new Error("API Error");
      const text = await res.text();
      
      setChatMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {role: "bot", text: text};
        return newMsgs;
      });
    } catch (err) {
      setChatMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {role: "bot", text: "Error connecting to AI Tutor. Please try again later."};
        return newMsgs;
      });
    }
  };

\`;

file = file.substring(0, chatStartIdx) + replacementChat + file.substring(chatEndIdx);

fs.writeFileSync('index.html', file);
console.log("Successfully rebuilt index.html");

const fs = require('fs');

let file = fs.readFileSync('index.html', 'utf8');

const startMatch = "\\n    // FEEDBACK BUTTON";
const endMatch = "// AI TUTOR (floating)";

const startIdx = file.indexOf(startMatch);
const endIdx = file.indexOf(endMatch);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = "\\n" +
    "    // FEEDBACK BUTTON (floating bottom left)\\n" +
    "    React.createElement('a', {\\n" +
    "      href: 'https://github.com/JesseFlip/sec_plus/issues/new',\\n" +
    "      target: '_blank',\\n" +
    "      rel: 'noopener noreferrer',\\n" +
    "      style: {\\n" +
    "        position: 'fixed', bottom: 20, left: 20, zIndex: 100,\\n" +
    "        background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)',\\n" +
    "        padding: '8px 16px', borderRadius: 20, textDecoration: 'none', fontSize: 13,\\n" +
    "        display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',\\n" +
    "        transition: 'all 0.2s'\\n" +
    "      },\\n" +
    "      onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface2)',\\n" +
    "      onMouseLeave: (e) => e.currentTarget.style.background = 'var(--surface)'\\n" +
    "    }, '💡 Feedback / Suggest Change'),\\n\\n    // AI TUTOR (floating)\\n";

  file = file.substring(0, startIdx) + replacement + file.substring(endIdx + endMatch.length);
  fs.writeFileSync('index.html', file);
  console.log("Cleanup successful.");
} else {
  console.log("Could not find the corrupted block.");
}

const fs = require('fs');

let file = fs.readFileSync('index.html', 'utf8');

if (file.includes("\\n")) {
    file = file.replace(/\\n/g, "\n");
    fs.writeFileSync('index.html', file);
    console.log("Fixed literal newlines.");
} else {
    console.log("No literal newlines found.");
}

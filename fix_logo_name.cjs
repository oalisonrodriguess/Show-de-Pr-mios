const fs = require('fs');

let content = fs.readFileSync('index.tsx', 'utf8');

// replace customLogo with customLogoBase64
content = content.replace(/appStore\.state\.appConfig\.customLogo \|\| ''/g, "appStore.state.appConfig.customLogoBase64 || ''");

fs.writeFileSync('index.tsx', content);
console.log('Fixed variable name');

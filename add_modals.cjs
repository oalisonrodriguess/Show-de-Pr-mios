const fs = require('fs');
let tsx = fs.readFileSync('index.tsx', 'utf8');

tsx = tsx.replace(/\['floating-number-modal', 'custom-alert-modal', 'congrats-modal', 'winner-modal', 'sponsor-display-modal'\]/,
"['floating-number-modal', 'custom-alert-modal', 'congrats-modal', 'winner-modal', 'sponsor-display-modal', 'verification-modal', 'event-break-modal']")

fs.writeFileSync('index.tsx', tsx);
console.log('moar modals');

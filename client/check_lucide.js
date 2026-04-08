import * as lucide from 'lucide-react';
const iconsToCheck = ['Github', 'Linkedin', 'Code', 'Mail', 'Phone', 'FileText', 'ExternalLink', 'GraduationCap', 'Loader2'];
console.log('Available icons:', Object.keys(lucide).filter(k => iconsToCheck.map(i => i.toLowerCase()).includes(k.toLowerCase())));
console.log('Missing icons:', iconsToCheck.filter(i => !Object.keys(lucide).some(k => k.toLowerCase() === i.toLowerCase())));


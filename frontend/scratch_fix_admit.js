
const fs = require('fs');
let content = fs.readFileSync('src/app/(public)/admit-card/page.tsx', 'utf8');
const searchString = 'use client';\r\nimport { useState, useEffect } from 'react';;
const parts = content.split(searchString);
if (parts.length > 2) {
    // Keep the last part which is the clean version
    let fixedContent = searchString + parts[parts.length - 1];
    fs.writeFileSync('src/app/(public)/admit-card/page.tsx', fixedContent, 'utf8');
    console.log('Fixed');
} else if (parts.length === 2 && content.startsWith(searchString)) {
    // If it starts with use client but has another one
    let fixedContent = searchString + parts[1];
    fs.writeFileSync('src/app/(public)/admit-card/page.tsx', fixedContent, 'utf8');
    console.log('Fixed from start');
} else if (parts.length === 2 && !content.startsWith(searchString)) {
    // If there's gibberish before the first use client
    let fixedContent = searchString + parts[1];
    fs.writeFileSync('src/app/(public)/admit-card/page.tsx', fixedContent, 'utf8');
    console.log('Fixed gibberish start');
} else {
    // Let's just split by 'use client'; (LF vs CRLF)
    const lfParts = content.split('use client';\nimport { useState, useEffect } from 'react';);
    if (lfParts.length > 1) {
        let fixedContent = 'use client';\nimport { useState, useEffect } from 'react'; + lfParts[lfParts.length - 1];
        fs.writeFileSync('src/app/(public)/admit-card/page.tsx', fixedContent, 'utf8');
        console.log('Fixed LF');
    } else {
        console.log('Could not split');
    }
}


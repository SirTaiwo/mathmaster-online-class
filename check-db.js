const db = require('./database/database');

console.log("\nASSESSMENTS TABLE:");
console.log(
    db.prepare(`
        PRAGMA table_info(assessments)
    `).all()
);


console.log("\nASSESSMENT QUESTIONS TABLE:");
console.log(
    db.prepare(`
        PRAGMA table_info(assessment_questions)
    `).all()
);


console.log("\nASSESSMENT RESULTS TABLE:");
console.log(
    db.prepare(`
        PRAGMA table_info(assessment_results)
    `).all()
);
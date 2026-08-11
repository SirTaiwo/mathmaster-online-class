const fs = require("fs");

const file = "public/js/geometry-tools.js";
const src = fs.readFileSync(file, "utf8");

let stack = [];
let line = 1;
let state = "code";
let quote = null;
let escape = false;

for (let i = 0; i < src.length; i++) {

    const c = src[i];
    const n = src[i + 1];

    if (c === "\n") line++;

    if (state === "lineComment") {
        if (c === "\n") state = "code";
        continue;
    }

    if (state === "blockComment") {
        if (c === "*" && n === "/") {
            state = "code";
            i++;
        }
        continue;
    }

    if (state === "string") {
        if (escape) {
            escape = false;
            continue;
        }

        if (c === "\\") {
            escape = true;
            continue;
        }

        if (c === quote) {
            state = "code";
            quote = null;
        }

        continue;
    }

    if (c === "/" && n === "/") {
        state = "lineComment";
        i++;
        continue;
    }

    if (c === "/" && n === "*") {
        state = "blockComment";
        i++;
        continue;
    }

    if (c === "'" || c === '"' || c === "`") {
        state = "string";
        quote = c;
        continue;
    }

    if ("{([".includes(c)) {
        stack.push({
            char: c,
            line: line
        });
    }

    if ("})]".includes(c)) {

        const expected = {
            "}": "{",
            ")": "(",
            "]": "["
        }[c];

        const last = stack.pop();

        if (!last || last.char !== expected) {

            console.log(
                "MISMATCH at line",
                line,
                "found",
                c,
                "expected",
                last ? last.char : "nothing"
            );

            if (last) {
                console.log(
                    "Opening",
                    last.char,
                    "was at line",
                    last.line
                );
            }

            process.exit(1);
        }
    }
}

console.log("Remaining open structures:", stack);
console.log("Brace/parenthesis scan complete.");

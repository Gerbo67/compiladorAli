//////////////////////
// Funciones Básicas
//////////////////////

function removeCommentsFromLines(code) {
    const lines = code.split("\n");
    let cleanLines = [];
    let inBlockComment = false;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (inBlockComment) {
            const endIndex = line.indexOf("*/");
            if (endIndex !== -1) {
                line = line.substring(endIndex + 2);
                inBlockComment = false;
            } else {
                cleanLines.push("");
                continue;
            }
        }
        let blockStart = line.indexOf("/*");
        while (blockStart !== -1) {
            const blockEnd = line.indexOf("*/", blockStart + 2);
            if (blockEnd !== -1) {
                line = line.slice(0, blockStart) + line.slice(blockEnd + 2);
                blockStart = line.indexOf("/*");
            } else {
                line = line.slice(0, blockStart);
                inBlockComment = true;
                break;
            }
        }
        const singleCommentIndex = line.indexOf("//");
        if (singleCommentIndex !== -1) {
            line = line.slice(0, singleCommentIndex);
        }
        cleanLines.push(line);
    }
    return cleanLines;
}

function tokenizeLine(line, lineIndex, lexicalErrors) {
    const tokenRegex = /("([^"\\]*(\\.[^"\\]*)*)")|(\d+(\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|([{}()\[\];,=+\-*\/<>!&|])/g;
    let lastIndex = 0;
    let match;
    while ((match = tokenRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
            const gap = line.slice(lastIndex, match.index);
            if (gap.trim() !== "") {
                lexicalErrors.push(`Error léxico en línea ${lineIndex + 1}: Token inválido "${gap}"`);
            }
        }
        lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < line.length) {
        const gap = line.slice(lastIndex);
        if (gap.trim() !== "") {
            lexicalErrors.push(`Error léxico en línea ${lineIndex + 1}: Token inválido "${gap}"`);
        }
    }
}

//////////////////////////
// Validación de Balance
//////////////////////////

// Verifica de forma básica que en la línea (sin cadenas) los paréntesis, corchetes y llaves estén balanceados.
function checkBalance(line, lineIndex) {
    // Eliminar cadenas simples o dobles para no contar símbolos dentro de ellas.
    let lineWithoutStrings = line.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, "");
    let errors = [];
    let countPar = 0, countBrack = 0, countBrace = 0;
    for (let char of lineWithoutStrings) {
        if (char === "(") countPar++;
        else if (char === ")") countPar--;
        else if (char === "[") countBrack++;
        else if (char === "]") countBrack--;
        else if (char === "{") countBrace++;
        else if (char === "}") countBrace--;
    }
    if (countPar !== 0) {
        errors.push(`Error sintáctico en línea ${lineIndex + 1}: Paréntesis no balanceados.`);
    }
    if (countBrack !== 0) {
        errors.push(`Error sintáctico en línea ${lineIndex + 1}: Corchetes no balanceados.`);
    }
    if (countBrace !== 0) {
        errors.push(`Error sintáctico en línea ${lineIndex + 1}: Llaves no balanceadas.`);
    }
    return errors;
}

//////////////////////////
// Función de Resaltado
//////////////////////////

function applySyntaxHighlighting(code) {
    const syntaxRegex = new RegExp(
        '(' +
        '\\b(?:void|main|var|if|else|for|while|print|int|double|String|bool|List|return)\\b' +
        ')' +
        '|' +
        '("([^"\\\\]*(?:\\\\.[^"\\\\]*)*)")' +
        '|' +
        '(\\/\\/[^\\n]*)' +
        '|' +
        '(\\/\\*[\\s\\S]*?\\*\\/)' +
        '|' +
        '(\\b\\d+(?:\\.\\d+)?\\b)' +
        '|' +
        '(\\b[a-zA-Z_][a-zA-Z0-9_]*\\b)' +
        '|' +
        '([{}()\\[\\];,=+\\-\\*\\/<>&|!])'
        , 'gm');
    return code.replace(syntaxRegex, (match, g1, g2, g3, g4, g5, g6, g7, g8) => {
        if (g1 !== undefined) {
            return `<span class="token-keyword">${match}</span>`;
        } else if (g2 !== undefined) {
            return `<span class="token-string">${match}</span>`;
        } else if (g4 !== undefined) {
            return `<span class="token-comment">${match}</span>`;
        } else if (g5 !== undefined) {
            return `<span class="token-comment">${match}</span>`;
        } else if (g6 !== undefined) {
            return `<span class="token-number">${match}</span>`;
        } else if (g7 !== undefined) {
            return `<span class="token-identifier">${match}</span>`;
        } else if (g8 !== undefined) {
            return `<span class="token-operator">${match}</span>`;
        }
        return match;
    });
}

function updateHighlighting() {
    let code = document.getElementById("codeArea").value;
    // Reemplazar tabs por 4 espacios para consistencia
    code = code.replace(/\t/g, '    ');
    document.getElementById("highlightedCode").innerHTML = applySyntaxHighlighting(code);
}

window.updateHighlighting = updateHighlighting;

//////////////////////////
// Función Principal: Análisis
//////////////////////////

function analyzeCode() {
    const code = document.getElementById("codeArea").value;
    const cleanLines = removeCommentsFromLines(code);
    let lexicalErrors = [];
    let syntacticErrors = [];
    let semanticErrors = [];

    // --- Análisis Léxico ---
    cleanLines.forEach((line, lineIndex) => {
        tokenizeLine(line, lineIndex, lexicalErrors);
    });

    // --- Análisis Sintáctico ---
    const cleanCode = cleanLines.join("\n");
    if (!cleanCode.includes("main(")) {
        syntacticErrors.push("Error sintáctico: No se encontró la función main().");
    }
    cleanLines.forEach((line, lineIndex) => {
        const trimmed = line.trim();
        // Validación básica de terminación de sentencias (salvo excepciones)
        if (trimmed !== "" &&
            !trimmed.endsWith("{") &&
            !trimmed.endsWith("}") &&
            !trimmed.startsWith("if") &&
            !trimmed.startsWith("for") &&
            !trimmed.startsWith("while") &&
            !trimmed.includes("main(") &&
            !trimmed.startsWith("else") &&
            !trimmed.endsWith(")")) {
            if (!trimmed.endsWith(";")) {
                syntacticErrors.push(`Error sintáctico en línea ${lineIndex + 1}: Falta ";" al final de la sentencia.`);
            }
        }
        // Validar estructuras condicionales y ciclos: deben incluir paréntesis.
        if (trimmed.startsWith("if") || trimmed.startsWith("for") || trimmed.startsWith("while")) {
            if (!trimmed.includes("(") || !trimmed.includes(")")) {
                syntacticErrors.push(`Error sintáctico en línea ${lineIndex + 1}: Estructura mal formada en "${trimmed.split(" ")[0]}".`);
            }
        }
        // Validación de balance de paréntesis, corchetes y llaves (línea por línea)
        const balanceErrors = checkBalance(line, lineIndex);
        if (balanceErrors.length > 0) {
            syntacticErrors.push(...balanceErrors);
        }
    });

    // --- Análisis Semántico: Variables ---
    // (a) Recolectar variables declaradas
    let declaredVariables = [];
    const declarationTypes = ["var", "String", "int", "double", "bool", "List"];
    cleanLines.forEach((line, lineIndex) => {
        const tokens = line.match(/("([^"\\]*(\\.[^"\\]*)*)")|(\d+(\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|([{}()\[\];,=+\-*\/<>!&|])/g);
        if (tokens && tokens.length >= 2 && declarationTypes.includes(tokens[0])) {
            const varName = tokens[1];
            if (declaredVariables.includes(varName)) {
                semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Variable duplicada "${varName}".`);
            } else {
                declaredVariables.push(varName);
            }
        }
    });
    // (b) Validar uso de variables: ignorar identificadores dentro de cadenas.
    const usageReserved = ["void", "main", "print", "if", "else", "for", "while", "return",
        "var", "String", "int", "double", "bool", "List"];
    cleanLines.forEach((line, lineIndex) => {
        // Eliminar literales de cadena para evitar falsos positivos
        let lineWithoutStrings = line.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, "");
        const tokens = lineWithoutStrings.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);
        if (tokens) {
            tokens.forEach(token => {
                if (usageReserved.includes(token)) return;
                if (!isNaN(token)) return;
                if (!declaredVariables.includes(token)) {
                    semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Variable no declarada "${token}".`);
                }
            });
        }
    });

    // --- Mostrar Resultados ---
    document.getElementById("lexicalContent").innerHTML =
        lexicalErrors.length > 0
            ? `<span style="color: red;">${lexicalErrors.join("<br>")}</span>`
            : `<span style="color: green;">NO ERROR</span>`;
    document.getElementById("syntacticContent").innerHTML =
        syntacticErrors.length > 0
            ? `<span style="color: red;">${syntacticErrors.join("<br>")}</span>`
            : `<span style="color: green;">NO ERROR</span>`;
    document.getElementById("semanticContent").innerHTML =
        semanticErrors.length > 0
            ? `<span style="color: red;">${semanticErrors.join("<br>")}</span>`
            : `<span style="color: green;">NO ERROR</span>`;
}

//////////////////////////
// Eventos
//////////////////////////

document.getElementById("codeArea").addEventListener("input", updateHighlighting);

document.getElementById("codeArea").addEventListener("scroll", function() {
    const pre = document.getElementById("highlightedCode");
    pre.scrollTop = this.scrollTop;
    pre.scrollLeft = this.scrollLeft;
});

document.getElementById("runButton").addEventListener("click", analyzeCode);

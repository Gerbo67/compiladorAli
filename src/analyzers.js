/* analyzers.js - Análisis y resaltado de sintaxis para código Dart (básico)
   ====================================================
   - Análisis Léxico: Se tokeniza cada línea y se reportan tokens no válidos.
   - Análisis Sintáctico:
         • Se verifica la existencia de la función main.
         • Se comprueba que las sentencias (fuera de bloques o estructuras de control) terminen en ";".
         • Se valida que las estructuras condicionales y de ciclo tengan paréntesis.
         • Se verifica globalmente el balance de paréntesis, corchetes y llaves utilizando un stack.
   - Análisis Semántico:
         • Variables:
              - Se detectan las declaraciones usando una expresión regular.
              - Se valida que no existan duplicados.
              - Se verifica que la expresión asignada coincida con el tipo declarado:
                    * String: debe ser un literal entre comillas.
                    * int: o bien un literal entero (o una expresión que contenga solo dígitos, operadores, puntos y paréntesis)
                    * double: literal numérico (con o sin decimal) o expresión puramente numérica.
                    * bool: debe ser "true" o "false".
                    * List: debe tener la forma literal de una lista (inicia con "[" y termina con "]").
         • Uso de variables: Se revisa que cada identificador (fuera de literales) haya sido declarado previamente.
   - Resaltado de Sintaxis: Se colorean palabras clave, cadenas, comentarios, números, identificadores y operadores.
*/

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
// Validación Global de Balance
//////////////////////////

function checkGlobalBalance(code) {
    const stack = [];
    const errors = [];
    const pairs = { '(': ')', '{': '}', '[': ']' };
    const lines = code.split("\n");
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let line = lines[lineIndex];
        // Eliminar literales de cadena para no contar símbolos dentro de ellas
        let lineWithoutStrings = line.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, "");
        for (let charIndex = 0; charIndex < lineWithoutStrings.length; charIndex++) {
            const char = lineWithoutStrings[charIndex];
            if (char === '(' || char === '{' || char === '[') {
                stack.push({ symbol: char, line: lineIndex });
            } else if (char === ')' || char === '}' || char === ']') {
                if (stack.length === 0) {
                    errors.push(`Error sintáctico en línea ${lineIndex + 1}: No hay símbolo de apertura para "${char}".`);
                } else {
                    const last = stack.pop();
                    if (pairs[last.symbol] !== char) {
                        errors.push(`Error sintáctico en línea ${lineIndex + 1}: Símbolo "${last.symbol}" en línea ${last.line+1} no coincide con "${char}".`);
                    }
                }
            }
        }
    }
    while (stack.length > 0) {
        const leftover = stack.pop();
        errors.push(`Error sintáctico en línea ${leftover.line+1}: Falta cerrar "${leftover.symbol}".`);
    }
    return errors;
}

//////////////////////////
// Función de Resaltado
//////////////////////////

function applySyntaxHighlighting(code) {
    // Expresión regular para tokens (agrupa: keyword, string, comentario línea, comentario bloque, número, identificador y operador)
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
        '([{}()\\[\\];,=+\\-\\*\\/<>&|!#])'
        , 'gm');

    let result = "";
    let lastIndex = 0;
    let match;
    while ((match = syntaxRegex.exec(code)) !== null) {
        // Agregar la parte que no fue resaltada y envolverla en blanco.
        let index = match.index;
        if (index > lastIndex) {
            let nonMatched = code.substring(lastIndex, index);
            result += `<span style="color: white;">${nonMatched}</span>`;
        }
        // Aplicar formato según el tipo de token
        let token = "";
        if (match[1] !== undefined) {
            token = `<span class="token-keyword">${match[1]}</span>`;
        } else if (match[2] !== undefined) {
            token = `<span class="token-string">${match[2]}</span>`;
        } else if (match[4] !== undefined) {
            token = `<span class="token-comment">${match[4]}</span>`;
        } else if (match[5] !== undefined) {
            token = `<span class="token-comment">${match[5]}</span>`;
        } else if (match[6] !== undefined) {
            token = `<span class="token-number">${match[6]}</span>`;
        } else if (match[7] !== undefined) {
            token = `<span class="token-identifier">${match[7]}</span>`;
        } else if (match[8] !== undefined) {
            token = `<span class="token-operator">${match[8]}</span>`;
        } else {
            token = `<span style="color: white;">${match[0]}</span>`;
        }
        result += token;
        lastIndex = syntaxRegex.lastIndex;
    }
    // Agregar el resto del texto no procesado, en blanco.
    if (lastIndex < code.length) {
        let nonMatched = code.substring(lastIndex);
        result += `<span style="color: white;">${nonMatched}</span>`;
    }
    return result;
}

function updateHighlighting() {
    let code = document.getElementById("codeArea").value;
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

    // Ejecutar análisis en cascada:
    // Solo si no hay errores léxicos, se pasa al análisis sintáctico.
    if (lexicalErrors.length === 0) {
        // --- Análisis Sintáctico ---
        const cleanCode = cleanLines.join("\n");
        if (!cleanCode.includes("main(")) {
            syntacticErrors.push("Error sintáctico: No se encontró la función main().");
        }
        cleanLines.forEach((line, lineIndex) => {
            const trimmed = line.trim();
            // Si la línea no es vacía, no es un bloque y no inicia con estructuras de control:
            if (trimmed !== "" &&
                !trimmed.endsWith("{") &&
                !trimmed.endsWith("}") &&
                !(trimmed.startsWith("if") || trimmed.startsWith("for") || trimmed.startsWith("while") || trimmed.startsWith("else"))) {
                if (!trimmed.endsWith(";")) {
                    syntacticErrors.push(`Error sintáctico en línea ${lineIndex + 1}: Falta ";" al final de la sentencia.`);
                }
            }
            // Validar que condicionales y ciclos incluyan paréntesis.
            if (trimmed.startsWith("if") || trimmed.startsWith("for") || trimmed.startsWith("while")) {
                if (!trimmed.includes("(") || !trimmed.includes(")")) {
                    syntacticErrors.push(`Error sintáctico en línea ${lineIndex + 1}: Estructura mal formada en "${trimmed.split(" ")[0]}".`);
                }
            }
        });
        // Verificar el balance global de paréntesis, corchetes y llaves.
        const balanceErrors = checkGlobalBalance(cleanCode);
        syntacticErrors.push(...balanceErrors);
    } else {
        // Mensaje modificado en caso de errores léxicos.
        syntacticErrors.push("No se puede analizar por ahora");
    }

    // --- Análisis Semántico ---
    // Solo se ejecuta si no hay errores léxicos ni sintácticos.
    if (lexicalErrors.length === 0 && syntacticErrors.length === 0) {
        let declaredVariables = {};
        const varDeclRegex = /^(var|String|int|double|bool|List)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+);$/;
        cleanLines.forEach((line, lineIndex) => {
            let trimmed = line.trim();
            let match = trimmed.match(varDeclRegex);
            if (match) {
                let type = match[1];
                let varName = match[2];
                let expression = match[3].trim();
                if (declaredVariables[varName]) {
                    semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Variable duplicada "${varName}".`);
                } else {
                    declaredVariables[varName] = type;
                }
                // Validar asignación según tipo.
                if (type === "String") {
                    if (!expression.match(/^["'][^"']*["']$/)) {
                        semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Asignación inválida a variable de tipo String. Se esperaba una cadena literal.`);
                    }
                } else if (type === "int") {
                    if (!/[+\-*/()]/.test(expression)) {
                        if (!expression.match(/^\d+$/)) {
                            semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Asignación inválida a variable de tipo int. Se esperaba un entero literal.`);
                        }
                    } else {
                        let exprNoSpaces = expression.replace(/\s/g, "");
                        if (!exprNoSpaces.match(/^[\d+\-*/.()]+$/)) {
                            semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Asignación inválida a variable de tipo int. La expresión no es exclusivamente numérica.`);
                        }
                    }
                } else if (type === "double") {
                    if (!/[+\-*/()]/.test(expression)) {
                        if (!expression.match(/^\d+(\.\d+)?$/)) {
                            semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Asignación inválida a variable de tipo double. Se esperaba un literal numérico (con o sin decimal).`);
                        }
                    } else {
                        let exprNoSpaces = expression.replace(/\s/g, "");
                        if (!exprNoSpaces.match(/^[\d+\-*/.()]+$/)) {
                            semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Asignación inválida a variable de tipo double. La expresión no es exclusivamente numérica.`);
                        }
                    }
                } else if (type === "bool") {
                    if (!expression.match(/^(true|false)$/)) {
                        semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Asignación inválida a variable de tipo bool. Se esperaba "true" o "false".`);
                    }
                } else if (type === "List") {
                    if (!expression.match(/^\[.*\]$/)) {
                        semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Asignación inválida a variable de tipo List. Se esperaba una lista literal.`);
                    }
                }
            }
        });
        const usageReserved = ["void", "main", "print", "if", "else", "for", "while", "return",
            "var", "String", "int", "double", "bool", "List"];
        cleanLines.forEach((line, lineIndex) => {
            let lineWithoutStrings = line.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, "");
            const tokens = lineWithoutStrings.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);
            if (tokens) {
                tokens.forEach(token => {
                    if (usageReserved.includes(token)) return;
                    if (!isNaN(token)) return;
                    if (!(token in declaredVariables)) {
                        semanticErrors.push(`Error semántico en línea ${lineIndex + 1}: Variable no declarada "${token}".`);
                    }
                });
            }
        });
    } else {
        // Mensaje modificado en caso de errores léxicos o sintácticos.
        semanticErrors.push("No se puede analizar por ahora");
    }

    // --- Mostrar Resultados ---
    document.getElementById("lexicalContent").innerHTML =
        lexicalErrors.length > 0
            ? `<span style="color: red;">${lexicalErrors.join("<br>")}</span>`
            : `<span style="color: green;">NO ERROR</span>`;

    // Mostrar errores sintácticos: si el único mensaje es "No se puede analizar por ahora", se muestra en gris.
    let syntacticDisplay = "";
    if (syntacticErrors.length > 0) {
        if (syntacticErrors.length === 1 && syntacticErrors[0] === "No se puede analizar por ahora") {
            syntacticDisplay = `<span style="color: gray;">${syntacticErrors.join("<br>")}</span>`;
        } else {
            syntacticDisplay = `<span style="color: red;">${syntacticErrors.join("<br>")}</span>`;
        }
    } else {
        syntacticDisplay = `<span style="color: green;">NO ERROR</span>`;
    }
    document.getElementById("syntacticContent").innerHTML = syntacticDisplay;

    // Mostrar errores semánticos: si el único mensaje es "No se puede analizar por ahora", se muestra en gris.
    let semanticDisplay = "";
    if (semanticErrors.length > 0) {
        if (semanticErrors.length === 1 && semanticErrors[0] === "No se puede analizar por ahora") {
            semanticDisplay = `<span style="color: gray;">${semanticErrors.join("<br>")}</span>`;
        } else {
            semanticDisplay = `<span style="color: red;">${semanticErrors.join("<br>")}</span>`;
        }
    } else {
        semanticDisplay = `<span style="color: green;">NO ERROR</span>`;
    }
    document.getElementById("semanticContent").innerHTML = semanticDisplay;
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

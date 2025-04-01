document.addEventListener('DOMContentLoaded', function () {
    const codeArea = document.getElementById('codeArea');
    const lineNumbers = document.getElementById('lineNumbers');
    const scrollContainer = document.getElementById('scrollContainer');
    const codeContainer = document.getElementById('codeContainer');

    // Función para actualizar números de línea
    function updateLineNumbers() {
        const content = codeArea.value;
        const lines = content.split('\n');
        const lineCount = lines.length;

        // Generar números de línea
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.textContent = i;
            lineNumbers.appendChild(lineNumber);
        }

        // Ajustar la altura del textarea para que coincida con su contenido
        codeArea.style.height = 'auto';
        codeArea.style.height = codeArea.scrollHeight + 'px';

        // Asegurar que el ancho se ajuste para permitir scroll horizontal
        let maxLineLength = 0;
        for (const line of lines) {
            maxLineLength = Math.max(maxLineLength, line.length);
        }

        // Establecer un ancho mínimo basado en el contenido
        if (maxLineLength > 40) {
            const charWidth = 8;
            codeArea.style.width = (maxLineLength * charWidth) + 'px';
        } else {
            codeArea.style.width = '100%';
        }
    }

    // Sincronizar altura y ajustes del textarea al cambiar su contenido
    codeArea.addEventListener('input', updateLineNumbers);

    // Manejar tecla Tab
    codeArea.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();

            const start = this.selectionStart;
            const end = this.selectionEnd;

            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;

            updateLineNumbers();

            if (typeof updateHighlighting === "function") {
                updateHighlighting();
            }
        }
    });

    // Agregar evento de clic al contenedor de scroll para activar el foco en el textarea
    scrollContainer.addEventListener('click', function (e) {
        if (e.target === scrollContainer || e.target === codeContainer || e.target.closest('.editor-content')) {
            // Enfocar el textarea
            codeArea.focus();

            if (e.target !== codeArea) {
                codeArea.selectionStart = codeArea.selectionEnd = codeArea.value.length;
            }
        }
    });
    updateLineNumbers();
});
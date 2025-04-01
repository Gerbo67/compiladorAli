import "./commonEditor.js";
import "./analyzers.js";

import Toast from "awesome-toast-component";

// Notificación de copiado
document.getElementById("copyButton").addEventListener("click", function () {
    const code = document.getElementById("codeArea").value;
    navigator.clipboard.writeText(code)
        .then(() => {
            new Toast("Código copiado", {
                timeout: 2000,
                position: 'top',
                theme: 'dark'
            });
        })
        .catch(err => console.error("Error al copiar: ", err));
});

// Esperar a que todos los scripts estén cargados
window.addEventListener('load', () => {
    const codeArea = document.getElementById('codeArea');

    // Solo inicializar si no hay contenido ya (para evitar sobrescribir)
    if (!codeArea.value || codeArea.value === "// Este es un ejemplo de código") {
        // Insertar texto de ejemplo inicial
        codeArea.value = `/*
 * ====================================================
 * ANALIZADOR DE CÓDIGO DART
 * ====================================================
 * 
 * Autor: José Fernando Reséndiz López
 * 
 * Este proyecto implementa un analizador léxico, sintáctico
 * y semántico para código Dart. La herramienta permite:
 *   - Identificar tokens y estructuras léxicas
 *   - Validar la estructura sintáctica del programa
 *   - Realizar comprobaciones semánticas básicas
 * ====================================================
 */

void main() {
  // Mensaje de bienvenida
  print("¡Hola mundo desde Dart!");
  
  // Ejemplo de variable
  String mensaje = "Analizador funcionando correctamente";
  print(mensaje);
}`;

        // Actualizar los números de línea
        if (typeof updateLineNumbers === "function") {
            updateLineNumbers();
        }

        // Forzar la actualización del resaltado
        if (typeof updateHighlighting === "function") {
            updateHighlighting();
        }

        // Si todo lo anterior falla, forzar un evento de input
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        codeArea.dispatchEvent(event);
    }
});

// Al final de main.js
document.addEventListener('DOMContentLoaded', function () {
    // Disparar un evento de clic en el área de código para activar el resaltado
    setTimeout(() => {
        const codeArea = document.getElementById('codeArea');
        if (codeArea) {
            // Forzar un evento que sabemos que funciona para activar el resaltado
            codeArea.focus();
            codeArea.blur();
            codeArea.focus();

            // Y también intentar directamente la función
            if (typeof window.updateHighlighting === 'function') {
                window.updateHighlighting();
            }
        }
    }, 500);
});
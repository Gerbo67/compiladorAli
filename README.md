<img src="./flor.ico" alt="Flor Icon" width="50" align="left" style="margin-right: 10px;" />

# Compilador Ali
> Un proyecto para la materia de **Compiladores**, donde se integran análisis léxico, sintáctico y semántico de manera visual e interactiva usando Node.js, HTML y JavaScript.

---

## 📚 ¿Qué es *Compilador Ali*?

**Compilador Ali** es una herramienta educativa y funcional que simula el proceso de compilación de un lenguaje sencillo. El proyecto está dividido en tres fases fundamentales del proceso de compilación:

### 🔍 Análisis Léxico
El analizador léxico toma el código fuente como entrada y lo divide en **tokens**. Estos tokens representan las unidades más pequeñas con significado (como palabras clave, identificadores, números, símbolos, etc).

➡️ Ejemplo: La cadena `int suma = 5 + 2;` se convierte en los tokens `INT`, `ID`, `ASIGNACIÓN`, `NUM`, `SUMA`, `NUM`, `PUNTOYCOMA`.

### 🧠 Análisis Sintáctico
En esta fase se construye el árbol de derivación o árbol sintáctico verificando que la estructura del código siga las **reglas gramaticales del lenguaje**. Si el orden o combinación de los tokens no tiene sentido, se generará un error de sintaxis.

➡️ Por ejemplo, una estructura como `int = suma;` no es válida sintácticamente.

### 🧩 Análisis Semántico
Aquí se valida el **significado lógico** del código. Se comprueba, por ejemplo, que las variables estén declaradas antes de usarse, que las operaciones sean entre tipos compatibles, etc.

➡️ Así se evitan errores como usar una variable no declarada o sumar un número con una cadena.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** para el backend del análisis.
- **HTML + CSS** básico para la estructura visual.
- **JavaScript** para interacción y lógica del análisis.
- ¡Sin frameworks pesados! Ideal para comprender lo esencial del proceso de compilación.

---
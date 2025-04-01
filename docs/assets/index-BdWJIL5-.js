(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",function(){const i=document.getElementById("codeArea"),s=document.getElementById("lineNumbers"),r=document.getElementById("scrollContainer"),n=document.getElementById("codeContainer");function e(){const o=i.value.split(`
`),c=o.length;s.innerHTML="";for(let l=1;l<=c;l++){const d=document.createElement("div");d.textContent=l,s.appendChild(d)}i.style.height="auto",i.style.height=i.scrollHeight+"px";let a=0;for(const l of o)a=Math.max(a,l.length);a>40?i.style.width=a*8+"px":i.style.width="100%"}i.addEventListener("input",e),i.addEventListener("keydown",function(t){if(t.key==="Tab"){t.preventDefault();const o=this.selectionStart,c=this.selectionEnd;this.value=this.value.substring(0,o)+"    "+this.value.substring(c),this.selectionStart=this.selectionEnd=o+4,e(),typeof updateHighlighting=="function"&&updateHighlighting()}}),r.addEventListener("click",function(t){(t.target===r||t.target===n||t.target.closest(".editor-content"))&&(i.focus(),t.target!==i&&(i.selectionStart=i.selectionEnd=i.value.length))}),e()});function w(i){const s=i.split(`
`);let r=[],n=!1;for(let e=0;e<s.length;e++){let t=s[e];if(n){const a=t.indexOf("*/");if(a!==-1)t=t.substring(a+2),n=!1;else{r.push("");continue}}let o=t.indexOf("/*");for(;o!==-1;){const a=t.indexOf("*/",o+2);if(a!==-1)t=t.slice(0,o)+t.slice(a+2),o=t.indexOf("/*");else{t=t.slice(0,o),n=!0;break}}const c=t.indexOf("//");c!==-1&&(t=t.slice(0,c)),r.push(t)}return r}function L(i,s,r){const n=/("([^"\\]*(\\.[^"\\]*)*)")|(\d+(\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|([{}()\[\];,=+\-*\/<>!&|])/g;let e=0,t;for(;(t=n.exec(i))!==null;){if(t.index>e){const o=i.slice(e,t.index);o.trim()!==""&&r.push(`Error léxico en línea ${s+1}: Token inválido "${o}"`)}e=n.lastIndex}if(e<i.length){const o=i.slice(e);o.trim()!==""&&r.push(`Error léxico en línea ${s+1}: Token inválido "${o}"`)}}function x(i){const s=[],r=[],n={"(":")","{":"}","[":"]"},e=i.split(`
`);for(let t=0;t<e.length;t++){let c=e[t].replace(/(["'])(?:(?=(\\?))\2.)*?\1/g,"");for(let a=0;a<c.length;a++){const l=c[a];if(l==="("||l==="{"||l==="[")s.push({symbol:l,line:t});else if(l===")"||l==="}"||l==="]")if(s.length===0)r.push(`Error sintáctico en línea ${t+1}: No hay símbolo de apertura para "${l}".`);else{const d=s.pop();n[d.symbol]!==l&&r.push(`Error sintáctico en línea ${t+1}: Símbolo "${d.symbol}" en línea ${d.line+1} no coincide con "${l}".`)}}}for(;s.length>0;){const t=s.pop();r.push(`Error sintáctico en línea ${t.line+1}: Falta cerrar "${t.symbol}".`)}return r}function $(i){const s=new RegExp('(\\b(?:void|main|var|if|else|for|while|print|int|double|String|bool|List|return)\\b)|("([^"\\\\]*(?:\\\\.[^"\\\\]*)*)")|(\\/\\/[^\\n]*)|(\\/\\*[\\s\\S]*?\\*\\/)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b[a-zA-Z_][a-zA-Z0-9_]*\\b)|([{}()\\[\\];,=+\\-\\*\\/<>&|!#])',"gm");return i.replace(s,(r,n,e,t,o,c,a,l,d)=>n!==void 0?`<span class="token-keyword">${r}</span>`:e!==void 0?`<span class="token-string">${r}</span>`:o!==void 0?`<span class="token-comment">${r}</span>`:c!==void 0?`<span class="token-comment">${r}</span>`:a!==void 0?`<span class="token-number">${r}</span>`:l!==void 0?`<span class="token-identifier">${r}</span>`:d!==void 0?`<span class="token-operator">${r}</span>`:r)}function b(){let i=document.getElementById("codeArea").value;i=i.replace(/\t/g,"    "),document.getElementById("highlightedCode").innerHTML=$(i)}window.updateHighlighting=b;function H(){const i=document.getElementById("codeArea").value,s=w(i);let r=[],n=[],e=[];s.forEach((d,m)=>{L(d,m,r)});const t=s.join(`
`);t.includes("main(")||n.push("Error sintáctico: No se encontró la función main()."),s.forEach((d,m)=>{const u=d.trim();u!==""&&!u.endsWith("{")&&!u.endsWith("}")&&!(u.startsWith("if")||u.startsWith("for")||u.startsWith("while")||u.startsWith("else"))&&(u.endsWith(";")||n.push(`Error sintáctico en línea ${m+1}: Falta ";" al final de la sentencia.`)),(u.startsWith("if")||u.startsWith("for")||u.startsWith("while"))&&(!u.includes("(")||!u.includes(")"))&&n.push(`Error sintáctico en línea ${m+1}: Estructura mal formada en "${u.split(" ")[0]}".`)});const o=x(t);n.push(...o);let c={};const a=/^(var|String|int|double|bool|List)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+);$/;s.forEach((d,m)=>{let p=d.trim().match(a);if(p){let h=p[1],v=p[2],f=p[3].trim();c[v]?e.push(`Error semántico en línea ${m+1}: Variable duplicada "${v}".`):c[v]=h,h==="String"?f.match(/^["'][^"']*["']$/)||e.push(`Error semántico en línea ${m+1}: Asignación inválida a variable de tipo String. Se esperaba una cadena literal.`):h==="int"?/[+\-*/()]/.test(f)?f.replace(/\s/g,"").match(/^[\d+\-*/.()]+$/)||e.push(`Error semántico en línea ${m+1}: Asignación inválida a variable de tipo int. La expresión no es exclusivamente numérica.`):f.match(/^\d+$/)||e.push(`Error semántico en línea ${m+1}: Asignación inválida a variable de tipo int. Se esperaba un entero literal.`):h==="double"?/[+\-*/()]/.test(f)?f.replace(/\s/g,"").match(/^[\d+\-*/.()]+$/)||e.push(`Error semántico en línea ${m+1}: Asignación inválida a variable de tipo double. La expresión no es exclusivamente numérica.`):f.match(/^\d+(\.\d+)?$/)||e.push(`Error semántico en línea ${m+1}: Asignación inválida a variable de tipo double. Se esperaba un literal numérico (con o sin decimal).`):h==="bool"?f.match(/^(true|false)$/)||e.push(`Error semántico en línea ${m+1}: Asignación inválida a variable de tipo bool. Se esperaba "true" o "false".`):h==="List"&&(f.match(/^\[.*\]$/)||e.push(`Error semántico en línea ${m+1}: Asignación inválida a variable de tipo List. Se esperaba una lista literal.`))}});const l=["void","main","print","if","else","for","while","return","var","String","int","double","bool","List"];s.forEach((d,m)=>{const p=d.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g,"").match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);p&&p.forEach(h=>{l.includes(h)||isNaN(h)&&(h in c||e.push(`Error semántico en línea ${m+1}: Variable no declarada "${h}".`))})}),document.getElementById("lexicalContent").innerHTML=r.length>0?`<span style="color: red;">${r.join("<br>")}</span>`:'<span style="color: green;">NO ERROR</span>',document.getElementById("syntacticContent").innerHTML=n.length>0?`<span style="color: red;">${n.join("<br>")}</span>`:'<span style="color: green;">NO ERROR</span>',document.getElementById("semanticContent").innerHTML=e.length>0?`<span style="color: red;">${e.join("<br>")}</span>`:'<span style="color: green;">NO ERROR</span>'}document.getElementById("codeArea").addEventListener("input",b);document.getElementById("codeArea").addEventListener("scroll",function(){const i=document.getElementById("highlightedCode");i.scrollTop=this.scrollTop,i.scrollLeft=this.scrollLeft});document.getElementById("runButton").addEventListener("click",H);function I(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var g={},E;function S(){if(E)return g;E=1,Object.defineProperty(g,"__esModule",{value:!0});class i{constructor(n,e){var t,o;this.bornTime=Date.now(),this.hideEventHandler=this.handleHideEvent.bind(this),i.appendCSS(),this.viewID=i.generateViewID();let c=i.getHtml(this.viewID);document.body.appendChild(c),this.view=document.getElementById(this.viewID.toString())||document.createElement("div"),this.setMessage(this.message=n),this.setPosition(this.position=(e==null?void 0:e.position)||i.DEFAULT_POSITION),this.setTheme(e==null?void 0:e.theme),this.setStyle(e==null?void 0:e.style),this.waitForEvent=(t=e==null?void 0:e.waitForEvent)!==null&&t!==void 0?t:!1,this.timeout=(o=e==null?void 0:e.timeout)!==null&&o!==void 0?o:i.DEFAULT_HIDING_TIMEOUT,this.isWaitingForHide=!1,this.afterHide=e==null?void 0:e.afterHide,this.addHideEventListener(),this.waitForEvent||this.startHidingTimer(this.timeout),this.show()}static appendCSS(){if(document.getElementById("toast-style")===null){let n=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.id="toast-style",n.appendChild(e),e.appendChild(document.createTextNode(s))}}static generateViewID(){let n=Math.floor(Math.random()*1e9)+1e8;return document.getElementById(n.toString())===null?n:i.generateViewID()}static getHtml(n){const e=`
            <div class="toast" id="${n}">
                <div class="container">
                    <p class="message"></p>
                </div>
            </div>
        `;let t=document.createElement("div");return t.innerHTML=e.trim(),t.firstChild||t}setMessage(n){this.message=n;let e=this.view.getElementsByClassName("message")[0];e.innerHTML=this.message}setPosition(n){this.position=n,this.view.classList.remove("bottom"),this.view.classList.remove("top"),this.view.classList.add(n)}setTheme(n){n!==void 0&&(this.theme==n,this.view.classList.remove("light"),this.view.classList.remove("dark"),this.view.classList.add(n))}setStyle(n){if(n!==void 0){this.style=n;for(const[e,t]of Object.entries(this.style)){let c=document.getElementById(this.viewID.toString()).getElementsByClassName(e)[0];if(c!==void 0)for(const a of t)c.style.setProperty(a[0],a[1])}}}show(){let n=this;setTimeout(()=>{n.view.classList.add("visible")},50)}addHideEventListener(){const n=this;"mousemove mousedown mouseup touchmove click keydown keyup scroll".split(" ").forEach(e=>{window.addEventListener(e,n.hideEventHandler)})}removeHideEventListener(){const n=this;"mousemove mousedown mouseup touchmove click keydown keyup scroll".split(" ").forEach(e=>{window.removeEventListener(e,n.hideEventHandler)})}handleHideEvent(){let n=this.timeout;Date.now()-this.bornTime>this.timeout&&(n=this.timeout/2),this.startHidingTimer(n),this.removeHideEventListener()}startHidingTimer(n){n>0&&!this.isWaitingForHide&&(this.isWaitingForHide=!0,setTimeout(()=>{this.hide()},n))}hide(){this.view.classList.remove("visible");const n=this;setTimeout(()=>{n.view.remove(),n.afterHide!==void 0&&n.afterHide()},800)}}g.default=i,i.DEFAULT_HIDING_TIMEOUT=4e3,i.DEFAULT_POSITION="bottom";const s=`
.toast {
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    opacity: 0;
    transition: top 400ms ease-in-out 0s, bottom 400ms ease-in-out 0s, opacity 500ms ease-in-out 0ms;
    z-index: 999999995;
  }
  .toast > .container {
    box-sizing: border-box;
    max-width: 350px;
    border-radius: 23px;
    background-color: rgb(58, 58, 58);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  .toast > .container > .message {
    box-sizing: border-box;
    padding: 10px 20px;
    text-align: center;
    font-size: 0.9375rem;
    color: rgb(240, 240, 240);
    margin: 0;
  }
  
  .toast.visible {
    opacity: 1;
  }
  
  .toast.bottom {
    bottom: 25px;
  }
  
  .toast.top {
    top: 25px;
  }
  
  .toast.light > .container {
    background-color: #fbfbfb;
  }
  .toast.light > .container > .message {
    color: #555;
  }
  
  @media only screen and (max-width: 500px) {
    .toast {
      width: calc(100% - 24px);
      max-width: unset;
      left: 12px;
      transform: translate(0, 0);
      display: flex;
      justify-content: center;
    }
  }
`;return g}var A=S();const T=I(A);document.getElementById("copyButton").addEventListener("click",function(){const i=document.getElementById("codeArea").value;navigator.clipboard.writeText(i).then(()=>{new T("Código copiado",{timeout:2e3,position:"top",theme:"dark"})}).catch(s=>console.error("Error al copiar: ",s))});window.addEventListener("load",()=>{const i=document.getElementById("codeArea");if(!i.value||i.value==="// Este es un ejemplo de código"){i.value=`/*
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
}`,typeof updateLineNumbers=="function"&&updateLineNumbers(),typeof updateHighlighting=="function"&&updateHighlighting();const s=new Event("input",{bubbles:!0,cancelable:!0});i.dispatchEvent(s)}});document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{const i=document.getElementById("codeArea");i&&(i.focus(),i.blur(),i.focus(),typeof window.updateHighlighting=="function"&&window.updateHighlighting())},500)});

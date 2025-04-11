(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",function(){const n=document.getElementById("codeArea"),o=document.getElementById("lineNumbers"),a=document.getElementById("scrollContainer"),i=document.getElementById("codeContainer");function e(){const s=n.value.split(`
`),r=s.length;o.innerHTML="";for(let d=1;d<=r;d++){const u=document.createElement("div");u.textContent=d,o.appendChild(u)}n.style.height="auto",n.style.height=n.scrollHeight+"px";let c=0;for(const d of s)c=Math.max(c,d.length);c>40?n.style.width=c*8+"px":n.style.width="100%"}n.addEventListener("input",e),n.addEventListener("keydown",function(t){if(t.key==="Tab"){t.preventDefault();const s=this.selectionStart,r=this.selectionEnd;this.value=this.value.substring(0,s)+"    "+this.value.substring(r),this.selectionStart=this.selectionEnd=s+4,e(),typeof updateHighlighting=="function"&&updateHighlighting()}}),a.addEventListener("click",function(t){(t.target===a||t.target===i||t.target.closest(".editor-content"))&&(n.focus(),t.target!==n&&(n.selectionStart=n.selectionEnd=n.value.length))}),e()});function w(n){const o=n.split(`
`);let a=[],i=!1;for(let e=0;e<o.length;e++){let t=o[e];if(i){const c=t.indexOf("*/");if(c!==-1)t=t.substring(c+2),i=!1;else{a.push("");continue}}let s=t.indexOf("/*");for(;s!==-1;){const c=t.indexOf("*/",s+2);if(c!==-1)t=t.slice(0,s)+t.slice(c+2),s=t.indexOf("/*");else{t=t.slice(0,s),i=!0;break}}const r=t.indexOf("//");r!==-1&&(t=t.slice(0,r)),a.push(t)}return a}function L(n,o,a){const i=/("([^"\\]*(\\.[^"\\]*)*)")|(\d+(\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|([{}()\[\];,=+\-*\/<>!&|])/g;let e=0,t;for(;(t=i.exec(n))!==null;){if(t.index>e){const s=n.slice(e,t.index);s.trim()!==""&&a.push(`Error léxico en línea ${o+1}: Token inválido "${s}"`)}e=i.lastIndex}if(e<n.length){const s=n.slice(e);s.trim()!==""&&a.push(`Error léxico en línea ${o+1}: Token inválido "${s}"`)}}function x(n){const o=[],a=[],i={"(":")","{":"}","[":"]"},e=n.split(`
`);for(let t=0;t<e.length;t++){let r=e[t].replace(/(["'])(?:(?=(\\?))\2.)*?\1/g,"");for(let c=0;c<r.length;c++){const d=r[c];if(d==="("||d==="{"||d==="[")o.push({symbol:d,line:t});else if(d===")"||d==="}"||d==="]")if(o.length===0)a.push(`Error sintáctico en línea ${t+1}: No hay símbolo de apertura para "${d}".`);else{const u=o.pop();i[u.symbol]!==d&&a.push(`Error sintáctico en línea ${t+1}: Símbolo "${u.symbol}" en línea ${u.line+1} no coincide con "${d}".`)}}}for(;o.length>0;){const t=o.pop();a.push(`Error sintáctico en línea ${t.line+1}: Falta cerrar "${t.symbol}".`)}return a}function $(n){const o=new RegExp('(\\b(?:void|main|var|if|else|for|while|print|int|double|String|bool|List|return)\\b)|("([^"\\\\]*(?:\\\\.[^"\\\\]*)*)")|(\\/\\/[^\\n]*)|(\\/\\*[\\s\\S]*?\\*\\/)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b[a-zA-Z_][a-zA-Z0-9_]*\\b)|([{}()\\[\\];,=+\\-\\*\\/<>&|!#])',"gm");let a="",i=0,e;for(;(e=o.exec(n))!==null;){let t=e.index;if(t>i){let r=n.substring(i,t);a+=`<span style="color: white;">${r}</span>`}let s="";e[1]!==void 0?s=`<span class="token-keyword">${e[1]}</span>`:e[2]!==void 0?s=`<span class="token-string">${e[2]}</span>`:e[4]!==void 0?s=`<span class="token-comment">${e[4]}</span>`:e[5]!==void 0?s=`<span class="token-comment">${e[5]}</span>`:e[6]!==void 0?s=`<span class="token-number">${e[6]}</span>`:e[7]!==void 0?s=`<span class="token-identifier">${e[7]}</span>`:e[8]!==void 0?s=`<span class="token-operator">${e[8]}</span>`:s=`<span style="color: white;">${e[0]}</span>`,a+=s,i=o.lastIndex}if(i<n.length){let t=n.substring(i);a+=`<span style="color: white;">${t}</span>`}return a}function b(){let n=document.getElementById("codeArea").value;n=n.replace(/\t/g,"    "),document.getElementById("highlightedCode").innerHTML=$(n)}window.updateHighlighting=b;function I(){const n=document.getElementById("codeArea").value,o=w(n);let a=[],i=[],e=[];if(o.forEach((r,c)=>{L(r,c,a)}),a.length===0){const r=o.join(`
`);r.includes("main(")||i.push("Error sintáctico: No se encontró la función main()."),o.forEach((d,u)=>{const l=d.trim();l!==""&&!l.endsWith("{")&&!l.endsWith("}")&&!(l.startsWith("if")||l.startsWith("for")||l.startsWith("while")||l.startsWith("else"))&&(l.endsWith(";")||i.push(`Error sintáctico en línea ${u+1}: Falta ";" al final de la sentencia.`)),(l.startsWith("if")||l.startsWith("for")||l.startsWith("while"))&&(!l.includes("(")||!l.includes(")"))&&i.push(`Error sintáctico en línea ${u+1}: Estructura mal formada en "${l.split(" ")[0]}".`)});const c=x(r);i.push(...c)}else i.push("No se puede analizar por ahora");if(a.length===0&&i.length===0){let r={};const c=/^(var|String|int|double|bool|List)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+);$/;o.forEach((u,l)=>{let p=u.trim().match(c);if(p){let h=p[1],g=p[2],m=p[3].trim();r[g]?e.push(`Error semántico en línea ${l+1}: Variable duplicada "${g}".`):r[g]=h,h==="String"?m.match(/^["'][^"']*["']$/)||e.push(`Error semántico en línea ${l+1}: Asignación inválida a variable de tipo String. Se esperaba una cadena literal.`):h==="int"?/[+\-*/()]/.test(m)?m.replace(/\s/g,"").match(/^[\d+\-*/.()]+$/)||e.push(`Error semántico en línea ${l+1}: Asignación inválida a variable de tipo int. La expresión no es exclusivamente numérica.`):m.match(/^\d+$/)||e.push(`Error semántico en línea ${l+1}: Asignación inválida a variable de tipo int. Se esperaba un entero literal.`):h==="double"?/[+\-*/()]/.test(m)?m.replace(/\s/g,"").match(/^[\d+\-*/.()]+$/)||e.push(`Error semántico en línea ${l+1}: Asignación inválida a variable de tipo double. La expresión no es exclusivamente numérica.`):m.match(/^\d+(\.\d+)?$/)||e.push(`Error semántico en línea ${l+1}: Asignación inválida a variable de tipo double. Se esperaba un literal numérico (con o sin decimal).`):h==="bool"?m.match(/^(true|false)$/)||e.push(`Error semántico en línea ${l+1}: Asignación inválida a variable de tipo bool. Se esperaba "true" o "false".`):h==="List"&&(m.match(/^\[.*\]$/)||e.push(`Error semántico en línea ${l+1}: Asignación inválida a variable de tipo List. Se esperaba una lista literal.`))}});const d=["void","main","print","if","else","for","while","return","var","String","int","double","bool","List"];o.forEach((u,l)=>{const p=u.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g,"").match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);p&&p.forEach(h=>{d.includes(h)||isNaN(h)&&(h in r||e.push(`Error semántico en línea ${l+1}: Variable no declarada "${h}".`))})})}else e.push("No se puede analizar por ahora");document.getElementById("lexicalContent").innerHTML=a.length>0?`<span style="color: red;">${a.join("<br>")}</span>`:'<span style="color: green;">NO ERROR</span>';let t="";i.length>0?i.length===1&&i[0]==="No se puede analizar por ahora"?t=`<span style="color: gray;">${i.join("<br>")}</span>`:t=`<span style="color: red;">${i.join("<br>")}</span>`:t='<span style="color: green;">NO ERROR</span>',document.getElementById("syntacticContent").innerHTML=t;let s="";e.length>0?e.length===1&&e[0]==="No se puede analizar por ahora"?s=`<span style="color: gray;">${e.join("<br>")}</span>`:s=`<span style="color: red;">${e.join("<br>")}</span>`:s='<span style="color: green;">NO ERROR</span>',document.getElementById("semanticContent").innerHTML=s}document.getElementById("codeArea").addEventListener("input",b);document.getElementById("codeArea").addEventListener("scroll",function(){const n=document.getElementById("highlightedCode");n.scrollTop=this.scrollTop,n.scrollLeft=this.scrollLeft});document.getElementById("runButton").addEventListener("click",I);function H(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var f={},v;function S(){if(v)return f;v=1,Object.defineProperty(f,"__esModule",{value:!0});class n{constructor(i,e){var t,s;this.bornTime=Date.now(),this.hideEventHandler=this.handleHideEvent.bind(this),n.appendCSS(),this.viewID=n.generateViewID();let r=n.getHtml(this.viewID);document.body.appendChild(r),this.view=document.getElementById(this.viewID.toString())||document.createElement("div"),this.setMessage(this.message=i),this.setPosition(this.position=(e==null?void 0:e.position)||n.DEFAULT_POSITION),this.setTheme(e==null?void 0:e.theme),this.setStyle(e==null?void 0:e.style),this.waitForEvent=(t=e==null?void 0:e.waitForEvent)!==null&&t!==void 0?t:!1,this.timeout=(s=e==null?void 0:e.timeout)!==null&&s!==void 0?s:n.DEFAULT_HIDING_TIMEOUT,this.isWaitingForHide=!1,this.afterHide=e==null?void 0:e.afterHide,this.addHideEventListener(),this.waitForEvent||this.startHidingTimer(this.timeout),this.show()}static appendCSS(){if(document.getElementById("toast-style")===null){let i=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.id="toast-style",i.appendChild(e),e.appendChild(document.createTextNode(o))}}static generateViewID(){let i=Math.floor(Math.random()*1e9)+1e8;return document.getElementById(i.toString())===null?i:n.generateViewID()}static getHtml(i){const e=`
            <div class="toast" id="${i}">
                <div class="container">
                    <p class="message"></p>
                </div>
            </div>
        `;let t=document.createElement("div");return t.innerHTML=e.trim(),t.firstChild||t}setMessage(i){this.message=i;let e=this.view.getElementsByClassName("message")[0];e.innerHTML=this.message}setPosition(i){this.position=i,this.view.classList.remove("bottom"),this.view.classList.remove("top"),this.view.classList.add(i)}setTheme(i){i!==void 0&&(this.theme==i,this.view.classList.remove("light"),this.view.classList.remove("dark"),this.view.classList.add(i))}setStyle(i){if(i!==void 0){this.style=i;for(const[e,t]of Object.entries(this.style)){let r=document.getElementById(this.viewID.toString()).getElementsByClassName(e)[0];if(r!==void 0)for(const c of t)r.style.setProperty(c[0],c[1])}}}show(){let i=this;setTimeout(()=>{i.view.classList.add("visible")},50)}addHideEventListener(){const i=this;"mousemove mousedown mouseup touchmove click keydown keyup scroll".split(" ").forEach(e=>{window.addEventListener(e,i.hideEventHandler)})}removeHideEventListener(){const i=this;"mousemove mousedown mouseup touchmove click keydown keyup scroll".split(" ").forEach(e=>{window.removeEventListener(e,i.hideEventHandler)})}handleHideEvent(){let i=this.timeout;Date.now()-this.bornTime>this.timeout&&(i=this.timeout/2),this.startHidingTimer(i),this.removeHideEventListener()}startHidingTimer(i){i>0&&!this.isWaitingForHide&&(this.isWaitingForHide=!0,setTimeout(()=>{this.hide()},i))}hide(){this.view.classList.remove("visible");const i=this;setTimeout(()=>{i.view.remove(),i.afterHide!==void 0&&i.afterHide()},800)}}f.default=n,n.DEFAULT_HIDING_TIMEOUT=4e3,n.DEFAULT_POSITION="bottom";const o=`
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
`;return f}var A=S();const T=H(A);document.getElementById("copyButton").addEventListener("click",function(){const n=document.getElementById("codeArea").value;navigator.clipboard.writeText(n).then(()=>{new T("Código copiado",{timeout:2e3,position:"top",theme:"dark"})}).catch(o=>console.error("Error al copiar: ",o))});window.addEventListener("load",()=>{const n=document.getElementById("codeArea");if(!n.value||n.value==="// Este es un ejemplo de código"){n.value=`/*
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
}`,typeof updateLineNumbers=="function"&&updateLineNumbers(),typeof updateHighlighting=="function"&&updateHighlighting();const o=new Event("input",{bubbles:!0,cancelable:!0});n.dispatchEvent(o)}});document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{const n=document.getElementById("codeArea");n&&(n.focus(),n.blur(),n.focus(),typeof window.updateHighlighting=="function"&&window.updateHighlighting())},500)});

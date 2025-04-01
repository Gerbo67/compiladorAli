(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(e){if(e.ep)return;e.ep=!0;const i=r(e);fetch(e.href,i)}})();document.addEventListener("DOMContentLoaded",function(){const t=document.getElementById("codeArea"),o=document.getElementById("lineNumbers"),r=document.getElementById("scrollContainer"),n=document.getElementById("codeContainer");function e(){const s=t.value.split(`
`),c=s.length;o.innerHTML="";for(let l=1;l<=c;l++){const u=document.createElement("div");u.textContent=l,o.appendChild(u)}t.style.height="auto",t.style.height=t.scrollHeight+"px";let d=0;for(const l of s)d=Math.max(d,l.length);d>40?t.style.width=d*8+"px":t.style.width="100%"}t.addEventListener("input",e),t.addEventListener("keydown",function(i){if(i.key==="Tab"){i.preventDefault();const s=this.selectionStart,c=this.selectionEnd;this.value=this.value.substring(0,s)+"    "+this.value.substring(c),this.selectionStart=this.selectionEnd=s+4,e(),typeof updateHighlighting=="function"&&updateHighlighting()}}),r.addEventListener("click",function(i){(i.target===r||i.target===n||i.target.closest(".editor-content"))&&(t.focus(),i.target!==t&&(t.selectionStart=t.selectionEnd=t.value.length))}),e()});function v(t){const o=t.split(`
`);let r=[],n=!1;for(let e=0;e<o.length;e++){let i=o[e];if(n){const d=i.indexOf("*/");if(d!==-1)i=i.substring(d+2),n=!1;else{r.push("");continue}}let s=i.indexOf("/*");for(;s!==-1;){const d=i.indexOf("*/",s+2);if(d!==-1)i=i.slice(0,s)+i.slice(d+2),s=i.indexOf("/*");else{i=i.slice(0,s),n=!0;break}}const c=i.indexOf("//");c!==-1&&(i=i.slice(0,c)),r.push(i)}return r}function E(t,o,r){const n=/("([^"\\]*(\\.[^"\\]*)*)")|(\d+(\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|([{}()\[\];,=+\-*\/<>!&|])/g;let e=0,i;for(;(i=n.exec(t))!==null;){if(i.index>e){const s=t.slice(e,i.index);s.trim()!==""&&r.push(`Error léxico en línea ${o+1}: Token inválido "${s}"`)}e=n.lastIndex}if(e<t.length){const s=t.slice(e);s.trim()!==""&&r.push(`Error léxico en línea ${o+1}: Token inválido "${s}"`)}}function y(t){const o=new RegExp('(\\b(?:void|main|var|if|else|for|while|print|int|double|String|bool|List|return)\\b)|("([^"\\\\]*(?:\\\\.[^"\\\\]*)*)")|(\\/\\/[^\\n]*)|(\\/\\*[\\s\\S]*?\\*\\/)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b[a-zA-Z_][a-zA-Z0-9_]*\\b)|([{}()\\[\\];,=+\\-\\*\\/<>&|!])',"gm");return t.replace(o,(r,n,e,i,s,c,d,l,u)=>n!==void 0?`<span class="token-keyword">${r}</span>`:e!==void 0?`<span class="token-string">${r}</span>`:s!==void 0?`<span class="token-comment">${r}</span>`:c!==void 0?`<span class="token-comment">${r}</span>`:d!==void 0?`<span class="token-number">${r}</span>`:l!==void 0?`<span class="token-identifier">${r}</span>`:u!==void 0?`<span class="token-operator">${r}</span>`:r)}function p(){let t=document.getElementById("codeArea").value;t=t.replace(/\t/g,"    "),document.getElementById("highlightedCode").innerHTML=y(t)}window.updateHighlighting=p;function b(){const t=document.getElementById("codeArea").value,o=v(t);let r=[],n=[],e=[];o.forEach((l,u)=>{E(l,u,r)}),o.join(`
`).includes("main(")||n.push("Error sintáctico: No se encontró la función main()."),o.forEach((l,u)=>{const a=l.trim();a!==""&&!a.endsWith("{")&&!a.endsWith("}")&&!a.startsWith("if")&&!a.startsWith("for")&&!a.startsWith("while")&&!a.includes("main(")&&!a.startsWith("else")&&!a.endsWith(")")&&(a.endsWith(";")||n.push(`Error sintáctico en línea ${u+1}: Falta ";" al final de la sentencia.`))}),o.forEach((l,u)=>{const a=l.trim();(a.startsWith("if")||a.startsWith("for")||a.startsWith("while"))&&(!a.includes("(")||!a.includes(")"))&&n.push(`Error sintáctico en línea ${u+1}: Estructura mal formada en "${a.split(" ")[0]}".`)});let s=[];const c=["var","String","int","double","bool","List"];o.forEach((l,u)=>{const a=l.match(/("([^"\\]*(\\.[^"\\]*)*)")|(\d+(\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|([{}()\[\];,=+\-*\/<>!&|])/g);if(a&&a.length>=2&&c.includes(a[0])){const m=a[1];s.includes(m)?e.push(`Error semántico en línea ${u+1}: Variable duplicada "${m}".`):s.push(m)}});const d=["void","main","print","if","else","for","while","return","var","String","int","double","bool","List"];o.forEach((l,u)=>{const m=l.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g,"").match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);m&&m.forEach(h=>{d.includes(h)||isNaN(h)&&(s.includes(h)||e.push(`Error semántico en línea ${u+1}: Variable no declarada "${h}".`))})}),document.getElementById("lexicalContent").innerHTML=r.length>0?`<span style="color: red;">${r.join("<br>")}</span>`:'<span style="color: green;">NO ERROR</span>',document.getElementById("syntacticContent").innerHTML=n.length>0?`<span style="color: red;">${n.join("<br>")}</span>`:'<span style="color: green;">NO ERROR</span>',document.getElementById("semanticContent").innerHTML=e.length>0?`<span style="color: red;">${e.join("<br>")}</span>`:'<span style="color: green;">NO ERROR</span>'}document.getElementById("codeArea").addEventListener("input",p);document.getElementById("codeArea").addEventListener("scroll",function(){const t=document.getElementById("highlightedCode");t.scrollTop=this.scrollTop,t.scrollLeft=this.scrollLeft});document.getElementById("runButton").addEventListener("click",b);function w(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var f={},g;function L(){if(g)return f;g=1,Object.defineProperty(f,"__esModule",{value:!0});class t{constructor(n,e){var i,s;this.bornTime=Date.now(),this.hideEventHandler=this.handleHideEvent.bind(this),t.appendCSS(),this.viewID=t.generateViewID();let c=t.getHtml(this.viewID);document.body.appendChild(c),this.view=document.getElementById(this.viewID.toString())||document.createElement("div"),this.setMessage(this.message=n),this.setPosition(this.position=(e==null?void 0:e.position)||t.DEFAULT_POSITION),this.setTheme(e==null?void 0:e.theme),this.setStyle(e==null?void 0:e.style),this.waitForEvent=(i=e==null?void 0:e.waitForEvent)!==null&&i!==void 0?i:!1,this.timeout=(s=e==null?void 0:e.timeout)!==null&&s!==void 0?s:t.DEFAULT_HIDING_TIMEOUT,this.isWaitingForHide=!1,this.afterHide=e==null?void 0:e.afterHide,this.addHideEventListener(),this.waitForEvent||this.startHidingTimer(this.timeout),this.show()}static appendCSS(){if(document.getElementById("toast-style")===null){let n=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.id="toast-style",n.appendChild(e),e.appendChild(document.createTextNode(o))}}static generateViewID(){let n=Math.floor(Math.random()*1e9)+1e8;return document.getElementById(n.toString())===null?n:t.generateViewID()}static getHtml(n){const e=`
            <div class="toast" id="${n}">
                <div class="container">
                    <p class="message"></p>
                </div>
            </div>
        `;let i=document.createElement("div");return i.innerHTML=e.trim(),i.firstChild||i}setMessage(n){this.message=n;let e=this.view.getElementsByClassName("message")[0];e.innerHTML=this.message}setPosition(n){this.position=n,this.view.classList.remove("bottom"),this.view.classList.remove("top"),this.view.classList.add(n)}setTheme(n){n!==void 0&&(this.theme==n,this.view.classList.remove("light"),this.view.classList.remove("dark"),this.view.classList.add(n))}setStyle(n){if(n!==void 0){this.style=n;for(const[e,i]of Object.entries(this.style)){let c=document.getElementById(this.viewID.toString()).getElementsByClassName(e)[0];if(c!==void 0)for(const d of i)c.style.setProperty(d[0],d[1])}}}show(){let n=this;setTimeout(()=>{n.view.classList.add("visible")},50)}addHideEventListener(){const n=this;"mousemove mousedown mouseup touchmove click keydown keyup scroll".split(" ").forEach(e=>{window.addEventListener(e,n.hideEventHandler)})}removeHideEventListener(){const n=this;"mousemove mousedown mouseup touchmove click keydown keyup scroll".split(" ").forEach(e=>{window.removeEventListener(e,n.hideEventHandler)})}handleHideEvent(){let n=this.timeout;Date.now()-this.bornTime>this.timeout&&(n=this.timeout/2),this.startHidingTimer(n),this.removeHideEventListener()}startHidingTimer(n){n>0&&!this.isWaitingForHide&&(this.isWaitingForHide=!0,setTimeout(()=>{this.hide()},n))}hide(){this.view.classList.remove("visible");const n=this;setTimeout(()=>{n.view.remove(),n.afterHide!==void 0&&n.afterHide()},800)}}f.default=t,t.DEFAULT_HIDING_TIMEOUT=4e3,t.DEFAULT_POSITION="bottom";const o=`
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
`;return f}var x=L();const I=w(x);document.getElementById("copyButton").addEventListener("click",function(){const t=document.getElementById("codeArea").value;navigator.clipboard.writeText(t).then(()=>{new I("Código copiado",{timeout:2e3,position:"top",theme:"dark"})}).catch(o=>console.error("Error al copiar: ",o))});window.addEventListener("load",()=>{const t=document.getElementById("codeArea");if(!t.value||t.value==="// Este es un ejemplo de código"){t.value=`/*
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
}`,typeof updateLineNumbers=="function"&&updateLineNumbers(),typeof updateHighlighting=="function"&&updateHighlighting();const o=new Event("input",{bubbles:!0,cancelable:!0});t.dispatchEvent(o)}});document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{const t=document.getElementById("codeArea");t&&(t.focus(),t.blur(),t.focus(),typeof window.updateHighlighting=="function"&&window.updateHighlighting())},500)});

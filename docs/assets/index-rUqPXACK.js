(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();console.log("Pure JS start:",new Date().toISOString());const i=document.getElementById("root");i?(i.innerHTML=`
        <div>
            <h1>🌍 Aetheria - Pure JS</h1>
            <p>This is pure JavaScript with no TypeScript compilation</p>
            <p>Load time should be instant</p>
        </div>
    `,console.log("Pure JS complete:",new Date().toISOString())):console.error("Root element not found");window.addEventListener("load",()=>{console.log("Pure JS - Window load event:",new Date().toISOString())});

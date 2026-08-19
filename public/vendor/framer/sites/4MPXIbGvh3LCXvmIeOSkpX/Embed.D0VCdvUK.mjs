import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{I as t,P as n,V as r,c as i,k as a,o,w as s,z as c}from"./react.BXLtZsiS.mjs";import{A as l,X as u,c as d}from"./framer.BNSqZPTw.mjs";import{h as f,o as p,p as m}from"./OIjZRBmWDcIE2B6qgG1j.Dg_EDk95.mjs";import{t as h}from"./default-utils.E9nOUV0-.mjs";function g({type:e,url:t,html:n,zoom:r,radius:a,border:o,style:s={}}){return e===`url`&&t?i(v,{url:t,zoom:r,radius:a,border:o,style:s}):e===`html`&&n?i(b,{html:n,style:s}):i(_,{style:s})}function _({style:e}){return i(`div`,{style:{minHeight:D(e),...f,overflow:`hidden`,...e},children:i(`div`,{style:A,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function v({url:e,zoom:r,radius:a,border:o,style:s}){let c=!s.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let l=p(),[u,d]=t(l?void 0:!1);return n(()=>{if(!l)return;let t=!0;d(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&d(e)}else{let e=await n.text();console.error(e),d(Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),d(e)}),()=>{t=!1}},[e]),l&&c?i(E,{message:`URL embeds do not support auto height.`,style:s}):e.startsWith(`https://`)?u===void 0?i(T,{}):u instanceof Error?i(E,{message:u.message,style:s}):u===!0?i(E,{message:`Can’t embed ${e} due to its content security policy.`,style:s}):i(`iframe`,{src:e,style:{...O,...s,...o,zoom:r,borderRadius:a,transformOrigin:`top center`},loading:`lazy`,fetchPriority:l?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:y(l)}):i(E,{message:`Unsupported protocol.`,style:s})}function y(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function b({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return i(n||r?S:x,{html:e,...t})}return i(C,{html:e,...t})}function x({html:e,style:o}){let s=a(),[c,l]=t(0);n(()=>{let e=s.current?.contentWindow;function t(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&l(r)}return r.addEventListener(`message`,t),e?.postMessage(`getEmbedHeight`,`*`),()=>{r.removeEventListener(`message`,t)}},[]);let u=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,d={...O,...o};return o.height||(d.height=c+`px`),i(`iframe`,{ref:s,style:d,srcDoc:u})}function S({html:e,style:t}){let r=a();return n(()=>{let t=r.current;if(t)return t.innerHTML=e,w(t),()=>{t.innerHTML=``}},[e]),i(`div`,{ref:r,style:{...k,...t}})}function C({html:e,style:t}){return i(`div`,{style:{...k,...t},dangerouslySetInnerHTML:{__html:e}})}function w(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)w(t)}function T(){return i(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...m,overflow:`hidden`},children:i(`div`,{style:A,children:`Loading…`})})}function E({message:e,style:t}){return i(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:D(t),...m,overflow:`hidden`,...t},children:i(`div`,{style:A,children:e})})}function D(e){if(!e.height)return 200}var O,k,A,j=e((()=>{c(),o(),s(),u(),h(),l(g,{type:{type:d.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:d.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:d.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:d.Border,optional:!0,hidden(e){return e.type!==`url`}},radius:{type:d.BorderRadius,title:`Radius`,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:d.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),O={width:`100%`,height:`100%`,border:`none`},k={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},A={textAlign:`center`,minWidth:140}}));export{j as n,g as t};
//# sourceMappingURL=Embed.D0VCdvUK.mjs.map
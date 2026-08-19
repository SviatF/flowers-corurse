import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{P as t,c as n,o as r,w as i}from"./react.BXLtZsiS.mjs";function a(){t(()=>{try{if(!document.getElementById(`custom-blog-styles`)){let e=document.createElement(`style`);e.id=`custom-blog-styles`,e.innerHTML=`
                        @media (min-width: 810px) {
                            [aria-label="post-hover"]::after {
                                content: '' !important;
                                position: absolute !important;
                                left: 0 !important;
                                top: 0 !important;
                                background-color: #f779d0 !important;
                                height: 100% !important;
                                width: 0 !important;
                                z-index: 0 !important;
                            }

                            [aria-label="post-hover"]::after {
                                transition: all .35s ease !important;
                            }

                            [aria-label="post-hover"]:hover::after {
                                width: 100% !important;
                            }

                            [data-framer-name="Article List"] {
                                z-index: 1 !important;
                            }
                        }
                    `,document.head.appendChild(e)}}catch(e){console.error(`Error in custom styling:`,e)}},[])}function o(e){return t=>(a(),n(e,{...t}))}var s=e((()=>{r(),i()}));export{s as n,o as t};
//# sourceMappingURL=CustomBlogOverviewStyling.BBuo1Ldt.mjs.map
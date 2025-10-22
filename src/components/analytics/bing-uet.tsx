"use client";

import Script from "next/script";

export default function BingUET() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const uetTagId = process.env.NEXT_PUBLIC_BING_UET_TAG_ID || "";
  if (!uetTagId) {
    return null;
  }

  const initCode = `
    (function(w,d,t,r,u){
      var f,n,i; w[u]=w[u]||[], f=function(){
        var o={ti:"${uetTagId}", enableAutoSpaTracking: true};
        o.q=w[u]; w[u]=new UET(o); w[u].push("pageLoad");
      }, n=d.createElement(t); n.src=r; n.async=1; n.onload=n.onreadystatechange=function(){
        var s=this.readyState; s && s!=="loaded" && s!=="complete" || (f(), n.onload=n.onreadystatechange=null)
      }, i=d.getElementsByTagName(t)[0]; i.parentNode.insertBefore(n,i);
    })(window,document,"script","https://bat.bing.com/bat.js","uetq");
  `;

  const consentDefaults = `
    window.uetq = window.uetq || [];
    if (!window.__uetConsentAdStorage) {
      window.__uetConsentAdStorage = 'denied';
    }
    window.uetq.push('consent', 'default', { 'ad_storage': 'denied' });
    window.__updateUetConsent = function(granted){
      var status = granted ? 'granted' : 'denied';
      window.__uetConsentAdStorage = status;
      window.uetq = window.uetq || [];
      window.uetq.push('consent', 'update', { 'ad_storage': status });
      try {
        window.dispatchEvent(new CustomEvent('consent:changed', { detail: { ad_storage: status, source: 'bing-uet' } }));
      } catch (e) {}
    };
  `;

  return (
    <>
      <Script id="bing-uet-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: initCode }} />
      <Script id="bing-uet-consent" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: consentDefaults }} />
    </>
  );
}


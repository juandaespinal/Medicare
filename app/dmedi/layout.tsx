import type React from "react"
import "../../app/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medicare Health Allowance Benefits",
  description: "Claim your Medicare Health Allowance benefits today",
}

export default function DmediLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:," />

        {/* Basic test script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("=== LAYOUT HEAD SCRIPT LOADED ===");
              window.debugInfo = {
                scriptsLoaded: [],
                errors: []
              };
            `,
          }}
        />
      </head>
      <body>
        {children}

        {/* Load scripts dynamically to avoid blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("=== BODY SCRIPT STARTING ===");
              
              // Set default number
              window.defaultRingbaNumber = "+18554690274";
              
              // Function to load external scripts
              function loadScript(src, name) {
                return new Promise((resolve, reject) => {
                  console.log("Attempting to load " + name + " from: " + src);
                  
                  const script = document.createElement('script');
                  script.src = src;
                  script.async = true;
                  
                  script.onload = function() {
                    console.log(name + " loaded successfully");
                    window.debugInfo.scriptsLoaded.push(name);
                    resolve();
                  };
                  
                  script.onerror = function(error) {
                    console.error(name + " failed to load:", error);
                    window.debugInfo.errors.push(name + " failed to load");
                    reject(error);
                  };
                  
                  document.head.appendChild(script);
                });
              }
              
              // Try to load RedTrack
              loadScript('https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559', 'RedTrack')
                .catch(error => console.log('RedTrack blocked or failed'));
              
              // Try to load Ringba
              loadScript('//b-js.ringba.com/CAefa19b14140b4593baf4f0e1d288e9e8', 'Ringba')
                .catch(error => console.log('Ringba blocked or failed'));
              
              // Alternative Ringba loading method
              setTimeout(() => {
                console.log("=== TRYING ALTERNATIVE RINGBA METHOD ===");
                
                // Create the _rgba object manually
                window._rgba = window._rgba || { q: [] };
                
                // Try the traditional Ringba loading method
                (function(e,d) {
                  var ringba_com_tag="JS27fbc6124e1b476c86fb0dc9ada51072";
                  var _sc = d.getElementsByTagName('script'), _s = _sc[_sc.length - 1];
                  e._rgba = e._rgba || { q: [] }; 
                  e._rgba.q.push({ tag: ringba_com_tag, script: _s });
                  
                  if (!(e._rgba.loading = !!e._rgba.loading)) {
                    console.log("Creating Ringba script element...");
                    var sc = d.createElement('script'); 
                    sc.type = 'text/javascript'; 
                    sc.async = true;
                    sc.src = '//js.callcdn.com/js_v3/min/ringba.com.js';
                    
                    sc.onload = function() {
                      console.log("Ringba script loaded via alternative method");
                    };
                    
                    sc.onerror = function() {
                      console.log("Ringba script failed via alternative method");
                    };
                    
                    var s = d.getElementsByTagName('script')[0]; 
                    s.parentNode.insertBefore(sc, s);
                    e._rgba.loading = true;
                  }
                })(window,document);
              }, 2000);
              
              // Check for scripts every 3 seconds
              let checkCount = 0;
              const checkInterval = setInterval(() => {
                checkCount++;
                console.log("=== STATUS CHECK " + checkCount + " ===");
                console.log("Scripts loaded:", window.debugInfo.scriptsLoaded);
                console.log("Errors:", window.debugInfo.errors);
                console.log("window._rgba:", window._rgba);
                console.log("window.ringba_known_numbers:", window.ringba_known_numbers);
                console.log("window.rtkClickID:", window.rtkClickID);
                
                // Stop after 10 checks
                if (checkCount >= 10) {
                  console.log("=== FINAL STATUS ===");
                  console.log("Scripts that loaded:", window.debugInfo.scriptsLoaded);
                  console.log("Scripts that failed:", window.debugInfo.errors);
                  clearInterval(checkInterval);
                }
              }, 3000);
            `,
          }}
        />
        {/* Ringba tracking script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (window._rgba_tags = (window._rgba_tags || [])).push({ type: "User", track_attempted: "yes" });
              var intervalId = setInterval(() => {
                if (window.rtkClickID != undefined) {
                  (window._rgba_tags = (window._rgba_tags || [])).push({ type: "User", clickid: window.rtkClickID });
                  console.log("Just ran the rtkClickID script to add Ringba tags: ", window.rtkClickID);
                  clearInterval(intervalId);
                } else {
                  console.log("rtkcid not defined yet");
                }
              }, 500);
            `,
          }}
        />

        {/* Mixpanel analytics script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split( " "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for ( var d = {}, e = ["get_group"].concat( Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);
    `,
          }}
        />

        {/* Location and URL parameter script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              fetch("https://pro.ip-api.com/json/?key=YfaAgEjllgeNS6P")
                .then(function(response) {
                  return response.json();
                })
                .then(function(location) {
                  //ADD ZIP TO URL
                  const url = new URL(window.location.href);
                  url.searchParams.set('zipcode', parseInt(location['zip']));
                  window.history.pushState(null, '', url.toString());
                })
                .then(function() {
                      const currentURL = window.location.href;
                      const urlParams = currentURL.split('?');
                      
                      if (urlParams.length > 1) {
                          const params = urlParams.at(-1);
                          const buttons = document.getElementsByClassName("lp-button-react");
                          for (button of buttons) {
                              button.href += \`?\${params}\`
                          }
                      }
                })
            `,
          }}
        />

        {/* CSS styling script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                try {
                  const bgElement = document.getElementsByClassName("has-background-size-contain")[0];
                  if (bgElement) {
                    bgElement.style.height = "60px";
                    bgElement.style.marginTop = "20px";
                  }

                  const headerElement1 = document.evaluate('//*[@id="header"]/div[1]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                  if (headerElement1) {
                    headerElement1.style.display = "none";
                  }

                  const headerElement2 = document.evaluate('//*[@id="header"]/div[2]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                  if (headerElement2) {
                    headerElement2.style.display = "none";
                  }

                  const hrElement = document.getElementsByTagName("hr")[0];
                  if (hrElement) {
                    hrElement.style.display = "none";
                  }
                } catch (error) {
                  console.log("Some styling elements not found, skipping...");
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}

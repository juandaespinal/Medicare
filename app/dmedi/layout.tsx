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
        {/* RDTK Tracking Script */}
        <script type="text/javascript" src="https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559"></script>

        {/* Ringba Number Pool Script - Updated to use dangerouslySetInnerHTML for better control */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function(e,d) {
        //Ringba.com phone number tracking
        var ringba_com_tag="JS27fbc6124e1b476c86fb0dc9ada51072";
        var _sc = d.getElementsByTagName('script'), _s = _sc[_sc.length - 1];
        e._rgba = e._rgba || { q: [] }; e._rgba.q.push({ tag: ringba_com_tag, script: _s });
        if (!(e._rgba.loading = !!e._rgba.loading)) {
            var sc = d.createElement('script'); sc.type = 'text/javascript'; sc.async = true;
            sc.src = '//js.callcdn.com/js_v3/min/ringba.com.js';
            var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sc, s);
            e._rgba.loading = true;
        }
        
        // Store the default number in a global variable for easy access
        e.defaultRingbaNumber = "+18554690274";
        
        // Create a callback system for when Ringba assigns a number
        e.ringbaNumberAssigned = function(number) {
          console.log("Ringba number assigned:", number);
          
          // Update any phone displays on the page
          const phoneDisplays = document.querySelectorAll('#dynamic-phone-number, .phone-display');
          phoneDisplays.forEach(function(display) {
            if (display.textContent) {
              // Format the number for display
              const cleaned = number.replace(/[^0-9]/g, "");
              let formatted = number;
              if (cleaned.length === 10) {
                formatted = "(" + cleaned.slice(0, 3) + ") " + cleaned.slice(3, 6) + "-" + cleaned.slice(6);
              } else if (cleaned.length === 11 && cleaned[0] === "1") {
                formatted = "+1 (" + cleaned.slice(1, 4) + ") " + cleaned.slice(4, 7) + "-" + cleaned.slice(7);
              }
              display.textContent = formatted;
            }
          });
          
          // Update any buttons with the new number
          const buttons = document.querySelectorAll('button[data-default-number]');
          buttons.forEach(function(button) {
            button.setAttribute('data-ringba-number', number);
          });
          
          // Store in global variable for React components to access
          e.currentRingbaNumber = number;
          
          // Dispatch a custom event that React components can listen to
          const event = new CustomEvent('ringbaNumberAssigned', { 
            detail: { number: number } 
          });
          document.dispatchEvent(event);
        };
        
        // Override the default Ringba callback if it exists
        var originalCallback = e._rgba.callback;
        e._rgba.callback = function(data) {
          if (originalCallback) {
            originalCallback(data);
          }
          
          // Check if a number was assigned
          if (data && data.number) {
            e.ringbaNumberAssigned(data.number);
          }
        };
      })(window,document);
    `,
          }}
        />
      </head>
      <body>
        {children}

        {/* Additional scripts requested to be added before closing body tag */}
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

        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split( " "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for ( var d = {}, e = ["get_group"].concat( Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);
            `,
          }}
        />

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
                    for (let button of buttons) {
                      button.href += \`?\${params}\`
                    }
                  }
                })
            `,
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                  try {
                    const headerBgElements = document.getElementsByClassName("has-background-size-contain");
                    if (headerBgElements && headerBgElements.length > 0) {
                      headerBgElements[0].style.height = "60px";
                      headerBgElements[0].style.marginTop = "20px";
                    }
                    
                    const headerRightElement = document.evaluate('//*[@id="header"]/div[1]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (headerRightElement) {
                      headerRightElement.style.display = "none";
                    }
                    
                    const headerBottomElement = document.evaluate('//*[@id="header"]/div[2]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (headerBottomElement) {
                      headerBottomElement.style.display = "none";
                    }
                    
                    const hrElements = document.getElementsByTagName("hr");
                    if (hrElements && hrElements.length > 0) {
                      hrElements[0].style.display = "none";
                    }
                    
                    console.log("DOM manipulation script executed successfully");
                  } catch (error) {
                    console.error("Error in DOM manipulation script:", error);
                  }
                }, 1000); // Delay execution to ensure DOM is fully loaded
              });
            `,
          }}
        />
      </body>
    </html>
  )
}

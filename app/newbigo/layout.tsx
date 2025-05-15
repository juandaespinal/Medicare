import type React from "react"
import "../../app/globals.css"
import type { Metadata } from "next"
import NewBigoClient from "./NewBigoClient"

export const metadata: Metadata = {
  title: "Medicare Grocery Allowance Benefits",
  description: "Claim your Medicare Grocery Allowance benefits today",
}

export default function NewBigoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* RedTrack Tracking Script - Positioned at the top for priority loading */}
        <script type="text/javascript" src="https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559"></script>

        {/* BIGO Tracking Script - Using the official implementation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.bgdataLayer = window.bgdataLayer || [];
function bge(){bgdataLayer.push(arguments);}
bge('init', "${process.env.NEXT_PUBLIC_BIGO_PIXEL_ID || "905552424104630784"}");
            `,
          }}
        />
        <script
          async
          src="https://api.topnotchs.site/ad/events.js?pixel_id=${process.env.NEXT_PUBLIC_BIGO_PIXEL_ID || '905552424104630784'}"
        ></script>

        {/* Other meta tags and styles */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Medicare Grocery Allowance Benefits</title>
        <meta name="description" content="Claim your Medicare Grocery Allowance benefits today" />

        {/* Ringba Number Pool Script */}
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
          })(window,document);
        `,
          }}
        />
      </head>
      <body>
        <NewBigoClient>{children}</NewBigoClient>

        {/* Additional scripts at the end of body */}
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
      </body>
    </html>
  )
}

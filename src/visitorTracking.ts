/**
 * Simple visitor tracking utility.
 * Uses ipapi.co (or similar) to get geolocation and sends it to a Google Apps Script web app.
 */

const TRACKING_ENDPOINT = "https://script.google.com/macros/s/AKfycbxvOCOjlsYHF7qwWEXEYyDM8CeoLfT2asWRwaa171evuRoa-HubOkliqG3GPNyshUE4mw/exec"; // USER: Replace with your deployed Google Apps Script URL

export async function trackVisitor() {
    // Prevent double tracking in the same session if needed
    if (sessionStorage.getItem("slic_tracked")) {
        return;
    }

    try {
        // 1. Get Geolocation info (with fallback)
        let geoData: any = {};
        try {
            const geoResponse = await fetch("https://ipapi.co/json/");
            if (geoResponse.ok) {
                geoData = await geoResponse.json();
            }
        } catch (e) {
            console.warn("Geolocation API blocked or failed, recording basic visit info instead.");
        }

        const payload = {
            ip: geoData.ip || "Unknown",
            country: geoData.country_name || "Unknown",
            region: geoData.region || "Unknown",
            city: geoData.city || "Unknown",
            userAgent: navigator.userAgent,
            referrer: document.referrer || "Direct",
        };

        // 2. Send to Google Apps Script
        if (TRACKING_ENDPOINT) {
            await fetch(TRACKING_ENDPOINT, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload),
            });

            sessionStorage.setItem("slic_tracked", "true");
            console.log("Visitor tracking recorded.");
        }
    } catch (error) {
        console.error("Critical error in visitor tracking:", error);
    }
}

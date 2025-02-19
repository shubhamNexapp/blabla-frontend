import React, { useEffect } from "react";

const OtpCompo = () => {
    useEffect(() => {
        const scriptLoaded = () => {
            const callback = (userinfo) => {
                const emailMap = userinfo.identities.find(
                    (item) => item.identityType === "EMAIL",
                );

                const mobileMap = userinfo.identities.find(
                    (item) => item.identityType === "MOBILE",
                )?.identityValue;

                const token = userinfo.token;
                const email = emailMap?.identityValue;
                const mobile = mobileMap?.identityValue;
                const name = emailMap?.name || mobileMap?.name;

                console.log("User Info:", userinfo);
                console.log("User verify:", userinfo.identities[0].identityValue.slice(-10));
                console.log("User verify:", userinfo.identities[0].verified);
                // Implement your custom logic here
            };

            // Initialize OTPLESS SDK with the defined callback
            window.OTPlessSignin = new OTPless(callback);
        };

        // Check if the script has loaded
        if (window.OTPless) {
            scriptLoaded();
        } else {
            window.addEventListener("otpless:loaded", scriptLoaded);
        }
    }, []);

    const phoneAuth = () => {
        const mobileInput = document.getElementById("mobile-input").value;
        window.OTPlessSignin.initiate({
            channel: "PHONE",
            phone: mobileInput,
            countryCode: "+91", // Adjust country code as necessary
        });
        document.getElementById("otp-section").style.display = "block";
    };

    const verifyOTP = () => {
        const mobileInput = document.getElementById("mobile-input").value;
        const otpInput = document.getElementById("otp-input").value;

        window.OTPlessSignin.verify({
            channel: "PHONE",
            phone: mobileInput,
            otp: otpInput,
            countryCode: "+91",
        });
    };

    const oauth = (provider) => {
        window.OTPlessSignin.initiate({
            channel: "OAUTH",
            channelType: provider, // "WHATSAPP", "GMAIL", etc.
        });
    };

    return (
        <main>
            <h1>instaone</h1>

            <h1>instaone</h1>
            <h1>instaone</h1>
            <div>
                <input id="mobile-input" placeholder="Enter mobile number" />
                <button onClick={phoneAuth}>Request OTP</button>
            </div>

            <div id="otp-section" style={{ display: "none" }}>
                <input id="otp-input" placeholder="Enter OTP" />
                <button onClick={verifyOTP}>Verify OTP</button>
            </div>
        </main>
    );
}

export default OtpCompo
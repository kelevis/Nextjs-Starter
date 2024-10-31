// components/Recaptcha.tsx
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onVerify }: { onVerify: (token: string | null) => void }) => {
    return (
        <ReCAPTCHA
            sitekey={process.env.RECAPTCHA_SITE_KEY!}
            // sitekey="6LeZG3EqAAAAANcsv-xAyS4UdrXGBUVeyb8BYoTw"
            onChange={onVerify}
        />
    );
};

export default Recaptcha;

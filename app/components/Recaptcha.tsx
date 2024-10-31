// components/Recaptcha.tsx
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onVerify }: { onVerify: (token: string | null) => void }) => {
    return (
        <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={onVerify}
        />
    );
};

export default Recaptcha;

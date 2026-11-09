import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';
import '../../styles/ui/ResumePaymentBanner.css';

const ResumePaymentBanner = ({ onResume }) => {
    return (
        <div className="resume-payment-wrapper">
            <button className="resume-payment-btn" onClick={onResume}>
                <div className="flex-row">
                    <Wallet size={28} className="bounce-icon" />
                    <div className="text-left">
                        <span className="title">กำลังรอการชำระเงิน</span>
                        <span className="subtitle">แตะเพื่อดู QR Code หรือแนบสลิปต่อ</span>
                    </div>
                </div>
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default ResumePaymentBanner;
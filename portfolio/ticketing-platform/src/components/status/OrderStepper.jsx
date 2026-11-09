import React from "react";
import { Hourglass, Wallet, Truck, CircleCheck } from "lucide-react";
import "../../styles/status/OrderStepper.css";

const STATUS_STEPS = [
    { label: "รอชำระเงิน", icon: <Hourglass size={16} />, key: "pending" },
    { label: "รอตรวจสอบการชำระ", icon: <CircleCheck size={16} />, key: "preparing" },
    { label: "ชำระเเงินสร็จสิ้น", icon: <Wallet size={16} />, key: "shipping" },
];

const OrderStepper = ({ currentStatus }) => {
    // คำนวณความยาวของแถบสีตามสถานะ (0-3)
    const pct = ["0%","50%", "100%"][currentStatus] || "0%";

    return (
        <div className="pa-stepper">
            <div className="pa-stepper-track">
                <div className="pa-stepper-fill" style={{ width: pct }} />
            </div>
            <div className="pa-stepper-row">
                {STATUS_STEPS.map((step, i) => {
                    const done = i < currentStatus;
                    const active = i === currentStatus;
                    return (
                        <div key={i} className={`pa-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                            <div className="pa-step-icon">{step.icon}</div>
                            <span className="pa-step-label">{step.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStepper;
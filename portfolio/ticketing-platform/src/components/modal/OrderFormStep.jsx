import React from "react";
import { User, CreditCard, MapPin } from "lucide-react";
import SortButton from "../button/SortButton";

const OrderFormStep = ({ formData, handleChange, errors, onSubmit, provincesList }) => {
    const provinceOptions = provincesList ? provincesList.map(prov => ({
        value: prov.thai,
        label: prov.thai
    })) : [];

    return (
        <div className="wizard-container order-form">
            <h4 className="form-section-title"><User size={18} /> ข้อมูลผู้ซื้อ</h4>
            <div className="input-row">
                <div className="input-group">
                    <label>ชื่อ <i>*</i></label>
                    <input type="text" name="firstName" placeholder="ชื่อผู้ซื้อ" value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <p className="error-msg">{errors.firstName}</p>}
                </div>
                <div className="input-group">
                    <label>นามสกุล <i>*</i></label>
                    <input type="text" name="lastName" placeholder="นามสกุล" value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <p className="error-msg">{errors.lastName}</p>}
                </div>
            </div>

            <div className="input-group">
                <label>เบอร์โทรศัพท์ <i>*</i></label>
                <input type="tel" name="phone" placeholder="08xxxxxxxx" value={formData.phone} onChange={handleChange} maxLength="10" />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}
            </div>

            <div className="input-group">
                <label>เช็คจังหวัด <i>*</i></label>
                <SortButton
                    value={formData.province}
                    onChange={(val) => {
                        handleChange({ target: { name: "province", value: val } });
                    }}
                    options={provinceOptions}
                    searchable={true}
                    placeholder="ค้นหา หรือ เลือกจังหวัด"
                    icon={MapPin}
                    className="full-width-dropdown"
                    display="block"
                    contentPosition="top"
                />

                {errors.province && <p className="error-msg">{errors.province}</p>}
            </div>

            <div className="sheet-footer-actions">
                <button type="button" className="btn-confirm-order" onClick={onSubmit}>
                    <CreditCard size={18} /> ยืนยันข้อมูล
                </button>
            </div>
        </div>
    );
};

export default OrderFormStep;
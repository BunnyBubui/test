const getTypeLabel = (type) => {
    switch (type) {
        case "N": return "ธรรมดา";
        case "P": return "โปรโมชั่น";
        case "S": return "พิเศษ";
        default: return "ไม่ระบุ";
    }
};

const getTypeColor = (type) => {
    switch (type) {
        case "N": return "#888";
        case "P": return "#ff7a00";
        case "S": return "#e91e63";
        default: return "#ccc";
    }
};

const getStatusColor = (status) => {
    switch (status) {
      case "เปิดขายอยู่":
        return "open";
      case "ปิดการขาย":
        return "closed";
      default:
        return "coming";
    }
  };

export {getTypeLabel, getTypeColor, getStatusColor};
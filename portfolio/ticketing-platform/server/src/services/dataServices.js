const DataModel = require("../models/dataModels");

const getFilteredData = (type, section, slug, id) => {
    let result = DataModel.fetchByType(type);

    if (!result) return null;

    // 2. กรองข้อมูลตาม Section (เช่น ?section=foodData)
    if (section && result[section]) {
        result = result[section];
    }

    // 3. กรองตาม Slug (เช่น ?slug=seafood)
    if (slug && Array.isArray(result)) {
        result = result.find(item => item.slug === slug) || null;
    }

    // 4. กรองตาม ID สำหรับหน้า Detail เจาะจง (เช่น ?id=1)
    if (id && result && result.contentHtml && Array.isArray(result.contentHtml.places)) {
        result = result.contentHtml.places.find(place => place.id == id) || null;
    }

    return result;
}

module.exports = {getFilteredData};
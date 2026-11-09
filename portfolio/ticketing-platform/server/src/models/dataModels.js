const {getData} = require('../../public/data/dataIndex');

const fetchByType = (type) => {
    return getData(type);
}

module.exports = {fetchByType};
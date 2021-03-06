const filter = require("../queries/filter");
const DTO = require("../queries/DTO");

const convertQueryMiddle = async (req, res, next) => {
  console.log("converting");
  if (Object.keys(req.query).length !== 0) {
    console.log(`req.query exists, #params: ${Object.keys(req.query).length}`);
    const filterData = DTO.convertData(req.query);
    const resArr = await filter.getData(filterData);
    // console.log(resArr);
    res.locals.resArr = resArr;
  }
  next();
};
const convertBodyMiddle = async (req, res, next) => {
  if (Object.keys(req.body).length !== 0) {
    console.log(`req.body exists, #params: ${Object.keys(req.body).length}`);
    const filterData = DTO.convertData(req.body);
    const resArr = await filter.getData(filterData);
    // console.log(resArr);
    res.locals.resArr = resArr;
  }
  next();
};

exports.convertQueryMiddle = convertQueryMiddle;
exports.convertBodyMiddle = convertBodyMiddle;

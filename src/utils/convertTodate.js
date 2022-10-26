module.exports = {
  dateConvert: function(time) {
    let timeLocal = "";
    let timeCurrent = Date.now() - Number(time);
    let countDay = 0;
    let countHour = 0;
    let countMinite = 0;

    if (timeCurrent > 86400000) {
      while (timeCurrent > 86400000) {
        countDay = countDay + 1;
        timeCurrent = timeCurrent - 86400000;
      }
      return (timeLocal = timeLocal + `${countDay} ngày`);
    } else if (timeCurrent > 3600000) {
      while (timeCurrent > 3600000) {
        countHour = countHour + 1;
        timeCurrent = timeCurrent - 3600000;
      }
      return (timeLocal = timeLocal + `${countHour} giờ `);
    } else if (timeCurrent > 60000) {
      while (timeCurrent > 60000) {
        countMinite = countMinite + 1;
        timeCurrent = timeCurrent - 60000;
      }
      return (timeLocal = timeLocal + `${countMinite} phút `);
    } else {
      return (timeLocal = timeLocal + "Vừa xong");
    }
  },
};

/**
 * Controller xử lý trang chủ
 * Render file views/index.ejs
 */
const getHomepage = async (req, res) => {
  return res.render("index.ejs");
};

module.exports = {
  getHomepage,
};

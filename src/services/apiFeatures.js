/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // Search thru a specified keyword in the query string (e.g. ?name=laptop)

  search(query) {
    const keyword = this.queryStr.keyword
      ? {
          // if a keyword exists, search it thru this regex.
          title: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};
    console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = APIFeatures;

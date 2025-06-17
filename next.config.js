// next.config.js
module.exports = {
  async middleware() {
    return {
      source: '/:path*',
      destination: '/',
    };
  },
};

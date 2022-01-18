
// const exclusionList = require("metro-config/src/defaults/exclusionList");
 
// module.exports = {
//   resolver: {
//     blacklistRE: exclusionList([/amplify\/#current-cloud-backend\/.*/]),
//   },

//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
// };

const blacklist = require('metro-config/src/defaults/blacklist')
module.exports = {
  resolver: {
    blacklistRE: blacklist([/#current-cloud-backend\/.*/]),
  },
};
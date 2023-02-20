export const environment = {
  production: true,  
  apiUrl: 'http://103.204.131.217:3006/api/',
  ageDiff : 18,
  defaultDate: "february 01 1950 00:00",
  minYear: "1950",
  yearRange: "2022:2060",
  yearDiff: 1,
  pagination: [10, 20, 50, 100, 1000, { showAll: 'All' }],
  productUploadUrl: 'http://103.204.131.217:3006/upload/',
  uploadUrl: 'src/public/uploads/cmsPic/',
  imageSize: 2000000,
  videoSize: 20000000,
  frontEnd: {
    domain: 'http://103.204.131.217:4200',
    picPath: 'http://103.204.131.217:3004',
  },
  picture: {
    profilePicFolder: 'src/public/uploads/profilepic/',
    showPicFolderPath: 'uploads/profilepic/',
    defaultPicFolderPath: 'images/',
    bannerImageFolder: 'src/public/uploads/bannerimage/',
    showBannerPicFolderPath: 'uploads/bannerimage/',
  },
  api: {
    port: 3006,
    root: '/api',
  },
  maxVenuePrice: 1000000,
  minVenuePrice: 10000,
  capacity: [
    {
      'id': 1, 'label': "30-80", condition: 'lte', value: 80, status: false
    },
    {
      'id': 2, 'label': "30-100", condition: 'lte', value: 100, status: false
    },
    {
      'id': 3, 'label': "30-200", condition: 'lte', value: 200, status: false
    },
    {
      'id': 4, 'label': "30-300", condition: 'lte', value: 300, status: false
    },
    {
      'id': 5, 'label': "30-400", condition: 'lte', value: 400, status: false
    },
    {
      'id': 6, 'label': "30-500", condition: 'lte', value: 500, status: false
    },
    {
      'id': 7, 'label': "30-600", condition: 'lte', value: 600, status: false
    },
    {
      'id': 8, 'label': "30-700", condition: 'lte', value: 700, status: false
    },
    {
      'id': 10, 'label': "30-800", condition: 'lte', value: 800, status: false
    },
    {
      'id': 11, 'label': "30-900", condition: 'lte', value: 900, status: false
    },
    {
      'id': 12, 'label': "30-1000", condition: 'lte', value: 1000, status: false
    },
    {
      'id': 13, 'label': "30-1200", condition: 'lte', value: 1200, status: false
    },
    {
      'id': 14, 'label': "30-1300", condition: 'lte', value: 1300, status: false
    },
    {
      'id': 15, 'label': "30-1400", condition: 'lte', value: 1400, status: false
    },
    {
      'id': 16, 'label': "30-1500", condition: 'lte', value: 1500, status: false
    },
    {
      'id': 17, 'label': "Above 1500", condition: 'gte', value: 1600, status: false
    },
  ],
};

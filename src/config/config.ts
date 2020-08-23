
export const config = {
    apiKey: "<Your key here>",
    authDomain: "<Your key here>",
    databaseURL: "<Your key here>",
    projectId: "<Your key here>",
    storageBucket: "<Your key here>",
    messagingSenderId: "<Your key here>"
};

export const payPalEnvironmentSandbox = '<Your key here>';

export const webClientId = '<Your key here>';

export const admobAndroid = {
    banner:       '<Your key here>',
    interstitial: '<Your key here>',
    videos:       '<Your key here>'
};

export const admobIOS = {
    banner: '<Your key here>',
    interstitial: '<Your key here>',
    videos: '<Your key here>'
};

//these are the images for the slides on the login pwa
export const imagesSlide = [{ "src": "./assets/slide1.png" },
    { "src": "./assets/slide3.png" },
    { "src": "./assets/slide4.png" },
    { "src": "./assets/slide5.png" }];

export const stripeKey = "<Your key here>";//use test key from your account on stripe.com published key

export const stripeBackendEndPoint = 'http://192.168.1.12:3333/processpay';

export const wordPressUrl = 'https://jomendez.com/wp-json/';

export const ApiAIPlugin = '<Your key here>';

export const youtubeApiKey = '<Your key here>';//reminder: also remove it on the config.xml

export const azureFaceRecognitionApi = '<Your key here>';

export const googleCloudVisionAPIKey = '<Your key here>';

export const googleMapsApi = '<Your key here>';


//---------Appointment Application-------
export const imagesSlideAppt = [{ "src": 'https://lh5.googleusercontent.com/p/AF1QipOjORyT80BtrnDuEMDt8OMg8liqSUmTu-7N8x9i=s396-k-no' },
{ "src": 'https://geo3.ggpht.com/cbk?output=thumbnail&panoid=FH9MrtJRfBDnM0n9Q1HA0w&minw=535&minh=264&thumb=2&yaw=187.54257&pitch=0' },
{ "src": 'https://lh5.googleusercontent.com/p/AF1QipM5fH3-WbsQIK9P7viqM7PNMlsr5DXx4jsjpe8e=s396-k-no' },
{ "src": 'https://lh5.googleusercontent.com/p/AF1QipMjX2IUVf5_-_Y4Q3wnxYFiT14BWeqXmjnrXC79=s396-k-no' }];

export const mapInfo = {
    photos: [
      'https://lh5.googleusercontent.com/p/AF1QipOjORyT80BtrnDuEMDt8OMg8liqSUmTu-7N8x9i=s396-k-no',
      'https://geo3.ggpht.com/cbk?output=thumbnail&panoid=FH9MrtJRfBDnM0n9Q1HA0w&minw=535&minh=264&thumb=2&yaw=187.54257&pitch=0',
      'https://lh5.googleusercontent.com/p/AF1QipM5fH3-WbsQIK9P7viqM7PNMlsr5DXx4jsjpe8e=s396-k-no',
      'https://lh5.googleusercontent.com/p/AF1QipMjX2IUVf5_-_Y4Q3wnxYFiT14BWeqXmjnrXC79=s396-k-no',
      'https://lh5.googleusercontent.com/p/AF1QipMIcUPlb-UEsQLG1IlN8nUI7R02ighR8IBHcU1w=s252-k-no',
      'https://lh5.googleusercontent.com/p/AF1QipNvgBs89hiNAP9hNGBx0gZoV-HzlVlxavFh69lN=s142-k-no',
      'https://lh5.googleusercontent.com/p/AF1QipNPb6mQ-v5Kfb1Pm92_JYwHFimu4DDEmND194WT=s396-k-no'
    ],
    address: '9628 Coral Way, Miami, FL 33165',
    phoneNumber: '(305) 480-2757',
    workHours:  [
      'Sunday - 9AM–3PM',
      'Monday - 9AM–7PM',
      'Tuesday - 9AM–7PM',
      'Wednesday - 9AM–7P',
      'Thursday - 9AM–7PM',
      'Friday - 9AM–7PM',
      'Saturday - 9AM–7PM',
    ],
    reviews: [{"author_name":"Alex Abreu","text":"I happened to walk in to this barber shop great !!!\nThey have my business great prices great customer services","relative_time_description":" 2 months ago","rating":4,"profile_photo_url":"https://lh5.googleusercontent.com/-Y3RSnSLKF-M/AAAAAAAAAAI/AAAAAAAAB38/k1VtH9m8b1U/w36-h36-p/photo.jpg"},{"author_name":"Scott Stewart","text":"Fernando gave me the best flat top ever. Didn't use wax and was done in less then 15 minutes. No wait and very pleasant.","relative_time_description":" a year ago","rating":5,"profile_photo_url":"https://lh5.googleusercontent.com/-6ZMyggR9oTQ/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq0wcBh6TI0c9OTqbzE5T7BrytXVrQ/w36-h36-p/photo.jpg"},{"author_name":"Will G","text":"Oye meng! Come here for a good and affordable haircut in a friendly Cuban atmosphere.","relative_time_description":" a year ago","rating":5,"profile_photo_url":"https://lh3.googleusercontent.com/-KHP3XE0iTsk/AAAAAAAAAAI/AAAAAAAAGzg/PG7ExihKfn8/w36-h36-p/photo.jpg"},{"author_name":"Rafael Ojeda","text":"El mejor lugar para un Buen corte de pelo😎\n\n(Translated by Google)\nThe best place for a good haircut😎","relative_time_description":" a month ago","rating":5,"profile_photo_url":"https://lh4.googleusercontent.com/-b_4Ms0l16wA/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq1qYZIzjah_UektjNsu2kRcXQCLhQ/w36-h36-p/photo.jpg"},{"author_name":"Manny Rodriguez","text":"","relative_time_description":" a month ago","rating":5,"profile_photo_url":"https://lh6.googleusercontent.com/-GT3Z0vUnKdY/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq00zNB_cGm9b50VnegjjgpYJKLeiA/w36-h36-p/photo.jpg"},{"author_name":"Antonio Jesus","text":"","relative_time_description":" 2 months ago","rating":5,"profile_photo_url":"https://lh5.googleusercontent.com/-W_1KGUJjV7g/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq3VJU2C8ptw2Z03hD1mrVt23Nr71Q/w36-h36-p/photo.jpg"},{"author_name":"Carlos Ruiz","text":"","relative_time_description":" 7 months ago","rating":5,"profile_photo_url":"https://lh6.googleusercontent.com/-Sq6sGgknEGs/AAAAAAAAAAI/AAAAAAAAmNQ/ArDUiVRtklE/w36-h36-p/photo.jpg"},{"author_name":"Guillermo Baragaño Pérez","text":"","relative_time_description":" a year ago","rating":5,"profile_photo_url":"https://lh6.googleusercontent.com/-0m4MTdhCRFg/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq24Ca3niAgvFTa3Ia-uxREj48Azqw/w36-h36-p/photo.jpg"},{"author_name":"Yordan Diaz","text":"","relative_time_description":" a month ago","rating":5,"profile_photo_url":"https://lh4.googleusercontent.com/-D2DB5AZLYEU/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq3a47bRcsRF5uGHLOtW2lh18aMi1Q/w36-h36-p/photo.jpg"}],
    placeId: 'ChIJm42MKMe42YgRNplq-AqQfHU',
    lon: -80.3497773,
    lat: 25.7468642
  }
  
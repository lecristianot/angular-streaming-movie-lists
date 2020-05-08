let request = require('request');
let methods: any = {};
let mainMovies = [
  {
    nfMovies: [],
    nfDetails: [],
    nfCredits: [],
    amzMovies: [],
    amzDetails: [],
    amzCredits: [],
    disneyMovies: [],
    disneyDetails: [],
    disneyCredits: []
  }
];
let searchInfo = [
  {
    results: []
  }
];
import { forkJoin } from 'rxjs';

methods.getAllMovies = async apiKey => {
  let utcDate = new Date();
  utcDate.setHours(utcDate.getHours() - 8);
  let myDate = new Date(utcDate);
  let dailyDate = myDate.toISOString().slice(0, 10);
  let apiRoot = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
  let nfUrl = `${apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=en&with_ott_monetization_types=&with_ott_providers=8&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let amzUrl = `${apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=9&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  let dPlusUrl = `${apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=${dailyDate}&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=337&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;

  let nfPromise = new Promise((resolve, reject) => {
    request(nfUrl, {}, async function(err, res, body) {
      let netflixDetails = [];
      let netflixCredits = [];
      //console.log(body, 'got body');
      if (typeof body !== 'undefined') {
        let data = JSON.parse(body);
        mainMovies[0]['nfMovies'] = data['results'];

        async function details() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixDetails.push(data);
                  if (netflixDetails.length > 1) {
                    return (mainMovies[0]['nfDetails'] = netflixDetails);
                  }
                }
              )
            )
          );
        }

        async function credits(): Promise<any> {
          
          await details();
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  netflixCredits.push(data);
                  if (netflixCredits.length > 1) {
                    mainMovies[0]['nfCredits'] = netflixCredits;
                    let result = await Promise.resolve(netflixCredits);
                  }
                }
              )
            )
          );
        }
        await credits();
        resolve();
      }
    });
  });

  let amzPromise = new Promise((resolve, reject) => {
    request(amzUrl, {}, async function(err, res, body) {
      let amazonDetails = [];
      let amazonCredits = [];

      if (typeof body !== 'undefined') {
        let data = JSON.parse(body);
        mainMovies[0]['amzMovies'] = data['results'];

        async function details() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonDetails.push(data);
                  return (mainMovies[0]['amzDetails'] = amazonDetails);
                }
              )
            )
          );
        }

        await details();

        async function credits() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  amazonCredits.push(data);
                  return (mainMovies[0]['amzCredits'] = amazonCredits);
                }
              )
            )
          );
        }

        await credits();
        resolve();
      }
    });
  });

  let dPromise = new Promise((resolve, reject) => {
    request(dPlusUrl, {}, async function(err, res, body) {
      let disneyDetails = [];
      let disneyCredits = [];

      if (typeof body !== 'undefined') {
        let data = JSON.parse(body);
        mainMovies[0]['disneyMovies'] = data['results'];

        async function details() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyDetails.push(data);
                  return (mainMovies[0]['disneyDetails'] = disneyDetails);
                }
              )
            )
          );
        }

        await details();

        async function credits() {
          forkJoin(
            data['results'].map(async m =>
              request(
                `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`,
                {},
                async function(err, res, body) {
                  let data = await JSON.parse(body);
                  disneyCredits.push(data);
                  return (mainMovies[0]['disneyCredits'] = disneyCredits);
                }
              )
            )
          );
        }

        await credits();
        resolve();
      }
    });
  });

  let result = await nfPromise;
  let result2 = await amzPromise;
  let result3 = await dPromise;
  return mainMovies;
};

methods.search = async (id, apiKey) => {
  let apiUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`;
  let searchPromise = new Promise((resolve, reject) => {
    request(apiUrl, {}, function(err, res, body) {
      let data = JSON.parse(body);
      searchInfo[0].results = data['results'];
      resolve();
    });
  });
  let result = await searchPromise;
  return searchInfo[0];
};

exports.data = methods;

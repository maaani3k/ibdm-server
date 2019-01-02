const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const dropTable = require('../modules/drop');

const cheerio = require('cheerio');
const rp = require('request-promise');

let url = 'https://www.imdb.com/search/title?genres=action&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=TE1MQPPKCE421N095KV7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1';


// handling extract request
router.post('/extract', function (req, res) {
  url = req.body.url;

  //server obsługujący zapytanie extract

  rp(url) // dostajesz POST z aplikacji
    .then(function (html) {
      let $ = cheerio.load(html); // funkcja pobierająca dane z html'a

      let moviesArray = []; // tworzy zmienną tablicową

      $('#main > div > div.lister.list.detail.sub-list > div > div') // tworzy element film
        .each((index, element) => {
          const rank = $(element) // wyciąga poszczególne dane tutaj ranking
            .find('div.lister-item-content > h3 > span.lister-item-index.unbold.text-primary')
            .text()
            .replace('.', '');
          const title = $(element)
            .find('div.lister-item-content > h3 > a')
            .text();
          const link = 'https://www.imdb.com' + $(element)
            .find('div.lister-item-content > h3 > a')
            .attr('href');
          const year = $(element)
            .find('div.lister-item-content > h3 > span.lister-item-year.text-muted.unbold')
            .text();
          const runtime = $(element)
            .find('div.lister-item-content > p:nth-child(2) > span.runtime')
            .text();
          const rating = $(element)
            .find('div.lister-item-content > div > div.inline-block.ratings-imdb-rating > strong')
            .text();
          const director = $(element)
            .find('div.lister-item-content > p:nth-child(5) > a:nth-child(1)')
            .text();
          const description = $(element)
            .find('div.lister-item-content > p:nth-child(4)')
            .text().trim();
          const votes = $(element)
            .find('div.lister-item-content > p.sort-num_votes-visible > span:nth-child(2)')
            .text();
          const income = $(element)
            .find('div.lister-item-content > p.sort-num_votes-visible > span:nth-child(5)')
            .text()
            .replace("$", '')
            .replace("M", " M$");
          const image = $(element)
            .find('div.lister-item-image.float-left > a > img')
            .attr('src');
          const actors = $(element)
            .find('div.lister-item-content > p:nth-child(5) > a:not(:first-child)')
            .text()
            .replace(/([A-Z])/g, ' $1').trim();

          moviesArray.push({ // wrzuca do tablicy
            index: index,
            rank: rank,
            title: title,
            year: year,
            director: director,
            runtime: runtime,
            description: description.replace(/(\r\n\t|\n|\r\t)/gm, ""),
            rating: rating,
            votes: votes,
            income: income,
            link: link,
            image: image,
            actors: actors
          })
        })

      res.send(moviesArray) // przesłanie tablicy z servera do aplikacji
    });
});

// handling transform request
router.post('/transform', function (req, res) {
  let movieData = req.body;

  transformedMoviesArray = []; // tworzę tablicę z przetransformowanymi filmami

  movieData.forEach(element => { // dla każdej zmiennej tablicy tworzę obiekt zgodnie ze schematem reprezentacji w aplikacji

    let movie = new Movie({
      index: element.index,
      rank: element.rank,
      title: element.title,
      year: element.year,
      director: element.director,
      runtime: element.runtime,
      description: element.description,
      rating: element.rating,
      votes: element.votes,
      income: element.income,
      link: element.link,
      image: element.image,
      actors: element.actors
    })
    transformedMoviesArray.push(movie);
  })

  res.send(transformedMoviesArray); // wysyła do aplikacji
});

// handling load request
router.post('/load', function (req, res) { // dostajesz przetransformowane dane o filmach i ładujesz do bazy danych
  let movieData = req.body;

  let moviesArray = []; // tworzy tablicę z filmami

  movieData.forEach(element => {
    let movie = new Movie(element); // towrzy nowy film ze schematu "Movie"

    moviesArray.push(element);

    Movie.findOne({
      'link': movie.link,
    },
      function (err, dbMovie) { // funkcja nadpisująca zmiany dotyczące filmu i zapisuje w bazie
        // hanlde err..
        if (dbMovie) {
          movie = new Movie(dbMovie);
          console.log('saved', movie.link)
          movie.save();
        } else {
          movie.save();
        }
      })
  })

  res.send(moviesArray); // wrzuca do tablicy
});



// handling etl request
router.get('/etl', function (req, res) { //tak jak wyżej tylko po chuj ale jest

  rp(url)
    .then(function (html) {

      let $ = cheerio.load(html);
      let moviesArray = [];

      $('#main > div > div.lister.list.detail.sub-list > div > div')
        .each((index, element) => {
          const rank = $(element)
            .find('div.lister-item-content > h3 > span.lister-item-index.unbold.text-primary')
            .text()
            .replace('.', '');
          const title = $(element)
            .find('div.lister-item-content > h3 > a')
            .text();
          const link = 'https://www.imdb.com' + $(element)
            .find('div.lister-item-content > h3 > a')
            .attr('href');
          const year = $(element)
            .find('div.lister-item-content > h3 > span.lister-item-year.text-muted.unbold')
            .text();
          const runtime = $(element)
            .find('div.lister-item-content > p:nth-child(2) > span.runtime')
            .text();
          const rating = $(element)
            .find('div.lister-item-content > div > div.inline-block.ratings-imdb-rating > strong')
            .text();
          const director = $(element)
            .find('div.lister-item-content > p:nth-child(5) > a:nth-child(1)')
            .text();
          const description = $(element)
            .find('div.lister-item-content > p:nth-child(4)')
            .text().trim();
          const votes = $(element)
            .find('div.lister-item-content > p.sort-num_votes-visible > span:nth-child(2)')
            .text();
          const income = $(element)
            .find('div.lister-item-content > p.sort-num_votes-visible > span:nth-child(5)')
            .text()
            .replace("$", '')
            .replace("M", " M$");
          const image = $(element)
            .find('div.lister-item-image.float-left > a > img')
            .attr('src');
          const actors = $(element)
            .find('div.lister-item-content > p:nth-child(5) > a:not(:first-child)')
            .text()
            .replace(/([A-Z])/g, ' $1').trim();

          var movie = new Movie({
            index: index,
            rank: rank,
            title: title,
            year: year,
            director: director,
            runtime: runtime,
            description: description.replace(/(\r\n\t|\n|\r\t)/gm, ""),
            rating: rating,
            votes: votes,
            income: income,
            link: link,
            image: image,
            actors: actors
          })

          moviesArray.push(movie);

          Movie.findOne({
            'title': title,
          },
            function (err, dbMovie) {
              if (dbMovie) {
                movie = dbMovie;
                movie.save();
              } else {
                movie.save();
              }
            })
        });

      res.json(moviesArray)
    })
    .catch(function (err) {
      console.log(err);
    });
});

// drop table function czyli kasuje tabelę z bazy danych i servera
router.get('/drop', function (req, res) {
  let data = { // tworzy zmienną liczącą filmy które usuwamy
    movieCount: 0
  };

  Movie.find({}, function (error, movies) { // funkcja przeszukująca bazę danych i zliczająca wystąpienia wszystkich pozycji
    movies.forEach(function (movie) {
      data.movieCount++;
    });
  })
    .then(() => {
      res.json(data); // wysyła liczbę do aplikacji
    });
  dropTable(); // usuwa tabelę
})

module.exports = router;

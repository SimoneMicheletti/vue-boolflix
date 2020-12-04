var app = new Vue ({
  el: "#app",

  data: {
    arrayFilm: [],
    page: 1,
    totalPages: 1,
    query: "",
    searchKey: "",
    filmSel: {id:""},
    filterMovTv: "movietv",
    genres: [],
    filterGenres: "",
    myListId: [],
    myListType: []
  },

  mounted: function() {
    this.homePage();
    this.reqGenres();
  },

  methods: {

    // Funzione aggiornare film mostrati
    updateFilm() {
      this.arrayFilm = [];
      // se è una nuova ricerca azzero pagine e aggiorno query
      if (this.searchKey != "") {
        this.query = this.searchKey
        this.page = 1;
        this.totalPages = 1;
      }
      // altrimenti è un cambio pagina
      this.searchKey = "";
      this.searchAPI("movie")
      this.searchAPI("tv")
    },

    // search API
    searchAPI(movieTv) {
      axios.get("https://api.themoviedb.org/3/search/" + movieTv + "?api_key=3c7831140b3840fb6c05d908251a82a8&language=it-IT", {
        params: { query: this.query, page: this.page }})
      .then(resp => {
        this.totalPages < resp.data.total_pages ? this.totalPages = resp.data.total_pages : this.total_pages
        resp.data.results.forEach(item => Vue.set(item, "type", movieTv))
        this.arrayFilm = [...this.arrayFilm, ...resp.data.results]
      })
    },

    // Funzione per sostituire poster mancante
    replacePoster(event) {
      event.target.src = "img/randomPoster.jpg"
    },

    // Funzione Next page
    nextPage() {
      this.page++
      this.updateFilm()
    },

    // Funzione Prev page
    prevPage() {
      this.page--
      this.updateFilm()
    },

    // Funzione Home Page
    homePage() {
      this.query = "marvel";
      this.page = 1;
      this.totalPages = 1;
      this.filterMovTv = "movietv";
      this.filterGenres = "";
      this.updateFilm();
      this.query = "";
    },

    // Dettagli Film API Genere e Cast
    reqDetails(index) {
      this.filmSel = this.arrayFilm[index]
      axios.get("https://api.themoviedb.org/3/" + this.filmSel.type + "/" + this.filmSel.id + "?api_key=3c7831140b3840fb6c05d908251a82a8&language=it-IT")
      .then(resp => Vue.set(this.filmSel, "genres", resp.data.genres))
      axios.get("https://api.themoviedb.org/3/" + this.filmSel.type + "/" + this.filmSel.id + "/credits?api_key=3c7831140b3840fb6c05d908251a82a8&language=it-IT")
      .then(resp => Vue.set(this.filmSel, "cast", resp.data.cast))
    },

    // Funzione rimuovore focus film
    removeFilmSel() {
      this.filmSel = {id:""}
    },

    // Funzione toggle my list
    toggleMyList(type) {

      // rimuovi dalla lista in pagina normale
      if (this.myListId.includes(this.filmSel.id)) {
        this.myListId.forEach((item,i) => {
          if (item === this.filmSel.id) {
            Vue.delete(this.myListId, i)
            Vue.delete(this.myListType, i)
          }
        });
        // se sono nella pagina "mia lista" refresh pagina
        if (this.query === "^^") {
          this.showMyList();
          this.removeFilmSel();
        }
      // aggiungi alla mia lista
      } else {
        // mi salvo id e tipologia film selezionato
        this.myListId.push(this.filmSel.id)
        this.myListType.push(type)
      }

    },

    // Funzione show my List
    showMyList(){
      this.query = "^^"
      this.arrayFilm = [];
      // ciclo tutti gli id presenti nel all'array dei film salvati passandogli ad ogni chiamata l'id specifico e la relativa tipologia
      this.myListId.forEach((item,i) => {
        axios.get("https://api.themoviedb.org/3/" + this.myListType[i] + "/" + item + "?api_key=3c7831140b3840fb6c05d908251a82a8&language=it-IT")
        .then(resp => {
          // aggiungo al risultato la tipologia
          Vue.set(resp.data, "type", this.myListType[i])
          // trasformo il risoltato genre.id in genre_ids per permettermi il filtraggio
          Vue.set(resp.data, "genre_ids", [])
          resp.data.genres.forEach(item => resp.data.genre_ids.push(item.id));
          //push in arrayFilm e visualizzo a schermo
          this.arrayFilm.push(resp.data)
        })
      });
    },

    // API Genere
    // richiedo tutti igeneri possibili per movie e tv
    reqGenres() {
      axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=3c7831140b3840fb6c05d908251a82a8&language=it-IT")
      .then(resp => this.genres = resp.data.genres)
      axios.get("https://api.themoviedb.org/3/genre/tv/list?api_key=3c7831140b3840fb6c05d908251a82a8&language=it-IT")
      .then(resp => this.genres = [...this.genres, ...resp.data.genres])
    },

  },
})

{
    let view = {
        el: 'section.remd_song',
        render(data) {
            let { songs } = data
            songs.map((song) => {
                let $li = $(
                    `<li>
                    <div class="song-container">
                        <h3>${song.name}</h3>
                        <p><svg class="icon" aria-hidden="true"><use xlink:href="#icon-sq"></use></svg>
                        ${song.singer}
                        </p>
                    </div>
                    <a href="./song.html?id=${song.id}">
                        <div class="icon-play"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-play"></use></svg></div>
                    </a>
                    </li>`)
                $(this.el).find('ol.newSongs').append($li)
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {                      //model.find()返回的是一个Promise对象，所以有.then()方法
                console.log(songs)
                this.data.songs = songs.map((song) => {                  //songs:[{id,name,url,singer},...]
                    return { id: song.id, ...song.attributes }
                })
                console.log(this.data.songs)
                return songs
            })
        }
    }
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view
            this.model = model
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
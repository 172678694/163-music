{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data) {                                          //作用：接受一个<歌曲>数组，生成ul ; 实现高亮
            let $el = $(this.el)                                //let $el=$('.songList-container')
            $el.html(this.template)                             //this === view 
            let {songs,selectedSongId} = data                   //data [歌曲] [{name,singer,url,id},...]
            let liList = songs.map((song)=>{
                let singer = song.singer
                let $li= $('<li></li>').attr('data-song-id',song.id)
                let $iconDiv = $('<div></div>').attr('class',"icon-cd")
                let html1='<svg class="icon" aria-hidden="true"><use xlink:href="#icon-cd"></use></svg>'
                $iconDiv.html(html1)
                let $songDiv=$('<div></div>').attr('class',"song-container")
                let $h3 = $('<h3></h3>').text(song.name)
                let $p = $('<p></p>')
                let html2 = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-sq"></use></svg>'+ singer
                $p.html( html2)
                $songDiv.append($h3,$p)
                $li.append($iconDiv,$songDiv)
                if(song.id === selectedSongId){
                     $li.addClass('active')
                 }
                return $li
            })
            $el.find('ul').empty()                              //清空ul
            liList.map((domLi)=>{                               //往ul里append所有<li>
                $el.find('ul').append(domLi)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model={                                                       //model = 数据中心
        data:{                                                        //一个模块的data的数据结构很重要
            songs:[ ],                                                                                                               //song-form模块第一次提交后song-list的data：songs[{name:'1',singer:'2',url:'3',id:''}]
            selectedSongId: undefined,                                                                                                               //songs[{name:'1',singer:'2',url:'3',id:''},ADDR109]
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{                      //model.find()返回的是一个Promise对象，所以有.then()方法
                this.data.songs=songs.map((song)=>{                  //songs:[{id,name,url,singer},...]
                    return {id:song.id,...song.attributes}   
                })
                return songs
            })
        }
    }
    let controller = {
        view: null,
        model: null,
        init(view,model) {
            this.view = view                                //this === controller
            this.model = model
            this.bindEvents()                               //绑定事件
            this.bindEventHub()
            this.getAllSongs()
        },
        getAllSongs(){
            this.model.find().then(()=>{
              this.view.render(this.model.data)
            })
        },
        bindEvents(){                                       //当点击歌曲时自身高亮&通知song-form展示对应信息
            $(this.view.el).on('click','li',(e)=>{
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedSongId = songId
                this.view.render(this.model.data)
                let selectedSong
                let songs = this.model.data.songs
                for(i=0;i<songs.length;i++ ){
                    if(songs[i].id === songId){
                        selectedSong = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select',JSON.parse(JSON.stringify(selectedSong)))  //传selectedSong
            })
        },
        bindEventHub(){
            window.eventHub.on('create', (songData) => {    //监听'create'                                                                        //ADDR109
                this.model.data.songs.push(songData)        //更新model
                this.view.render(this.model.data)           //重新render
            })
            window.eventHub.on('update',(songData)=>{
                console.log('song-list监听到了song-form的update')
                let songs = this.model.data.songs
                for(i=0;i<songs.length;i++){
                    if(songs[i].id === songData.id){
                        songs[i] = songData
                        break
                    }
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
                this.model.data.selectedSongId = undefined
            })
        }
    }
    controller.init(view, model)                            //init()作为controller的方法，它的this指向controller
}
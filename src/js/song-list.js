{
    let view={
        el:'.songList-container',
        template:`
        <ul class="songList">
        </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let {songs} = data
            let liList=songs.map((song)=>$('<li></li>').text(song.name))
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        }
    }
    let model = {
        data:{
            songs:[] //song-form模块第一次提交后song-list的data：songs[{name:'1',singer:'2',url:'3',id:''}]
            //songs[{name:'1',singer:'2',url:'3',id:''},ADDR109]
        }
    }
    let controller = {
        view:null,
        model:null,
        init(){
            this.view = view
            this.model = model
            window.eventHub.on('create',(songData)=>{ //ADDR109
                console.log("songData")
                console.log(songData)
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
                console.log("this.model.data")
                console.log(this.model.data)
            })
            
        }
    }
    controller.init(view,model)
}
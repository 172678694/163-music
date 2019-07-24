{
    let view={
        el:'#app',
        template:``,
        init(){
            this.$el=$(this.el)
        },
        render(data){
            let {song,status}=data
            if(this.$el.find('audio').attr('src') !== song.url){
                this.$el.find('.shadow').css('background-image',`url(${song.cover})`)
                this.$el.find('.cover').attr('src',song.cover)
                let audio = this.$el.find('audio').attr('src', song.url).get(0)
                this.$el.find('.lyrics>h1').text(song.name)
                
                let string = song.lyrics
                string.split('\n').map((string)=>{
                    let p = document.createElement('p')
                    let regex = /\[([\d:.]+)\](.+)/
                    let matches =string.match(regex)
                    if(matches){
                        p.textContent = matches[2]
                        let array=matches[1].split(':')
                        let mins=array[0]
                        let seconds=array[1]
                        let newTime=parseInt(mins)*60+parseFloat(seconds)
                        $(p).attr('data-time', newTime)
                    }else{
                        p.textContent = string 
                    }
                    $('.lines').append(p)
                })                
              }
            if(status === 'playing'){
                this.$el.find('.disc').addClass('playing')
            }else if((status === 'paused')){
                this.$el.find('.disc').removeClass('playing')
            } 
        },
        play(){
            let audio =  this.$el.find('audio')[0]
            audio.play().catch(function(){
            })
        },
        pause(){
            let audio =  this.$el.find('audio')[0]
            audio.pause()
        },
        showLyric(time,lastP){
            let $allP=this.$el.find('.lines>p')
            let currentP
            for(i=0;i<$allP.length;i++){
                if(i===$allP.length-1){
                    currentP=$allP[i]
                    break
                }else{
                    let prevTime=$allP.eq(i).attr('data-time')
                    let nextTime=$allP.eq(i+1).attr('data-time')
                    if(prevTime<=time&&time<=nextTime){
                        currentP=$allP[i]
                        break
                    }   
                }
            }
            
            $(currentP).addClass('active').siblings('.active').removeClass('active')
            if(currentP!==lastP){
                window.eventHub.emit('selectP',currentP)
                
                this.$el.find('.lines').css('transform',`translateY(${-(24*i-24)}px)`)
            }
        }             
            // let height
            // if(i===0){
            //     height=$allP.eq(i).offset().top
            // }else{
            //   height= $allP.eq(i).offset().top - $('.lines-container').offset().top

            //   this.$el.find('.lines').css('transform',`translateY(${-height}px)`)
            //    break              
        
    }
    let model={
        data:{
            song:{
                id:'',
                name:'',
                singer:'',
                url:'',
                cover:'',
                lyrics:''
            },
            status:'paused',
            currentP:null
        },
        getSong(id){
            var query = new AV.Query('Song')
            return query.get(id).then((song)=>{
                Object.assign(this.data.song, {id:song.id,...song.attributes})
                return song
            })
        }
    }
    let controller={
        init(){
            this.view=view
            this.view.init()
            this.model=model
            let id = this.getId()
            this.model.getSong(id).then((song)=>{
                // 从id拿到歌曲信息后，即渲染封面及背景
               this.view.render(this.model.data)
               
            })
            this.bindEvents()
        },
        getId(){
            let search = window.location.search
            if(search[0]==='?'){
                search=search.substring(1)
            }
            let array = search.split('&').filter((v=>v))
            let id 
            for(i=0;i<array.length;i++){
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                 id = value
                 break
                }
            }
            return id
        },
        bindEvents(){
            $(this.view.el).on('click', '.icon-play', ()=> { 
                this.model.data.status='playing'
                this.view.render(this.model.data)
                // 页面的事情交给VIEW，调用circle(),使唱片转动
                // this.view.circle()
                //播放按钮消失，暂停按钮出现
                // this.view.showPausebutton()
                this.view.play()
                
              })
              $(this.view.el).on('click', '.icon-pause', ()=> {
                this.model.data.status='paused'
                this.view.render(this.model.data)
                // this.view.stopcircle()
                // this.view.showPlaybutton()
                this.view.pause()
              })
              $(this.view.el).find('audio').get(0).onended=()=>{
                this.model.data.status='paused'
                this.view.render(this.model.data)
              }
              $(this.view.el).find('audio').get(0).ontimeupdate=()=>{
                  let audio=$(this.view.el).find('audio').get(0)
                  this.view.showLyric(audio.currentTime,this.model.data.currentP)
                  window.eventHub.on('selectP',(currentP)=>{
                      this.model.data.currentP=currentP
                  })
              }
        }
    }
    controller.init(view,model)
}

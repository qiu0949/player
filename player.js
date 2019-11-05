const log = console.log.bind(console)

const e = (selector) => {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `选择器 ${selector} 写错了, 请仔细检查并且复习三种基本的选择器`
        alert(s)
        return null
    } else {
        return element
    }
}

const bindEvent = (element, eventName, callback) => {
    element.addEventListener(eventName, callback)
}

let id = 0

const toggleHide = () => {
    let play = e('.img-play')
    let pause = e('.img-pause')
    play.classList.toggle('hide')
    pause.classList.toggle('hide')
}

const toggleMute = () => {
    let mute = e('.img-mute')
    let speak = e('.img-speak')
    mute.classList.toggle('hide')
    speak.classList.toggle('hide')
}

const bindEventPlay = (audio) => {
    let play = e('.img-play')
    let a = audio
    bindEvent(play, 'click',  () => {
        a.volume = 0.5
        a.play()
        toggleHide()
    })
}

const bindEventPause = (audio) => {
    let pause = e('.img-pause')
    let a = audio
    bindEvent(pause, 'click', () => {
        a.pause()
        toggleHide()
    })
}

const changeName = (url) => {
    let u = url
    let index = u.indexOf('c/')
    let index2 = u.indexOf('.')
    let totalName = u.slice(index + 2, index2)
    let names = totalName.split(' - ')
    let song_name = e('.song-name')
    let artist_name = e('.artist-name')
    song_name.innerText = names[0]
    artist_name.innerText = names[1]
}

const changeImg = (active) => {
    let a = e('.album')
    let imgList = {
        1: 'url("imgs/music/Blood Rage - David Vives.jpg',
        2: 'url("imgs/music/It Is Well - Bethel Music.jpg")',
        3: 'url("imgs/music/soda city funk - Tim Legend.jpg")'
    }
    let url = imgList[active]
    if (url !== undefined) {
        a.style.backgroundImage = url
    }
    changeName(url)
}

const bindEventNext =  (audio) => {
    let a = audio
    let next = e('.img-next')
    let pause = e('.img-pause')
    bindEvent(next,'click', () => {
        let active = Number(a.dataset.active) + Number(next.dataset.active)
        if (active === 3) {
            active = 0
        }
        a.dataset.active = String(active)
        a.src = `audio/${active + 1}.mp3`
        if (pause.classList.contains('hide')) {
            toggleHide()
        }
        changeImg(active + 1)
        cleanInterval()
    })
}

const bindEventBack = (audio) => {
    let a = audio
    let back = e('.img-back')
    let pause = e('.img-pause')
    bindEvent(back,'click', () => {
        let active = Number(a.dataset.active) + Number(back.dataset.active)
        if (active === -1) {
            active = 2
        }
        a.dataset.active = String(active)
        a.src = `audio/${active + 1}.mp3`
        if (pause.classList.contains('hide')) {
            toggleHide()
        }
        changeImg(active + 1)
        cleanInterval()
    })
}

const getTime = (time) => {
    let t = time
    let minute = parseInt(t / 60)
    let second = parseInt(t - minute * 60)
    let minStr = String(minute)
    let secStr = String(second)
    let finalTime = ""
    if (minStr.length > 1 && secStr.length > 1) {
        finalTime = `${minute}:${second}`
    } else if (secStr.length > 1) {
        finalTime = `0${minute}:${second}`
    } else if (minStr.length > 1) {
        finalTime = `${minute}:0${second}`
    } else {
        finalTime = `0${minute}:0${second}`
    }
    return finalTime
}

const setDuration = (audio) => {
    let a = audio
    let duration = a.duration
    let time = getTime(duration)
    let total = e('.time--total')
    total.innerText = time
    return duration
}

const setCurrent = (audio) => {
    let a = audio
    let current = a.currentTime
    let time = getTime(current)
    let currentTime = e('.time--current')
    currentTime.innerText = time
    return current
}

Number.prototype.toPercent = function(){
    return (Math.round(this * 10000)/100).toFixed(0) + '%';
}

const setBar = (current, duration) => {
    let c = parseInt(current)
    let total = parseInt(duration)
    let bar = e('.fill')
    let len = (c / total).toPercent()
    bar.style.width = `${len}`
}

const runInterval = (audio) => {
    let a = audio
    let interval = 1000
    let id = setInterval(() => {
        let duration = setDuration(a)
        let current = setCurrent(a)
        setBar(current, duration)
    }, interval)
    getCleanId(id)
    log('id', id)
}

const getCleanId = (clearId) => {
    id = clearId
}

const cleanInterval = () => {
    clearInterval(id)
}

const bindEventCanplay = (audio) => {
    let a = audio
    a.addEventListener('canplay', () => {
        cleanInterval()
        runInterval(a)
        a.play()
    })
}

const nextMusic = (audio) => {
    let a = audio
    let active = Number(a.dataset.active)
    let next = active + 1
    if (next === 3) {
        next = 0
    }
    let path = `audio/${next + 1}.mp3`
    a.src = path
    a.dataset.active = String(next)
    changeImg(next + 1)
}

const choice = (number) => {
    let n = number
    let index = parseInt(Math.random() * 10)
    let rand = index % n
    return rand
}

const randMusic = (audio) => {
    let a = audio
    let active = choice(3)
    let path = `audio/${active + 1}.mp3`
    a.src = path
    changeImg(active + 1)
    a.dataset.active = String(active)
}

const bindEventEnded = (audio) => {
    let a = audio
    let modeList = {
        'next': nextMusic,
        'shuffle': randMusic,
    }
    a.addEventListener('ended', () => {
        let mode = a.dataset.mode
        if (mode !== undefined) {
            modeList[mode](a)
        }
        cleanInterval()
    })
}

const bindEventOver = (info) => {
    bindEvent(info, 'mouseover', () => {
        info.style.transform = 'translateY(1px)'
    })
}

const bindEventOut = (info) => {
    bindEvent(info, 'mouseout', () => {
        info.style.transform = 'translateY(35px)'
    })
}

const bindEventShuffle = (audio) => {
    let rand = e('.img-shuffle')
    bindEvent(rand, 'click', () => {
        let tran = rand.style.transform
        let scale = 'scale(1.05)'
        if (tran === scale) {
            audio.dataset.mode = 'next'
            rand.style.transform = 'scale(1)'
        } else {
            audio.dataset.mode = 'shuffle'
            rand.style.transform = scale
        }
    })
}

const bindEventMute = (audio) => {
    let a = audio
    let mute = e('.img-mute')
    bindEvent(mute, 'click', () => {
        a.muted = false
        toggleMute()
    })
}

const bindEventSpeak = (audio) => {
    let a = audio
    let speak = e('.img-speak')
    bindEvent(speak, 'click', () => {
        a.muted = true
        toggleMute()
    })
}

const bindEvents = () => {
    let audio = e('#id-audio')
    toggleHide()
    bindEventCanplay(audio)
    bindEventPlay(audio)
    bindEventPause(audio)
    bindEventNext(audio)
    bindEventBack(audio)
    bindEventEnded(audio)
    bindEventShuffle(audio)
    bindEventSpeak(audio)
    bindEventMute(audio)
    let info = e('.info')
    bindEventOver(info)
    bindEventOut(info)
}

const __main = () => {
    bindEvents()
}

__main()
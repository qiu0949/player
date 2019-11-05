const bindEventPlay = function(audio) {
    let button = e('#id-button-play')
    let a = audio
    button.addEventListener('click', function () {
        changeActive(a.dataset.active)
        a.play()
    })
}

const bindEventPause = function(audio) {
    let a = audio
    let button = e('#id-button-pause')
    button.addEventListener('click', function() {
        a.pause()
    })
}

const getTime = function(time) {
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

const setDuration = function(audio) {
    let a = audio
    let duration = a.duration
    let time = getTime(duration)
    let total = e('#id-span-duration')
    total.innerText = time
}

const setCurrent = function(audio) {
    let interval = 1000
    setInterval(function() {
        let a = audio
        let current = a.currentTime
        let time = getTime(current)
        let currentTime = e('#id-span-currentTime')
        currentTime.innerText = time
    }, interval)
}

const bindEventCanplay = function(audio) {
    let a = audio
    a.addEventListener('canplay', function() {
        setDuration(a)
        setCurrent(a)
    })
}

const changeActive = function(index) {
    removeClassAll('active')
    let bars = es('.music-list')
    bars[index].classList.add('active')
}

const bindEventSwitchmusic = function(audio) {
    let a = audio
    bindAll('.music-list', 'click', function(event) {
        let self = event.target
        let index = self.dataset.index
        changeActive(index)
        let path = self.dataset.path
        a.src = path
        a.dataset.active = self.dataset.index
        a.play()
    })
}

const getMusicList = function() {
    let paths = []
    let ms = es('.music-list')
    for (let i = 0; i < ms.length; i++) {
        let path = ms[i].dataset.path
        paths.push(path)
    }
    return paths
}

const nextMusic = function(audio) {
    let a = audio
    let paths = getMusicList()
    let numberOfMusic = paths.length
    let activeIndex = a.dataset.active
    a.dataset.active += 1
    let nextIndex = (numberOfMusic + activeIndex + 1) % numberOfMusic
    changeActive(nextIndex)
    a.src = paths[nextIndex]
}

const choice = function(array) {
    let index = parseInt(Math.random() * 10)
    return index % array.length
}

const randMusic = function(audio) {
    let a = audio
    let paths = getMusicList()
    let index = choice(paths)
    a.src = paths[index]
    a.dataset.active = index
    changeActive(index)
}

const bindEventEnded = function(audio) {
    let a = audio
    a.addEventListener('ended', function() {
        // nextMusic(a)
        randMusic(a)
        a.play()
    })
}

const bindEvents = function() {
    let a = e('#id-audio-player')
    bindEventCanplay(a)
    bindEventPlay(a)
    bindEventPause(a)
    bindEventSwitchmusic(a)
    bindEventEnded(a)
}

const __main = function() {
    bindEvents()
}

__main()
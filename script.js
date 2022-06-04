const candyContainer = document.getElementById('candy-container')
const CandyAudios = ["Candy_land1.ogg", "Candy_land2.ogg", "Candy_land3.ogg", "Candy_land4.ogg"]
const candiesIcon = [{
    icon: "🍋",
    id: "LEMON"
}, {
    icon: "🍓",
    id: "STRAWBERRY"
}, {
    icon: "🍆",
    id: "EGGPLANT"
}]

function playSound(url) {
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = url;
    audio.autoplay = true;
    audio.onended = function () {
        audio.remove()
    };
    document.body.appendChild(audio);
}

class biusCandy {
    constructor(sizeX = 10, sizeY = 10) {
        self.items = []
        self.sizeX = sizeX
        self.sizeY = sizeY
        self.selected = []
        self.score = 0
    }

    shuffle() {
        let secondCandy = self.items[self.selected[1].x][self.selected[1].y]
        let firstCandy = self.items[self.selected[0].x][self.selected[0].y]
        let old_innerHtml = secondCandy.element.innerHTML
        let old_candy = secondCandy.candy
        secondCandy.element.innerHTML = firstCandy.element.innerHTML
        firstCandy.element.innerHTML = old_innerHtml
        secondCandy.candy = firstCandy.candy
        firstCandy.candy = old_candy
    }

    generate() {
        for (let x = 0; x < self.sizeX; x++) {
            const candyRow = document.createElement('div')
            candyRow.className = 'candy-row'

            self.items[x] = self.items[x] || []

            for (let y = 0; y < self.sizeY; y++) {
                const candyRandom = candiesIcon[Math.floor(Math.random() * candiesIcon.length)]
                const candyElement = document.createElement('div')
                candyElement.className = 'candy-item'
                candyElement.innerHTML = candyRandom.icon

                candyRow.appendChild(candyElement)

                self.items[x].push({
                    candy: candyRandom.id,
                    element: candyElement
                })

                candyElement.addEventListener('click', () => {
                    if (self.items[x][y].candy == "") return
                    self.selected.push({
                        x, y
                    })
                    candyElement.className = "candy-item active"

                    if (self.selected.length >= 2) {
                        if (self.selected[1].x == self.selected[0].x + 1 && self.selected[1].y == self.selected[0].y) {
                            this.shuffle()
                        } else if (self.selected[1].y == self.selected[0].y + 1 && self.selected[1].x == self.selected[0].x) {
                            this.shuffle()
                        }
                        if (self.selected[1].x == self.selected[0].x - 1 && self.selected[1].y == self.selected[0].y) {
                            this.shuffle()
                        } else if (self.selected[1].y == self.selected[0].y - 1 && self.selected[1].x == self.selected[0].x) {
                            this.shuffle()
                        }

                        self.selected = []
                        this.clearActiveClass()
                        this.checkCandyPattern()
                    }
                })
            }

            candyContainer.appendChild(candyRow)
        }

        this.checkCandyPattern()
    }

    clearActiveClass() {
        self.items.forEach(element => {
            element.forEach(obj => {
                obj.element.className = 'candy-item'
            })
        });
    }

    fillBlank() {
        for (let x = 0; x < self.sizeX; x++) {
            for (let y = 0; y < self.sizeY; y++) {
                const currentRowIndex = self.sizeX - x - 1
                let currentRow = self.items[currentRowIndex]
                if (currentRow[y].candy == '') {
                    for (let _x = 0; _x < currentRowIndex; _x++) {
                        let currentItem = self.items[currentRowIndex - _x - 1][y]
                        self.items[currentRowIndex - _x][y].candy = currentItem.candy
                        self.items[currentRowIndex - _x][y].element.innerHTML = currentItem.element.innerHTML

                        currentItem.candy = ''
                        currentItem.element.innerHTML = ''
                    }
                }
            }
        }
    }

    displayScore() {
        document.getElementById('score').innerHTML = String(self.score)
    }

    checkCandyPattern() {
        for (let x = 0; x < self.sizeX; x++) {
            for (let y = 0; y < self.sizeY; y++) {
                const currentCandy = self.items[x][y]
                if (currentCandy.candy == '') continue

                const firstCheck = [self.items[x][y - 1], currentCandy, self.items[x][y + 1]]
                const secondCheck = [self.items[x - 1]?.[y], currentCandy, self.items[x + 1]?.[y]]
                let checked = []
                if (firstCheck.filter(_ => _?.candy == currentCandy.candy).length >= 3) {
                    checked = firstCheck
                } else if (secondCheck.filter(_ => _?.candy == currentCandy.candy).length >= 3) {
                    checked = secondCheck
                }
                if (checked.length <= 0) continue

                console.log('candy!', currentCandy.candy);
                setTimeout(() => {
                    playSound(CandyAudios[Math.floor(Math.random() * CandyAudios.length)])
                    for (let candy of checked) {
                        candy.candy = ''
                        candy.element.innerHTML = ''
                        candy.element.className = "candy-item active"
                        setTimeout(() => {
                            candy.element.className = "candy-item"
                        }, 200);
                    }

                    self.score += Math.floor(10 + (10 * Math.random()))
                    this.displayScore()
                    this.fillBlank()

                    setTimeout(() => {
                        this.fillBlank()
                        this.checkCandyPattern()
                    }, 200);
                }, 100);
                return
            }
        }
    }
}

let test = new biusCandy()
test.generate()
import { createElement } from '../tool/function.js'

export default class UI {
  constructor(player) {
    const hpDiv = createElement('div', 'hp')
    for (let i = 0; i < player.hp; i++)
      hpDiv.appendChild(createElement('div', `heart p${i}`))

    const score = createElement('div', 'score')
    // score.appendChild(createElement('div', 'iconScore'))
    score.appendChild(createElement('div', 'valueScore', ''))

    const kills = createElement('div', 'kills')
    // kills.appendChild(createElement('div', 'iconKills'))
    kills.appendChild(createElement('div', 'valueKills', ''))

    const levels = createElement('div', 'levels')
    // levels.appendChild(createElement('div', 'iconLevels'))
    levels.appendChild(createElement('div', 'valueLevels', ''))

    const xp = createElement('div', 'xp')
    // xp.appendChild(createElement('div', 'iconXp'))
    xp.appendChild(createElement('div', 'valueXp', ''))

    document.body.appendChild(hpDiv)
    document.body.appendChild(score)
    document.body.appendChild(kills);
    document.body.appendChild(levels);
    document.body.appendChild(xp);

    this.scoreDom = score
    this.htDom = hpDiv
    this.killsDom = kills;
    this.levelsDom = levels;
    this.xpDom = xp;
    this.scoreValueDom = score.children[0]
    this.killsValueDom = kills.children[0]
    this.levelsValueDom = levels.children[0]
    this.xpValueDom = xp.children[0]
    this.value = 0
  }

  update(player) {
    if (!player) return
    // this.setRubies(player.rubies)
    this.setHP(player.hp)
    this.setKills(player.kills);
    this.setLevels(player.levels);
    this.setScore(player.score, player.rubies);
    this.setXp(player.xp, player);
  }

  setKills(value) {
    if (value === 0) this.killsValueDom.textContent = 'Kill: 00';
    else if (value < 10) this.killsValueDom.textContent = `Kills: 0${value}`;
    else this.killsValueDom.textContent = `Kills: ${value}`;
  }
  setLevels(value) {
    if (value === 0) this.levelsValueDom.textContent = 'Stage: 00';
    else if (value < 10) this.levelsValueDom.textContent = `Stage: 0${value}`;
    else this.levelsValueDom.textContent = `Stage: ${value}`;
  }
  setScore(valueScore, valueRubies) {
    let value = valueScore + valueRubies;
    if (value === 0) this.scoreValueDom.textContent = 'Score: 00';
    else this.scoreValueDom.textContent = `Score: ${value}`;
  }
  setXp(value, p) {
    let isGood = false;
    let valMin = 0;
    let valMax = 85;
    let c = 1;
    let toNextLevel = 0;
    while(!isGood) {
      c == 1 ? valMin = 0 : valMin = 85 * c; 
      c == 1 ? valMax = 85 : valMax = 85 * (c+1);
      if(value >= (valMin * c) && value <= valMax - 1) {
        toNextLevel = valMax * (c+1);
        isGood = true;
      } else {
        c++;
      }
    }
    if (value === 0) this.xpValueDom.textContent = `Lv.1 (0/${toNextLevel})`;
    // else if (value < 85) this.xpValueDom.textContent = `Lv.1 (${value}/85)`;
    else this.xpValueDom.textContent = `Lv.${c} (${value}/${toNextLevel})`;
    p.xpLevels = c;
    // if(c >= 5 && c < 10) p.hp += 1, p.hpMax += 1
    //   else if(c >= 10 && c < 15) p.hp += 1, p.hpMax += 1
    //   else if(c >= 15 && c < 20) p.hp += 1, p.hpMax += 1
    //   else if(c >= 25 && c < 30) p.hp += 1, p.hpMax += 1
    //   else if(c >= 30) p.hp += 1, p.hpMax += 1

    for(let i = 0; i < c; i++) {
      if(i != 0 && i%2) p.hp += 1
          else if(i =! 0 && i%1) p.veloci += 0.1
    }
  }

  // setRubies(value) {
  //   if (value === 0) this.rubyValueDom.textContent = '00'
  //   else if (value < 10) this.rubyValueDom.textContent = `0${value}`
  //   else this.rubyValueDom.textContent = value
  // }

  setHP(value) {
    if (this.value !== value) {
      this.htDom.className = `hp h${value * 2}`
      this.value = value
    }
  }

  delete() {
    document.body.removeChild(this.scoreDom)
    document.body.removeChild(this.htDom)
    document.body.removeChild(this.killsDom);
    document.body.removeChild(this.xpDom);
    document.body.removeChild(this.levelsDom);
  }
}

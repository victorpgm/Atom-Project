import {elements} from "./elements.js";

let elementName = document.getElementById("element-name")

const canvas = document.getElementById("atom");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const nucleusRadius = 20

const r = 50

let angle = 0

let z = Math.round(Math.random() * 118) + 1


function atomColor(type){
    
    switch(type){
        case "Nonmetal":
            return "#FF4B91"
        case "Noble Gas":
            return "#D90429"
        case "Alkali Metal":
            return "#FF5C20"
        case "Alkaline Earth Metal":
            return "#FFD203"
        case "Metalloid":
            return "#00F5D4"
        case "Halogen":
            return "#B26BFF"
        case "Post Transition Metal":
            return "#00FFF4"
        case "Transition Metal":
            return "#00CFF8"
        case "Lanthanide":
            return "#90E0EF"
        case "Actinide":
            return "#060913"
    }
}

function electronConfiguration(maxN = 7) {
    let subshells = [];
    
    for (let n = 1; n <= maxN; n++) {
        for (let l = 0; l < n; l++) {
            const maxEletrons = 2 * (2 * l + 1);
            subshells.push({
                n: n,
                l: l,
                sub: ['s','p','d','f'][l],
                max: maxEletrons
            });
        }
    }
    
    subshells.sort((a, b) => {
        const sumA = a.n + a.l;
        const sumB = b.n + b.l;
        
        if (sumA !== sumB) return sumA - sumB;
        return a.n - b.n;
    });
    
    return subshells;
}

function getElectronDistribuiton(Z) {
    const order = electronConfiguration();
    let eletrons = Z;
    let eachShell = [];
    
    

    for (let subshell of order) {
        if (eletrons <= 0) break;
        
        const electronInShell = Math.min(eletrons, subshell.max);
        
        if (!eachShell[subshell.n]) eachShell[subshell.n] = 0;
        eachShell[subshell.n] += electronInShell;
        
        eletrons -= electronInShell;
    }
    eachShell = eachShell.slice(1,eachShell.length)
    return eachShell;
}


function draw(){

    let color = atomColor(elements[z-1].category)
    let shell = getElectronDistribuiton(z)
    
    ctx.shadowBlur = 10
    ctx.shadowColor = color
    ctx.fillStyle = color
    ctx.clearRect(0,0,canvas.width,canvas.height)
    
    angle +=0.1
    
    ctx.strokeStyle = "grey"
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius, 0, 2 * Math.PI);
    ctx.fill();

    for(let i=1; i<=shell.length;i++){
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, i*r, 0, 2 * Math.PI);
        ctx.stroke();

        for(let j=0; j<shell[i-1]; j++){

            let n = shell[i-1]
            let m = 2*Math.PI/n
            
            let x_pos = centerX+i*r*Math.cos(angle/i+m*j)
            let y_pos = centerY+i*r*Math.sin(angle/i+m*j)

            ctx.shadowBlur = 10
            ctx.shadowColor = color
            ctx.fillStyle = color
            ctx.beginPath();
            ctx.arc(x_pos,y_pos,5,0,2*Math.PI)
            ctx.fill()
            
        }
    }

    elementName.innerHTML = elements[z-1].name
    
    ctx.font = "15px Arial bold"

    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(elements[z-1].symbol, centerX, centerY)
    
}

function animate(){
    draw();
    requestAnimationFrame(animate)
}

animate()

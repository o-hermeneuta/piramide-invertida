//////// FRONTEND

document.getElementById('nameForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const alert = document.getElementById('alert-message');
    if (validateInput(fullname)) {
        const nameFormDiv = document.getElementById('nameForm-div');
        const values = document.getElementById('main-values');
        nameFormDiv.classList.add('d-none');
        alert.classList.add('d-none');
        values.classList.remove('d-none');
        generatePiramid(fullname);
    } else {
        alert.innerHTML = 'Coloque um nome valido';
        alert.classList.remove('d-none');
    }
});

function validateInput(fullname) {
    if (fullname.trim().length === 0) return false;
    return true;
}

function getTriplePositions(line) {
    const positions = new Array(line.length).fill(false);
    let i = 0;
    while (i < line.length) {
        let j = i;
        while (j < line.length && line[j] === line[i]) j++;
        if (j - i >= 3) {
            for (let k = i; k < j; k++) positions[k] = true;
        }
        i = j;
    }
    return positions;
}

function getTripleValues(line) {
    const values = new Set();
    let i = 0;
    while (i < line.length) {
        let j = i;
        while (j < line.length && line[j] === line[i]) j++;
        if (j - i >= 3) values.add(line[i]);
        i = j;
    }
    return values;
}

function generatePiramid(fullname) {
    const piramide = getPiramid(fullname);
    let classes = "row justify-content-center fw-bold fs-6 fs-md-4 fs-lg-2";
    const tripleNumbers = new Set();

    piramide.forEach((line, idx) => {
        generateLine(line, classes);
        classes = 'row justify-content-center';
        if (idx > 0) {
            getTripleValues(line).forEach(n => { if (arcanosMaiores[n]) tripleNumbers.add(n); });
        }
    });

    generateVideoLinks(tripleNumbers);
}

function generateVideoLinks(numbers) {
    const container = document.getElementById('video-links');
    [...numbers].sort((a, b) => a - b).forEach(n => {
        const arcano = arcanosMaiores[n];
        const a = document.createElement('a');
        a.href = arcano.video;
        a.target = '_blank';
        a.className = 'btn btn-primary fw-bold fs-5 px-4 py-2';
        a.textContent = arcano.name;
        container.appendChild(a);
    });
}

function generateLine(line, classes) {
    const row = document.createElement('div');
    row.className = classes;
    const piramide = document.getElementById('piramide');

    const triplePos = getTriplePositions(line);

    line.forEach((letra, idx) => {
        const col = document.createElement('div');
        col.className = 'col-auto';
        if (triplePos[idx]) {
            const a = document.createElement('a');
            a.textContent = letra;
            a.style.color = 'red';
            a.style.textDecoration = 'none';
            a.href = arcanosMaiores[letra]?.video || '#';

            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip-image';
            const img = document.createElement('img');
            img.src = arcanosMaiores[letra]?.image || '';
            img.alt = arcanosMaiores[letra]?.name || '';
            tooltip.appendChild(img);

            col.classList.add('triple-col');
            col.appendChild(a);
            col.appendChild(tooltip);

            col.addEventListener('mouseenter', () => {
                const rect = col.getBoundingClientRect();
                const tooltipW = 160;
                const tooltipH = 180;

                tooltip.style.left = '';
                tooltip.style.right = '';
                tooltip.style.top = '';
                tooltip.style.bottom = '';

                if (rect.right + tooltipW > window.innerWidth) {
                    tooltip.style.right = '0';
                } else {
                    tooltip.style.left = '0';
                }

                if (rect.bottom + tooltipH > window.innerHeight) {
                    tooltip.style.bottom = '100%';
                } else {
                    tooltip.style.top = '100%';
                }
            });
        } else {
            col.textContent = letra;
        }
        row.appendChild(col);
    });

    piramide.appendChild(row);
}


//////// BACKEND

function getPiramid(name){
  if(name.trim().length === 0) { alert("Coloque um nome"); }

  let piramid = [];
  name = name.toUpperCase().trim();
  const letters = name.split('');
  piramid.push(letters); 
  
  let firstLine = [];
  letters.forEach((val) => {
    if(val.trim().length === 0) {return;}
    const valNumber = getNumberByLetra(val.normalize('NFD').replace(/[\u0300-\u036f]/g, ""));    
    firstLine.push(valNumber);
  });
  
  piramid.push(firstLine); 
  
  const piramidBody = generateBasedOnFirstLine(firstLine, piramid);

  return piramidBody;
}

function getNumberByLetra(letra){
  return numeroToLetra[letra]; 
}

function generateBasedOnFirstLine(numbers, piramid){
  let nextLine = [];
  for (let i = 0; i < numbers.length - 1; i++){
    const firstNumber = numbers[i];
    let secondNumber = numbers[i+1];
    let sum = firstNumber + secondNumber;
    if(sum > 9) {
      sum = somaAcimaDeDez(sum);
    }
    nextLine.push(sum);
  }

  piramid.push(nextLine); 
  if(nextLine.length > 1){
    piramid = generateBasedOnFirstLine(nextLine, piramid);
  }
  return piramid;
}

function somaAcimaDeDez(numero) {
  return numero
    .toString()
    .split('')
    .reduce((soma, digito) => soma + Number(digito), 0);
}


//////// DATABASE

const numeroToLetra = {
  'A': 1,
  'J': 1,
  'S': 1,
  'B': 2,
  'K': 2,
  'T': 2,
  'C': 3,
  'L': 3,
  'U': 3,
  'D': 4,
  'M': 4,
  'V': 4,
  'E': 5,
  'N': 5,
  'W': 5,
  'F': 6,
  'O': 6,
  'X': 6,
  'G': 7,
  'P': 7,
  'Y': 7,
  'H': 8,
  'Q': 8,
  'Z': 8,
  'I': 9,
  'R': 9
};

const arcanosMaiores = {
    0: { name: "0 - O Louco", image: "public/cards/major_arcana_fool.png", video: "https://www.youtube.com/watch?v=qrdOm2BsV4Q" },
    1: { name: "1 - O Mago", image: "public/cards/major_arcana_magician.png", video: "https://www.youtube.com/watch?v=6B2gsn_Nsrg" },
    2: { name: "2 - A Sacerdotisa", image: "public/cards/major_arcana_priestess.png", video: "https://www.youtube.com/watch?v=SnUyvSMaNzU" },
    3: { name: "3 - A Imperatriz", image: "public/cards/major_arcana_empress.png", video: "https://www.youtube.com/watch?v=na-O01G-u3s" },
    4: { name: "4 - O Imperador", image: "public/cards/major_arcana_emperor.png", video: "https://www.youtube.com/watch?v=KHc-QFPBl1g" },
    5: { name: "5 - O Hierofante", image: "public/cards/major_arcana_hierophant.png", video: "https://www.youtube.com/watch?v=YaIHqJpUfTM" },
    6: { name: "6 - Enamorados", image: "public/cards/major_arcana_lovers.png", video: "https://www.youtube.com/watch?v=-Hl64af4LjM" },
    7: { name: "7 - O Carro", image: "public/cards/major_arcana_chariot.png", video: "https://www.youtube.com/watch?v=Bt709CNcH3c" },
    8: { name: "8 - A Força", image: "public/cards/major_arcana_strength.png", video: "https://www.youtube.com/watch?v=1c-c3Fomw5s" },
    9: { name: "9 - O Eremita", image: "public/cards/major_arcana_hermit.png", video: "https://www.youtube.com/watch?v=iGeMj8hOM0Q" },
    10: { name: "10 - A Roda da Fortuna", image: "public/cards/major_arcana_fortune.png", video: "https://www.youtube.com/watch?v=Cn3kvhvPOfw" },
    11: { name: "11 - A Justiça", image: "public/cards/major_arcana_justice.png", video: "https://www.youtube.com/watch?v=moK3ZIx-H8Y" },
    12: { name: "12 - O Pendurado", image: "public/cards/major_arcana_hanged.png", video: "https://www.youtube.com/watch?v=fEykQJsCUzM" },
    13: { name: "13 - A Morte", image: "public/cards/major_arcana_death.png", video: "https://www.youtube.com/watch?v=h_Xq5fMShfM" },
    14: { name: "14 - A Temperança", image: "public/cards/major_arcana_temperance.png", video: "https://www.youtube.com/watch?v=dImEx4kkLis" },
    15: { name: "15 - O Diabo", image: "public/cards/major_arcana_devil.png", video: "https://www.youtube.com/watch?v=mo-ffQbzebI" },
    16: { name: "16 - A Torre", image: "public/cards/major_arcana_tower.png", video: "https://www.youtube.com/watch?v=MQnvTMH4EBE" },
    17: { name: "17 - A Estrela", image: "public/cards/major_arcana_star.png", video: "https://www.youtube.com/watch?v=CsNcutaVG_A" },
    18: { name: "18 - A Lua", image: "public/cards/major_arcana_moon.png", video: "https://www.youtube.com/watch?v=lVE-GLcEEMs" },
    19: { name: "19 - O Sol", image: "public/cards/major_arcana_sun.png", video: "https://www.youtube.com/watch?v=T3loe-HhCDo" },
    20: { name: "20 - O Julgamento", image: "public/cards/major_arcana_judgement.png", video: "https://www.youtube.com/watch?v=TkUBzzWX5lQ" },
    21: { name: "21 - O Mundo", image: "public/cards/major_arcana_world.png", video: "https://www.youtube.com/watch?v=tj98roN8EoI+" }
};

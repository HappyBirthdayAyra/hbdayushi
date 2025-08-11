// ---- Data ----
const questions = [
  {
    id:1,
    q: "What’s Ayra’s perfect birthday mood today?",
    opts: [
      {t:"Dancing like nobody’s watching", note:"The dance floor called. It’s scared of you."},
      {t:"Laughing till your cheeks hurt", note:"Warning: face muscles may file a complaint."},
      {t:"Chilling like a queen", note:"Royal decree: today is officially Ayra Day."},
      {t:"Making Instagram jealous of her day", note:"Hashtags are already trembling in fear."},
    ]
  },
  {
    id:2,
    q: "What’s the ideal gift for Ayra?",
    opts: [
      {t:"Cute polaroid camera", note:"Perfect for capturing how ridiculously adorable you are."},
      {t:"Handwritten letters", note:"Warning: may cause permanent smiles."},
      {t:"Endless supply of desserts", note:"Sweetness level: illegal in 7 countries."},
      {t:"A personal concert from Atif", note:"He might refuse to leave after singing for you."},
    ]
  },
  {
    id:3,
    q: "How should the evening be celebrated?",
    opts: [
      {t:"Sunset walk", note:"The sunset will probably get jealous."},
      {t:"Listening to Atif in a cozy coffee cafe", note:"Perfect mix: caffeine, music, and you."},
      {t:"Ice cream run", note:"Your smile will outshine the freezer lights."},
      {t:"Stargazing while plotting world domination", note:"Step one: steal the moon. Step two: eat cake."},
    ]
  },
  {
    id:4,
    q: "Guess who’s behind this little surprise?",
    opts: [
      {t:"Einstein", note:"Smart enough to know you’re brilliant.", correct:false},
      {t:"Preeti Gugnani", note:"Would totally throw you a dance party.", correct:false},
      {t:"Someone who thinks of you a little more", note:"Someone who’s smiling right now.", correct:true},
      {t:"Harish Kamal", note:"Definitely the cooler Harish, no debates.", correct:false},
    ]
  }
];

// ---- State + DOM ----
let cur = 0;
const playMusicBtn = document.getElementById('playMusicBtn');
const startBtn = document.getElementById('startBtn');
const bgAudio = document.getElementById('bgAudio');

const welcomeScreen = document.getElementById('welcomeScreen');
const questionArea = document.getElementById('questionArea');
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const noteArea = document.getElementById('noteArea');
const nextArea = document.getElementById('nextArea');
const nextBtn = document.getElementById('nextBtn');

const finalScreen = document.getElementById('finalScreen');
const finalNote = document.getElementById('finalNote');
const slideImg = document.getElementById('slideImg');
const replayBtn = document.getElementById('replay');
const heartsLayer = document.getElementById('heartsLayer');

// slideshow photos (opening + final)
const photos = [
  'photo1.png','photo2.png','photo3.png','photo4.png','photo5.png','photo6.png'
];
let slideIndex = 0;
let slideInterval = null;

// ---- Audio controls ----
bgAudio.addEventListener('error', ()=> {
  playMusicBtn.disabled = true;
  playMusicBtn.textContent = 'Music not available';
});
playMusicBtn.addEventListener('click', ()=> {
  bgAudio.play().catch(()=>{});
  playMusicBtn.style.display = 'none';
});

// ---- Start game ----
startBtn.addEventListener('click', ()=> {
  welcomeScreen.style.display = 'none';
  questionArea.style.display = 'block';
  cur = 0;
  renderQuestion();
});

// ---- Render question ----
function renderQuestion(){
  const q = questions[cur];
  questionText.innerText = q.q;
  optionsGrid.innerHTML = '';
  noteArea.innerHTML = '';
  nextArea.style.display = 'none';

  // set a subtle pastel background per question
  const bgList = ['linear-gradient(135deg,#fce7f3,#fff7ee)','linear-gradient(135deg,#eef9ff,#fff7f0)','linear-gradient(135deg,#f8fff0,#fff6fb)','linear-gradient(135deg,#fff3e8,#f6f7ff)'];
  document.querySelector('.card').style.background = bgList[(cur % bgList.length)];

  q.opts.forEach((opt, i) => {
    const card = document.createElement('div');
    card.className = 'option';
    card.innerHTML = `<div class="text">${opt.t}</div>`;
    card.addEventListener('click', ()=> onSelect(opt,q));
    optionsGrid.appendChild(card);
  });
}

// ---- On select ----
function onSelect(opt,q){
  noteArea.innerHTML = `<div class="note">${opt.note}</div>`;
  // special logic for last question
  if(q.id === 4){
    if(opt.correct){
      setTimeout(()=> showFinal(), 800);
    } else {
      // show try again
      noteArea.innerHTML += `<div style="margin-top:10px;text-align:center"><button class="btn secondary" id="tryAgain">Try Again</button></div>`;
      document.getElementById('tryAgain').addEventListener('click', ()=> {
        renderQuestion();
      });
    }
    return;
  }

  // show next
  nextArea.style.display = 'flex';
  // auto advance after short delay unless user clicks Next
  setTimeout(()=> {
    if(nextArea.style.display !== 'none') goNext();
  }, 1200);
}

// ---- Next question ----
function goNext(){
  cur++;
  if(cur < questions.length){
    renderQuestion();
  } else {
    showFinal();
  }
}

// ---- Final screen ----
function showFinal(){
  questionArea.style.display = 'none';
  finalScreen.style.display = 'block';
  startSlideshow();
  finalNote.innerText = `Happy Birthday, Ayra

We have not talked a lot but every time we do, it is hard not to notice how sweet you are.
And yes, I take my cool sa mast sa senior title very seriously.

You have a way of making people smile without even trying.
I hope this year is full of coffee that tastes perfect,
songs that make you feel like the main character,
and moments that make you think "Okay, this is even better than I imagined."

And maybe your mast senior will make a few of those moments happen. 😉`;
  // create dreamy yellow hearts
  createHearts(14);
}

// ---- Slideshow ----
function startSlideshow(){
  if(slideInterval) clearInterval(slideInterval);
  slideImg.src = photos[slideIndex];
  slideImg.style.opacity = 1;
  slideInterval = setInterval(()=> {
    slideImg.style.opacity = 0;
    setTimeout(()=> {
      slideIndex = (slideIndex + 1) % photos.length;
      slideImg.src = photos[slideIndex];
      slideImg.style.opacity = 1;
    }, 400);
  }, 3500);
}

// ---- Replay ----
replayBtn.addEventListener('click', ()=> {
  finalScreen.style.display = 'none';
  document.getElementById('welcomeScreen').style.display = 'block';
  slideIndex = 0;
  clearInterval(slideInterval);
  // pause audio and show play button again
  bgAudio.pause();
  playMusicBtn.style.display = 'inline-block';
  // clear hearts
  heartsLayer.innerHTML = '';
});

// ---- Yellow hearts generator ----
function createHearts(count = 12){
  heartsLayer.innerHTML = '';
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.style.left = (5 + Math.random()*90) + '%';
    h.style.bottom = (-40 - Math.random()*80) + 'px';
    h.style.width = (12 + Math.random()*16) + 'px';
    h.style.height = (10 + Math.random()*14) + 'px';
    h.style.animationDuration = (6 + Math.random()*6) + 's';
    heartsLayer.appendChild(h);
  }
}

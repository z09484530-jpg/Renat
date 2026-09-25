const API_KEY = 'b628d35452msh77090e225e8245ap12eeb5jsne5a71a4a3fab';
const API_HOST = 'spotify23.p.rapidapi.com';

const api = axios.create({
  baseURL: 'https://spotify23.p.rapidapi.com',
  headers: {
    'x-rapidapi-host': API_HOST,
    'x-rapidapi-key': API_KEY
  }
});

const input=document.getElementById('searchInput');
const results=document.getElementById('results');
const status=document.getElementById('status');
const audio=document.getElementById('audio');
const cover=document.getElementById('cover');
const trackName=document.getElementById('trackName');
const artistName=document.getElementById('artistName');
const play=document.getElementById('play');
const progress=document.getElementById('progress');
const current=document.getElementById('current');
const duration=document.getElementById('duration');
let tracks=[],currentIndex=-1;

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

function parseTrack(item){
  const t=item?.data||item||{};
  const album=t.albumOfTrack||t.album||{};
  const artists=t.artists?.items||t.artists||[];
  const sources=album.coverArt?.sources||album.images||[];
  return {
    name:t.name||'Unknown',
    artist:artists.map(a=>a.profile?.name||a.name).filter(Boolean).join(', ')||'Unknown artist',
    album:album.name||'',
    image:sources[0]?.url||'',
    preview:t.preview_url||t.previewUrl||t.audioPreview||t.preview?.url||''
  };
}

async function searchMusic(){
  const q=input.value.trim();
  if(!q)return;
  status.textContent='Searching…';
  results.innerHTML='';
  try{
    const {data}=await api.get('/search/',{params:{q,type:'multi',offset:0,limit:30}});
    tracks=(data?.tracks?.items||[]).map(parseTrack);
    status.textContent=tracks.length?`${tracks.length} results`:'Nothing found';
    tracks.forEach((t,i)=>{
      const row=document.createElement('div');
      row.className='row';
      row.innerHTML=`
        <div class="num">${i+1}</div>
        <div class="song">
          <img class="thumb" src="${esc(t.image)}" alt="">
          <div style="min-width:0">
            <div class="song-name">${esc(t.name)}</div>
            <div class="song-artist">${esc(t.artist)}</div>
          </div>
        </div>
        <div class="album">${esc(t.album)}</div>
        <button aria-label="Play">${t.preview?'▶':'○'}</button>`;
      row.onclick=()=>playTrack(i);
      results.appendChild(row);
    });
  }catch(e){
    console.error(e);
    status.textContent='API error. Check the RapidAPI key or API response.';
  }
}

async function playTrack(i){
  const t=tracks[i];
  if(!t)return;
  currentIndex=i;
  trackName.textContent=t.name;
  artistName.textContent=t.artist;
  cover.src=t.image||'';
  if(t.preview){
    if(audio.src!==t.preview)audio.src=t.preview;
    try{await audio.play();play.textContent='Ⅱ'}catch(e){play.textContent='▶'}
  }else{
    /*
      The search endpoint can return metadata without an audio URL.
      We intentionally do not send the user to another site.
      If the API returns a preview URL, it plays here automatically.
    */
    status.textContent='Бул ыр үчүн API audio/preview URL берген жок.';
  }
}

play.onclick=()=>{
  if(!audio.src)return;
  if(audio.paused){audio.play();play.textContent='Ⅱ'}
  else{audio.pause();play.textContent='▶'}
};
document.getElementById('prev').onclick=()=>{
  if(tracks.length)playTrack((currentIndex-1+tracks.length)%tracks.length);
};
document.getElementById('next').onclick=()=>{
  if(tracks.length)playTrack((currentIndex+1)%tracks.length);
};
audio.addEventListener('loadedmetadata',()=>duration.textContent=fmt(audio.duration));
audio.addEventListener('timeupdate',()=>{
  current.textContent=fmt(audio.currentTime);
  progress.value=audio.duration?(audio.currentTime/audio.duration)*100:0;
});
audio.addEventListener('play',()=>play.textContent='Ⅱ');
audio.addEventListener('pause',()=>play.textContent='▶');
audio.addEventListener('ended',()=>{
  if(tracks.length)playTrack((currentIndex+1)%tracks.length);
});
progress.oninput=()=>{if(audio.duration)audio.currentTime=audio.duration*progress.value/100};
document.getElementById('volume').oninput=e=>audio.volume=e.target.value;
audio.volume=.8;

function fmt(s){
  if(!isFinite(s))return'0:00';
  return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
}
input.addEventListener('keydown',e=>{if(e.key==='Enter')searchMusic()});
document.getElementById('clear').onclick=()=>{input.value='';results.innerHTML='';status.textContent=''};
document.getElementById('menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');

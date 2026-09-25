VIBE FY SEARCH — 1:1 STYLE BUILD
=================================
Бул долбоор muzic-theta.vercel.app/search барагынын жеткиликтүү көрүнүшүнө
окшош караңгы музыкалык Search интерфейси катары түзүлдү.

Кошулган:
- Search
- ыр/артист/альбом тизмеси
- cover artwork
- төмөнкү музыкалык player
- play/pause
- next/previous
- progress
- volume
- mobile responsive меню
- берилген RapidAPI key жана spotify23.p.rapidapi endpoint

МААНИЛҮҮ:
API search endpoint audio/preview URL кайтарса, ыр ошол эле баракта түз ойнойт.
Эгер API конкреттүү ыр үчүн preview/audio URL бербесе, frontend өзү толук ырды
ойдон чыгарып бере албайт. Толук Spotify аудиосу үчүн тиешелүү расмий playback
авторизациясы керек.

SECURITY:
Бул ZIPте API key client-side коюлган, ошондуктан GitHub public repo'до key
көрүнөт. Production үчүн key'ди server-side сактоо сунушталат.

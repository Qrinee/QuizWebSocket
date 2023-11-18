# 🎯 QuizWebSocket w stylu kahoot

Witaj w QuizWebSocket! Ta aplikacja umożliwia hostowanie pytań, a uczestnicy mogą dołączać do gry za pomocą aplikacji na telefon. Całość została zrealizowana w stacku technologicznym:

**Stack technologiczny:**
- Socket.io
- React Native
- React
- MySQL
- NodeJS

## 📱 Screeny z aplikacji:
<div style="display: flex;">
<div>
  <img src="https://i.imgur.com/oJKyMfm.png" height="300" />
  <img src="https://i.imgur.com/BtgDGaJ.png" height="300" />
</div>
<div>
  <img src="https://i.imgur.com/QrOyPsS.jpg" height="300" />
  <img src="https://i.imgur.com/87H967r.jpg" height="300" />
  <img src="https://i.imgur.com/2gwPz3o.jpg" height="300" />
  <img src="https://i.imgur.com/SedsAbe.jpg" height="300" />
</div>
</div>
## Jak uruchomić?

### 1. Konfiguracja plików środowiskowych:
Edytuj pliki `.env` znajdujące się wewnątrz folderów `web` i `mobile`.

### 2. Konfiguracja plików dla builda i proxy:
- W `mobile/eas.json` dokonaj odpowiednich zmian dla builda mobilnej aplikacji.
- W pliku `web/vite.config.js` dostosuj ustawienia dla proxy.

### 3. Uruchomienie serwera Node.js:
1. Uruchom serwer MySQL.
2. Załaduj tabele z pliku `quiz.sql`.
3. Przejdź do folderu `server`.
4. Zainstaluj zależności poprzez wykonanie komendy `npm i`.
5. Edytuj dane logowania do twojej bazy mysql w pliku `index.js`
6. Uruchom serwer poprzez `node index.js`.

### 4. Uruchomienie aplikacji React:
1. Przejdź do folderu `web`.
2. Zainstaluj zależności komendą `npm i`.
3. Uruchom aplikację za pomocą komendy `npm run dev`.

### 5. Uruchomienie aplikacji React Native:
1. Przejdź do folderu `mobile`.
2. Zainstaluj zależności komendą `npm i`.
3. Rozpocznij aplikację za pomocą komendy `npm start`.

Z tą instrukcją powinieneś z łatwością uruchomić aplikację QuizWebSocket! 🚀

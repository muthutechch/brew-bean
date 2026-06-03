# brew-bean

Moderne Coffee-Shop-Website für Brew & Bean in Zürich.

## Funktionen

- 4 responsive HTML-Seiten: Startseite, Menü, Über uns, Kontakt
- Deutsches Interface, CHF-Preise
- Modernes UI mit Glas-Effekten, Animationen und Karussell
- Google Material Symbole statt Bild-Icons
- SEO-optimiert (sitemap.xml, robots.txt, JSON-LD)
- Kein Framework – reines HTML, CSS und JavaScript

## Verwendung

1. **Repository klonen**

   ```bash
   git clone https://github.com/muthutechch/brew-bean.git
   cd brew-bean
   ```

2. **Lokal öffnen**

   Öffne `index.html` in deinem Browser – alle Seiten sind statisch und benötigen keinen Server.

3. **Anpassen**

   - **Inhalte bearbeiten:** Texte in den HTML-Dateien (`index.html`, `menu.html`, `about.html`, `contact.html`) ändern
   - **Farben anpassen:** CSS-Variablen in `css/style.css` (Zeile 9–29) bearbeiten
   - **Bilder austauschen:** Unsplash-URLs in den HTML-Dateien durch eigene Bilder ersetzen
   - **Menü ändern:** Speisekarte in `menu.html` bearbeiten (Kategorien, Preise, Beschreibungen)
   - **Standort anpassen:** Adresse, Telefon, E-Mail in allen HTML-Dateien aktualisieren
   - **Google Maps:** Karten-Embed in `contact.html` durch eigene Koordinaten ersetzen

4. **Auf GitHub Pages veröffentlichen**

   - Gehe zu deinem Repository auf GitHub → **Settings** → **Pages**
   - Wähle bei "Branch" `main` und `/ (root)` aus
   - Nach ca. 1 Minute ist die Seite live unter:  
     `https://dein-nutzername.github.io/brew-bean/`

## Struktur

```
brew-bean/
├── index.html          # Startseite
├── menu.html           # Menü / Speisekarte
├── about.html          # Über uns
├── contact.html        # Kontakt mit Formular
├── css/
│   └── style.css       # Alle Styles
├── js/
│   └── main.js         # Alle Skripte
├── images/             # Platzhalter für eigene Bilder
├── sitemap.xml         # SEO-Sitemap
├── robots.txt          # Crawler-Konfiguration
└── README.md
```

## Technologien

- HTML5
- CSS3 (Flexbox, Grid, Animationen, Glassmorphism)
- JavaScript (Intersection Observer, Carousel, Formular-Validierung)
- Google Material Symbols
- Google Fonts (Inter, Poppins)

## Standort

Bahnhofstrasse 42, 8001 Zürich, Schweiz

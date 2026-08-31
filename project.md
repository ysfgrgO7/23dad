# Interactive Real-World Scavenger Hunt Web App (Daniel in the Lions' Den / قصة دانيال وجب الأسود)

## 📌 Project Overview
Build an interactive, kid-friendly web application for an IRL (In Real Life) scavenger hunt based on the Biblical story of Daniel in the Lions' Den. Kids explore the levels on the map screen. When solving a level / finding the IRL station, interacting with the screen unlocks the character, displays their character image and Egyptian Arabic monologue, and advances the adventure.

---

## 🎨 Visual Design & Theme
- **Theme**: Ancient Persian / Biblical Adventure (Warm desert tones, ancient parchment, gold accents, stone textures, stars, and lantern glow).
- **Map View (Home Screen)**:
  - An illustrated adventure path displaying the 3 levels / stations leading to the Lions' Den finale.
  - Background: Uses the custom map illustration (`assets/map.jpeg`).
  - **Station Nodes on Map**:
    - **Locked / Unsolved**: Shows a profile circle / placeholder silhouette with a `?` on it.
    - **Active Station**: Pulsing / highlighted node indicating it's ready to be interacted with.
    - **Solved / Unlocked**: Replaces the `?` with the character's portrait (`assets/King Darius.jpeg`, `assets/Admins.jpeg`, `assets/Daniel.jpeg`).
- **Child-Friendly UX**:
  - Full RTL (Right-to-Left) Arabic layout with modern, legible Arabic typography.
  - Big, tactile buttons (min 48px–64px tap targets), lively reveal animations, confetti/particle effects on completion, and friendly sound effects (reveal, stone sliding, victory jingle).
  - Responsive & mobile/tablet-first layout.

---

## 🗺️ Levels & Character Reveals

### 1. 👑 Level 1: الملك داريوس (King Darius)
- **Node Status**: Starts as unlocked node with `?` avatar on the map.
- **Action**: Tap to open / complete level (e.g., tap "فتح المحطة" or "لقيتها! 🔍").
- **Reveal Screen / Modal**:
  - Plays stone door sliding / magic reveal animation.
  - Displays character portrait (`assets/King Darius.jpeg`).
  - **Character Dialogue (Egyptian Arabic)**:
    > "انا داريوس ملك فارس، وجولي الوزراء بتوعي قالولي اني اصدر امر ملكي ان اي حد يطلب طلب او يصلي لانسان او اله غيري لمدة ٣٠ يوم يترمي في جب الاسود."
  - **Result**: Station 1 node now shows King Darius's face; unlocks Level 2 on the map.

---

### 2. 📜 Level 2: الوزراء (The Royal Ministers)
- **Node Status**: Unlocks after Level 1 is completed (shows `?` avatar).
- **Action**: Tap to open / complete level.
- **Reveal Screen / Modal**:
  - Displays character portrait (`assets/Admins.jpeg`).
  - **Character Dialogue (Egyptian Arabic)**:
    > "احنا وزراء الملك داريوس وشوفنا ان دانيال احسن مننا.. فكنا غيرانين منه وكنا عايزين نأذيه، واحنا عارفين انه كل يوم بيصلي لإلهه وهو سايب الشباك مفتوح، فجتلنا فكرة شريرة وهي اننا نروح نطلب من الملك ان اي حد بيصلي لإلهه يترمي في جب الاسود!"
  - **Result**: Station 2 node now shows the Ministers' face; unlocks Level 3 on the map.

---

### 3. 🦁 Level 3: دانيال (Daniel)
- **Node Status**: Unlocks after Level 2 is completed (shows `?` avatar).
- **Action**: Tap to open / complete level.
- **Reveal Screen / Modal**:
  - Displays character portrait (`assets/Daniel.jpeg`).
  - **Character Dialogue (Egyptian Arabic)**:
    > "انا دانيال كنت احسن وزير عند الملك داريوس وكنت بصلي لإلهي كل يوم عشان هو وقف معايا في السبي من ساعة ما جيت، ودلوقتي هيرموني في جب الاسود!"
  - **Result**: Station 3 node now shows Daniel's face; unlocks the **Grand Finale**!

---

### 🌟 4. The Grand Finale: إنقاذ دانيال (The Lions' Den Deliverance)
- **Cutscene / Interactive Finale Screen**:
  - Dramatic transition into the Lions' Den with peaceful lions and glowing divine light.
  - **Daniel's Victory Dialogue**:
    > "«إِلَهِي أَرْسَلَ مَلاَكَهُ وَسَدَّ أَفْوَاهَ الأُسُودِ فَلَمْ تَضُرَّنِي»"
  - **Moral of the Story / إيه اللي اتعلمناه؟**:
    - الصلاة الدائمة والأمانة مع ربنا مهما كانت الظروف صعبة.
    - ربنا دايماً بيحمي أولاده اللي بيحبوه وبيثقوا فيه.
  - Celebration confetti + **زرار إعادة اللعب (Play Again)** to reset the map progress.

---

## 🛠️ Assets Reference & File Mapping
- **Map Background**: `assets/map.jpeg`
- **King Darius**: `assets/King Darius.jpeg`
- **The Ministers / Admins**: `assets/Admins.jpeg`
- **Daniel**: `assets/Daniel.jpeg`

---

## ⚙️ Technical Requirements
1. **Tech Stack**: Modern web app (HTML5 / Vanilla CSS3 / JavaScript ES6+ or lightweight SPA framework).
2. **Audio & Feedback**: Web Audio API / synthesized sound effects (button clicks, reveal sound, celebratory fanfares).
3. **State Management**: LocalStorage to save unlocked stations so progress isn't lost on page refresh, with a clear "Reset" button for coordinators/teachers.
4. **Accessibility**: Clean UI, high-contrast buttons, responsive scaling for tablets/phones, RTL support with `dir="rtl"`.

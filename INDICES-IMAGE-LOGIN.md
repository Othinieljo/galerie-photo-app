# Indices pour retrouver l’image d’arrière-plan de la page Login

Pour reproduire fidèlement l’interface, voici des **indices de recherche** pour trouver une image d’arrière-plan proche du design (personne au bureau, laptop, style minimaliste, tons beige / orange) :

## Mots-clés recommandés

- **Login illustration vector**
- **Authentication UI background**
- **People working on laptop illustration**
- **Minimalist design system illustration**
- **Flat design login page art**
- **unDraw style login** (unDraw propose des illustrations libres dans ce style)
- **Login page background illustration**
- **Line art desk workspace illustration**
- **Beige orange login illustration**

## Où chercher

- **unDraw** (undraw.co) — illustrations SVG gratuites, style épuré
- **Freepik** — catégories « business », « work », « technology », filtre « minimalist » ou « flat »
- **Adobe Stock** / **Shutterstock** — recherche « login illustration » ou « authentication background »
- **Humaaans** — personnages et scènes modulables
- **Storyset** (storyset.com) — illustrations par thème

## Style à cibler

- Fond **beige clair** (#f2ebe3 ou proche)
- Accent **orange / pêche** pour certains éléments de l’illustration
- **Ligne noire** (line art), zones remplies en orange
- Personnage au **bureau**, **laptop**, éventuellement **plante**
- Formes **simples** : cercles, traits, rectangles pointillés, bulles

Une fois l’image trouvée, placez-la dans `public/` (ex. `public/login-bg.svg`) et définissez dans `app/globals.css` :

```css
--auth-bg-image: url('/login-bg.svg');
```

(et supprimez le `/*` devant cette ligne si vous l’aviez commentée.)

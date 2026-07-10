# Jamoa a'zolari rasmlari / Team member photos

Jamoa a'zolarining rasmlarini shu papkaga joylang.
Place team member photos in this folder.

## Qanday ishlatiladi / How to use

1. Rasmni shu papkaga qo'ying, masalan / Add a photo here, e.g.:
   `public/team/sardor.jpg`

2. `lib/content.ts` faylidagi tegishli a'zoga `image` maydonini qo'shing
   (root-relative yo'l, `public/` prefiksisiz) / Set the member's `image`
   field in `lib/content.ts` (root-relative path, no `public/` prefix):

   ```ts
   {
     name: "Sardor Rahimov",
     role: "Asoschi va CEO",
     bio: "...",
     initials: "SR",
     image: "/team/sardor.jpg", // <-- shu yerda / here
     socials: [ ... ],
   }
   ```

## Maslahatlar / Tips

- Kvadrat rasmlar eng chiroyli ko'rinadi (≈400×400px) /
  Square images look best (≈400×400px).
- `.jpg`, `.png` yoki `.webp` formatlari qo'llab-quvvatlanadi /
  `.jpg`, `.png` and `.webp` are supported.
- `image` qo'shilmasa, tilla rangli bosh harflar (masalan "SR") ko'rsatiladi /
  Without `image`, gold initials (e.g. "SR") are shown instead.

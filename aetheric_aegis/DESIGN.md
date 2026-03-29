# Design System Strategy: The Gilded Relic

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Sovereign Archive."** This is not a flat interface; it is a high-end, tactile command center for digital deities. We are moving away from the "mobile game template" look by embracing **Kinetic Ornateism**—where heavy, ancient metallic textures meet fluid, holographic energy.

The system breaks the standard grid through **intentional layering**. Elements should never sit flat on a background; they are docked, floating, or encased. We use aggressive, angular geometry to suggest power and high-contrast typography to evoke a cinematic, editorial feel. The goal is to make the user feel like they are interacting with a physical artifact of immense power.

---

## 2. Colors & Atmospheric Depth
Our palette is a study in high-contrast prestige. We use deep, nocturnal blues to provide an infinite "void" for our gold and cyan elements to inhabit.

### The Palette (Material Design Mapping)
*   **Primary (`#f2ca50` / `#d4af37`):** Antique Gold. Used for high-value containment and "Sovereign" actions.
*   **Secondary (`#c6c6c6`):** Refined Silver. Used for structural highlights and secondary information.
*   **Tertiary (`#00e3fd`):** Astral Cyan. Reserved strictly for "Energy" (XP bars, active glows, holographic data).
*   **Surface (`#071421`):** Deep Night Blue. The foundation of the "void."

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. They look "cheap." Instead:
*   Define boundaries through **Surface Shifts**: Place a `surface_container_high` module on a `surface` background.
*   Define boundaries through **Bevels**: Use the `primary_container` (Antique Gold) as a thick, 3-4px 3D-beveled frame rather than a flat line.

### Surface Hierarchy & Nesting
Treat the UI as a physical rig.
1.  **Base Layer (`surface`):** The deep blue abyss.
2.  **Middle Layer (`surface_container_low`):** Large, semi-transparent panels for hero stats.
3.  **Active Layer (`surface_container_highest`):** High-interaction modules, docked into the gold frames.

### Signature Textures
Never use a flat `#071421`. Every background must feature a radial gradient transitioning from `surface` at the edges to `surface_bright` in the center to create a sense of focal illumination.

---

## 3. Typography
The typography is designed to feel "engraved." It is loud, cinematic, and authoritative.

*   **Display & Headlines (Space Grotesk):** Set to **Uppercase** with a letter-spacing of `0.05rem`. These are your "Titles of Power." Use `display-lg` for Hero Names and `headline-md` for Attribute Labels.
*   **Body (Manrope):** This provides a clean, technical contrast to the ornate headlines. Use `body-md` for lore descriptions or technical stat breakdowns.
*   **Labels (Space Grotesk):** Small, caps-locked technical readouts (e.g., "LEVEL UP," "UPGRADE COST").

**Hierarchy Tip:** Contrast a `display-sm` gold headline against a `body-sm` silver caption. The size and color disparity create a high-end editorial rhythm.

---

## 4. Elevation & Depth
We reject drop shadows in favor of **Tonal Layering** and **Atmospheric Glows**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` panel nested within a `surface_container_high` frame creates a "recessed slot" effect without needing a shadow.
*   **Energy Glows:** Instead of black shadows, "floating" items (like magic gems or buttons) use a `tertiary` (Cyan) or `primary` (Gold) outer glow with a blur of `20px-40px` at `15%` opacity. This mimics light emission rather than light blockage.
*   **Glassmorphism:** Holographic windows must use `surface_container_low` at 60% opacity with a `backdrop-blur` of `12px`. This creates the "terminal" feel requested.
*   **The Ghost Border:** For subtle containment, use `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Large Sovereign Buttons (Primary)
*   **Shape:** Hard-edged, angular (0px radius).
*   **Frame:** A 4px `primary_container` (Gold) border with a 3D-bevel effect.
*   **Fill:** A linear gradient of `primary` to `primary_container`.
*   **State:** On hover/active, the button gains a `tertiary` (Cyan) inner-glow to signify "Charging Energy."

### Status & XP Bars
*   **Track:** `surface_container_highest` with a recessed inner shadow.
*   **Fill:** A "Glass-Liquid" texture using a gradient of `tertiary` (Cyan) to `tertiary_container`. 
*   **Detail:** Add a 1px `tertiary_fixed` highlight along the top edge of the fill to simulate light hitting glass.

### Tactical Chips
*   **Usage:** For hero traits (e.g., "Mage," "Burst").
*   **Style:** No background fill. Use a `secondary` (Silver) ghost-border and `label-sm` typography.

### Input Fields & Terminal Windows
*   **Style:** Semi-transparent "Holographic" panels.
*   **Visual Separator:** Forbid dividers. Use a `2.25rem` (10) spacing gap or a slight shift from `surface_container_low` to `surface_container_high`.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a heavy gold ornament on only the left side of a panel to create a "custom" bespoke feel.
*   **Embrace the 0px Radius:** Every corner must be sharp. Angularity suggests danger and precision.
*   **Layer Metallics:** Mix `primary` (Gold) frames with `secondary` (Silver) internal accents for a sophisticated, multi-metal look.

### Don't:
*   **Don't use Rounded Corners:** Nothing in this world is soft.
*   **Don't use Standard Dividers:** Never use a line to separate content. Use the spacing scale (`1.1rem` to `1.75rem`) to create "visual islands."
*   **Don't use Pure White:** Use `secondary_fixed` (`#e3e2e2`) for high-contrast text; pure white breaks the "Dark Fantasy" immersion.
*   **Don't settle for Flat Colors:** If a surface is large, it needs a subtle gradient or a "brushed metal" texture overlay.
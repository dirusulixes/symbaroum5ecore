## v0.3.0
* "Soulless" special trait added (used for Dwarves and Undead) which mirrors any corruption damage to max hp (and caps current HP accordingly).
* Corruption fields now accept +/- delta values
* All items now have a "Corruption" field in their details which allow them to modify the corruption the item normally generates or adds corruption on use to items (such as features) that do not normally cause corruption.
* Spell school "None" added primarily for Troll Singer Songs. They are treated as favored cantrips under the hood.

### Known Issues
* Non-leveled-spell items (cantrips, weapons, features, etc) that generate corruption (using the corruption override) will NOT present a ability use dialog to optionally ignore the corruption gain.

## v0.2.3
* dnd5e system patch: Weapons that use ammunition but use a save instead of an attack roll will now both consume and use its ammunition's damage on its damage roll. Ex. Firetube uses a cone AoE with a save, but its damage is determined entirely by its ammunition.
  * Note: As with attack roll ammo, the damage type of the ammunition is ignored. Use die labels (e.g. `1d10[fire]`) to include ammunition specific damage.
* Moved needed syb5e system initialization to system's `init` stage.
* Fixed stock short/long rest functionality.

### Known Issues
* Origins which suffer max HP damage instead of corruption are not fully supported. Adjustments can be made by hand, but casting spells will, currently, always add corruption.
* Certain spells and abilities modify how much corruption a spell generates or adds corruption damage to origin/class features. This is unsupported currently.
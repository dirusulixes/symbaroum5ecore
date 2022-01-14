import { COMMON } from '../common.js'
import { logger } from '../logger.js';
import { SYB5E } from '../config.js'
import { Spellcasting } from './spellcasting.js'
import { SheetCommon } from './actor-sheet.js'


/* Initial attempt is via injection only */
export class Syb5eItemSheet {

  static NAME = "Syb5eItemSheet";

  static register() {
    this.hooks();
  }

  static hooks() {
    Hooks.on('renderItemSheet5e', this._renderItemSheet5e);
  }

  /* Handles injection of new SYB5E properties that are NOT handled
   * implicitly by a game.dnd5e.config object
   */
  static async _renderItemSheet5e(sheet, html/*, options*/) {
    /* need to insert checkbox for favored and put a favored 'badge' on the description tab */
    const item = sheet.item;

    /* if this is an owned item, owner needs to be a SYB sheet actor
     * if this is an unowned item, show always
     */
    if( item.parent && !item.parent.isSybActor() ) {
      logger.debug(`Item [${item.id}] with parent actor [${item.parent.id}] is not an SYB5E item`);
      return;
    }

    /* only concerned with adding favored to sybactor owned spell type items */
    if (item.type == 'spell'){

      const data = {
        isFavored: item.isFavored,
        favoredPath: SYB5E.CONFIG.PATHS.favored
      }

      const favoredCheckbox = await renderTemplate(`${COMMON.DATA.path}/templates/items/parts/spell-favored.html`, data);
      const favoredBadge = await renderTemplate(`${COMMON.DATA.path}/templates/items/parts/spell-favored-badge.html`, data);

      /* insert our favored checkbox */
      const preparedCheckbox = html.find('label.checkbox.prepared');
      preparedCheckbox.before(favoredCheckbox);

      /* insert our favored badge */
      const itemPropBadges = html.find('.properties-list li');
      itemPropBadges.last().after(favoredBadge);
    }

    /* need to rename "subclass" to "approach" */
    if (item.type == 'class') {

      /* get the subclass text field entry */
      const subclassLabel = html.find('[name="data.subclass"]').parent().prev('label');
      if (subclassLabel.length > 0) {
        subclassLabel.text(COMMON.localize("SYB5E.Item.Class.Approach"));
      } else {
        logger.debug("Could not find subclass label field in class item render.");
      }

      /* remove spellcasting progression not in syb5e */
      const filterList = Object.keys(game.syb5e.CONFIG.SPELL_PROGRESSION).reduce( (acc, key) => {

        if (acc.length == 0) {
          /* dont put the comma in front */
          acc+=`[value="${key}"]`
        } else {
          acc += `, [value="${key}"]`
        }
        return acc

      }, "");
      const progressionSelect = html.find('[name="data.spellcasting.progression"]');
      progressionSelect.children().not(filterList).remove();

    }

    /* only concerned with adding armor props to armor type items */
    if (item.isArmor){
      const data = {
        armorProps: item.properties,
        propRoot: game.syb5e.CONFIG.PATHS.armorProps,
        propLabels: game.syb5e.CONFIG.ARMOR_PROPS
      }

      const propCheckboxes = await renderTemplate(`${COMMON.DATA.path}/templates/items/parts/armor-properties.html`, data);

      const equipmentDetails = html.find('[name="data.proficient"]').parents('.form-group').last();

      equipmentDetails.after(propCheckboxes);
    }
  }

}

/**
 * AIRSPACE STANDOFF: Tactical Cards & Pylon Bay Coordinator
 */

class DeckManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.deckContainer = document.getElementById('maneuver-deck');
    this.pylonContainer = document.getElementById('pylon-rack');
    this.maneuverDeck = new ManeuverDeckRenderer(this);
    this.pylonBay = new PylonBayRenderer(this);
  }

  renderManeuverHand(activeUnit) {
    var container = this.deckContainer || document.getElementById('maneuver-deck');
    if (this.maneuverDeck) {
      this.maneuverDeck.render(activeUnit, container);
    }
  }

  renderPylonBay(activeUnit, targetEntity) {
    var container = this.pylonContainer || document.getElementById('pylon-rack');
    if (this.pylonBay) {
      this.pylonBay.render(activeUnit, targetEntity, container);
    }
  }
}

window.DeckManager = DeckManager;
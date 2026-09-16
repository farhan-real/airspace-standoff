/**
 * APEX VECTOR // Tactical Maneuvers Hand Deck
 */

class ManeuverDeckRenderer {
  constructor(deckManager) {
    this.dm = deckManager;
    this.game = deckManager.game;
    this.currentUnitId = null;
  }

  render(activeUnit, container) {
    if (!container) return;

    if (!activeUnit || activeUnit.hp <= 0) {
      container.innerHTML = '<div class="deck-empty-prompt">SELECT AN OPERATIONAL AIRFRAME TO DRAW TACTICAL CARDS</div>';
      this.currentUnitId = null;
      return;
    }

    var cardsList = window.MANEUVER_CARDS || [];

    if (this.currentUnitId !== activeUnit.id || container.children.length === 0) {
      this.currentUnitId = activeUnit.id;
      container.innerHTML = '';

      cardsList.forEach(card => {
        var cardEl = document.createElement('div');
        cardEl.className = 'maneuver-card';
        cardEl.dataset.cardId = card.id;

        cardEl.innerHTML = `
          <div class="mcard-name-row">
            <span class="mcard-name">${card.name}</span>
            <span class="mcard-cost">${card.cost || 0.7} TOK</span>
          </div>
          <div class="mcard-badge">[${card.badge || 'TACTICAL'}]</div>
          <div class="mcard-hint-box">
            <div class="mcard-when">${card.whenToUse || ''}</div>
            <div class="mcard-why">${card.whyToUse || ''}</div>
          </div>
          <div class="mcard-status-bar">
            <span class="bonus-tag">+${Math.round((card.evasionBonus || 0.3) * 100)}% EVASION</span>
            <span class="recom-badge hidden">RECOMMENDED</span>
          </div>
        `;

        cardEl.onclick = (e) => {
          e.preventDefault();
          if (!cardEl.classList.contains('locked')) {
            this.game.executeCard(card, activeUnit);
          }
        };

        container.appendChild(cardEl);
      });
    }

    var currentTokens = this.game.getCurrentCommanderTokenBucket();
    var cardElements = container.querySelectorAll('.maneuver-card');

    cardElements.forEach(el => {
      var cardId = el.dataset.cardId;
      var card = cardsList.find(c => c.id === cardId);
      if (!card) return;

      var cost = card.cost || 0.7;
      var isEligible = card.checkPrereq(activeUnit) && currentTokens >= cost;
      if (isEligible) el.classList.remove('locked');
      else el.classList.add('locked');

      var recomBadge = el.querySelector('.recom-badge');
      var isRecom = card.isRecommended && card.isRecommended(activeUnit, this.game);
      if (recomBadge) {
        if (isRecom) {
          recomBadge.classList.remove('hidden');
          el.classList.add('recommended-card');
        } else {
          recomBadge.classList.add('hidden');
          el.classList.remove('recommended-card');
        }
      }
    });
  }
}

window.ManeuverDeckRenderer = ManeuverDeckRenderer;
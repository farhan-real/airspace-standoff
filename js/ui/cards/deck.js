/**
 * AIRSPACE STANDOFF // Tactical Maneuvers Hand Deck
 */

class ManeuverDeckRenderer {
  constructor(deckManager) {
    this.dm = deckManager;
    this.game = deckManager.game;
    this.currentUnitId = null;
    this._cardNodes = [];
  }

  render(activeUnit, container) {
    if (!container) return;

    if (!activeUnit || activeUnit.hp <= 0) {
      if (this.currentUnitId !== 'EMPTY') {
        container.innerHTML = '<div class="deck-empty-prompt">SELECT AN OPERATIONAL AIRFRAME TO ISSUE FLIGHT MANEUVERS</div>';
        this.currentUnitId = 'EMPTY';
        this._cardNodes = [];
      }
      return;
    }

    const cardsList = window.MANEUVER_CARDS || [];

    if (this.currentUnitId !== activeUnit.id || this._cardNodes.length !== cardsList.length) {
      this.currentUnitId = activeUnit.id;
      this._cardNodes = [];
      container.innerHTML = '';
      const frag = document.createDocumentFragment();

      cardsList.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'maneuver-card';
        cardEl.dataset.cardId = card.id;

        cardEl.innerHTML = `
          <div class="mcard-name-row">
            <span class="mcard-name">${card.name}</span>
            <span class="mcard-cost">${card.cost || 0.7} TOK</span>
          </div>
          <div class="mcard-badge">[${card.badge || 'MANEUVER'}]</div>
          <div class="mcard-hint-box">
            <div class="mcard-when">${card.whenToUse || ''}</div>
            <div class="mcard-why">${card.whyToUse || ''}</div>
          </div>
          <div class="mcard-status-bar">
            <span class="bonus-tag">+${Math.round((card.evasionBonus || 0.3) * 100)}% EVASION</span>
            <span class="recom-badge hidden">REC</span>
          </div>
        `;

        cardEl.onclick = (e) => {
          e.preventDefault();
          if (!cardEl.classList.contains('locked')) {
            this.game.executeCard(card, activeUnit);
          }
        };

        const recomBadge = cardEl.querySelector('.recom-badge');
        this._cardNodes.push({ el: cardEl, card, recomBadge, lastLocked: null, lastRecom: null });
        frag.appendChild(cardEl);
      });
      container.appendChild(frag);
    }

    const currentTokens = this.game.getCurrentCommanderTokenBucket();
    for (let i = 0; i < this._cardNodes.length; i++) {
      const node = this._cardNodes[i];
      const card = node.card;
      const cost = card.cost || 0.7;
      const isLocked = !(card.checkPrereq(activeUnit) && currentTokens >= cost);
      if (node.lastLocked !== isLocked) {
        node.lastLocked = isLocked;
        node.el.classList.toggle('locked', isLocked);
      }

      const isRecom = Boolean(card.isRecommended && card.isRecommended(activeUnit, this.game));
      if (node.lastRecom !== isRecom) {
        node.lastRecom = isRecom;
        if (node.recomBadge) node.recomBadge.classList.toggle('hidden', !isRecom);
        node.el.classList.toggle('recommended-card', isRecom);
      }
    }
  }
}

window.ManeuverDeckRenderer = ManeuverDeckRenderer;

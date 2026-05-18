<script lang="ts">
  import type { AttackModifierCard, DeckStats } from "../domain/index.ts";

  export let stats: DeckStats;
  export let discardPile: AttackModifierCard[];
  export let cardImage: (card: AttackModifierCard) => string;
</script>

<aside class="side-panel" aria-label="Deck stats">
  <div class="stats-grid" data-testid="deck-stats">
    <div>
      <span>{stats.drawPile}</span>
      <p>Draw</p>
    </div>
    <div>
      <span>{stats.discardPile}</span>
      <p>Discard</p>
    </div>
    <div>
      <span>{stats.modifierPile}</span>
      <p>Class mods</p>
    </div>
    <div>
      <span>{stats.globalModifierPile}</span>
      <p>Global mods</p>
    </div>
  </div>

  <div class:warning={stats.shuffleNeeded} class="shuffle-state" data-testid="shuffle-state">
    {stats.shuffleNeeded ? "Shuffle needed" : "Deck clean"}
  </div>

  <section class="discard-list" aria-label="Discard pile">
    <h2>Discard</h2>
    {#if discardPile.length === 0}
      <p class="muted">No cards discarded.</p>
    {:else}
      <div class="mini-card-list" data-testid="discard-pile">
        {#each discardPile.slice().reverse().slice(0, 8) as card}
          <img src={cardImage(card)} alt={card.name} title={card.name} />
        {/each}
      </div>
    {/if}
  </section>
</aside>

<script lang="ts">
  import type { AttackModifierCard } from "../domain/index.ts";
  import type { DeckSessionAction, DeckSessionSnapshot } from "../state/deck-session.ts";

  export let snapshot: DeckSessionSnapshot;
  export let errorMessage = "";
  export let cardImage: (card: AttackModifierCard) => string;
  export let classIcon: (path: string) => string;
  export let cardValue: (card: AttackModifierCard) => string;
  export let onAction: (action: DeckSessionAction) => void = () => {};
</script>

<section class="deck-stage" aria-label="Draw controls and current card">
  <div class="selected-class">
    <img src={classIcon(snapshot.selectedClass.iconPath)} alt="" />
    <div>
      <p>Selected class</p>
      <strong>{snapshot.selectedClass.name}</strong>
    </div>
  </div>

  <div class="draw-zone" data-testid="draw-zone">
    {#if snapshot.lastDrawnCards.length > 0}
      {#each snapshot.lastDrawnCards as card}
        <figure class="drawn-card">
          <img src={cardImage(card)} alt={card.name} />
          <figcaption>{cardValue(card)}</figcaption>
        </figure>
      {/each}
    {:else}
      <div class="empty-draw">
        <span>{snapshot.stats.drawPile}</span>
        <p>cards ready</p>
      </div>
    {/if}
  </div>

  <div class="actions">
    <button type="button" class="primary" data-testid="draw-card" on:click={() => onAction("draw")}>
      Draw
    </button>
    <button type="button" data-testid="draw-two-cards" on:click={() => onAction("drawTwo")}>
      Draw 2
    </button>
    <button type="button" data-testid="shuffle-deck" on:click={() => onAction("shuffle")}>
      Shuffle
    </button>
    <button type="button" data-testid="add-bless" on:click={() => onAction("bless")}>
      Bless
    </button>
    <button type="button" data-testid="add-curse" on:click={() => onAction("curse")}>
      Curse
    </button>
    <button type="button" class="compact" data-testid="add-minus-one" on:click={() => onAction("minusOne")}>
      -1
    </button>
  </div>

  <div class="reset-actions" aria-label="Reset and history controls">
    <button
      type="button"
      data-testid="undo-action"
      disabled={!snapshot.canUndo}
      on:click={() => onAction("undo")}
    >
      Undo
    </button>
    <button type="button" data-testid="reset-scenario" on:click={() => onAction("resetScenario")}>
      Reset scenario
    </button>
    <button type="button" data-testid="reset-base-deck" on:click={() => onAction("resetBaseDeck")}>
      Reset base deck
    </button>
    <button type="button" data-testid="reset-character" on:click={() => onAction("resetCharacter")}>
      Reset character
    </button>
  </div>

  {#if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
  {/if}
</section>

<script lang="ts">
  import type { Perk } from "../domain/index.ts";

  export let perks: Perk[];
  export let activePerks: number[];
  export let onApplyPerk: (perkIndex: number) => void = () => {};
</script>

<section class="perks" aria-label="Class perks">
  <div class="section-heading">
    <h2>Perks</h2>
    <p>{activePerks.length} active</p>
  </div>

  <div class="perk-grid" data-testid="perk-list">
    {#each perks as perk, index}
      <button
        type="button"
        class:active={activePerks.includes(index)}
        disabled={activePerks.includes(index)}
        data-testid={`perk-${index}`}
        on:click={() => onApplyPerk(index)}
      >
        <span>{index + 1}</span>
        {perk.name}
      </button>
    {/each}
  </div>
</section>

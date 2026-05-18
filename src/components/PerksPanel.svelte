<script lang="ts">
  import type { Perk } from "../domain/index.ts";

  export let perks: Perk[];
  export let activePerks: number[];
  export let onTogglePerk: (perkIndex: number) => void = () => {};
</script>

<section class="perks" aria-label="Class perks">
  <div class="section-heading">
    <h2>Perks</h2>
    <p>{activePerks.length} active</p>
  </div>

  <div class="perk-grid" data-testid="perk-list">
    {#each perks as perk, index}
      <label class:active={activePerks.includes(index)} class="perk-option" data-testid={`perk-${index}`}>
        <input
          type="checkbox"
          checked={activePerks.includes(index)}
          on:change={() => onTogglePerk(index)}
        />
        <span>{index + 1}</span>
        {perk.name}
      </label>
    {/each}
  </div>
</section>

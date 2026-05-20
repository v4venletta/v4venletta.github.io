<script lang="ts">
  import type { CharacterSlotSnapshot } from "../state/deck-session.ts";

  export let characters: CharacterSlotSnapshot[];
  export let activeCharacterIndex = 0;
  export let onSelect: (index: number) => void = () => {};
</script>

<nav class="character-tabs" aria-label="Characters" data-testid="character-tabs">
  {#each characters as character}
    <button
      type="button"
      class:active={character.index === activeCharacterIndex}
      aria-current={character.index === activeCharacterIndex ? "page" : undefined}
      data-testid={`character-slot-${character.index}`}
      on:click={() => onSelect(character.index)}
    >
      <span>{character.name}</span>
      <strong>{character.selectedClass.name}</strong>
      {#if character.activePerks.length > 0}
        <small>{character.activePerks.length} perks</small>
      {/if}
    </button>
  {/each}
</nav>

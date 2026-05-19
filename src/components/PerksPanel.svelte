<script lang="ts">
  import type { Perk } from "../domain/index.ts";

  type PerkNamePart =
    | { type: "text"; value: string }
    | { type: "icon"; token: string; label: string };

  export let perks: Perk[];
  export let activePerks: number[];
  export let iconPath: (token: string) => string;
  export let onTogglePerk: (perkIndex: number) => void = () => {};

  function perkNameParts(name: string): PerkNamePart[] {
    const parts: PerkNamePart[] = [];
    const tokenPattern = /\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenPattern.exec(name)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: name.slice(lastIndex, match.index) });
      }

      const label = match[1];
      parts.push({ type: "icon", token: label.toLowerCase(), label });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < name.length) {
      parts.push({ type: "text", value: name.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: "text", value: name }];
  }
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
        <span class="perk-number">{index + 1}</span>
        <span class="perk-name">
          {#each perkNameParts(perk.name) as part}
            {#if part.type === "icon"}
              <img class="perk-icon" src={iconPath(part.token)} alt={part.label} title={part.label} />
            {:else}
              {part.value}
            {/if}
          {/each}
        </span>
      </label>
    {/each}
  </div>
</section>

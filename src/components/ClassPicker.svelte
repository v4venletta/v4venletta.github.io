<script lang="ts">
  import type { CharacterClassId, CharacterClassOption } from "../domain/index.ts";

  export let classOptions: CharacterClassOption[];
  export let selectedClassId: CharacterClassId;
  export let disabled = false;
  export let onSelect: (classId: CharacterClassId) => void = () => {};

  function handleChange(event: Event): void {
    onSelect((event.currentTarget as HTMLSelectElement).value as CharacterClassId);
  }
</script>

<label class="class-picker">
  <span>Class</span>
  <select
    data-testid="class-picker"
    value={selectedClassId}
    on:change={handleChange}
    disabled={disabled}
  >
    {#each classOptions as option}
      <option value={option.id}>{option.name}</option>
    {/each}
  </select>
</label>

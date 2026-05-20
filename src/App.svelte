<script lang="ts">
  import { onMount } from "svelte";
  import type { AttackModifierCard, CharacterClassId } from "./domain/index.ts";
  import { assetPath, loadAppData } from "./browser-data.ts";
  import CharacterTabs from "./components/CharacterTabs.svelte";
  import ClassPicker from "./components/ClassPicker.svelte";
  import DrawStage from "./components/DrawStage.svelte";
  import PerksPanel from "./components/PerksPanel.svelte";
  import StatsPanel from "./components/StatsPanel.svelte";
  import {
    DeckSessionController,
    type DeckSessionAction,
    type DeckSessionSnapshot,
  } from "./state/deck-session.ts";

  let controller: DeckSessionController | undefined;
  let snapshot: DeckSessionSnapshot | undefined;
  let isLoading = true;
  let errorMessage = "";

  onMount(async () => {
    try {
      controller = new DeckSessionController(await loadAppData());
      snapshot = controller.snapshot;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Unable to load app data";
    } finally {
      isLoading = false;
    }
  });

  function selectClass(classId: CharacterClassId): void {
    if (!controller) {
      return;
    }

    errorMessage = "";
    snapshot = controller.selectClass(classId);
  }

  function selectCharacter(index: number): void {
    if (!controller) {
      return;
    }

    errorMessage = "";
    snapshot = controller.selectCharacter(index);
  }

  function runAction(action: DeckSessionAction): void {
    runSessionAction(() => controller?.run(action));
  }

  function applyPerk(perkIndex: number): void {
    runSessionAction(() => controller?.togglePerk(perkIndex));
  }

  function runSessionAction(action: () => DeckSessionSnapshot | undefined): void {
    if (!controller) {
      return;
    }

    try {
      errorMessage = "";
      snapshot = action() ?? snapshot;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Action failed";
    }
  }

  function cardImage(card: AttackModifierCard): string {
    return assetPath(`images/${card.image}`);
  }

  function classIcon(path: string): string {
    return assetPath(path);
  }

  function perkIcon(token: string): string {
    return assetPath(`images/icons/${token}.png`);
  }

  function cardValue(card: AttackModifierCard): string {
    return card.value === undefined ? "Special" : String(card.value);
  }

  $: classOptions = controller?.classOptions ?? [];
</script>

<svelte:head>
  <title>Gloomhaven Attack Modifier Deck</title>
</svelte:head>

<main class="app-shell">
  <section class="workspace" aria-label="Attack modifier deck">
    <header class="topbar">
      <div>
        <p class="eyebrow">Gloomhaven</p>
        <h1>Attack modifier deck</h1>
      </div>

      <ClassPicker
        {classOptions}
        selectedClassId={snapshot?.selectedClassId ?? "brute"}
        disabled={isLoading}
        onSelect={selectClass}
      />
    </header>

    {#if isLoading}
      <div class="status" role="status">Loading deck data...</div>
    {:else if snapshot}
      <CharacterTabs
        characters={snapshot.characters}
        activeCharacterIndex={snapshot.activeCharacterIndex}
        onSelect={selectCharacter}
      />

      <div class="deck-layout">
        <DrawStage
          {snapshot}
          {errorMessage}
          {cardImage}
          {classIcon}
          {cardValue}
          onAction={runAction}
        />

        <StatsPanel stats={snapshot.stats} discardPile={snapshot.discardPile} {cardImage} />
      </div>

      <PerksPanel
        perks={snapshot.perks}
        activePerks={snapshot.activePerks}
        iconPath={perkIcon}
        onTogglePerk={applyPerk}
      />
    {:else}
      <p class="error" role="alert">{errorMessage || "The app could not start."}</p>
    {/if}
  </section>
</main>

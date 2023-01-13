<script setup lang="ts">
import { teamName } from 'lib/util'
import type { PlayersData } from 'lib/ws'
defineProps<{
  teams: PlayersData
  self?: { userId: string; teamId: number }
  turn: number
}>()
</script>

<template>
  <div class="teams">
    <div
      class="team"
      v-for="(team, i) in teams.teams"
      :class="{ active: i == turn, [`${teamName(i)}`]: true }"
      :key="i"
    >
      {{ teamName(i) }} Team

      <div class="player" v-for="player in team" :key="player">
        {{ player || 'Unknown player' }}
        <i v-if="self?.userId == player && self.teamId == i">(you)</i>
      </div>

      <div class="player" v-if="team.length == 0">
        <i>Empty team</i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
i {
  font-weight: normal;
  // font-style: normal;
  opacity: 0.75;
}
.team {
  padding: $pad;
  // width: 100%;
  flex: 1;
  max-width: 240pt;
  text-transform: uppercase;
  font-size: 0.65rem;
  border-radius: $br * 0.5;

  position: relative;
  &.active::before {
    $offset: 0.15rem;
    $border: 0.15rem;

    content: '';
    position: absolute;
    top: -$offset - $border;
    left: -$offset - $border;
    bottom: -$offset - $border;
    right: -$offset - $border;
    border: $border solid white;
    border-radius: $br;
  }
}
.teams {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: $gap * 3;
  padding: $pad * 2;
}
.player {
  font-size: 1rem;
  text-transform: none;
  padding: $gap;
  white-space: nowrap;
  min-width: min(8rem, 40vw);
  border-radius: $br * 0.25;
}

.Red {
  background-color: $red;
}

.Yellow {
  background-color: $yellow;
}
</style>

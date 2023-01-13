<template>
  <h1>Connect Four</h1>
</template>

<style scoped lang="scss">
h1 {
  text-align: center;
  font-family: 'Bakso Sapi', sans-serif;
  font-weight: bold;
  color: white;
  font-size: 3rem;

  text-align: center;
  width: fit-content;

  transition: margin-top 1s, font-size 1s;
  margin-top: 60pt;

  &.min {
    margin-top: $pad;
    font-size: 1.4rem;
  }

  user-select: none;
}
</style>

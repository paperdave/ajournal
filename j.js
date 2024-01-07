Bun.spawnSync({
  cmd: ["python3"],
  stdio: ["inherit", "inherit", "inherit"],
  cwd: `/something/that/doesnt/exist`,
});

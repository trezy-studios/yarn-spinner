module.exports = {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true
    }
  ],
	extends: 'semantic-release-monorepo',
}

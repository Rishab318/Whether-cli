module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        // Use a commit message that won't trigger another workflow run
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
  // Explicitly set the repository URL including auth token
  repositoryUrl: `https://\${process.env.GITHUB_TOKEN}@github.com/\${process.env.GITHUB_REPOSITORY}.git`,
};

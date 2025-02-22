const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "bump",
        "chore",
        "docs",
        "e2e",
        "feat",
        "fix",
        "optimize",
        "refactor",
        "revamp",
        "revert",
        "security",
        "style",
        "test",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "assets",
        "components",
        "atoms",
        "molecules",
        "organisms",
        "configs",
        "contexts",
        "enums",
        "hooks",
        "pages",
        "queries",
        "routes",
        "services",
        "utils",
        "main",
      ],
    ],
    "subject-case": [2, "never", ["start-case", "pascal-case"]],
  },
};

export default config;

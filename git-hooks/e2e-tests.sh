# Define color variables
Red="\033[0;31m"
Green="\033[0;32m"
Blue="\033[0;34m"
NC="\033[0m" # No Color

# e2e test code before commit.
echo "\n${Blue}=================================${NC}\n"

echo "${Green}Start - E2E testing.${NC}"

pnpm e2e-run:pre-commit
E2E_EXIT_CODE=$?

# Check if build failed
if [ $E2E_EXIT_CODE -ne 0 ]; then
    echo "${Red}E2E tests failed with exit code $E2E_EXIT_CODE${NC}"
    echo "\n${Blue}=================================${NC}\n"
    exit 1
fi

echo "${Green}End - E2E testing.${NC}"

echo "\n${Blue}=================================${NC}\n"
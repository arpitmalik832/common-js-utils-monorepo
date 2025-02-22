# Define color variables
Red="\033[0;31m"
Green="\033[0;32m"
Blue="\033[0;34m"
NC="\033[0m" # No Color

# validate code before commit.
echo "\n${Blue}=================================${NC}\n"

echo "${Green}Start - Linting of the code.${NC}"

pnpm lint:fix
LINT_EXIT_CODE=$?

# Check if build failed
if [ $LINT_EXIT_CODE -ne 0 ]; then
    echo "${Red}Lint failed with exit code $LINT_EXIT_CODE${NC}"
    echo "\n${Blue}=================================${NC}\n"
    exit 1
fi
# Adding changes made by lint-fix
git add .

echo "${Green}End - Linting of the code.${NC}"

echo "\n${Blue}=================================${NC}\n"
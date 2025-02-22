# Define color variables
Red="\033[0;31m"
Green="\033[0;32m"
Blue="\033[0;34m"
NC="\033[0m" # No Color

# validate unused code before commit.
echo "\n${Blue}=================================${NC}\n"

echo "${Green}Start - Knipping of the code.${NC}"

pnpm knip:prod:check-files
KNIP_EXIT_CODE=$?

# Check if build failed
if [ $KNIP_EXIT_CODE -ne 0 ]; then
    echo "${Red}Knip failed with exit code $KNIP_EXIT_CODE${NC}"
    echo "\n${Blue}=================================${NC}\n"
    exit 1
fi

echo "${Green}End - Knipping of the code.${NC}"

echo "\n${Blue}=================================${NC}\n"

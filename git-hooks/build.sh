# Define color variables
Red="\033[0;31m"
Green="\033[0;32m"
Blue="\033[0;34m"
NC="\033[0m" # No Color

# # build code before commit 
# echo "\n${Blue}=================================${NC}\n"

# echo "${Green}Start - Check build (staging).${NC}"

# pnpm build
# BUILD_EXIT_CODE=$?

# # Check if build failed
# if [ $BUILD_EXIT_CODE -ne 0 ]; then
#     echo "${Red}Build failed with exit code $BUILD_EXIT_CODE${NC}"
#     echo "\n${Blue}=================================${NC}\n"
#     exit 1
# fi

# echo "${Green}End - Check build (staging).${NC}"

# echo "\n${Blue}=================================${NC}\n"

# # build-beta code before commit 
# echo "\n${Blue}=================================${NC}\n"

# echo "${Green}Start - Check build (beta).${NC}"

# pnpm build:beta
# BUILD_EXIT_CODE=$?

# # Check if build failed
# if [ $BUILD_EXIT_CODE -ne 0 ]; then
#     echo "${Red}Build failed with exit code $BUILD_EXIT_CODE${NC}"
#     echo "\n${Blue}=================================${NC}\n"
#     exit 1
# fi

# echo "${Green}End - Check build (beta).${NC}"

# echo "\n${Blue}=================================${NC}\n"

# build-prod code before commit 
echo "\n${Blue}=================================${NC}\n"

echo "${Green}Start - Check build (production).${NC}"

pnpm build:prod
BUILD_EXIT_CODE=$?

# Check if build failed
if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "${Red}Build failed with exit code $BUILD_EXIT_CODE${NC}"
    echo "\n${Blue}=================================${NC}\n"
    exit 1
fi

echo "${Green}End - Check build (production).${NC}"

echo "\n${Blue}=================================${NC}\n"
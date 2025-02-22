# Define color variables
Red="\033[0;31m"
Green="\033[0;32m"
Blue="\033[0;34m"
NC="\033[0m" # No Color

# validate file size before commit.
echo "\n${Blue}=================================${NC}\n"

echo "${Green}Start - Checking the code for file sizes.${NC}"

# This is a pre-commit hook that ensures attempts to commit files that are
# larger than $limit to your _local_ repo fail, with a helpful error message.

# Maximum file size limit in bytes
limit=$(( 50 * 1024 * 1024 )) # 50MB
limitInMB=$(( $limit / (1024 * 1024) ))

# Move to the repo root so git files paths make sense
repo_root=$( git rev-parse --show-toplevel )
cd $repo_root

empty_tree=$( git hash-object -t tree /dev/null )

if git rev-parse --verify HEAD > /dev/null 2>&1
then
	against=HEAD
else
	against="$empty_tree"
fi

# Set split so that for loop below can handle spaces in file names by splitting on line breaks
IFS='
'

echo "Checking staged file sizes"

shouldFail=false
# `--diff-filter=d` -> skip deletions
for file in $( git diff-index --cached --diff-filter=d --name-only "$against" ); do
	# Skip for directories (git submodules)
	if [[ -f "$file" ]]; then
		file_size=$( ls -lan $file | awk '{ print $5 }' )
		if [ "$file_size" -gt  "$limit" ]; then
echo "${Red}File $file is $(( $file_size / 2**20 )) MB, which is larger than our configured limit of $limitInMB MB shouldFail=true${NC}"
		fi
	fi
done

if $shouldFail
then
    echo "${Green}If you really need to commit this file, you can push with the --no-verify switch, but the file should definitely, definitely be under $limitInMB MB!!!${NC}"
	  echo "${Red}Commit aborted${NC}"
    exit 1;
fi

echo "${Green}End - Checking the code for file sizes.${NC}"

echo "\n${Blue}=================================${NC}\n"

#!/bin/sh
TYPE=$(gum choose "fix" "feat" "docs" "style" "refactor" "test" "chore" "revert")
SCOPE=$(gum input --placeholder "scope")
BREAKING_CHANGE=$(gum confirm -n "Breaking change?" && printf "!")

# Since the scope is optional, wrap it in parentheses if it has a value.
[[ -n "$SCOPE" ]] && SCOPE="($SCOPE)"

# Pre-populate the input with the type(scope): so that the user may change it
SUMMARY=$(gum input --value "$TYPE$SCOPE$BREAKING_CHANGE: " --placeholder "Summary of this change")
DESCRIPTION=$(gum write --placeholder "Details of this change")

# Commit these changes
gum confirm "Commit changes?" && git commit -m "$SUMMARY" -m "$DESCRIPTION"

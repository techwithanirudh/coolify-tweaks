ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"

git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$ZSH_CUSTOM/themes/powerlevel10k"

sed -i -e 's/ZSH_THEME=.*/ZSH_THEME="powerlevel10k\/powerlevel10k"/g' "$HOME/.zshrc"
echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> "$HOME/.zshrc"

curl -fsSL https://raw.githubusercontent.com/techwithanirudh/dotfiles/main/zsh/.p10k.zsh -o "$HOME/.p10k.zsh"
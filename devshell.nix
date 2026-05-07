{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  name = "skyvault-devshell";

  buildInputs = with pkgs; [
    nodejs_22
    mongodb-ce
    mongosh
    git
    curl
    jq
  ];

  shellHook = ''
    echo "☁️ Entering SkyVault DevShell"
    echo "📦 Node: $(node -v)"
    echo "🍃 MongoDB: $(mongod --version | head -n 1)"
    echo ""
    echo "Available commands:"
    echo "  npm install"
    echo "  npm run dev"
    echo "  mongod --dbpath ./data/db"
    echo ""

    mkdir -p data/db
    mkdir -p backend/src/uploads
  '';
}

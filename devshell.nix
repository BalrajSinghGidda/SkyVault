{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  name = "skyvault-devshell";

  buildInputs = with pkgs; [
    nodejs_22
    git
    curl
    jq
    # MongoDB Community Edition not available in stable NixOS
    # Use alternatives below:
  ];

  shellHook = ''
    echo "☁️ Entering SkyVault DevShell"
    echo "📦 Node: $(node -v)"
    echo ""
    echo "⚙️  MongoDB Setup for NixOS:"
    echo ""
    echo "Option 1: MongoDB Atlas (RECOMMENDED)"
    echo "  ✓ No local installation needed"
    echo "  ✓ Free tier available"
    echo "  ✓ Steps:"
    echo "    1. Create cluster: https://www.mongodb.com/cloud/atlas"
    echo "    2. Get connection string"
    echo "    3. Update backend/.env with MONGO_URI"
    echo "    4. npm run dev"
    echo ""
    echo "Option 2: Docker (requires Docker installed)"
    echo "  ✓ Isolated MongoDB instance"
    echo "  ✓ Easy to tear down"
    echo "  ✓ Commands:"
    echo "    docker run -d -p 27017:27017 --name skyvault-mongo mongo:latest"
    echo "    docker stop skyvault-mongo  (to stop)"
    echo "    docker rm skyvault-mongo    (to cleanup)"
    echo ""
    echo "Option 3: System MongoDB"
    echo "  ✓ If installed via nix-shell or system package"
    echo "  ✓ Command: mongod --dbpath ./data/db"
    echo ""
    echo "Quick Start:"
    echo "  cd backend && npm install && npm run dev"
    echo ""

    mkdir -p data/db
    mkdir -p backend/src/uploads
  '';
}

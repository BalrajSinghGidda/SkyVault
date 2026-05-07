{
  description = "SkyVault DBMS Project Dev Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        name = "skyvault-shell";

        packages = with pkgs; [
          nodejs_22
          git
          curl
          jq
          # MongoDB: Use Atlas connection string or Docker instead
          # For NixOS: mongodb-ce not available in stable nixpkgs
          # docker  # Uncomment if you want to use MongoDB in Docker
        ];

        shellHook = ''
          echo "☁️ SkyVault Development Environment Ready"
          echo ""
          echo "Node Version: $(node -v)"
          echo ""
          echo "⚙️  Setup Instructions:"
          echo ""
          echo "Option 1: Use MongoDB Atlas (Recommended for NixOS)"
          echo "  1. Create free cluster at https://www.mongodb.com/cloud/atlas"
          echo "  2. Get connection string"
          echo "  3. Update backend/.env with MONGO_URI"
          echo ""
          echo "Option 2: Use Docker for MongoDB"
          echo "  docker run -d -p 27017:27017 --name skyvault-mongo mongo:latest"
          echo "  Then: mongod --version  # Check connection"
          echo ""
          echo "Option 3: Use local MongoDB (if installed system-wide)"
          echo "  mongod --dbpath ./data/db"
          echo ""

          mkdir -p data/db
          mkdir -p backend/src/uploads
        '';
      };
    });
}

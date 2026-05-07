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
          mongodb-ce
          mongosh
          git
          curl
          jq
        ];

        shellHook = ''
          echo "☁️ SkyVault Development Environment Ready"
          echo ""
          echo "Node Version: $(node -v)"
          echo "Mongo Shell: $(mongosh --version)"
          echo ""

          mkdir -p data/db
          mkdir -p backend/src/uploads
        '';
      };
    });
}

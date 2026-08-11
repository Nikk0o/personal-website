{
  description = "Personal website";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
		flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils }: {
		flake-utils.lib.eachDefaultSystem (system:
			let pkgs = nixpkgs.legacyPackages.${system}; in
			{
				nixosModules.default = ./module.nix;
			}
		);
  };
}

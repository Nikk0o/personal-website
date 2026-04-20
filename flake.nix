{
	description = "Niko's personal website";

	inputs = {
		nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
		flake-utils.url = "github:numtide/flake-utils";
	};

	outputs = { self, nixpkgs, flake-utils }@inputs:
		flake-utils.lib.eachDefaultSystem
		(system:
			let pkgs = nixpkgs.legacyPackages.${system};
			    server = import ./default.nix { pkgs = pkgs; };
			in
			{

				apps.default = {
					type = "app";
					program = "${server}/bin/run";
				};

				packages.default = server;
			}
		);
}

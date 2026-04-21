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
			    srvpkg =
						(pkgs.callPackage ./default.nix {}).overrideAttrs (final: prev:
							{ installPhase = prev.installPhase + ''

mkdir $out/bin
echo -e "#!/bin/bash''\n${pkgs.jekyll}/bin/jekyll serve --destination $out --port 4000 --skip-initial-build" > $out/bin/run
chmod +777 $out/bin/run'';
							}
						);
			in
			{
				# For testing locally
				apps.default = {
					type = "app";
					program = "${srvpkg}/bin/run";
				};
			}
		);
}

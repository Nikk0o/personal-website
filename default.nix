{ pkgs ? import <nixpkgs> {}, ... }:
	pkgs.stdenv.mkDerivation {
		name = "Niko personal website";
		src = ./.;

		dontUnpack = true;

		installPhase = ''
			mkdir $out
			mv ./* $out

			echo -e "#!bash\n ${pkgs.jekyll}/bin/jekyll serve -s $out --port 4000" > $out/run.sh
			chmod +777 $out/run.sh
		'';
	}

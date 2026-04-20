{ pkgs ? import <nixpkgs> {}, ... }:
	pkgs.stdenv.mkDerivation {
		name = "Niko personal website";
		src = ./.;

		dontUnpack = true;

		buildInputs = with pkgs; [ jekyll bundler ];
		buildPhase = "jekyll build";

		installPhase = ''
			mkdir $out
			mv ./_site $out

			echo -e "#!bash\n${pkgs.jekyll}/bin/jekyll serve $out --port 4000 --skip-initial-build" > $out/run.sh
			chmod +777 $out/run.sh
		'';
	}

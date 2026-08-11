{ srvroot, pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
	name = "lagarto-gay";
	dontUnpack = true;

	buildPhase = "";

	installPhase = ''
		mkdir -p ${srvroot}
		cp frontend ${srvroot}
		cp backend ${srvroot}'';
}

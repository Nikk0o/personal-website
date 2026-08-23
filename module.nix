{ lib, pkgs, config, ... }:
let cfg = config.services.lagarto-gay; in
{
	options = {
    services.lagarto-gay = {
			enable = lib.mkEnableOption "Run the server";
		};
	};

	config =
	let
		front = (pkgs.callPackage ./frontend/default.nix { inherit pkgs; });
	in
	lib.mkIf cfg.enable {

		environment.systemPackages = [
			front
		];

		services.nginx = {
			enable = true;

			virtualHosts."leksu.sh" = {
				root = "${front}";
			};
		};
	};
}

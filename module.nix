{ config, pkgs, ... }:
let lib = pkgs.lib;
    cfg = config.module;
		types = lib.types;
in
{
	imports = [];

	options = {
		enable = lib.mkEnableOption "Run the server.";

		port = lib.mkIf cfg.enable {
			type = types.int;
			default = 4000;
		};

		galleryPath = lib.mkIf cfg.enable {
			type = types.path;
			default = /srv/art;
		};

	};

	config =
		let sitepkg = pkgs.callPackage ./package.nix { };
		in
			lib.mkIf cfg.enable {
				environment.systemPackages = [
					sitepkg
				];

				systemd.sevices."serve-leksu.sh" = {
					enable = true;
					description = "Will serve with jekyll.";

					serviceConfig = {
						Type = "exec";
						ExecStart =
							"jekyll serve -p ${cfg.port} --destination ${sitepkg} --skip-initial-build";
					};
				};
			};
}

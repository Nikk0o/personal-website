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

		domain = lib.mkIf cfg.enable {
			type = types.str;
			default = "leksu.sh";
		};

		galleryPath = lib.mkIf cfg.enable {
			type = types.path;
			default = /srv/art;
		};

	};

	config =
	let srvpkg = pkgs.callPackage ./package.nix { };
	in
		lib.mkIf cfg.enable {
			environment.systemPackages = [
				sitepkg
			];

			systemd.sevices.${domain} = {
				enable = true;
				description = "Will serve with jekyll.";

				serviceConfig = {
					Type = "exec";
					ExecStart =
						"jekyll serve -p ${cfg.port} --destination ${srvpkg} --skip-initial-build";
				};
			};

			services.nginx.virtualHosts.${domain} = {
				locations."/" = {
					proxyPass = "http://localhost:${cfg.port}";
				};
			};
		};
}

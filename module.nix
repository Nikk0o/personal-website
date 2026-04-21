{ config, pkgs, lib, ... }:
let cfg = config.leksush;
		types = lib.types;
in
{
	imports = [];

	options = {
		leksush = {
			enable = lib.mkEnableOption "Run the server.";

			port = lib.mkOption {
				type = types.int;
				default = 4000;
			};

			domain = lib.mkOption {
				type = types.str;
				default = "leksu.sh";
			};

			galleryPath = lib.mkOption {
				type = types.path;
				default = /srv/art;
			};
		};
	};

	config =
	let srvpkg = pkgs.callPackage ./default.nix { };
	in
		lib.mkIf cfg.enable {
			environment.systemPackages = [
				srvpkg
			];

			services.nginx.virtualHosts.${cfg.domain} = {
				locations = {
					"/" = {
						root = "${srvpkg}";
					};
				};
			};

			networking.firewall.allowedTCPPorts = [ cfg.port ];
		};
}

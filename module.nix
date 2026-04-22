{ config, pkgs, lib, ... }:
let cfg = config.leksush;
		types = lib.types;
in
{
	imports = [];

	options = {
		leksush = {
			enable = lib.mkEnableOption "Run the server.";

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

			services.nginx.virtualHosts = {

			/*
				# This doesn't work for some reason,
				# it redirects everything to /gallery/ (at least when testing with localhost)
				"art.${cfg.domain}" = {
					serverName = "art.${cfg.domain}";
					root = "${srvpkg}/gallery/";
				};

				"blog.${cfg.domain}" = {
					serverName = "blog.${cfg.domain}";
					root = "${srvpkg}/blog/";
				};
			*/

				${cfg.domain} = {
					serverName = cfg.domain;

					locations = {
						"/" = {
							root = "${srvpkg}";
						};

						"/arts/" = {
							alias = cfg.galleryPath;
						};
					};
				};
			};
		};
}

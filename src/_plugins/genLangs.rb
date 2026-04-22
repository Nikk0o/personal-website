module Langs
  class Generator < Jekyll::Generator
    def generate(site)
      langs = site.data['langs'].keys
      siteMap = site.data['pages']

      siteMap.each do |file|

        redirectPage = Jekyll::Page.new(site, ".", ".", file['name'] + ".html")
        redirectPage.data['permalink'] = "/" + file['permalink']
        redirectPage.data['layout'] = "redirect"

        site.pages << redirectPage

        langs.each do |lang|
          newPage = Jekyll::Page.new(site, ".", ".", lang + "-" + file['name'] + ".html")
          newPage.data['lang'] = lang
          newPage.data['permalink'] = "/" + lang + "/" + file['permalink']
          newPage.data['layout'] = file['name']
          newPage.data['style'] = file['name'] + ".css"

          if file['doors']
            newPage.data['doors'] = file['doors']
          end

          site.pages << newPage
        end
      end
    end
  end
end

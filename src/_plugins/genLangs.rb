module Langs
  class Generator < Jekyll::Generator
    def generate(site)
      langs = site.data['langs']
      siteMap = site.data['map']

      langs.each do |lang|
        siteMap.each do |file|
          newPage = Jekyll::Page.new(site, ".", ".", lang[0] + "-" + file['name'] + ".html")
          newPage.data['lang'] = lang[0]
          newPage.data['permalink'] = "/" + lang[0] + "/" + file['permalink']
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

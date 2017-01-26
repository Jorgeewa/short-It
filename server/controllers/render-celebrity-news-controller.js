var request = require('request');
var cheerio = require('cheerio');

module.exports.render = function(req, res){
    url = 'http://www.pulse.ng/celebrities';
    
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            
            var titles = [], hrefs = [], artistes = [], images = [];
            var counter = 0;
            var json = [];
            
            $('a.news-img').filter(function(){
                var data = $(this);
                artiste = data.attr('title');
                title = data.text();
                href = data.attr('href');
                
                artistes.push(artiste);
                titles.push(title);
                hrefs.push(href);
            })
            
            $('img.lazyload').filter(function(){
                    var data = $(this);
                    image = data.attr('data-pulsesrc');
                    images.push(image);
                    json.push({
                        title : titles[counter],
                        artiste : artistes[counter],
                        href : hrefs[counter],
                        image : image
                    });
                    counter++;
                })
            
            res.json(json);
        }
    })
}
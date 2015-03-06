var
    glob = require("glob"),
    fs = require('fs-extra'),
    _ = require('lodash'),
    path = require('path'),

    src = 'svg-iso2/',
    dest = 'svg-iso3/'
;

var ref = fs.readJsonSync('iso-3166-1.json', {throws: false});
var countries = [];

_.each(glob.sync("svg-iso2/country-4x3/**/*.svg"), function(filename){
    var iso2 = path.basename(filename, '.svg');

    if (ref.Results[iso2.toUpperCase()] !== undefined) {
        var def = ref.Results[iso2.toUpperCase()];
        countries.push({
            name: def.Name,
            iso2: def.CountryCodes.iso2,
            iso3: def.CountryCodes.iso3
        });

    } else {
        console.log("cant't convert : " + iso2.toUpperCase());
    }
});

_.each(countries, function(country){
    if (country.iso3) {
        _.each(glob.sync("svg-iso2/**/" + country.iso2.toLowerCase() + ".svg"), function(filename){
            var dir = path.dirname(filename).split(path.sep);
            dir[0] = "svg-iso3";

            var copyname = dir.join('/') + '/' + country.iso3.toLowerCase() + '.svg';
            console.log('copy ' + filename + ' to ' + copyname);
            fs.copySync(filename, copyname);
        });
    }
});

fs.outputJson('countries.json', countries, function(err) {
    if (err) console.log(err);
});

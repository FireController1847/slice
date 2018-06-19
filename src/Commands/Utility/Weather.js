/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');
const countries = require('country-data').countries.all;
const { MessageEmbed } = require('discord.js');
const request = require('snekfetch');

class Weather extends Command {
  constructor() {
    super('weather', {
      aliases: ['weather'],
      description: 'Gets the current temperature, condition, humidity, and forecast for the requested area.',
      typing: true
    });
  }
  async exec(m) {
    const city = m.content.slice(m.content.search(' ') + 1);
    const makeURL = city2 => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.' +
        'forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city2)}%22)' + 
        '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
    const celsius = fahrenheit => Math.round(((fahrenheit - 32) * 5) / 9);
    const json = await request.get(makeURL(city));

    if (!json || !json.body || !json.body.query.results || !json.body.query.results.channel) {
      throw new Error('Failed to load weather info!');
    }

    const weatherInfo = json.body.query.results.channel;
    const forecast = weatherInfo.item.forecast[0];

    const countryInfo = countries.find(country => country.name === weatherInfo.location.country);
    const countryEmoji = countryInfo ? countryInfo.emoji : ':grey_question:';

    const description = `The current temperature in ${weatherInfo.location.city} is ${weatherInfo.item.condition.temp}°F/${celsius(weatherInfo.item.condition.temp)}°C`;

    const embed = new MessageEmbed()
      .setTitle(`${countryEmoji} ${weatherInfo.item.title}`)
      .setDescription(`${description}`)
      .setColor(0x87ceeb)
      .setTimestamp()
      .addField('Condition', weatherInfo.item.condition.text, true)
      .addField('Humidity', weatherInfo.atmosphere.humidity + '%', true)
      .addField(':wind_blowing_face: Wind', `*${weatherInfo.wind.speed}mph* ; direction: *${weatherInfo.wind.direction}°*`, true)
      .addField(':sunrise: Sunrise', weatherInfo.astronomy.sunrise, true)
      .addField(':city_sunset: Sunset', weatherInfo.astronomy.sunset, true)
      .addField(`Forecast for today is *${forecast.text}*`, `Highest temp is ${forecast.high}°F/${celsius(forecast.high)}°C, lowest temp is ${forecast.low}°F/${celsius(forecast.low)}°C`, false);


    m.channel.send({ embed });
  }
}

module.exports = Weather;
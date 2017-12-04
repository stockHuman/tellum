/**
 * @author Michael Hemingway
 * Desktop Client
 *
 * Concordia University, CART 351. November 2017
 */

(function ($) {
	'use strict'

	mapboxgl.accessToken = 'pk.eyJ1Ijoic3RvY2todW1hbiIsImEiOiJjamE4dWxyZTUwMG9zMnFzNDFucHF0ZzdyIn0.DpVSsrPakJynuKVNifh7uA';
	
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/stockhuman/cja8w6mus0yvc2sqazwtisw9p',
		// center: [, ],
		center: [-73.5878100, 45.5088400],
		zoom: 10
	})

	const server = 'https://c351.michaelhemingway.com/projects/tellum/api.php/sounds/'
	let nodes = []

	$(document).ready(function () {

		// fetch meta for the first time
		axios.get(server + '?columns=id,meta,datetime,sound_size')
		.then(response => {
			let tmp = response.data.sounds.records

			for (let i = tmp.length - 1; i >= 0; i--) {
				tmp[i] = {
					id: tmp[i][0],
					loc: JSON.parse(tmp[i][1]),
					date: tmp[i][2],
					len: Math.floor((tmp[i][3] / 10000) * 100) / 100
				}
			}
			nodes = tmp

			populate()
		})
	})

	function populate () {
		for (let i = nodes.length - 1; i >= 0; i--) {
			let m = document.createElement('div')

			axios.get(
				'https://api.mapbox.com/v4/geocode/mapbox.places/' +
				nodes[i].loc.lon +
				',' +
				nodes[i].loc.lat +
				'.json?access_token=' +
				mapboxgl.accessToken)
			.then(response => {
				nodes[i].city = response.data.features[2].place_name
				console.log(nodes[i])

				m.setAttribute('data-ID', nodes[i].id)
				m.setAttribute('data-city', nodes[i].city)
				m.setAttribute('data-date', nodes[i].date)
				m.setAttribute('data-len', nodes[i].len)

				new mapboxgl.Marker(m)
				.setLngLat([nodes[i].loc.lon, nodes[i].loc.lat])
				.addTo(map)
			})
		}
	}
}(jQuery));



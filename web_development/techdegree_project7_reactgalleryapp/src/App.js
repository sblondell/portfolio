import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import { APIKey } from './.config.js';
import Header from './components/Header.js';
import Gallery from './components/Gallery.js';

class App extends Component {
	constructor() {
		super();
		this.state = {
			gallery: {},
			apiKey: APIKey,
			customLoaded: false,
			customSearchTerm: '',
			preLoading: true,
		};
	}

	searchManager = (fillStaticGallery, ...searchTerms) => {
		searchTerms.forEach(topic => {
			let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search\
								&api_key=${this.state.apiKey}&tags=${topic}&per_page=24&format=json&nojsoncallback=1`;

			fetch(url)
				.then(response => response.json())
				.then(({ photos }) => {
					// Creating an array of objects (image information)
					const imgInfo = photos.photo.map(item => ({
						url: `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_n.jpg`,
						title: item.title
					}));
					// Temporary working objects to update state objects
					const userSearchGallery = {};
					let customLoaded = false;
					let customSearchTerm = '';

					userSearchGallery[topic] = imgInfo;

					// If not filling the intial "database" gallery, then the API request is for a custom user search...
					if (!fillStaticGallery) {
						customLoaded = true;
						customSearchTerm = topic;
					}

					this.setState(prevState => ({
						gallery: { ...prevState.gallery, ...userSearchGallery },
						customLoaded,
						preLoading: false,
						customSearchTerm
					}));
				})
				.catch(error => console.error("There was a problem: " + error));
		});
	}

	componentDidMount() {
		Promise.all([this.searchManager(true, 'birds', 'cats', 'dogs')])
			.catch(err => `There was a problem with initial loading of images... ${err}`);
	}

	handleSubmit = searchTerm => {
		this.searchManager(false, searchTerm);
	}

	render() {
		const { customSearchTerm } = this.state;
		const { customLoaded } = this.state;
		const propsForGallery = {
			customSearchTerm: customSearchTerm,
			customLoaded: customLoaded,
			list: this.state.gallery
		}
		return (
			<div>
				<BrowserRouter>
					<div>
						<Header getSearch={this.handleSubmit} />
						{this.state.preLoading ?
							<p>Loading...</p> :
							<Switch>
								<Route exact path="/"
									render={routeProp => <Gallery {...routeProp} {...propsForGallery} />} />
								<Route exact path="/gallery"
									render={routeProp => <Gallery {...routeProp} {...propsForGallery} />} />
								<Route path="/gallery/:topic"
									render={routeProp => <Gallery {...routeProp} {...propsForGallery} />} />
								<Route render={() => <p>404</p>} />
							</Switch>
						}
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;

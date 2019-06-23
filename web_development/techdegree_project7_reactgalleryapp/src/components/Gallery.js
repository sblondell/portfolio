import React from 'react';

import Image from './Image.js';

const Gallery = ({ list, match }) => {
	const topic = match.params.topic || 'cats';
	const title = (match.params.topic ? `Results For ${match.params.topic}` : `Welcome, have some ${topic}...`);

	/*
	 * Creates an array of JSX Image components or a "search not found" message wrapped in a try/catch which
	 * guards against searches for absent data in the gallery. ex. "/gallery/nfj#93jfn"
	 * @return  {Array}  images - array of JSX Image components || "search not found" message
	*/
	const populatePage = (topic = 'cats') => {
		const data = list;
		let images = null;

		try {
			images = data[topic].map((item, index) => <Image src={item.url} key={index} title={item.title} />);
		} catch {
			images = (<li className="not-found">
				<h3>No Results Found</h3>
				<p>Your search did not return any results. Please try again.</p>
				<p>Make sure to use the search function.</p>
			</li>);
		}
		return images;
	}

	return (
		<div className="photo-container">
			<h2>{title}</h2>
			<br />
			<ul>
				{populatePage(topic)}
			</ul>
		</div>
	);
}

export default Gallery;
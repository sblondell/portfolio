import React from 'react';
import { withRouter } from 'react-router-dom';

import SearchForm from './SearchForm.js';
import NavBar from './NavBar.js';

const Header = ({ getSearch }) => {
	const title = <h1>Image Gallery</h1>;

	return (
		<div>
			<p>{title}</p>
			<br />
			<SearchForm getSearch={getSearch} />
			<br />
			<NavBar />
		</div>
	);
}

export default withRouter(Header);
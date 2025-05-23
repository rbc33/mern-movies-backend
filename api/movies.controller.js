import MoviesDAO from "../dao/moviesDAO.js";

export default class MoviesController {
	static async apiGetMovies(req, res, next) {
		const moviesPerPage = req.query.moviesPerPage
			? parseInt(req.query.moviesPerPage)
			: 20;
		const page = req.query.page ? parseInt(req.query.page) : 0;

		let filters = {};
		if (req.query.rated) {
			filters.rated = req.query.rated;
		} else if (req.query.title) {
			filters.title = req.query.title;
		}
		try {
			const movieRes = await MoviesDAO.getMovies({
				filters,
				page,
				moviesPerPage,
			});
			if (!movieRes) {
				throw new Error("No results returned from MoviesDAO");
			}
			let response = {
				movies: movieRes.moviesList,
				page: page,
				filters: filters,
				entries_per_page: moviesPerPage,
				total_results: movieRes.totalNumMovies,
			};
			res.json(response);
		} catch (e) {
			console.error(`API Error: ${e.message}`);
			res.status(500).json({ error: e.message });
		}
	}
	static async apiGetMovieById(req, res, next) {
		try {
			let id = req.params.id || {};

			let movie = await MoviesDAO.getMovieById(id);

			if (!movie) {
				res.status(404).json({ error: "not found" });

				return;
			}

			res.json(movie);
		} catch (e) {
			console.log(`api, ${e}`);

			res.status(500).json({ error: e });
		}
	}

	static async apiGetRatings(req, res, next) {
		try {
			let propertyTypes = await MoviesDAO.getRatings();

			res.json(propertyTypes);
		} catch (e) {
			console.log(`api,${e}`);

			res.status(500).json({ error: e });
		}
	}
}

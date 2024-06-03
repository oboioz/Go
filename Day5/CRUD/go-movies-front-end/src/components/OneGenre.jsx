import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";


const OneGenre = () => {
    //Get the prop passed to this component
    const location = useLocation();
    const { genreName } = location.state;

    //Set stateful variable
    const [movies, setMovies] = useState([]);

    //Get ID from URL
    let { id } = useParams();

    //useEffect to get the list movie
    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const requestOptions = {
            method: 'GET',
            headers: headers,
        }

        fetch(`/movies/genre/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.log(data.message);
                } else {
                    setMovies(data);
                }
            })
            .catch(error => {
                console.log(error);
            })

    }, [id])

    //return jsx
    return (
        <>
            <div className="text-center">
                <h2>{genreName}</h2>
                <hr />

                {movies ? (

                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Release Date</th>
                            <th>Rating</th>
                        </tr>
                    </thead>

                    <tbody>
                        {movies.map((movie) => {
                            return (
                                <tr key={movie.id}>
                                    <td>
                                        <Link to={`/movie/${movie.id}`}>
                                            {movie.title}
                                        </Link>
                                    </td>
                                    <td>{movie.release_date}</td>
                                    <td>{movie.mpaa_rating}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                    ) : (
                        <p>No movies found</p>
                    )}
                    
            </div>
        </>
    )
}

export default OneGenre;
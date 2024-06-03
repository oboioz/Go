import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Genres = () => {

    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const requestOptions = {
            method: 'GET',
            headers: headers,
        }

        fetch(`/genres`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.message);

                } else {
                    setGenres(data);
                }
            })
            .catch(error => {
                console.log(error);
            })

    }, [])

    if (error !== null) {
        return (
            <div className="text-center">
                <h2>Error</h2>
                <hr />
                <p>{error.message}</p>
            </div>
        )

    } else {



        return (
            <>
                <div className="text-center">
                    <h2>Genres</h2>
                    <hr />
                    {genres.map((genre) => {
                        <Link
                            key={genre.id}
                            to={`/genre/${genre.id}`}
                            className="list-group-item list-group-item-action"
                            state={
                                {
                                    genreName: genre,genre
                                
                                }
                            }
                        >{genre.genre}</Link>

                    })}
                </div>
            </>
        )
    }
}

export default Genres;
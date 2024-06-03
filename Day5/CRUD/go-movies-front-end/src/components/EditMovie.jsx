import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import Checkbox from "./form/Checkbox";
import Swal from "sweetalert2";

const EditMovie = () => {

    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const mpaaOptions = [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG-13", value: "PG-13" },
        { id: "R", value: "R" },
        { id: "NC-17", value: "NC-17" },
        { id: "18A", value: "18A" },
    ]

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }
    const [movie, setMovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        genres: [],
        genres_array: [Array(13).fill(false)],

    });

    //get ID from the URL
    let { id } = useParams();
    if (id === undefined) {
        id = 0;
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }

        if (id === 0) {
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                description: "",
                genres: [],
                genres_array: [Array(13).fill(false)],

            });

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: headers,
            };

            fetch(`/genres`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const checks = [];

                    data.forEach((genre) => {
                        checks.push({
                            id: genre.id,
                            genre: genre.genre,
                            checked: false,
                        });
                    })

                    setMovie(movie => ({
                        ...movie,
                        genres: data,
                        genres_array: checks
                    }));
                })

                .catch((error) => {
                    console.log(error);
                });


        } else {

            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${jwtToken}`);

            const requestOptions = {
                method: "GET",
                headers: headers,
            };

            fetch(`/admin/movie/${id}`, requestOptions)
                .then((response) => {
                    if (response.status !== 200) {
                        setError(response.status);
                    }
                    return response.json();

                })
                .then((data) => {
                    //fix release date

                    data.movie.release_date = new Date(data.movie.release_date).toISOString().split("T")[0];

                    const checks = [];

                    data.genres.forEach((genre) => {
                        if (data.movie.genres_array.indexOf(genre.id) !== -1) {
                            checks.push({ id: genre.id, genre: genre.genre, checked: true });
                        } else {
                            checks.push({ id: genre.id, genre: genre.genre, checked: false });
                        }
                    })

                    //set the movie state
                    setMovie({
                        ...data.movie,
                        genres: checks,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        return () => {

        }
    }, [id, jwtToken, movie, navigate])



    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = [];
        let required = [
            {
                field: movie.title, name: "title"
            },
            {
                field: movie.release_date, name: "release_date"
            },
            {
                field: movie.runtime, name: "runtime"
            },
            {
                field: movie.mpaa_rating, name: "mpaa_rating"
            },
            {
                field: movie.description, name: "description"
            },
        ]

        required.forEach(function (obj) {
            if (obj.field === "") {
                errors.push(obj.name);
            }

        })

        if (movie.genres_array.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select at least one genre",
                confirmButtonText: "OK",
            });
            errors.push("genres");

        }

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        //passed validation -> save changes

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${jwtToken}`);

        let method = "PUT";
        if (movie.id > 0) {
            method = "PATCH";

        }

        const requestBody = movie;

        //Convert the values in JSON for release_date to date and runtime to int
        requestBody.release_date = new Date(requestBody.release_date);
        requestBody.runtime = parseInt(requestBody.runtime, 10);

        let requestOptions = {
            method: method,
            headers: headers,
            body: JSON.stringify(requestBody),
            credentials: "include",
        };

        fetch(`/admin/movies/${movie.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/manage-catalogue");
                }
            })
            .catch((error) => {
                console.log(error);
            });




    }

    const handleChange = () => (e) => {
        let value = e.target.value;
        let name = e.target.name;
        setMovie({ ...movie, [name]: value });
    }

    const handleCheck = (e, position) => {
        let tmpArr = movie.genres;

        tmpArr[position].checked = !tmpArr[position].checked;

        let tmpIDs = movie.genres_array;
        if (!e.target.checked) {
            tmpIDs.splice(tmpIDs.indexOf(e.target.value), 1);
        } else {
            tmpIDs.push(parseInt(e.target.value), 10);
        }

        setMovie({
            ...movie,
            genres_array: tmpIDs
        });
    };

    const confirmDelete = () => {
        Swal.fire({
            title: "Delete Movie?",
            text: "This action cannot be undone",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.isConfirmed) {
                let headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Authorization", `Bearer ${jwtToken}`);

                const requestOptions = {
                    method: "DELETE",
                    headers: headers,
                };

                fetch(`/admin/movies/${movie.id}`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            navigate("/manage-catalogue");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }

    if (error) {
        return <div>Error: {error}</div>;

    } else {
        return (
            <>
                <div className="text-center">
                    <h2>Add/Edit Movie</h2>
                    <hr />

                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={movie.id} id="id" />

                        <Input
                            title={"Title"}
                            className={"form-control"}
                            type={"text"}
                            name={"title"}
                            value={movie.title}
                            onChange={handleChange("title")}
                            errorDiv={hasError("title") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a title"}
                        />

                        <Input
                            title={"Release Date"}
                            className={"form-control"}
                            type={"date"}
                            name={"release_date"}
                            value={movie.release_date}
                            onChange={handleChange("release_date")}
                            errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a release date"}
                        />

                        <Input
                            title={"Runtime"}
                            className={"form-control"}
                            type={"text"}
                            name={"runtime"}
                            value={movie.runtime}
                            onChange={handleChange("runtime")}
                            errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a runtime"}
                        />

                        <Select
                            title={"MPAA Rating"}
                            className={"form-control"}
                            name={"mpaa_rating"}
                            value={movie.mpaa_rating}
                            onChange={handleChange("mpaa_rating")}
                            errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                            errorMsg={"Please select an MPAA rating"}
                            options={mpaaOptions}
                            placeHolder={"Select an MPAA rating"}
                        />

                        <TextArea
                            title={"Description"}
                            className={"form-control"}
                            name={"description"}
                            value={movie.description}
                            rows={"3"}
                            onChange={handleChange("description")}
                            errorDiv={hasError("description") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a description"}
                        />


                        <hr />

                        <h3>Genres</h3>

                        {movie.genres && movie.genres.length > 1 &&
                            <>
                                {Array.from(movie.genres).map((genre, index) => {
                                    <Checkbox
                                        title={genre.genre}
                                        name={genre.genre}
                                        key={index}
                                        id={"genre-" + index}
                                        checked={movie.genres[index].checked}
                                        onChange={(e) => handleCheck(e, index)}
                                        value={genre.id}
                                    />
                                })}




                            </>

                        }
                        <hr />
                        <button className="btn btn-primary">Save</button>

                        {movie.id > 0 &&
                            <a href="#!" className="btn btn-danger ms-2" onClick={confirmDelete}>Delete Movie</a>
                        }





                    </form>

                </div>
            </>
        )
    }
}

export default EditMovie;
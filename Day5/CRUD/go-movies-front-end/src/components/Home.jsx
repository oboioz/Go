import Ticket from './../assets/images/movie_tickets.jpg';

const Home = () => {

    return(
        <>
        <div className="text-center">
            <h2>Find a movie to watch tonight!</h2>
            <hr />
            <img src={Ticket} alt="movie tickets"></img>
        </div>
        </>
    )
}

export default Home;
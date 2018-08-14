import React, { Component } from "react";
import qs from "query-string"; // Used to parse access token
import "./App.css";

// Default text color. Yay pink!
let defaultStyle = {
  color: "#f9499e",
};

// The number of playlists being displayed
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

// The total hours of playtime for all displayed playlists
class HoursCounter extends Component {
  render() {
    // Combine all songs from all playlists into an array
    let allSongs = this.props.playlists.reduce((acc, eachPlaylist) => {
      return acc.concat(eachPlaylist.songs);
    }, []);

    // Combine the playtime from all songs into a single number
    let hours = allSongs.reduce((acc, song) => {
      return (acc + song.duration);
    }, 0);

    // Songs are measured in milliseconds. Converts playtime to hours.
    hours /= 1000; // convert to seconds
    hours /= 60; // convert to minutes
    hours /= 60; // convert to hours.
    hours = Math.round(hours*100) / 100; // round to two decimal places

    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>{hours} hours</h2>
      </div>
    );
  }
}

// The textbox for filtering playlists by name
class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img />
        <input type="text" onChange={event => this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

// Each individual playlist
class Playlist extends Component {
  render() {
    // Shorten variable name for clarity
    let playlist = this.props.playlist;

    return (
      <div style={{ ...defaultStyle, width: "25%", display: "inline-block" }}>
        <img src={playlist.imageUrl} style={{width: "120px"}}/>
        <h3>{playlist.name}</h3>
        <ol>
          {playlist.songs.slice(0, 3).map(song =>
            <li>
              {song.name}
            </li>
          )
          }
        </ol>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      // Default text in filter textbox
      filterString: "",
    };
  }

  componentDidMount() {
    // Check for access token from Spotify
    let parsed = qs.parse(window.location.search);
    let accessToken = parsed.access_token;

    // Fail gracefully
    if (!accessToken)
      return;
    
    // Get user details for user name
    fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }));

    // Get user's playlist details
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(playlistData => {
        let playlists = playlistData.items;
        let trackDataPromises = playlists.map(playlist => {
          let songPromises = fetch(playlist.tracks.href,
            { headers: { "Authorization": "Bearer " + accessToken } });
          let songDataPromises = songPromises
            .then(response => response.json());
          return songDataPromises;
        });
        let allTracksListsPromises = Promise.all(trackDataPromises);
        let playlistsPromise = allTracksListsPromises
          .then(tracksLists => {
            tracksLists.forEach((trackList, i) => {
              playlists[i].trackList = 
              trackList.items.map(item => item.track);
            });
            return playlists;
          });
        return playlistsPromise;
      })
      .then(playlists => this.setState({
        // Populate playlist state data
        playlists: playlists.map(item => {
          console.log(item.trackList);
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: item.trackList.map(track => ({
              name: track.name,
              duration: track.duration_ms,
            }))
          };
        })
      }));
  }

  render() {
    // Ensure we have playlist data to filter
    let playlistsToRender =
      (this.state.user
        && this.state.playlists
        && this.state.playlists.length > 0)

        // Apply filtering from filter textbox
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()))
        : []; // Set as empty array if we have no playlist data

    return (
      <div className="App">
        {this.state.user

          // If user data exists, draw page.
          // Must be wrapped in div – can only return a single tag.
          ? <div>
            <h1 style={{ ...defaultStyle, "fontSize": "54px" }}>
              {this.state.user.name + "'s"} Playlists
            </h1>
            <PlaylistCounter playlists={playlistsToRender} />
            <HoursCounter playlists={playlistsToRender} />
            <Filter onTextChange={text => this.setState({ filterString: text })} />
            {playlistsToRender.map(playlist => <Playlist playlist={playlist} />)}
          </div>

          // User data doesn't exist. Prompt to login
          // Can only return a single tag – using a giant button.
          : <button onClick={() => window.location =
            // Redirect based on current browser url
            window.location.href.includes("localhost")
              ? "http://localhost:8888/login"
              : "http://btrplaylist-backend.herokuapp.com/login"}
          style={{
            "padding": "20px",
            "fontSize": "50px",
            "marginTop": "20px"
          }}>Sign in to Spotify</button>
        }
      </div>
    );
  }
}

export default App;

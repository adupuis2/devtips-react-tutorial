import React, { Component } from "react";
import {
  defaultStyle,
  PlaylistCounter,
  HoursCounter,
  Filter,
  Playlist
} from "./Components";
import qs from "query-string"; // Used to parse access token
import "./App.css";

// Retrieve a promise for the playlists' json
function getHrefJsonPromise(accessToken, href) {
  let got = fetch(href,
    {
      headers: { "Authorization": "Bearer " + accessToken }
    }).then(response => response.json());
  return got;
}

// Get user details for user name
// and sets the associated app state
function FetchAndSetUsername(accessToken, context) {
  getHrefJsonPromise(accessToken, "https://api.spotify.com/v1/me")
    .then(data => {
      context.setState({
        user: {
          name: data.error ? "ERROR" : data.display_name
        }
      });
    });
}

// Get user's playlist details
// and sets the associated app state
function FetchAndSetPlaylistDetails(accessToken, context) {

  function getAllTracksForPlaylists(playlistJson) {
    let playlists = playlistJson.items;
    let trackDataPromises = playlists.map(playlist =>
      getHrefJsonPromise(accessToken, playlist.tracks.href)
    );
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
  }

  function setStateData(playlistsPromise) {
    playlistsPromise.then(playlists => context.setState({
      // Populate playlist state data
      playlists: playlists.map(item => {
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

  let jsonPromise = getHrefJsonPromise(accessToken,
    "https://api.spotify.com/v1/me/playlists");
  jsonPromise.then(dat => {
    if (dat.error)
      context.setState({error: true});
    else {
      let playlistData = getAllTracksForPlaylists(dat);
      setStateData(playlistData);
    }
  });
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

    FetchAndSetUsername(accessToken, this);
    FetchAndSetPlaylistDetails(accessToken, this);
  }


  render() {
    // abbreviations for readability
    let fs = this.state.filterString.toLowerCase();

    // Ensure we have playlist data to filter
    let playlistsToRender =
      (this.state.user
        && this.state.playlists
        && this.state.playlists.length > 0)

        // Apply filtering from filter textbox
        ?
        // Playlist name filtering
        this.state.playlists.filter(playlist => {
          let inPlaylistName = playlist.name.toLowerCase().includes(fs);
          if (inPlaylistName)
            return true;
          else
            // Song name filtering
            return playlist.songs.some(song =>
              song.name.toLowerCase().includes(fs));
        })
        : []; // Set playlistsToRender as empty array if we have no data

    return (
      <div className="App">
        {(this.state.user && !this.state.error)

          // If user data exists and there are no errors, draw page.
          // Must be wrapped in div – can only return a single tag.
          ? <div>
            <h1 style={{ ...defaultStyle, "fontSize": "54px" }}>
              {this.state.user.name + "'s"} Playlists
            </h1>
            <PlaylistCounter playlists={playlistsToRender} />
            <HoursCounter playlists={playlistsToRender} />
            <Filter onTextChange={text => this.setState({ filterString: text })} />
            {playlistsToRender.map(playlist => <Playlist playlist={playlist} key={playlist.name} />)}
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

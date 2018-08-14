import React, { Component } from "react";
import qs from "query-string";
import "./App.css";

let defaultStyle = {
  color: "#f9499e",
};

// let fakeServerData = {
//   user: {
//     name: "Alain",
//     playlists: [
//       {
//         name: "Favorites",
//         songs: [{
//           name: "Beat It",
//           duration: 17144
//         },
//         {
//           name: "Banana Bread",
//           duration: 48882
//         },
//         {
//           name: "Down in It",
//           duration: 45877
//         }]
//         ,
//       },
//     ]
//   }
// };

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((acc, eachPlaylist) => {
      return acc.concat(eachPlaylist.songs);
    }, []);

    let hours = allSongs.reduce((acc, song) => {
      return (acc + song.duration);
    }, 0);

    hours = Math.round((hours / 60) / 60 * 100) / 100;
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>{hours} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img />
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{ ...defaultStyle, width: "25%", display: "inline-block" }}>
        <img src={playlist.imageUrl} style={{height: "60px"}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {
            playlist.songs.map(song =>
              <li>
                {song.name} -- {Math.floor(song.duration * 100 / 60) / 100}m long
              </li>
            )
          }
        </ul>
      </div>
    );
  }

}
class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      playlists: {},
      filterString: "",
    };
  }

  componentDidMount() {
    let parsed = qs.parse(window.location.search);
    let accessToken = parsed.access_token;
    fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }));

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(response => response.json())
      .then((data) => {
        if (!data || !data.items || !data.items.length || !data.items.length > 0) {
          return null;
        }
        this.setState({
          playlists: data.items.map(item => ({
            name: item.name,
            imageUrl: item.images[0].url,
            songs: []
          }))
        });
      });
  }

  render() {
    //let usr = this.state.userData.user;
    let playlistsToRender =
      (this.state.user &&
        this.state.playlists &&
        this.state.playlists.length > 0)
        ?
        this.state.playlists
          .filter(playlist =>
            playlist.name.toLowerCase()
              .includes(this.state.filterString.toLowerCase())
          )
        : [];

    return (
      <div className="App">
        {
          this.state.user  ?
            <div>
              <h1 style={{ ...defaultStyle, "fontSize": "54px" }}>
                {this.state.user.name + "'s"} Playlists
              </h1>
              <PlaylistCounter playlists={playlistsToRender} />
              <HoursCounter playlists={playlistsToRender} />
              <Filter onTextChange={text => this.setState({ filterString: text })} />
              {
                playlistsToRender.map(playlist =>
                  <Playlist playlist={playlist} />
                )
              }
            </div> : <button
              onClick={() => window.location = "http://btrplaylist-backend.herokuapp.com/login"}
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

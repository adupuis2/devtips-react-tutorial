import React, { Component } from "react";
import "./App.css";

let defaultStyle = {
  color: "#f9499e",
};

let fakeServerData = {
  user: {
    name: "Alain",
    playlists: [
      {
        name: "Favorites",
        songs: [{
          name: "Beat It",
          duration: 17144
        },
        {
          name: "Banana Bread",
          duration: 48882
        },
        {
          name: "Down in It",
          duration: 45877
        }]
        ,
      },
      {
        name: "Mock Data",
        songs: [{
          name: "Song 1",
          duration: 20975
        },
        {
          name: "Song 2",
          duration: 2193
        },
        {
          name: "Song 3",
          duration: 2917
        }]
        ,
      },
      {
        name: "Worst Data of All Time",
        songs: [{
          name: "Ugh",
          duration: 31801
        },
        {
          name: "Unf",
          duration: 21248
        },
        {
          name: "Oof",
          duration: 12640
        }]
        ,
      },
      {
        name: "Last Data of All Time",
        songs: [{
          name: "Bump",
          duration: 14406
        },
        {
          name: "Boop",
          duration: 6957
        },
        {
          name: "Beep",
          duration: 49893
        }]
        ,
      }
    ]
  }
};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>{ this.props.playlists.length } playlists</h2>
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
    
    hours = Math.round((hours/60)/60 * 100)/100;
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2>{ hours } hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={ defaultStyle }>
        <img />
        <input type="text" />
        Filter
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: "25%", display: "inline-block" }}>
        <img />
        <h3>Playlist name</h3>
        <ul>
          <li>Song1</li>
          <li>Song2</li>
          <li>Song3</li>
        </ul>
      </div>
    );
  }

}
class App extends Component {
  constructor() {
    super();
    this.state = { serverData: {} };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ serverData: fakeServerData });
    }, 250);
  }

  render() {
    return (
      <div className="App">
        {
          this.state.serverData.user ?
            <div>
              <h1 style={{ ...defaultStyle, "font-size": "54px" }}>
                { this.state.serverData.user.name + "'s" } Playlists
              </h1>
              <PlaylistCounter playlists={ this.state.serverData.user.playlists } />
              <HoursCounter playlists={ this.state.serverData.user.playlists } />
              <Filter />
              <Playlist />
              <Playlist />
              <Playlist />
              <Playlist />
            </div> : <h1 style={ defaultStyle }>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;

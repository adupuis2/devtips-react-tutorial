import React, { Component } from "react";
const NUM_SONGS_TO_DISPLAY = 3;

// Default text color. Yay pink!
let defaultStyle = {
  color: "#f9499e",
};

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
        <img src={playlist.imageUrl} style={{width: "120px"}} alt={playlist.name} />
        <h3>{playlist.name}</h3>
        <ol>
          {playlist.songs.slice(0, NUM_SONGS_TO_DISPLAY).map(song =>
            <li key={song.name}>
              {song.name}
            </li>
          )
          }
        </ol>
      </div>
    );
  }
}

export {
  defaultStyle,
  PlaylistCounter,
  HoursCounter,
  Filter,
  Playlist,
  NUM_SONGS_TO_DISPLAY
};
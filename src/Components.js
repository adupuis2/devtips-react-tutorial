import React, { Component } from "react";

const NUM_SONGS_TO_DISPLAY = 3;

// Default text color. Yay pink!
let defaultStyle = {
  color: "#33332f",
  fontFamily: "Helvetica"
};
let aggregateStyle = {
  ...defaultStyle,
  width: "40%",
  display: "inline-block",
  fontSize: "30px",
  lineHeight: "50px",
};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={aggregateStyle}>
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
      <div style={aggregateStyle}>
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
        <input type="text"
          onChange={event => this.props.onTextChange(event.target.value)}
          style={{
            color: "black",
            fontSize: "20px",
            padding: "2px",
          }} />
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
      <div style={{
        ...defaultStyle,
        width: "28%",
        display: "inline-block",
        padding: "10px",
        margin: "10px",
        // marginLeft: "auto",
        // marginRight: "auto",
        color: "#e6e6d4",
        backgroundColor: "#005874",
      }}>

        <h3 style={{
          color: "#ffbe00",
          fontSize: "20px",
          textAlign: "center",
        }}>{playlist.name}</h3>
        <img src={playlist.imageUrl}
          alt={playlist.name}
          style={{
            display: "block",
            width: "160px",
            marginTop: "10px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <ul style={{
          marginTop: "10px",
        }}>
          {playlist.songs.slice(0, NUM_SONGS_TO_DISPLAY).map(song =>
            <li key={song.name} style={{
              paddingTop: "5px",
            }}>
              {song.name}
            </li>
          )}
        </ul>
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
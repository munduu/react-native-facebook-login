'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight,
  PixelRatio,
} = React;

var Rating = require('./Rating');

var MovieCell = React.createClass({
  propTypes: {
    movie: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired,
  },

  render: function() {
    var movie = this.props.movie;
    var critics_score = movie.ratings.critics_score;
    var audience_score = movie.ratings.audience_score;
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onPress}
        >
          <View style={styles.container}>
            <Image
              style={styles.thumbnail}
              source={{uri: movie.posters.thumbnail}}
            />
            <View style={styles.rightContainer}>
              <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
              <Text style={styles.year} numberOfLines={1}>{movie.year}</Text>
              <Rating score={critics_score} />
              <Rating score={audience_score} />
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.cellBorder} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',

    alignItems: 'center',
    padding: 5,
  },
  rightContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 53,
    height: 81,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  year: {
    color: '#999999',
    fontSize: 12,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 5,
  },
});

module.exports = MovieCell;

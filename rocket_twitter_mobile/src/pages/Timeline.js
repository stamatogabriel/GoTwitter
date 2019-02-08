import React, { Component } from "react";

import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import socket from 'socket.io-client';
import api from "../services/api";
import Tweet from '../components/Tweet';

export default class Timeline extends Component {
  static navigationOptions = ({navigation}) => ({
    title: "Início",
    headerRight: (
      <TouchableOpacity onPress={()=>navigation.navigate('New')}>
        <Icon
          style={{ marginRight: 20 }}
          name="add-circle-outline"
          size={30}
          color="#4BB0EE"
        />
      </TouchableOpacity>
    )
  });

  state = {
    tweets: []
  };

  subscribeToEvents = () => {
    const io = socket('http://10.0.3.2:3003');

    io.on('tweet', data => {
        this.setState({ tweets: [data, ...this.state.tweets] })
    });

    io.on('like', data => {
        this.setState({
            tweets: this.state.tweets.map(tweet =>
                (tweet._id === data._id ? data : tweet)
            )
        })
    });
};

  async componentDidMount() {
    this.subscribeToEvents();
    try {
      const response = await api.get('tweets');
      this.setState({ tweets: response.data });
    } catch (err) {
      console.log(err)
    };

    this.setState({ tweets: response.data });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
        data={this.state.tweets}
        keyExtractor={tweet => tweet._id}
        renderItem={({ item }) => <Tweet tweet={item} />}>
        </FlatList>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});

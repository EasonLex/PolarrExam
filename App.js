import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Image, Button, DeviceEventEmitter, TouchableOpacity, TextInput } from 'react-native';
import {
  getPhotoList,
  fetPhotoList,
  fetPhotoDetails,
  sortPhotoList,
  searchWithUserPhotoList,
} from './DataCenter/dataCenter'

import { createStackNavigator, createAppContainer } from "react-navigation";

import Waterfall from 'react-native-waterfall'
import SortScreen from './SortScreen'
import PhotoDetailScreen from './PhotoDetailScreen'
import DialogInput from 'react-native-dialog-input';

const { width, height } = Dimensions.get('window')

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    let showDialogFun = navigation.getParam('showDialog');
    
    return {
      headerLeft: (
        <Button
          onPress={() => showDialogFun(true)}
          title="Search User"
          color="black"
        />
      ),
      headerRight: (
        <Button
          onPress={() => navigation.navigate('MyModal')}
          title="Sort"
          color="black"
        />
      ),
      /* the rest of this config is unchanged */
    };
  };

  constructor(props) {
    super(props);

    (this: any).showDialog = this.showDialog.bind(this);
    this.state = {
      listData: [],
      isDialogVisible:false
    };
  }

  componentDidMount() {
    this.getPhotoFun();

    DeviceEventEmitter.addListener('sortUpdate', (item)=>this.sortUpdate(item) );
    this.props.navigation.setParams({ showDialog: this.showDialog })
  }

  showDialog(isShow){
    this.setState({isDialogVisible: isShow});
  }

  async sendInput(inputText){
    this.showDialog(false)

    let searchedList = await searchWithUserPhotoList(inputText);
    this.setState({
      listData:[]
    }, function(){
      this.setState({
        listData:searchedList
      })
    })
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener('sortUpdate');
  }

  async sortUpdate(item) {
    // console.log(item)
    let sortedList = await sortPhotoList(item);
    this.setState({
      listData:[]
    }, function(){
      this.setState({
        listData:sortedList
      })
    })
  }

  async getPhotoFun() {
    let photoList = await getPhotoList('mobile-only');
    // console.log(photoList)
    if (photoList.length === 0) {
      await fetPhotoList('mobile-only');
      this.getPhotoFun();
    } else {
      this.setState({
        listData:photoList
      }, function() {
        this.fetchDetail(photoList)
      })
    }
  }
  
  async fetchDetail(photoList) {
    let photoItem = photoList[0];
    if(!photoItem.downloads) {
      await fetPhotoDetails(photoList);
      this.getPhotoFun();
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"Search Users"}
                    message={"Please key in the user name"}
                    hintInput ={"User's name"}
                    submitInput={ (inputText) => {this.sendInput(inputText)} }
                    closeDialog={ () => {this.showDialog(false)}}>
        </DialogInput>
        <Waterfall
          data={this.state.listData}
          numberOfColumns       ={ 2 }
          expansionOfScope      ={ 100 }
          onEndReachedThreshold ={ 1000 }
          renderItem            ={ this.renderItem }
        />
      </View>
    )
  }

  renderItem = (itemData,itemIdx,itemContainer)=>{
    // console.log(itemData)
    let avgWidth = (width - 5*4)/2;
    let imgHeight = avgWidth * (itemData.height/itemData.width)
    return (
        <TouchableOpacity onPress={()=>this.pressPhoto(itemData)}>
          <View style={{flex:1, margin:5, height:imgHeight, backgroundColor:'lightgray'}}>
            <Image
            style={{width: avgWidth, height: imgHeight}}
            source={{uri: itemData.imgUrl}}/>
          </View>
        </TouchableOpacity>
    )
  }
  
  pressPhoto(itemData) {
    this.props.navigation.navigate('Details', {
      photoData: itemData,
    });
    
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: PhotoDetailScreen
  },
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: AppNavigator,
    },
    MyModal: {
      screen: SortScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default createAppContainer(RootStack);
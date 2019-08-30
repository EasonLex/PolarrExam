import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Image, Button, DeviceEventEmitter, TouchableOpacity, ScrollView, Modal, TouchableHighlight, CameraRoll, Alert, Linking, Platform } from 'react-native';

import ImageView from 'react-native-image-view';
const { width, height } = Dimensions.get('window')

class PhotoDetailScreen extends React.Component {

  constructor(props) {
    super(props);

    // (this: any).sortUpdate = this.sortUpdate.bind(this);
    this.state = {
      listData: [],
      modalVisible:false
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount() {
    
  }

  render() {
    const itemData = this.props.navigation.getParam('photoData');
    let avgWidth = width;
    let imgHeight = avgWidth * (itemData.height/itemData.width)
    let viewsString = (!!itemData.views) ? this.numberWithCommas(itemData.views):''
    let downloadsString = (!!itemData.downloads) ? this.numberWithCommas(itemData.downloads):''

    const images = [
      {
          source: {
              uri: itemData.largeImgUrl,
          },
          title: ((!!itemData.description)?itemData.description:''),
          width: itemData.width,
          height: itemData.height,
      },
    ];
    return(
      <ScrollView style={{flex:1}}>
        <ImageView
            images={images}
            imageIndex={0}
            isVisible={this.state.modalVisible}
            renderFooter={(currentImage) => (
              <View style={{width:width, alignItems:'flex-end'}}>
                <TouchableOpacity onPress={() => this.saveImage(itemData.imgUrl)}>
                  <Text style={{color:'white'}}>Press to download</Text>
                </TouchableOpacity>
              </View>
            )}
        />
        <TouchableOpacity onPress={()=>this.pressPhoto(itemData)}>
          <Image
              resizeMode = {'contain'}
              style={{width: avgWidth, height: ((imgHeight > 300)?300:imgHeight)}}
              source={{uri: itemData.imgUrl}}/>
        </TouchableOpacity>
        <View style={{flex:1, height:64, justifyContent:'center', marginLeft:16, backgroundColor:'white'}}>
          <Text style={{fontSize:24, fontWeight:'bold'}}>Description</Text>
        </View>
        <Text style={{color:'darkgray', marginLeft:16, fontSize:16}}>{(!!itemData.description)?itemData.description:''}</Text>
        <View style={{flex:1, height:64, justifyContent:'center', marginLeft:16, backgroundColor:'white'}}>
          <Text style={{fontSize:24, fontWeight:'bold'}}>Location</Text>
        </View>
        <TouchableOpacity onPress={()=>this.pressLocation(itemData)}>
          <Text style={{color:'darkgray', marginLeft:16, fontSize:16}}>{(!!itemData.locationtitle)?itemData.locationtitle:''}</Text>
        </TouchableOpacity>
        <View style={{flex:1, height:64, justifyContent:'center', marginLeft:16, backgroundColor:'white'}}>
          <Text style={{fontSize:24, fontWeight:'bold'}}>Info</Text>
        </View>
        <Text style={{color:'darkgray', marginLeft:16, fontSize:16}}>{(!!itemData.info)?itemData.info:''}</Text>
        <View style={{flexDirection:'row', flex:1, marginTop:8, height:64, justifyContent:'center', marginLeft:16, backgroundColor:'white'}}>
          <View style={{flex:1, height:64, justifyContent:'center', backgroundColor:'white'}}>
            <Text style={{fontSize:24, fontWeight:'bold'}}>Views</Text>
            <Text style={{color:'darkgray', fontSize:16}}>{viewsString}</Text>
          </View>
          <View style={{flex:1, height:64, justifyContent:'center', backgroundColor:'white'}}>
            <Text style={{fontSize:24, fontWeight:'bold'}}>Downloads</Text>
            <Text style={{color:'darkgray', fontSize:16}}>{downloadsString}</Text>
          </View>
        </View>
        <View style={{flex:1, height:64, justifyContent:'center', marginLeft:16, backgroundColor:'white'}}>
          <Text style={{fontSize:24, fontWeight:'bold'}}>Camera Make</Text>
        </View>
        <Text style={{color:'darkgray', marginLeft:16, fontSize:16}}>{(!!itemData.cameramake)?itemData.cameramake:''}</Text>
        <View style={{flex:1, height:64, justifyContent:'center', marginLeft:16, backgroundColor:'white'}}>
          <Text style={{fontSize:24, fontWeight:'bold'}}>Camera Model</Text>
        </View>
        <Text style={{color:'darkgray', marginLeft:16, marginBottom:16, fontSize:16}}>{(!!itemData.cameramodel)?itemData.cameramodel:''}</Text>
      </ScrollView>
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
    this.setModalVisible(true)
  }

  pressLocation(itemData) {
    // console.log(itemData)
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${parseFloat(itemData.latitude)},${parseFloat(itemData.longitude)}`;
    const label = itemData.locationtitle;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    
    Linking.openURL(url); 
  }

  async saveImage(imgUrl) {
    await CameraRoll.saveToCameraRoll(imgUrl);
    Alert.alert(
      'Image saved successfully',
      'Good job!',
      [
        {text: 'OK'},
      ],
      {cancelable: false},
    );
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export default PhotoDetailScreen;
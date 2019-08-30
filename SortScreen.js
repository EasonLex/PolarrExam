import React from 'react';
import { StyleSheet, Text, View, SectionList, Dimensions, Image, Button, TouchableOpacity, DeviceEventEmitter, InteractionManager
} from 'react-native';

import { createStackNavigator, createAppContainer } from "react-navigation";

import {
  getCameraList,
} from './DataCenter/dataCenter'
// import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window')

class SortScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    console.log(navigation)
    return {
      headerLeft: (
        <Button
          onPress={() => {
            navigation.pop()
          } }
          title="cancel"
          color="darkgray"
        />
      ),
      headerRight: (
        <Button
          onPress={() => {
            let statusObj = navigation.getParam('statusObj');
            let cameraJson = navigation.getParam('cameraJson');
            let cameraModelList = navigation.getParam('cameraModelList');
            
            let camearMakeSort = [];
            let camearModelSort = [];
            let countSort = [];
            
            Object.keys(statusObj).map(function(objectKey, index) {
              var value = statusObj[objectKey];
              if (value.selected == true) {
                // console.log(objectKey)
                let cameraMakeList = Object.keys(cameraJson);
                // console.log(cameraMakeList)
                let makeIndex = cameraMakeList.indexOf(objectKey);
                // console.log(makeIndex)
                if (makeIndex > -1) {
                  // camearMakeSort.push(objectKey)
                  // console.log(objectKey + ' is in camera make section')
                } else if (objectKey.includes("Views_") || objectKey.includes("Downloads_")) {
                  countSort.push(objectKey)
                  // console.log(objectKey)
                } else {
                  // console.log(objectKey + ' is in camera model section')
                  // console.log(value)
                  let sqlite = "cameramake  = '" + value.make + "'" +  " AND cameramodel = '" + objectKey + "'"
                  camearModelSort.push(sqlite)
                }
              }
            });
            DeviceEventEmitter.emit('sortUpdate', [camearModelSort, countSort]);
            navigation.pop()}
          }
          title="Apply"
          color="black"
        />
      ),
      /* the rest of this config is unchanged */
    };
  };

  applyPressed(navigation) {
    DeviceEventEmitter.emit('sortUpdate', 'testing');
    navigation.pop()
  }

  constructor(props) {
    super(props);

    (this: any).applyPressed = this.applyPressed.bind(this);

    this.state = {
      sectionData: [],
      cameraJsonData:{},
      statusObj:{}
    };
  }

  componentDidMount() {
    this.getCameraListFun();
  }

  async getCameraListFun() {
    let cameraList = await getCameraList();
    let cameraJsonData = {}
    let cameraModelList = [];
    let statusObj = {}

    for (let i = 0; i < cameraList.length; i++) {
      const cameraInfo = cameraList[i];
      
      if (!!cameraJsonData[cameraInfo['cameramake']]) {
        let modelList = cameraJsonData[cameraInfo['cameramake']];
        modelList.push(cameraInfo['cameramodel']);
      } else if(!!cameraInfo['cameramake']){
        let modelList = [cameraInfo['cameramodel']]
        cameraJsonData[cameraInfo['cameramake']] = modelList;
      }
    }

    let sectionData = []
    let section1 = {'title':'Camera Make', 'data':Object.keys(cameraJsonData)}
    sectionData.push(section1)
    for (let i = 0; i < Object.keys(cameraJsonData).length; i++) {
      const tmpCameraMake = Object.keys(cameraJsonData)[i];
      statusObj[tmpCameraMake] = {'enable':true, 'selected':false}
    }

    let makeList = []
    for (let i = 0; i < Object.keys(cameraJsonData).length; i++) {
      const tmpCameraMake = Object.keys(cameraJsonData)[i];
      let cameraModelArray = cameraJsonData[tmpCameraMake];
      for (let j = 0; j < cameraModelArray.length; j++) {
        makeList.push(tmpCameraMake)
      }
      Array.prototype.push.apply(cameraModelList, cameraModelArray);
    }
    this.props.navigation.setParams({ cameraModelList: makeList })
    let section2 = {'title':'Camera Model', 'data':cameraModelList}
    sectionData.push(section2)

    for (let i = 0; i < cameraModelList.length; i++) {
      const tmpCameraModel = cameraModelList[i];
      statusObj[tmpCameraModel] = {'enable':false, 'selected':false, 'make':makeList[i]}
    }

    let section3 = {'title': 'Views', 'data':['Ascending', 'Descending']}
    statusObj['Views_Ascending'] = {'enable':true, 'selected':false}
    statusObj['Views_Descending'] = {'enable':true, 'selected':false}
    sectionData.push(section3)

    let section4 = {'title':'Downloads', 'data':['Ascending', 'Descending']}
    statusObj['Downloads_Ascending'] = {'enable':true, 'selected':false}
    statusObj['Downloads_Descending'] = {'enable':true, 'selected':false}
    sectionData.push(section4)

    this.setState({
      sectionData:sectionData,
      cameraJsonData:cameraJsonData,
      statusObj:statusObj
    })
    this.props.navigation.setParams({ cameraJson: cameraJsonData })
  }

  render() {
    return (
      <SectionList
        renderItem={({item, index, section}) => this.renderItem(item, index, section)}
        renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
        sections= { this.state.sectionData }
        keyExtractor={(item, index) => item + index}
      />
    );
  }

  renderSectionHeader(title) {
    return(
      <View style={{flex:1, height:64, justifyContent:'center', marginLeft:16, backgroundColor:'white'}}>
        <Text style={{fontSize:24, fontWeight:'bold'}}>{title}</Text>
      </View>
    )
  }

  renderItem(item, index, section) {
    let checkBoxStatus = 'unselect'
    let itemName = item;
    if(section.title === 'Views' || section.title === 'Downloads') {
      itemName = section.title + '_' + item
    }
    let statusObj = this.state.statusObj[itemName];

    if (statusObj.enable == false) {
      checkBoxStatus = 'disabled'
    } else {
      if (statusObj.selected == true) { checkBoxStatus = 'selected' }
    }

    var icon = (checkBoxStatus === 'disabled' || checkBoxStatus === 'unselect') ? require('./icon/unselect.png') : require('./icon/selected.png')
    let buttonOpacity = (checkBoxStatus === 'disabled') ? 1:0.2
    let viewOpacity = (checkBoxStatus === 'disabled') ? 0.4:1
    return(
      <TouchableOpacity activeOpacity = {buttonOpacity} style={{flex:1, height:40, justifyContent:'center', marginLeft:20, backgroundColor:'transparent'}} onPress={()=>this.pressedItem(item, section.title)}>
        <View opacity={viewOpacity}style={{flexDirection:'row', alignItems:'center'}}>
          <Image
            style={{width: 30, height: 30}}
            source={icon}
          />
          <Text style={{marginLeft:8, fontSize:16}} key={index}>{item}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  pressedItem(item, sectionTitle) {
    // console.log(sectionTitle)
    // console.log(item)
    
    let itemName = item;
    if(sectionTitle === 'Views' || sectionTitle === 'Downloads') {
      itemName = sectionTitle + '_' + item
    }
    let statusObj = this.state.statusObj;
    let itemstatus = statusObj[itemName];

    switch (sectionTitle) {
      case 'Camera Make':
        // 1. select / deselect checkbox
        itemstatus.selected = !itemstatus.selected
        // 2. enable / disable second section items
        let modelList = this.state.cameraJsonData[item];
        for (let i = 0; i < modelList.length; i++) {
          const model = modelList[i];
          let tempItemstatus = statusObj[model];
          tempItemstatus.enable = !tempItemstatus.enable
          if (!itemstatus.selected) {
            tempItemstatus.selected = false 
          } else {
            tempItemstatus.selected = true
          }
        }
      break;

      case 'Camera Model':
          if (!!itemstatus.enable) {itemstatus.selected = !itemstatus.selected }
      break;

      case 'Views':
          if (!!itemstatus.enable) {
            itemstatus.selected = !itemstatus.selected 

            let otherView = 'Views_' + ((item === 'Ascending')? "Descending": "Ascending");
            let otherViewStatus = statusObj[otherView]
            otherViewStatus.selected = false;
  
            // disable and deselect downloads
            let downloadAscending = statusObj['Downloads_Ascending']
            downloadAscending.selected = false
            downloadAscending.enable = (!!itemstatus.selected)? false: true
            let downloadDescending = statusObj['Downloads_Descending']
            downloadDescending.selected = false
            downloadDescending.enable = (!!itemstatus.selected)? false: true
          }
      break;

      case 'Downloads':
          if (!!itemstatus.enable) {
            itemstatus.selected = !itemstatus.selected 

            let otherDownloads = 'Downloads_' + ((item === 'Ascending')? "Descending": "Ascending");
            let otherDownloadsStatus = statusObj[otherDownloads]
            otherDownloadsStatus.selected = false;
  
            // // disable and deselect downloads
            let viewsAscending = statusObj['Views_Ascending']
            viewsAscending.selected = false
            viewsAscending.enable = (!!itemstatus.selected)? false: true
            let viewsDescending = statusObj['Views_Descending']
            viewsDescending.selected = false
            viewsDescending.enable = (!!itemstatus.selected)? false: true
          }

      break;
        
      default:
        break;
    }
    // console.log(statusObj)

    this.setState({
      statusObj:statusObj
    })
    this.props.navigation.setParams({ statusObj: statusObj })
  }
}

const AppNavigator = createStackNavigator({
  Sort: {
    screen: SortScreen
  }
});

export default createAppContainer(AppNavigator);

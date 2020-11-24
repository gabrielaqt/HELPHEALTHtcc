/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import firebase from '@react-native-firebase/app';
import React, { Fragment } from 'react';
import { TouchableOpacity, View, ImageBackground, Button, Text, ToastAndroid, Alert, SafeAreaView,  Platform} from 'react-native';
import { RNCamera as Camera } from 'react-native-camera';
import RNTextDetector from "react-native-text-detector";
import style, { screenHeight, screenWidth } from "./styles";
import cloneDeep from 'lodash/cloneDeep';
import Spinner from 'react-native-loading-spinner-overlay';

//import CameraRollPicker from 'react-native-camera-roll-picker';

const PICTURE_OPTIONS = {
  quality: 1,
  fixOrientation: true,
  forceUpOrientation: true,
};
console.disableYellowBox = true;

export default class camera extends React.Component {
  state = {
    loading: false,
    image: null,
    error: null,
    visionResp: [],
    modifiedJson: [],
    auxVisionResp: [],
    textSelected: [],
    style: [],
    spinner: false
  };

  reset(error = "OTHER") {
    this.setState(
      {
        loading: false,
        image: null,
        error
      },
      () => {
        // setTimeout(() => this.camera.startPreview(), 500);
      }
    );
  }

  takePicture = async camera => {
    this.setState({
      loading: true
    });
    this.setState({ spinner: true });
    try {
      const data = await camera.takePictureAsync(PICTURE_OPTIONS);

      if (!data.uri) {
        throw "OTHER";
      }
      //CameraRoll.saveToCameraRoll(data.uri); save picture to phone
      this.setState(
        {
          image: data.uri
        },
        () => {
          console.log(data.uri);

          this.processImage(data.uri, {
            height: data.height,
            width: data.width
          });
        }
      );
    } catch (e) {
      console.warn(e);
      this.reset(e);
    }
    this.setState({ spinner: false });
  };

  processImage = async (uri, imageProperties) => {
    visionResp = await RNTextDetector.detectFromUri(uri);


    console.log("VISION RESP", visionResp)
    if (!(visionResp && visionResp.length > 0)) {
      throw "UNMATCHED";
    }
    this.setState({
      visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
    });
  };

  mapVisionRespToScreen = (visionResp, imageProperties) => {

    console.log("VisionResp antes",visionResp);
    const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
    const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;
    for (let i = 0; i < visionResp.length; i++) {
      if (visionResp[i].text.includes('\n')) {
        auxVisionResp = cloneDeep(visionResp);
        var countLine = 0;
        var countN = 1;
        while (visionResp[i].text.includes('\n')) {
          console.log("ANTES barra N",  visionResp[i].text)
         visionResp[i].text = visionResp[i].text.replace("\n", "");
          console.log("DEPOIS barra N",  visionResp[i].text)

          countN++;
          console.log("countN", countN);
        }
        visionResp[i].text = auxVisionResp[i].text.substring(0, (auxVisionResp[i].text.indexOf('\n')));

        while (auxVisionResp[i].text.includes('\n')) {
          console.log("AQUI antes ======", auxVisionResp[i].text)

          auxVisionResp[i].text = auxVisionResp[i].text.replace("\n", "$");
          console.log("AQUI depois ======", auxVisionResp[i].text)
          if(countLine !== 0)
           {
           console.log("HEIGHT", visionResp[i].bounding.height )
           console.log("DIV HEIGTH E LINEFORHEIGTH", ( visionResp[i].bounding.height /countN))
           console.log("LINHA COUNT", countLine)
           
            this.setState(prevState => ({
              modifiedJson: [...prevState.modifiedJson, { text: (auxVisionResp[i].text.substring(0, ((auxVisionResp[i].text.indexOf('$'))))), bounding: { height: (visionResp[i].bounding.height / countN), width: (visionResp[i].bounding.width), left: (visionResp[i].bounding.left), top: ((visionResp[i].bounding.top) + ((countLine ) * ((visionResp[i].bounding.height) / countN))) } }]
            }));
          }

          auxVisionResp[i].text = auxVisionResp[i].text.replace((auxVisionResp[i].text.substring(0, (auxVisionResp[i].text.indexOf('$') + 1))), "");
          console.log("SUBSTITUI PO espaçoooo",  auxVisionResp[i].text )

          countLine++;

        }

        console.log("ULTIMO ***  ", auxVisionResp[i].text);
        this.setState(prevState => ({
          modifiedJson: [...prevState.modifiedJson, { text: (auxVisionResp[i].text), bounding: { height: (visionResp[i].bounding.height / countN), width: (visionResp[i].bounding.width), left: (visionResp[i].bounding.left), top: ((visionResp[i].bounding.top) + ((countLine ) * ((visionResp[i].bounding.height) / countN))) } }]
        }));
        visionResp[i].bounding.height = visionResp[i].bounding.height / countN;

      }
    };
    console.log("EACH LINE ", this.state.modifiedJson)
    visionResp = this.state.modifiedJson.concat(visionResp);
    console.log("VisionResp",visionResp);

    return visionResp.map(item => {
      return {
        ...item,
        position: {
          width: item.bounding.width * IMAGE_TO_SCREEN_X,
          left: item.bounding.left * IMAGE_TO_SCREEN_X,
          height: item.bounding.height * IMAGE_TO_SCREEN_Y,
          top: item.bounding.top * IMAGE_TO_SCREEN_Y
        }
      };
    });
  };

  alertText = async (selectText) => {
    await Alert.alert('text', selectText,
      [
        { text: 'Cancel' },
        {
          text: 'Ok', onPress: () => this.props.navigation.navigate('RNTextDetector', {
            text: selectText
          }),
        },
      ],
      { cancelable: false },
    );
    console.log("textSelected", this.state.textSelected);
  }

  ToggleFunction = async (inputString) => {
    var array = [...this.state.textSelected];
    var index = array.indexOf(inputString);
    if (index !== -1) {
      array.splice(index, 1);
      await this.setState({ textSelected: array });
      await ToastAndroid.show(inputString + "\n Foi removido com sucesso", ToastAndroid.SHORT);
    }
    else {
      await this.setState(prevState => ({
        textSelected: [...prevState.textSelected, inputString]
      }));
      await ToastAndroid.show(inputString + "\n Foi adicionado com sucesso", ToastAndroid.SHORT);
    };
    console.log("textSelected", this.state.textSelected);
  }

  sendTextDetected= async() => {
    console.log(this.props.route.params)
    if(this.props.route.params.compA == true)
    {
      this.props.navigation.navigate('CompartimentoA', {textDetect: this.state.textSelected, camera: true})
    }
    if(this.props.route.params.compB == true)
    {
      this.props.navigation.navigate('CompartimentoB', {textDetect: this.state.textSelected, camera: true})
    }
    if(this.props.route.params.compC == true)
    {
      this.props.navigation.navigate('CompartimentoC', {textDetect: this.state.textSelected, camera: true})
    }
    if(this.props.route.params.compD == true)
    {
      this.props.navigation.navigate('CompartimentoD', {textDetect: this.state.textSelected, camera: true})
    }
    if(this.props.route.params.compE == true)
    {
      this.props.navigation.navigate('CompartimentoE', {textDetect: this.state.textSelected, camera: true})
    }
    
  }

  render() {
    
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

        <View style={style.screen}>
            {!this.state.image ? (
              
              <View>
                <Spinner
                  visible={this.state.spinner}
                  textContent={'Processando Imagem...'}
                  textStyle={{ color: '#FFF' }}
                />
                <Camera
                  ref={cam => {
                    this.camera = cam;
                  }}
                  key="camera"
                  style={style.camera}
                  notAuthorizedView={null}
                  flashMode={Camera.Constants.FlashMode.off}
                >
                  {({ camera, status }) => {
                    if (status !== "READY") {
                      return null;
                    }
                    return (
                      <View style={style.buttonContainer}>
                        <TouchableOpacity
                          onPress={() => this.takePicture(camera)}
                          style={style.circle}
                        />
                      </View>
                    );
                  }}
                </Camera>
              </View>
            ) 
            :
           ( <View style={{width:100,marginLeft:160, marginTop:3, position:'absolute'}} >
              <Button title="Enviar" 
              color='#65a3f7'
              ///vai ter q chamar uma função e ver de onde ta vindo..... 
              //qndo apertar direciona para a pagina certa
        
              onPress={this.sendTextDetected}/>
              </View>
              )
              
              }

            {this.state.image ? (
              <ImageBackground
                source={{ uri: this.state.image }}
                style={style.imageBackground}
                key="image"
                resizeMode="stretch"
              >
                {this.state.visionResp.map(item => {
                  return (
                  <Fragment> 
                     <TouchableOpacity
                      style={[style.boundingRect, item.position]}
                      key={item.text + item.bounding.top + item.bounding.left}
                    onPress={() => (this.ToggleFunction(item.text))} for muti selection
                    />
                    
                    
                    </Fragment>
                  );
                })}
              </ImageBackground>
            ) :  null}
          </View>
      </SafeAreaView>
    );
  }
  componentWillMount() {
    console.log('entrou aqui')
    this.props.navigation.setParams({ submitSelect: this.submitSelect });
  }

  componentDidMount() {
   
  }

  submitSelect = () => {
    this.props.navigation.navigate('PagInterm', {
      text: this.state.textSelected
    });
  };

  static navigationOptions = ({ navigation }) => {
    return {
    //  headerTitle: "React Native Text Detector camera",
      headerRight: (
        <Button
          onPress={navigation.getParam('submitSelect')}
          title="submit">
        </Button>
      ),
    };
  };
}

import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Image } from 'react-native';
import MapView from 'react-native-maps';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Camera} from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useEffect,useRef,useState } from 'react';


function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arkesh Choudhury</Text>
      <Button
        title="Map Integration"
        onPress={() => navigation.navigate('MapView')}
      />
      <Button
        title="Camera"
        onPress={() => navigation.navigate('Camera')}
      />
      <Button
        title="Go to Page 3"
        onPress={() => navigation.navigate('Page3')}
      />
    </View>
  );
}

function Page1Screen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

function Page2Screen() {

  let cameraRef = useRef();
  const [hasCameraPermission,setHasCameraPermission]= useState();
  const [hasMediaLibraryPermission,setHasMediaLibraryPermission] = useState();
  const [photo,setPhoto] = useState();

  useEffect(()=>{

    (async ()=> {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  },[]);

  if(hasCameraPermission===undefined){
    return <Text>Requesting permission...</Text>
  }else if(!hasCameraPermission){
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () =>{
    let options={
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if(photo){
    let sharePic = () => {
      shareAsync(photo.uri).then(()=>{
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(()=>{
        setPhoto(undefined);
      })
    };

    return(
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{uri:"data:image/jpg;base64,"+photo.base64}}/>
        <Button title="Share" onPress={sharePic}/>
        {hasMediaLibraryPermission?<Button title='Save' onPress={savePhoto}/>:undefined}
        <Button title='Discard' onPress={ ()=>setPhoto(undefined)}/>
      </SafeAreaView>
    );
      
    
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
    </Camera>
  );
}

function Page3Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page 3</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MapView" component={Page1Screen} />
        <Stack.Screen name="Camera" component={Page2Screen} />
        <Stack.Screen name="Page3" component={Page3Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer:{
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  preview:{
    alignSelf:'stretch',
    flex:1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

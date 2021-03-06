import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Image,
  TouchableHighlight
} from 'react-native';
import { Facebook } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Input,
  Button,
  Text,
  Divider
} from 'react-native-elements';
import {
  Grid,
  Row,
  Col
} from 'react-native-easy-grid';
import {
  Container
} from 'native-base'
import firebase from "../../Firebase";
import { LinearGradient } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';

import Spinner from '../../components/common/Spinner';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: '#A2A2A2',
    height: 25,
    paddingHorizontal: 2,
  },
  inputLabel: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "100",
    marginBottom: 5
  },
  inputStyle: {
    fontFamily: "Roboto",
    fontSize: 14
  },
  form: {
    width: 0.85 * deviceWidth,
    maxWidth: 0.95 * deviceWidth,
    height: 0.6 * deviceHeight,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginText: {
    fontSize: 27,
    fontFamily: 'Roboto',
    fontWeight: '300',
    color: 'white'
  },
  button: {
    marginTop: 25,
    borderRadius: 10,
    width: 200,
    paddingVertical: 10,
  },

  fe: {
    alignItems: 'flex-end',
  },
  dev: {
    borderColor: 'black',
    borderWidth: 1,
  },
  divider: {
    marginVertical: 25,
    backgroundColor: '#A2A2A2',
    height: StyleSheet.hairlineWidth,
    width: 0.3 * deviceWidth,
  },
  dividerText: {
    fontFamily: "Roboto",
    color: '#A2A2A2',
    paddingHorizontal: 5,
    fontSize: 12
  },
  signupView: {
    marginTop: 30,
  },
  signupText: {
    fontFamily: "Roboto",
    fontSize: 12,
    color: '#A2A2A2',
  },
  createnow: {
    fontWeight: 'bold',
  }
});

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('user');
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    });
    this.state = { text: 'Useless Placeholder', resetNav: resetAction };
  }

  state = { fontLoaded: false, email: '', password: '', loading: false };

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <View>
        <LinearGradient
            colors={['#32CCBC', '#90F7EC']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 0.55 * deviceHeight,
            }}
            start={[0,0]}
            end={[1,0]}
        />
        </View>
        <Grid>
          <Row size={2} style={[styles.container, styles.fe]}>
            <Image source={require('../../assets/images/pl-logo.png')} style={{ width: 100, height: 100, borderRadius: 15 }}/>
          </Row>
          <Row size={1} style={[styles.container]}>
          <Text style={styles.loginText}>Pet Shop</Text>
          </Row>
          <Row size={6}  style={ [styles.container, { alignItems: 'flex-start'}] }>
            <View style={[ styles.form, {alignItems: 'center'} ]}>
              <Input
                value={this.state.email}
                onChange={event => this.setState({ email: event.nativeEvent.text })}
                keyboardType='email-address'
                label='Email'
                autoComplete='email'
                placeholder="john@example.com"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={{marginTop: 10}}
                inputStyle={styles.inputStyle}
                labelStyle={[styles.inputLabel]}
                onSubmitEditing={this._signInWithEmail} />
              <Input
                value={this.state.password}
                onChange={event => this.setState({ password: event.nativeEvent.text })}
                secureTextEntry={true}
                autoCapitalize='none'
                label='Password'
                placeholder="******"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={{marginTop: 20}}
                inputStyle={styles.inputStyle}
                labelStyle={[styles.inputLabel]}
                onSubmitEditing={this._signInWithEmail} />
              { this.renderButton() }
              <View flexDirection="row" style={{alignItems: 'center'}}>
                <View style={styles.divider}/>
                <Text style={styles.dividerText}>ATAU</Text>
                <View style={styles.divider}/>
              </View>
              <Button
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: ['#3C8CE7', '#00EAFF'],
                  start: { x: 0, y: 0 },
                  end: { x: 1, y: 0 },
                }}
                title="Sign in with Facebook"
                buttonStyle={[styles.button, {marginTop: 0}]}
                onPress={this._signInFacebook}
              />
              <View flexDirection="row" style={styles.signupView}>
                <Text style={[styles.signupText]}>Don't have an account? </Text>
                <TouchableHighlight>
                  <View>
                    <Text style={[styles.signupText, styles.createnow]} onPress={() => this.props.navigation.navigate('SignUp')}>Create Now</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </Row>
        </Grid>
      </Container>
    );
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size='small' />;
    }

    return (
      <Button
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#90F7EC', '#32CCBC'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}
        title="Sign in"
        buttonStyle={[styles.button]}
        onPress={this._signInWithEmail}
      />
    );
  }

  _signInWithEmail = async () => {
    const { email, password } = this.state;

    if (!email || !password) {
      Alert.alert('Gagal', 'Masukkan Email dan Password');
      return;
    }

    this.setState({ loading: true });

    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userData) => {
          AsyncStorage.setItem('userToken', userData.user.uid);
      })
      .then(this.onLoginSuccess.bind(this))
      .catch((error) => {
        this.onLoginFail();
      }
    );
  }

  onLoginFail() {
    this.setState({ loading: false });
    Alert.alert('Gagal', 'Email atau Password salah');
  }

  onLoginSuccess() {
    this.setState({ email: '', password: '', loading: false });
    this.props.navigation.dispatch(this.state.resetNav);
  }

  _signInFacebook = async () => {
    const appId = '2160043080729166';

    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync(appId, {
      permissions: ['public_profile'],
    });

    switch (type) {
      case 'success': {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);// Set persistent auth state

        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
        const graphApi = `https://graph.facebook.com/v3.2/me?fields=id,name,email,picture.type(large)&access_token=${token}`;
        const alertPrint = await fetch(graphApi);

        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            AsyncStorage.setItem('userToken', user.uid); //set Token disimpan di AsyncStorage

            const dataUser = firebase.firestore().collection('user').doc(user.uid);//ngambil data document by user id Auth
            dataUser.get().then((doc) => {
              //buat ngecek data dari documentnya ada ga atau sama ga dengan user id Auth
              if (!doc.exists) {
                //kalo datanya ga ada, berarti jadinya sign up. kalo datanya ada berarti di skip bagian ini
                fetch(graphApi)
                .then(response => response.json())
                .then((response) => {
                    this.ref.doc(`${user.uid}`).set({
                      email: `${response.email}`,
                      nama: `${response.name}`,
                      foto: `${response.picture.data.url}`,
                    })
                    .catch((error) => {
                      console.error("Error adding user: ", error);
                    });
                })
                .catch(error => console.log(error));
              }
            });
          }
        });

        Alert.alert('Logged in!', `Hi ${(await alertPrint.json()).name}!`);
        this.props.navigation.dispatch(this.state.resetNav);
      }
      case 'cancel': { }
    }
  };
}

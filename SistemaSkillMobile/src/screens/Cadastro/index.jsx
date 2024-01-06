import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import service from '../../services/api';


const Cadastro = ({ navigation }) => {

  const [ver, setVer] = useState(false);
  const [senha, setSenha] = useState();
  const [confirmarSenha, setConfirmarSenha] = useState();
  const [login, setLogin] = useState();
//Snackbar1
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
//Snackbar2
  const [visible2, setVisible2] = React.useState(false);
  const onToggleSnackBar2 = () => setVisible2(!visible2);
  const onDismissSnackBar2 = () => setVisible2(false);

  const verSenha = () => {
    setVer(!ver);
    console.log(ver);
  }

  const cadastro = async () => {
    console.log(login);
    console.log(senha);
    console.log(confirmarSenha);
    if (senha === confirmarSenha) {
      console.log("senhas iguais");
      const log = {
        email: login,
        password: senha
      }
      await service.post("/usuario/cadastro", log)
        .then((resposta) => {
          console.log("deu certo");
          navigation.navigate('Login')
        }).catch(() => {
          console.log("erro");
          onToggleSnackBar2()
        })

    } else {
      onToggleSnackBar()
    }
  }

  return (
    <View style={styles.tela}>
      <View style={styles.card}>

        <View style={styles.loginLo}>
          <Text>Login</Text>
          <TextInput style={styles.inputLo} keyboardType='email-address' onChangeText={setLogin}/>
        </View>

        <View style={styles.senhaLo}>
          <Text>Senha</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput style={styles.inputLo} secureTextEntry={!ver} onChangeText={setSenha}/>
            <TouchableOpacity style={{ position: 'absolute', right: 2, top: 3 }} onPress={verSenha}>
              <Text >{ver ? <Entypo name="eye-with-line" size={24} color="black" /> : <Entypo name="eye" size={24} color="black" />}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.senhaLo}>
          <Text>Confirmar senha</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput style={styles.inputLo} secureTextEntry={!ver} onChangeText={setConfirmarSenha}/>
            <TouchableOpacity style={{ position: 'absolute', right: 2, top: 3 }} onPress={verSenha}>
              <Text >{ver ? <Entypo name="eye-with-line" size={24} color="black" /> : <Entypo name="eye" size={24} color="black" />}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.entrar} onPress={() =>cadastro() }>
          <Text>entrar</Text>
        </TouchableOpacity>

      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Ok',
          onPress: () => {
            // Do something
          },
        }}>
        As senhas não coincidem
      </Snackbar>

      <Snackbar
        visible={visible2}
        onDismiss={onDismissSnackBar2}
        action={{
          label: 'Ok',
          onPress: () => {
            // Do something
          },
        }}>
        Email já cadastrado!
      </Snackbar>
    </View>
  )
}

export default Cadastro
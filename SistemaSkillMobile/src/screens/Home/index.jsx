import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { styles } from './style'
import AuthContext from '../../context/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import service from '../../services/api'
import { Modal, Portal, Button, PaperProvider, List } from 'react-native-paper';

const Home = ({ navigation }) => {

  const { user, signOut } = useContext(AuthContext);
  const [lista, setLista] = useState([]);
  const [options, setOptions] = useState([]);
  const [nivel, setNivel] = useState("");
  const [opcao, setOpcao] = useState('');
  //modal1
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };
  //modal2
  const [visible2, setVisible2] = React.useState(false);
  const showModal2 = () => setVisible2(true);
  const hideModal2 = () => setVisible2(false);
  //modal3
  const [visible3, setVisible3] = React.useState(false);
  const showModal3 = () => setVisible3(true);
  const hideModal3 = () => setVisible3(false);

  const pegarskills = async () => {
    await service.get("/skill/listar")
      .then((resposta) => {
        console.log(resposta.data);
        setOptions(resposta.data)
      })
  }
  useEffect(() => {
    pegarskills()
    console.log(AsyncStorage.getItem('id'));
  }, [adicionar])

  const listaSkill = async () => {
    // console.log(await (AsyncStorage.getItem('infoUser')));
    let user = await (AsyncStorage.getItem('infoUser'))
    user = JSON.parse(user);
    console.log(user.id);
    service.get(`/usuario/listaSkill/${user.id}`)
      .then((response) => {
        console.log('deu certo');
        console.log(response.data);
        setLista(response.data)

      })
      .catch(() => {
        console.log('deu errado');
      })
  }
  useEffect(() => {
    listaSkill()
  }, [adicionar])

  const adicionar = async () => {
    console.log(nivel);
    console.log(opcao);
    let user = await (AsyncStorage.getItem('infoUser'))
    user = JSON.parse(user);
    console.log(user.id);
    service.post("/skill/associar", {}, { params: { idSkill: opcao, idUsuario: user.id, nivel: nivel } })
      .then(() => {
        console.log('deu certo');
        hideModal()
        listaSkill()
      }).catch(() => {
        console.log('deu ruim');
      })
  }

  const deleta = () => {

    console.log(opcao);
    service.delete(`/skill/deletar/${opcao}`)
      .then(() => {
        console.log('deu certo');
        hideModal2()
        listaSkill()
      }).catch(() => {
        console.log('deu ruim');
      })
  }

  const editar = () => {
    console.log(nivel);
    console.log(opcao);
    service.patch(`/skill/atualizar/${opcao}`, {}, { params: { nivel: nivel } })
      .then(() => {
        console.log('deu certo');
        hideModal3()
        listaSkill()
      }).catch(() => {
        console.log('deu ruim');
      })
  }

  return (
    <View style={styles.tela}>
      <View style={{ backgroundColor: '#22B3B2', width: '100%', height:"8%" }}>
        <Image  style={{height:55, width: 55}} source={require( '../../../assets/Logo-Neki.png')}/>
        <TouchableOpacity style={styles.logout} TouchableOpacity onPress={() => { signOut() }}>
          <Text style={{
            fontWeight: '500', textShadowColor: '#fff',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 8
          }}>Logout</Text>
        </TouchableOpacity >
      </View>
      {lista.length !== 0 ? <>
        <Text style={{ marginTop: 30, fontSize:18 }}>Skills</Text>
        <View style={styles.listaTopo}>
          <Text style={{ flex: 1, textAlign: 'center' }}>Imagem</Text>
          <Text style={{ flex: 1, textAlign: 'center' }}>Nome</Text>
          <Text style={{ flex: 1, textAlign: 'center' }}>Level</Text>
          <Text style={{ flex: 1, textAlign: 'center' }}>Descrição</Text>
        </View>
        <FlatList
          data={lista}
          style={styles.lista}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) =>
            <View style={[
              styles.itemlista,
              index % 2 == 0 ? styles.par : styles.impar]}>
              <Image style={{ flex: 1 }} width={50} height={50} resizeMode='contain' source={{ uri: item.skills.imagem }} alt={item.nome} />
              <Text style={{ flex: 1, textAlign: 'center' }}>{item.skills.nome}</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>{item.nivel}</Text>
              <Text style={{ flex: 1, textAlign: 'center',fontSize:12 }}>{item.skills.descricao}</Text>
            </View>}
        /></> :
        <View style={{ marginTop: "70%" }}>
          <Text style={{ fontSize: 18 }}>Você ainda não tem skills cadastradas</Text>
        </View>}
      <View style={styles.botoes}>
        {lista.length !== 0 ? <>
          <TouchableOpacity style={styles.botao} TouchableOpacity onPress={() => { showModal3() }}>
            <Text style={{
              textShadowColor: '#fff',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 8
            }}>Editar</Text>
          </TouchableOpacity >
          <TouchableOpacity style={styles.botao} TouchableOpacity onPress={() => { showModal2() }}>
            <Text style={{
              textShadowColor: '#fff',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 8
            }}>Excluir</Text>
          </TouchableOpacity >
        </> : <></>}
        <TouchableOpacity style={styles.botao} TouchableOpacity onPress={() => { showModal() }}>
          <Text style={{
            textShadowColor: '#fff',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 8
          }}>Adicionar</Text>
        </TouchableOpacity >
      </View>



      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>adicionar skill</Text>
          <List.Section title="">
            <List.Accordion
              title="adicione sua skill"
              left={props => <List.Icon {...props} icon="folder" />}>
              {options.map((skill) =>
                <TouchableOpacity onPress={() => setOpcao(skill.id)}>
                  <List.Item title={skill.nome} />
                </TouchableOpacity>)}

            </List.Accordion>
            <List.Accordion
              title="adicione seu level"
              left={props => <List.Icon {...props} icon="folder" />}>
              <TouchableOpacity onPress={() => setNivel('Alto')}>
                <List.Item title='Alto' />
              </TouchableOpacity >
              <TouchableOpacity onPress={() => setNivel('Médio')}>
                <List.Item title='Médio' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNivel('Baixo')}>
                <List.Item title='Baixo' />
              </TouchableOpacity>

            </List.Accordion>
          </List.Section>
          <TouchableOpacity style={styles.botao} onPress={adicionar}>
            <Text>adicionar</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>

      <Portal>
        <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={containerStyle}>
          <Text>excluir</Text>
          <List.Section title="">
            <List.Accordion
              title="exclua sua skill"
              left={props => <List.Icon {...props} icon="folder" />}>
              {lista.map((skill) =>
                <TouchableOpacity onPress={() => setOpcao(skill.id)}>
                  <List.Item title={skill.skills.nome} />
                </TouchableOpacity>)}

            </List.Accordion>
          </List.Section>
          <TouchableOpacity style={styles.botao} onPress={deleta}>
            <Text>excluir</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>

      <Portal>
        <Modal visible={visible3} onDismiss={hideModal3} contentContainerStyle={containerStyle}>
          <Text>editar</Text>
          <List.Section title="">
            <List.Accordion
              title="edite sua skill"
              left={props => <List.Icon {...props} icon="folder" />}>
              {lista.map((skill) =>
                <TouchableOpacity onPress={() => setOpcao(skill.id)}>
                  <List.Item title={skill.skills.nome} />
                </TouchableOpacity>)}
            </List.Accordion>
            <List.Accordion
              title="edite seu level"
              left={props => <List.Icon {...props} icon="folder" />}>
              <TouchableOpacity onPress={() => setNivel('Alto')}>
                <List.Item title='Alto' />
              </TouchableOpacity >
              <TouchableOpacity onPress={() => setNivel('Médio')}>
                <List.Item title='Médio' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNivel('Baixo')}>
                <List.Item title='Baixo' />
              </TouchableOpacity>

            </List.Accordion>

          </List.Section>
          <TouchableOpacity style={styles.botao} onPress={editar}>
            <Text>editar</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>

    </View >
  )
}

export default Home
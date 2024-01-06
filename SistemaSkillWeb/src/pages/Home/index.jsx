import React, { useEffect, useState } from 'react'
import HeaderWeb from '../../components/HeaderWeb'
import './style.css'
import service from '../../service/service'
import Select from 'react-select';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoTrash } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

function Home() {

  const navi = useNavigate();
  const [lista, setLista] = useState([]);
  const [options, setOptions] = useState([])
  const [novaSkills, setNovaSkills] = useState("");
  const [opcao, setOpcao] = useState("");
  const [nivel, setNivel] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [nivel2, setNivel2] = useState("");
  const [idTroca, setIdTroca] = useState();


  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navi('/');
  }

  const pegarskills = async () => {
    await service.get("/skill/listar")
      .then((resposta) => {
        console.log(resposta.data);
        setOptions(resposta.data.map(skill => ({
          value: skill.id,
          label: skill.nome
        })))
      })
  }
  useEffect(() => {
    pegarskills()
    console.log(sessionStorage.getItem('id'));
  }, [])

  const listaSkill = () => {
    service.get(`/usuario/listaSkill/${sessionStorage.getItem('id')}`)
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
  }, [])

  const addSkill = () => {
    //
    console.log(opcao.value);
    service.post("/skill/associar", {}, { params: { idSkill: opcao.value, idUsuario: sessionStorage.getItem('id'), nivel: nivel.value } })
      .then(() => {
        console.log('deu certo');
        navi('/')
      }).catch(() => {
        console.log('deu ruim');
      })
  }

  const deleta = (id) => {
    console.log(id);
    service.delete(`/skill/deletar/${id}`)
      .then(() => {
        console.log('deu certo');
        navi('/')
      }).catch(() => {
        console.log('deu ruim');
      })
  }
  const alterar = () => {
    console.log(nivel2.value);
    console.log(idTroca);
    service.patch(`/skill/atualizar/${idTroca}`, {}, { params: { nivel: nivel2.value } })
      .then(() => {
        console.log('deu certo');
        navi('/')
      }).catch(() => {
        console.log('deu ruim');
      })
  }

  return (
    <>
      <HeaderWeb />
      <div className='paginaHo'>
        <button className='logout' onClick={logout}>Logout<CiLogout /></button>
        <Table style={{ textAlign: 'center', border: '1px solid black' }} striped bordered hover size='sm' >
          <thead >
            <tr >
              <th >imagem</th>
              <th>nome</th>
              <th>level</th>
              <th>descriçao</th>
            </tr>
          </thead>
          <tbody>
            {lista?.map((skill, key) => {
              return (
                <tr key={key}>
                  <td> <img height={70} src={skill.skills.imagem} /></td>
                  <td style={{ paddingTop: '28px' }}>{skill.skills.nome}</td>
                  <td style={{ paddingTop: '28px' }}>{skill.nivel}</td>
                  <td style={{ paddingTop: '28px' }}>{skill.skills.descricao}</td>
                  <td style={{ paddingTop: '28px', cursor: 'pointer' }} onClick={() => deleta(skill.id)}><IoTrash /></td>
                  <td style={{ paddingTop: '28px', cursor: 'pointer' }} onClick={() => { setIdTroca(skill.id); handleShow2() }}><CiEdit /></td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <p>Adicione outra skill</p>

        <button className='botaoSkillHo' onClick={handleShow}>Adicionar</button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            Escolha a skill e o seu nível nela
            <Select onChange={setOpcao} options={options} />
            <Select onChange={setNivel} options={
              [
                {
                  value: 'Alto',
                  label: 'Alto'
                },
                {
                  value: 'Médio',
                  label: 'Médio'
                },
                {
                  value: 'Baixo',
                  label: 'Baixo'
                }
              ]
            } />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={addSkill}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show2} onHide={handleClose2}>
          <Modal.Body>
            Altere seu nivel
            <Select onChange={setNivel2} options={
              [
                {
                  value: 'Alto',
                  label: 'Alto'
                },
                {
                  value: 'Médio',
                  label: 'Médio'
                },
                {
                  value: 'Baixo',
                  label: 'Baixo'
                }
              ]
            } />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
              Close
            </Button>
            <Button variant="primary" onClick={alterar}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export default Home
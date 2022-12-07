import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import app from '../../app.js';
import request from 'supertest';

let server;
beforeEach(() => {
    const port = 3500;
    server = app.listen(port);
});

afterEach( () => {
    server.close();
});

describe('GET em /editoras', () => {
    it.skip('Deve retornar uma lista de editoras(modelo-01)', async ()=> {
        await request(app)
            .get('/editoras')
            .expect(200);
    });

    it('Deve retornar uma lista de editoras(modelo-02)', async ()=> {
        const resposta = await request(app)
            .get('/editoras')
            .expect(200);

        expect(resposta.body[0].email).toEqual('e@e.com')
    });
});

let idResposta;
describe('POST em /editoras', () =>{
    it('Deve adicionar uma nova editora', async () =>{
        const resposta = await request(app)
            .post('/editoras')
            .send({
                nome:"CDC",
                cidade:"São Paulo",
                email:"s@s.com"
            })
            .expect(201);

        idResposta = resposta.body.content.id;
    }); 
    
    it('Não adicionar nada quando o body estiver vazio', async () =>{
        await request(app)
            .post('/editoras')
            .send({})
            .expect(400); 
    })
});

describe('GET em /editoras/id', () =>{
    it('Deve retornar recurso selecionado', async () =>{
        await request(app)
            .get(`/editoras/${idResposta}`)
            .expect(200);
    });
});

describe('PUT em /editoras/id', () =>{
    it.each([
        ['nome', {nome:'Casa do Codigo'}],
        ['cidade', {cidade: 'Sampa'}],
        ['email', {email:'cdc@cdc.com'}],
    ])('Deve modificar recurso %s', async (chave, param) =>{
        const requisicao = { request };
        const spy = jest.spyOn(requisicao, 'request');
        await requisicao.request(app)
            .put(`/editoras/${idResposta}`)
            .send(param)
            .expect(204);

        expect(spy).toHaveBeenCalled();
    });
    
});

describe('DELETE em /editoras/id', () =>{
    it('Deve deletar uma editora', async () =>{
        await request(app)
            .delete(`/editoras/${idResposta}`)
            .expect(200);
    });    
});



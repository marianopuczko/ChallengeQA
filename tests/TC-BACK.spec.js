import axios from 'axios';
import { expect } from 'chai';

const API_URL = "https://gorest.co.in/public/v2/users";
const TOKEN = "6e0880d01913dd1947a241cf5098ac211680fcaa9b134bd6502d7e86ced001f9";

describe("Pruebas de API GoRest- Usuarios", () => {
  let idUsuario;

//Creación de nuevo usuario

  it("Debe crear un nuevo usuario", async () => {
    const nuevoUsuario = {
      name: "Mariano Puczko",
      gender: "male",
      email: `mpuczk_${Date.now()}@gmail.com`,
      status: "active",
    };

    const response = await axios.post(API_URL, nuevoUsuario, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property("id");
    idUsuario = response.data.id;
  });

// Obtenemos una lista de usuarios

    it("Debe obtener la lista de usuarios", async () => {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      expect(response.status).to.equal(200);
    });

//Obtenemos el detalle de un usuario

    it("Debe obtener el detalle de un usuario específico", async () => {
      const response = await axios.get(`${API_URL}/${idUsuario}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property("id", idUsuario);
      console.log(response.data);
    });
});

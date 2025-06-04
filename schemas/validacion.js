const { z } = require('zod')

const paisSchema = z.object({
    // id: z.string().uuid(),
    pais: z.string(),
    idioma: z.array(z.enum([
    'Italiano',
    'Inglés',
    'Chino',
    'Español',
    'Francés',
    'Japonés',
    'Portugués',
    'Hindi',
    'Ruso',
    'Árabe',
    'Afrikáans',
    'Alemán',
    'Maorí',
    'Coreano',
    'Maltés'
  ])),
    // idioma: z.string(),
    continente: z.string()
})
// const  UserSchema = z.object ( { 
//  nombredeusuario : z.string ( ), 
// }); 
// const usuario = { nombredeusuario : "John" }; 
// const resultado = UserSchema .safeParse (usuario); console .log 
// ( resultado );

const validarPais = (pais) => {
  return paisSchema .safeParse(pais)
}

module.exports = {
  validarPais
}
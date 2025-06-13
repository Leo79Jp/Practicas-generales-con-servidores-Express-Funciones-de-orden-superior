const express = require("express");
const app = express();
const port = 3000;
const fs = require('fs');
const countries = require("./data.json");

const {validarPais} = require('./schemas/validacion')
app.disable('x-powered-by')
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.get("/paises/all", (req, res) => {
  res.json(countries);
});

app.get("/paises/:pais", (req, res) => {
    const pais = req.params.pais;
  try {
    const consultaPais = countries.find((country) => country.pais === pais);
    if (consultaPais) {
      res.json(countries.find((country) => country.pais === pais));
    } else {
      res.status(404).send("Pais not found");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.get("/paises", (req, res) => {
    const queryIdioma = req.query.idioma.toLowerCase()
  if (queryIdioma) {
    const paisesIdioma = countries.filter(country => country.idioma.some(c => c.toLowerCase() === queryIdioma))
    if (paisesIdioma.length) {
      res.json(paisesIdioma)
    } else {
      res.status(404).json({ error: 'No pais found' })
    }
  }
}); 

app.post('/paises', (req, res) => {
  const paisNuevo = validarPais(req.body)
  console.log(paisNuevo);
  if (!paisNuevo.success) {
    res.status(400).json({ error: 'Invalid data: ', data: paisNuevo.error })
  }
  try {
    countries.push(paisNuevo.data)
    fs.writeFileSync('./data.json', JSON.stringify(countries, null, 2))
    res.status(201).json(paisNuevo)
  } catch (error) {
    res.status(500).json({ error: 'Error creating country' })
  }
})

app.delete('/paises/:pais', (req, res) => {
  const { pais } = req.params
  const paisABorrar = countries.findIndex(p => p.pais === pais)
  if (paisABorrar === -1) {
    res.status(404).json({ error: 'Pais no encontrado' })
  }else{
     countries.splice(paisABorrar, 1)
     try {
       fs.writeFileSync('./data.json', JSON.stringify(countries, null, 2))
       res.status(200).json({mesaage: 'Pais Borrado', data: pais})
     } catch (error) {
       res.status(500).json({ error: 'Error al borrar pais' })
     }
  }
})

app.patch('/paises/:pais', (req, res) => {
  const { pais } = req.params

  const paisAModificar = countries.findIndex(p => p.pais === pais)
  if (paisAModificar < 0) {
    res.status(404).json({ error: 'Pais no encontrado' })
  }
  try {
    countries[paisAModificar] = {...countries[paisAModificar], ...req.body}
    fs.writeFileSync('./data.json', JSON.stringify(countries, null, 2))
    res.status(200).json({mesaage: 'Pais Modificado', data: countries[paisAModificar]})
  } catch (error) {
    res.status(500).json({ error: 'Error al modificar pais' })
  }
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 
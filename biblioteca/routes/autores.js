let express = require('express');
let db = require('../utils/db');
let router = express.Router();



/* Rota para listar autores a partir do banco de dados */
let algumaCondicao = true; // or any other appropriate value

router.get('/listar', function(req, res) {
  if (algumaCondicao) {
    let cmd = `
      SELECT IdAutor, NoAutor, NoNacionalidade
      FROM TbAutor AS a
      INNER JOIN TbNacionalidade AS n
        ON a.IdNacionalidade = n.IdNacionalidade
      ORDER BY a.NoAutor
    `;
    
    db.query(cmd, [], function(erro, listagem) {
      if (erro) {
        return res.status(500).send(erro);
      }
      res.render('autores-lista', { resultado: listagem });
    });
  } else {
    res.status(400).send('Condição não atendida');
  }
});

// Rota para exibir o formulário para adicionar um novo autor
router.get('/add', function(req, res) {
  res.render('autores-add', {resultado:{}}); // Renderiza a view do formulário
});

// Rota para lidar com a submissão do formulário para adicionar um novo autor
router.post('/add', function(req, res) {
  if (algumaCondicao) {
    let nome    = req.body.nome;
    let nacionalidade = req.body.nacionalidade;

    // Verifica se a nacionalidade existe em TbNacionalidade
    let nacionalidadeCmd = "SELECT IdNacionalidade FROM TbNacionalidade WHERE NoNacionalidade = (?);";
    db.query(nacionalidadeCmd, [nacionalidade], function(erro, nacionalidadeResult) {
      if (erro) {
        return res.status(500).send(erro);
      }

      // Se não encontrar a nacionalidade, insere uma nova linha em TbNacionalidade
      if (nacionalidadeResult.length === 0) {
        let insertNacionalidadeCmd = "INSERT INTO TbNacionalidade (NoNacionalidade) VALUES (?);";
        db.query(insertNacionalidadeCmd, [nacionalidade], function(erro, insertResult) {
          if (erro) {
            return res.status(500).send(erro);
          }

          // Obtém o IdNacionalidade da linha inserida
          let idNacionalidade = insertResult.insertId;

          // Agora você pode inserir a linha em TbAutor com o IdNacionalidade correto
          let autorCmd = "INSERT INTO TbAutor (NoAutor, IdNacionalidade) VALUES (?,?);";
          db.query(autorCmd, [nome, idNacionalidade], function(erro, autorResult) {
            if (erro) {
              return res.status(500).send(erro);
            }
            res.redirect('/autores/listar');
          });
        });
      } else {
        // Se encontrar a nacionalidade, obtém o IdNacionalidade
        let idNacionalidade = nacionalidadeResult[0].IdNacionalidade;

        // Agora você pode inserir a linha em TbAutor com o IdNacionalidade correto
        let autorCmd = "INSERT INTO TbAutor (NoAutor, IdNacionalidade) VALUES (?,?);";
        db.query(autorCmd, [nome, idNacionalidade], function(erro, autorResult) {
          if (erro) {
            return res.status(500).send(erro);
          }
          res.redirect('/autores/listar');
        });
      }
    });
  } else {
    res.status(400).send('Condição não atendida');
  }
});

router.get('/dit/:id', function(req, res) {
  if (algumaCondicao) {
    let id = req.params.id;
    let cmd  = 'SELECT IdAutor, NoAutor, IdNacionalidade FROM TbAutor WHERE IdAutor = ?;';
   
    db.query(cmd, [id], function(erro, listagem) {
      if (erro) {
        return res.status(500).send(erro);
      }
      res.render('autores-add', { resultado: listagem [0]});
    });
  } else {
    res.status(400).send('Condição não atendida');
  }
});
router.put('/dit/:id', function(req, res) {
  let id = req.params.id;
  let nome = req.body.nome;
  let nacionalidade = req.body.nacionalidade;

  // Verifica se a nacionalidade existe em TbNacionalidade
  let nacionalidadeCmd = "SELECT IdNacionalidade FROM TbNacionalidade WHERE NoNacionalidade = ?;";
  db.query(nacionalidadeCmd, [nacionalidade], function(erro, nacionalidadeResult) {
    if (erro) {
      return res.status(500).send(erro);
    }

    // Se não encontrar a nacionalidade, insere uma nova linha em TbNacionalidade
    if (nacionalidadeResult.length === 0) {
      let insertNacionalidadeCmd = "INSERT INTO TbNacionalidade (NoNacionalidade) VALUES (?);";
      db.query(insertNacionalidadeCmd, [nacionalidade], function(erro, insertResult) {
        if (erro) {
          return res.status(500).send(erro);
        }

        // Obtém o IdNacionalidade da linha inserida
        let idNacionalidade = insertResult.insertId;

        // Agora você pode atualizar a linha em TbAutor com o IdNacionalidade correto
        let autorCmd = "UPDATE TbAutor SET NoAutor = ?, IdNacionalidade = ? WHERE IdAutor = ?;";
        db.query(autorCmd, [nome, idNacionalidade, id], function(erro, autorResult) {
          if (erro) {
            return res.status(500).send(erro);
          }
          res.redirect('/autores/listar');
        });
      });
    } else {
      // Se encontrar a nacionalidade, obtém o IdNacionalidade
      let idNacionalidade = nacionalidadeResult[0].IdNacionalidade;

      // Agora você pode atualizar a linha em TbAutor com o IdNacionalidade correto
      let autorCmd = "UPDATE TbAutor SET NoAutor = ?, IdNacionalidade = ? WHERE IdAutor = ?;";
      db.query(autorCmd, [nome, idNacionalidade, id], function(erro, autorResult) {
        if (erro) {
          return res.status(500).send(erro);
        }
        res.redirect(303,'/autores/listar');
      });
    }
  });
});
router.delete('/delete/:id', function(req, res) {
  let id = req.params.id;

  let autorCmd = "DELETE FROM TbAutor WHERE IdAutor= ?;";
    db.query(autorCmd, [id], function(erro, autorResult) {
      if (erro) {
        return res.status(500).send(erro);
      }
      res.redirect(303,'/autores/listar');
      
    });
});


module.exports = router;


/*CRUD
c: create
R: read
U: Updadte
D: Delete
*/
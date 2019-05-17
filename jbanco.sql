CREATE DATABASE jbanco;
ALTER DATABASE jbanco CHARACTER SET utf8 COLLATE utf8_general_cs;
use jbanco;

CREATE TABLE IF NOT EXISTS usuarios (
  id_user int(11) NOT NULL AUTO_INCREMENT ,
  usuario varchar(100),
  email varchar(100),
  senha varchar(100),
  
  PRIMARY KEY (id_user)
);

CREATE TABLE IF NOT EXISTS cliente (
  id_cliente int(11) NOT NULL AUTO_INCREMENT ,
  nome varchar(50),
  telefone1 varchar(15),
  telefone2 varchar(15),
  endereco varchar(245),
  
  PRIMARY KEY (id_cliente)
);

CREATE TABLE IF NOT EXISTS tarefas (
  id_tarefa int(11) NOT NULL AUTO_INCREMENT ,
  id_user int(11),
  
  dia date,
  periodo varchar(5),
  problema varchar(245),
  informacoes varchar(245),
  total_recebido varchar(10),
  total_gasto varchar(10),
  observacoes_servico varchar(245),
  
  nome varchar(50),
  telefone1 varchar(15),
  telefone2 varchar(15),
  endereco varchar(245),
  
  FOREIGN KEY (id_user) REFERENCES usuarios(id_user),
  PRIMARY KEY (id_tarefa)
);

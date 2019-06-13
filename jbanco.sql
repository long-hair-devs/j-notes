CREATE DATABASE jbanco;
ALTER DATABASE jbanco CHARACTER SET utf8 COLLATE utf8_general_ci;
use jbanco;

CREATE TABLE IF NOT EXISTS usuarios (
  id_user int(11) NOT NULL AUTO_INCREMENT ,
  usuario varchar(20) NOT NULL,
  email varchar(30) NOT NULL,
  senha varchar(40) NOT NULL,
  
  PRIMARY KEY (id_user)
);

CREATE TABLE IF NOT EXISTS cliente (
  id_cliente int(11) NOT NULL AUTO_INCREMENT ,
  id_user int(11) NOT NULL,
  nome varchar(30) NOT NULL,
  telefone1 varchar(15) NOT NULL,
  telefone2 varchar(15),
  endereco varchar(245) NOT NULL,
  
  FOREIGN KEY (id_user) references usuarios(id_user),
  PRIMARY KEY (id_cliente)
);

CREATE TABLE IF NOT EXISTS tarefas (
  id_tarefa int(11) NOT NULL AUTO_INCREMENT ,
  id_user int(11)  NOT NULL,
  
  dia date  NOT NULL,
  periodo varchar(6)  NOT NULL,
  problema varchar(245),
  informacoes varchar(245),
  total_recebido decimal(8,2),
  total_gasto decimal(8,2),
  observacoes_servico varchar(245),
  
  nome varchar(30)  NOT NULL,
  telefone1 varchar(15)  NOT NULL,
  telefone2 varchar(15),
  endereco varchar(245)  NOT NULL,
  
  FOREIGN KEY (id_user) REFERENCES usuarios(id_user),
  PRIMARY KEY (id_tarefa)
);
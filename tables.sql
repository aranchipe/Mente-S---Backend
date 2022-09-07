create database projeto_gama

create table profissionais (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
)


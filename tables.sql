create database projeto_gama

create table profissionais (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
)


create table pacientes (
  id serial primary key,
  profissional_id integer not null references profissionais(id),
  nome text not null,
  data_nascimento timestamp default null,
  cpf text not null unique,
  genero text not null, 
  endereco text,
  email text not null unique,
  telefone text not null unique
)

create table sessoes (
  id serial primary key,
  profissional_id integer not null references profissionais(id),
  paciente_id integer not null references pacientes(id),
  data timestamp not null default now(),
  status text not null,
  tema text default null,
  duracao time default '00:00',
  tipo text not null
)
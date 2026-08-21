export type Permissao = {
  id: number;
  nome: string;
  label: string;
};

export type Perfil = {
  id: number;
  nome: string;
  label: string;
  perfilPaiId?: number | null;
  permissoes: Permissao[];
};

export type PerfilSummary = Pick<Perfil, 'id' | 'nome' | 'label'>;

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfilPadraoId?: number | null;
  perfis: PerfilSummary[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UsuarioPayload = {
  nome: string;
  email: string;
  perfisIds: number[];
  perfilPadraoId?: number | null;
  password?: string;
  passwordConfirmation?: string;
  isActive?: boolean;
};

export type PerfilPayload = {
  nome: string;
  label: string;
  permissoesIds: number[];
  perfilPaiId?: number | null;
};

export type PermissaoPayload = {
  nome: string;
  label: string;
};

import React, { useState, useEffect } from 'react';
import { HStack, Input, Box, Button, Text, Spinner, Stack } from '@chakra-ui/react';
import { InputGroup } from "../components/ui/input-group";
import { useNavigate } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu'; // Ícone de busca
import axios from 'axios';

// Definir o tipo para o usuário retornado pela API
interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
}

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [userResults, setUserResults] = useState<GitHubUser[]>([]); // Agora tipado como GitHubUser[]
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para buscar usuários no GitHub
  const fetchUsers = async (query: string) => {
    if (!query) {
      setUserResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://api.github.com/search/users?q=${query}`);
      setUserResults(response.data.items || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce: aguardar um tempo após o usuário parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 500); // 500ms de espera após o usuário parar de digitar

    return () => clearTimeout(timer); // Limpa o timer ao atualizar o valor
  }, [search]);

  const handleSelectUser = (username: string) => {
    navigate(`/profile/${username}`);
    setSearch('');
  };

  return (
    <Box width="full" padding={4}>
      <HStack gap={4} width="full">
        {/* Campo de busca com ícone de busca e atalho */}
        <InputGroup startElement={<LuSearch />} width="full">
          <Input
            placeholder="Search GitHub User..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
            pl="3.5em" // Espaço para o ícone
          />
        </InputGroup>
      </HStack>

      {/* Exibe os resultados da busca */}
      {loading && <Spinner size="lg" mt={4} />}
      {!loading && userResults.length > 0 && (
        <Box mt={4}>
          <Stack>
            {userResults.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                width="full"
                onClick={() => handleSelectUser(user.login)}
              >
                {user.login}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
      {!loading && userResults.length === 0 && search && (
        <Text mt={4} color="gray.500">No users found</Text>
      )}
    </Box>
  );
};

export default SearchBar;

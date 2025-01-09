import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação entre as páginas
import { Input, Button, Box, Flex, Text, Image } from '@chakra-ui/react';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null); // Para mostrar a mensagem de erro
  const navigate = useNavigate();

  // Função para tratar a busca do usuário
  const handleSearch = () => {
    if (username) {
      // Limpa o erro se houver
      setError(null);
      // Verifica se o username existe (pode incluir uma validação para o GitHub mais tarde)
      navigate(`/profile/${username}`);
    } else {
      setError("Please enter a GitHub username"); // Exibe erro se não houver username
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" p={5}>
      {/* Logo - Pode ser uma imagem */}
      <Image src="/path/to/logo.png" alt="SearchFor DEVs" boxSize="150px" mb={5} />
      
      {/* Título */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Search for GitHub Developers
      </Text>

      {/* Input de pesquisa */}
          <Box mb={4} width="100%" maxW="400px">
            
        <Input
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb={2}
        />
      </Box>

      {/* Botão de busca */}
      <Button colorScheme="teal" onClick={handleSearch}>
        Search
      </Button>

      {/* Mensagem de erro */}
      {error && <Text color="red.500" mt={3}>{error}</Text>}
    </Flex>
  );
};

export default Profile;

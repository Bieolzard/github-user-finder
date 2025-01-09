import React from 'react';
import { Box, HStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar'; // Importando o componente de busca

const Header = () => {
  return (
    <Box padding={4} bg="white" borderBottom="1px" borderColor="gray.200">
      <HStack justify="space-between" align="center" width="full">
        {/* Logo */}
        <Link to="/">
          <Image src="/path-to-logo.png" alt="Logo" boxSize="50px" />
        </Link>

        {/* Barra de pesquisa */}
        <SearchBar />
      </HStack>
    </Box>
  );
};

export default Header;

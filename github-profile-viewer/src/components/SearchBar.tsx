import React, { useState, useEffect } from 'react';
import { HStack, Input, Box, Text, Spinner,  } from '@chakra-ui/react';
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
    const [userResults, setUserResults] = useState<GitHubUser[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(search);
        }, 500); // 500ms de espera após o usuário parar de digitar

        return () => clearTimeout(timer);
    }, [search]);

    const handleSelectUser = (username: string) => {
        navigate(`/profile/${username}`);
        setSearch('');
    };

    return (
        <Box width="full" padding={4}>
            <HStack gap={4} width="full">
                <InputGroup startElement={<LuSearch />} width="590px">
                    <Input
                        placeholder="Search GitHub User..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="lg"
                        color={'black'}
                        borderRadius="6px"
                        borderColor="#E2E8F0"
                        borderWidth="1px"
                        transition="all 0.3s ease-in-out"
                        _hover={{ borderColor: "#8C19D2", boxShadow: "0px 4px 8px #8C19D2(0, 0, 0, 0.1)" }}
                        _focus={{
                            borderColor: "#8C19D2",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                        width="100%"
                    />
                </InputGroup>
            </HStack>

            {loading && <Spinner size="lg" mt={4} />}
            {!loading && userResults.length > 0 && (
                <Box width="590px" mt={4} bg="white" border="1px solid #8C19D2" borderRadius="md" boxShadow="sm">
                    {userResults.map((user) => (
                        <Box color={'black'}
                            key={user.id}
                            p={2}
                            _hover={{ backgroundColor: "#F0F0F0", cursor: "pointer" }}
                            onClick={() => handleSelectUser(user.login)}
                        >
                            {user.login}
                        </Box>
                    ))}
                </Box>
            )}
            {!loading && userResults.length === 0 && search && (
                <Text mt={4} color="gray.500">No users found</Text>
            )}
        </Box>
    );
};

export default SearchBar;

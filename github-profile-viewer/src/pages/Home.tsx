import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Box, Flex, Text, Image} from '@chakra-ui/react';
import { InputGroup } from "../components/ui/input-group"
import { LuSearch } from 'react-icons/lu';
import logo from '../assets/logo.png'; // Caminho relativo correto




const Home = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Função para tratar a busca do usuário
    const handleSearch = () => {
        if (username) {
            setError(null);
            navigate(`/profile/${username}`);
        } else {
            setError("Please enter a GitHub username");
        }
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            backgroundColor="#FFF"
            minHeight="100vh"
            height="100%"
        >
            <Image src={logo} alt="SearchFor DEVs" />

            {/* Input de pesquisa */}
            <Box display={'flex'} justifyContent={'center'} mt="56px" width="100%">
                <Flex justify="center" align="center">
                    <InputGroup startElement={<LuSearch />}>
                        <Input
                            width={"592px"}
                            placeholder="Search"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            borderRadius="6px"
                            borderColor="#E2E8F0"
                            borderWidth="1px"
                            _hover={{ borderColor: "#E2E8F0" }}
                            _focus={{
                                borderColor: "#E2E8F0",
                                boxShadow: "0 0 0 1px #E2E8F0",
                            }}
                        />
                    </InputGroup>

                    <Button
                        backgroundColor="#8C19D2"
                        color="white"
                        onClick={handleSearch}
                        paddingBlock={"10px"}
                        paddingInline={"57.5px"}
                        marginStart={"32px"}
                    >
                        Search
                    </Button>
                </Flex>
            </Box>

            {error && <Text color="red.500" mt={3}>{error}</Text>}
        </Flex>
    );
};

export default Home;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Image, Input } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import logo from '../assets/logo.png';
import { InputGroup } from "../components/ui/input-group"
import { useTranslation } from 'react-i18next'; // Importa o hook

const Home = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation(); // Hook para acessar traduções

    const handleSearch = () => {
        const userNameRegex = /^[a-zA-Z0-9-_]+$/;

        if (!username) {
            setError(t("error.emptyField"));
        } else if (!userNameRegex.test(username)){
            setError(t("error.invalidUsername"));
        } else {
            setError(null);
            navigate(`/profile/${username}`)
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#FFF"
            minHeight="100vh"
            padding={{ base: '20px', md: '40px' }}
        >
            {/* Logo responsivo */}
            <Image
                src={logo}
                alt={t("alt.logo")}
                mb={6}
            />

            {/* Input de pesquisa */}
            <Box
                display="flex"
                justifyContent="center"
                mt={{ base: '20px', sm: '40px', md: '56px' }}
                width="100%"
            >
                <Box
                    display={{ base: 'flex', md: 'none' }}
                    width="100%"
                    position="relative"
                    marginBottom="20px"
                >
                    {/* Input customizado para mobile */}
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '15px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        width: '80%'
                    }}>
                        <label
                            htmlFor="mobile-search"
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '12px',
                                backgroundColor: '#FFF',
                                paddingInline: '4px',
                                borderRadius: '8px',
                                color: '#1C1B1F',
                                fontSize: '14px',
                            }}
                        >
                            {t("label.search")}
                        </label>
                        <div style={{
                            position: 'absolute',
                            left: '10px',
                            top: '44%',
                            transform: 'translateY(-50%)',
                            color: '#1C1B1F',
                            fontSize: '18px'
                        }}>
                            <LuSearch />
                        </div>

                        <input
                            type="text"
                            id="mobile-search"
                            placeholder={t("placeholder.search")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                fontSize: '16px',
                                padding: '12px 16px 12px 36px',
                                border: '1px solid #1C1B1F',
                                borderRadius: '4px',
                                marginBottom: '10px',
                                outline: 'none',
                                width: '100%',
                                color: '#1C1B1F',
                                backgroundColor: 'transparent',
                            }}
                        />
                    </div>
                </Box>

                <Box
                    display={{ base: 'none', md: 'flex' }}
                    justifyContent="center"
                    alignItems="center"
                >
                    <InputGroup startElement={<LuSearch />} width="592px">
                        <Input
                            placeholder={t("placeholder.search")}
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
                            width="100%"
                            color={'black'}
                        />
                    </InputGroup>
                </Box>

                <Button
                    backgroundColor="#8C19D2"
                    color="white"
                    onClick={handleSearch}
                    paddingBlock="10px"
                    paddingInline="57.5px"
                    marginStart={{ base: '0', sm: '32px' }}
                    width={{ base: '100%', md: 'auto' }}
                    display={{ base: 'none', md: 'inline-flex' }}
                >
                    {t("button.search")}
                </Button>
            </Box>

            {error && <Text color="red.500" mt={3}>{error}</Text>}
        </Box>
    );
};

export default Home;

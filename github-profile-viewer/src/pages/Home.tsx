import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Image, Input, Spinner, Text } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import logo from '../assets/logo.png';
import { InputGroup } from "../components/ui/input-group";
import { useTranslation } from 'react-i18next';
import axiosInstance from '../axiosInstance';
import axios from 'axios';
import { motion } from 'framer-motion';

const MotionImage = motion(Image);
const MotionButton = motion(Button);
const MotionBox = motion(Box);

const Home = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSearch = async () => {
        const userNameRegex = /^[a-zA-Z0-9-_]+$/;

        if (!username) {
            setError(t("error.emptyField"));
        } else if (!userNameRegex.test(username)) {
            setError(t("error.invalidUsername"));
        } else {
            setLoading(true);

            try {
                const response = await axiosInstance.get(`/users/${username}`);

                if (response.status === 200) {
                    const repoResponse = await axiosInstance.get(`/users/${username}/repos`);

                    if (repoResponse.data.length === 0) {
                        setError(t("error.noRepos"));
                        setLoading(false);
                        return;
                    }

                    navigate(`/profile/${username}`);
                } else {
                    setError(t("error.userNotFound"));
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        setError(t("error.userNotFound"));
                    } else {
                        setError(t("error.fetchError"));
                    }
                } else {
                    setError(t("error.fetchError"));
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === 'k') {
            handleSearch();
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                document.getElementById('mobile-search')?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

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
            {/* Logo com animação de fade-in */}
            <MotionImage
                src={logo}
                alt={t("alt.logo")}
                mb={6}
                initial={{ opacity: 0 }} // Inicializa com opacidade 0
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            />

            <MotionBox
                display="flex"
                justifyContent="center"
                mt={{ base: '20px', sm: '40px', md: '56px' }}
                width="100%"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <Box display={{ base: 'flex', md: 'none' }} width="100%" position="relative" marginBottom="20px">
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
                            onKeyDown={handleKeyDown}
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

                <Box display={{ base: 'none', md: 'flex' }} justifyContent="center" alignItems="center">
                    <InputGroup startElement={<LuSearch />} width="592px">
                        <Input
                            placeholder={t("placeholder.search")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                            aria-label={t("aria.label.search")}
                            aria-describedby="search-helper-text"
                            borderRadius="6px"
                            borderColor="#E2E8F0"
                            borderWidth="1px"
                            transition="all 0.3s ease-in-out"
                            _hover={{ borderColor: "#8C19D2", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
                            _focus={{
                                borderColor: "#8C19D2",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                            width="100%"
                            color={'black'}
                        />
                    </InputGroup>
                </Box>

                <MotionButton
                    backgroundColor="#8C19D2"
                    color="white"
                    onClick={handleSearch}
                    paddingBlock="10px"
                    paddingInline="57.5px"
                    marginStart={{ base: '0', sm: '32px' }}
                    width={{ base: '100%', md: 'auto' }}
                    display={{ base: 'none', md: 'inline-flex' }}
                    _hover={{ backgroundColor: "#7A14C2", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
                    transition={{
                        duration: 0.8,
                        type: "spring",
                        damping: 25,
                        stiffness: 100
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t("button.search")}
                </MotionButton>
            </MotionBox>

            {loading && (
                <Box display="flex" justifyContent="center" mt={6}>
                    <Spinner size="xl" color="purple.500" />
                </Box>
            )}

            {error && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    backgroundColor="rgba(0, 0, 0, 0.5)"
                    zIndex={999}
                >
                    <Box
                        backgroundColor={error === t("error.noRepos") ? "white" : "red.500"}
                        color={error === t("error.noRepos") ? "red" : "white"}
                        padding="16px"
                        borderRadius="8px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        width="90%"
                        maxWidth="500px"
                    >
                        <Text fontSize="lg" fontWeight="bold">
                            {error}
                        </Text>
                        <Button
                            onClick={() => setError(null)}
                            backgroundColor="transparent"
                            border="none"
                            color={error === t("error.noRepos") ? "black" : "white"}
                            fontSize="xl"
                        >
                            ×
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Home;

import React from 'react';
import { Box, HStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar'; // Importando o componente de busca
import logoProfile from '../assets/logoProfile.png';
import { useTranslation } from 'react-i18next'; // Importa o hook

const Header = () => {
    const { t } = useTranslation(); // Hook para acessar traduções
    return (
        <Box paddingBlock={'20px'} bg="white" borderBottom="1px" borderColor="gray.200" display={'flex'}>
            <HStack justify="space-between" align="center" width="full" justifyContent={'center'}>


                <Link to="/">
                    <Image
                        src={logoProfile}
                        alt={t("alt.logo")}
                        paddingStart={'112px'}
                        marginRight={'119px'}
                        

                    />
                </Link>

                {/* Barra de pesquisa */}
                <SearchBar />
            </HStack>
        </Box>
    );
};

export default Header;

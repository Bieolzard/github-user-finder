import { Box, HStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import logoProfile from '../assets/logoProfile.png';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Header = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                paddingBlock={'20px'}
                bg="white"
                borderBottom="1px"
                borderColor="gray.200"
                display={['none', 'none', 'none', 'flex']}
            >
                <HStack justify="space-between" align="center" width="full" justifyContent={'center'}>
                    <Link to="/">
                        <motion.div
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image
                                src={logoProfile}
                                alt={t("alt.logo")}
                                paddingStart={'112px'}
                                marginRight={'119px'}
                            />
                        </motion.div>
                    </Link>

                    <SearchBar />
                </HStack>
            </Box>
        </motion.div>
    );
};

export default Header;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { Text, Box, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Importando o motion

interface RepoListProps {
  username: string;
  setRepos: React.Dispatch<React.SetStateAction<Repo[]>>;
}

const repoSchema = z.object({
  name: z.string(),
  html_url: z.string(),
  stargazers_count: z.number(),
  updated_at: z.string(),
  description: z.string().nullable().optional(),
});

type Repo = z.infer<typeof repoSchema>;

const RepoList: React.FC<RepoListProps> = ({ username, setRepos }) => {
  const [sortOption, setSortOption] = useState('updated');
  const [direction, setDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  const fetchRepos = async (sort: string, direction: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=${sort}&direction=${direction}`);
      const reposValidated = response.data.map((repo: unknown) => repoSchema.parse(repo));
      setRepos(reposValidated);
    } catch (error) {
      console.error('Error fetching repositories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(sortOption, direction);
  }, [sortOption, direction]);

  return (
    <Box padding="16px" backgroundColor="#fff">
      <Box display="flex" flexDirection={['column', 'row']} alignItems="center" gap="8px">
        <Text color="black" marginBottom={['8px', '0']}>Ordenar por:</Text>

        {/* Envolvendo o select nativo com motion.div */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: 'transparent',
              color: 'black',
              cursor: 'pointer',
              width: '100%', // Responsividade: ocupa 100% da largura em telas pequenas
              maxWidth: '200px', // Limita a largura máxima para telas maiores
            }}
          >
            <option value="created">Data de criação</option>
            <option value="updated">Última atualização</option>
            <option value="pushed">Recentemente enviado</option>
            <option value="full_name">Nome</option>
          </select>
        </motion.div>

        {/* Seletor de direção */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: 'transparent',
              color: 'black',
              cursor: 'pointer',
              width: '100%', // Responsividade: ocupa 100% da largura em telas pequenas
              maxWidth: '200px', // Limita a largura máxima para telas maiores
            }}
          >
            <option value="asc">Ordem Crescente</option>
            <option value="desc">Ordem Decrescente</option>
          </select>
        </motion.div>
      </Box>

      {/* Exibindo o estado de carregamento */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Spinner size="xl" color="purple.500" />
        </Box>
      )}
    </Box>
  );
};

export default RepoList;

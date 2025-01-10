import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { Text } from '@chakra-ui/react';

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
    <div style={{ padding: '16px', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Text color={'black'}>Ordenar por:</Text>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              padding: '8px',
              borderRadius: '4px',
              boxShadow: 'none',
              cursor: 'pointer',
              color: 'black',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              paddingRight: '20px',
              outline: 'none', // Remove a borda ao selecionar o input
            }}
          >
            <option value="created">Data de criação</option>
            <option value="updated">Última atualização</option>
            <option value="pushed">Recentemente enviado</option>
            <option value="full_name">Nome</option>
          </select>
          <div style={{ position: 'absolute', top: '50%', right: '2px', pointerEvents: 'none', transform: 'translateY(-50%)' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1E90FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
        </div>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              padding: '8px',
              borderRadius: '4px',
              boxShadow: 'none',
              cursor: 'pointer',
              color: 'black',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              paddingRight: '20px',
              outline: 'none', // Remove a borda ao selecionar o input
            }}
          >
            <option value="asc">Ordem Crescente</option>
            <option value="desc">Ordem Decrescente</option>
          </select>
          <div style={{ position: 'absolute', top: '50%', right: '2px', pointerEvents: 'none', transform: 'translateY(-50%)' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1E90FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>
      {loading && <div>Carregando...</div>}
    </div>
  );
};

export default RepoList;

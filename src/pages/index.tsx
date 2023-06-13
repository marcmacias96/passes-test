import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Home.module.css';
import apiClient from '@/utils/httpClient';

const HeartButton = ({ likeId, userId }: { likeId: string; userId: string }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchLikeStatus();
    fetchLikeCount();
  }, []);

  const fetchLikeStatus = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/v1/like/${likeId}/user/${userId}`);
      setLiked(response.data.data);
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  }, [likeId, userId]);

  const fetchLikeCount = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/v1/like/${likeId}/count`);
      setLikeCount(response.data.data);
    } catch (error) {
      console.error('Failed to fetch like count:', error);
    }
  }, [likeId]);

  const handleButtonClick = useCallback(async () => {
    try {
      if (liked) {
        await apiClient.post('/api/v1/like/remove', { likeId, userId });
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        await apiClient.post('/api/v1/like/add', { likeId, userId });
        setLikeCount((prevCount) => prevCount + 1);
      }
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  }, [likeId, userId, liked]);

  const formatLikeCount = useCallback((count: number) => {
    if (count > 999) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }, []);

  return (
    <div className={styles.heartButtonContainer}>
      <div className={styles.item} onClick={handleButtonClick}>
        <svg
          style={{ fill: liked ? 'red' : 'none' }}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z"
            stroke="#A09FA6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={styles.item}>{formatLikeCount(likeCount)}</span>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className={styles.container}>
      <HeartButton likeId="123" userId="aaron" />
    </div>
  );
};

export default HomePage;

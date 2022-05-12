import { useEffect, useState } from 'react';
import useApi from './useApi';
import useCMetamask from './useCMetamask';
import useSigning from './useSigning';

export default function useWalletAuth() {
  const [isLogged, setLogged] = useState(false);
  const { account } = useCMetamask();
  const sign = useSigning();
  const api = useApi('http://localhost:3006');

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) setLogged(true);
  }, [account]);

  const login = async (message: string) => {
    if (account) {
      const signedMessage = await sign(message);
      const result = await api.post('/auth/', {
        address: account,
        signature: signedMessage,
      });
      if (result.success) {
        setLogged(true);
        localStorage.setItem('jwt', result.response.token.accessToken);
      }
    }
  };

  const getNonce = async () => {
    let nonce = '-1';
    // eslint-disable-next-line no-console
    console.log(account);
    if (account) {
      const nonceRes = await api.get(`/auth/${account}`);
      if (nonceRes.success) {
        nonce = nonceRes.response;
      } else throw new Error(nonceRes.response);
    }
    return nonce;
  };

  return { isLogged, login, getNonce };
}
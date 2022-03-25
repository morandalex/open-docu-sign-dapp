import { useAccount, useBlockNumber } from 'wagmi'

export const BlockNumber = () => {
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data, error, loading }, getBlockNumber] = useBlockNumber()
  if (accountData) {
    if (loading) return <div>Fetching block number…</div>
    if (error) return <div>Error fetching block number</div>
    return <div>Block number: {data}</div>
  }
  return (<></>)
}
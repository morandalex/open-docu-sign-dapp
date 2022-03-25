import { useFeeData,useAccount } from 'wagmi'

export const FeeData = () => {
  const [{ data, error, loading }, getFeeData] = useFeeData()
  const [{ data: accountData }, disconnect] = useAccount()
 
 if(accountData){
    if (loading) return <div>Fetching fee data…</div>
    if (error) return <div>Error fetching fee data</div>
    return <div>{data?.formatted?.gasPrice}</div>
 }
 return(<></>)
}